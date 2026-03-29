import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { optimizations } from "@/db/schema";
import { logAudit } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { claude, MODEL } from "@/lib/claude";
import { deductCredit, hasCredit } from "@/lib/credits";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import type { SSEEvent } from "@/types";
import {
  type CvParsed,
  CvParsedSchema,
  type GapAnalysis,
  GapAnalysisSchema,
  type JdParsed,
  JdParsedSchema,
  type Rewrites,
  RewritesSchema,
} from "@/types";

const MAX_RETRIES = 3;

const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404]);

function sseEncode(event: SSEEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

function userMessage(err: unknown): string {
  if (err instanceof Anthropic.APIError) {
    if (err.status === 401 || err.status === 403) return "AI service authentication error. Please contact support.";
    if (err.status === 429) return "AI service is busy. Please try again in a moment.";
    if (err.status === 400) return "Invalid request to AI service. Please try different input.";
  }

  return "Something went wrong. Please try again.";
}

async function runStep<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      console.error(`[optimize] attempt ${i + 1}/${retries} failed:`, e);

      if (e instanceof Anthropic.APIError && NON_RETRYABLE_STATUSES.has(e.status)) throw e;
      if (i === retries - 1) throw e;

      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }

  throw new Error("Unreachable");
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const isPaid = session.user.isLifetime || session.user.credits > 1;

  const rateCheck = await checkRateLimit(userId, isPaid);

  if (!rateCheck.allowed) {
    return Response.json({ error: rateCheck.error }, { status: 429 });
  }

  const creditCheck = await hasCredit(userId);

  if (!creditCheck) {
    return Response.json({ error: "No credits remaining" }, { status: 402 });
  }

  const body = await request.json();
  const { cvText, jdText, pdfBase64 } = body as {
    cvText: string;
    jdText: string;
    pdfBase64?: string;
  };

  if (!cvText || !jdText) {
    return Response.json({ error: "CV text and job description are required" }, { status: 400 });
  }

  const [row] = await db
    .insert(optimizations)
    .values({
      userId,
      cvRaw: cvText,
      jdRaw: jdText,
      status: "pending",
    })
    .returning();

  const stream = new ReadableStream({
    async start(controller) {
      let cvParsed: CvParsed | null = null;
      let jdParsed: JdParsed | null = null;
      let gapAnalysis: GapAnalysis | null = null;
      let rewrites: Rewrites | null = null;
      const totalTokens = { input: 0, output: 0 };

      function trackTokens(usage: { input_tokens: number; output_tokens: number }) {
        totalTokens.input += usage.input_tokens;
        totalTokens.output += usage.output_tokens;
      }

      try {
        // Step 1 & 2: Parse CV and JD in parallel
        controller.enqueue(sseEncode({ step: "parsing", message: "Parsing CV and job description..." }));

        await db.update(optimizations).set({ status: "parsing" }).where(eq(optimizations.id, row.id));

        const cvContent = pdfBase64
          ? [
              {
                type: "document" as const,
                source: { type: "base64" as const, media_type: "application/pdf" as const, data: pdfBase64 },
              },
              { type: "text" as const, text: "Extract the structured CV data from this PDF." },
            ]
          : [{ type: "text" as const, text: cvText }];

        const [cvResult, jdResult] = await Promise.all([
          runStep(() =>
            claude.messages.parse({
              model: MODEL,
              max_tokens: 4096,
              system: "You are a CV parser. Extract structured data from the CV. Be thorough and accurate.",
              messages: [{ role: "user", content: cvContent }],
              output_config: { format: zodOutputFormat(CvParsedSchema) },
            }),
          ),
          runStep(() =>
            claude.messages.parse({
              model: MODEL,
              max_tokens: 2048,
              system: "You are a job description parser. Extract structured requirements from the job posting.",
              messages: [{ role: "user", content: jdText }],
              output_config: { format: zodOutputFormat(JdParsedSchema) },
            }),
          ),
        ]);

        trackTokens(cvResult.usage);
        trackTokens(jdResult.usage);
        cvParsed = cvResult.parsed_output as unknown as CvParsed;
        jdParsed = jdResult.parsed_output as unknown as JdParsed;

        await db.update(optimizations).set({ cvParsed, jdParsed }).where(eq(optimizations.id, row.id));

        // Step 3: Gap analysis
        controller.enqueue(sseEncode({ step: "analyzing", message: "Analyzing gaps..." }));

        await db.update(optimizations).set({ status: "analyzing" }).where(eq(optimizations.id, row.id));

        const gapResult = await runStep(() =>
          claude.messages.parse({
            model: MODEL,
            max_tokens: 4096,
            system:
              "You are a CV-to-job-description gap analyzer. Compare the parsed CV against the job requirements. Score the match 0-100, identify missing keywords, missing skills, weak bullet points, and strengths. Provide a concise summary.",
            messages: [
              {
                role: "user",
                content: `CV:\n${JSON.stringify(cvParsed)}\n\nJob Description:\n${JSON.stringify(jdParsed)}`,
              },
            ],
            output_config: { format: zodOutputFormat(GapAnalysisSchema) },
          }),
        );

        trackTokens(gapResult.usage);
        gapAnalysis = gapResult.parsed_output as unknown as GapAnalysis;

        await db
          .update(optimizations)
          .set({ gapAnalysis, matchScore: gapAnalysis.match_score })
          .where(eq(optimizations.id, row.id));

        // Step 4: Rewrite bullets
        controller.enqueue(sseEncode({ step: "rewriting", message: "Rewriting bullet points..." }));

        await db.update(optimizations).set({ status: "rewriting" }).where(eq(optimizations.id, row.id));

        const rewriteResult = await runStep(() =>
          claude.messages.parse({
            model: MODEL,
            max_tokens: 4096,
            system:
              "You are a CV bullet point rewriter specializing in Western tech company standards. Rewrite weak bullet points to be action-oriented, quantified where possible, and aligned with the job requirements. Use strong active verbs. Westernize the language — remove passive voice, vague descriptions, and Eastern European CV conventions.",
            messages: [
              {
                role: "user",
                content: `CV bullets to rewrite:\n${JSON.stringify(cvParsed?.experience)}\n\nJob requirements:\n${JSON.stringify(jdParsed)}\n\nGap analysis:\n${JSON.stringify(gapAnalysis)}`,
              },
            ],
            output_config: { format: zodOutputFormat(RewritesSchema) },
          }),
        );

        trackTokens(rewriteResult.usage);
        rewrites = rewriteResult.parsed_output as unknown as Rewrites;

        // Deduct credit on success
        await deductCredit(userId);

        await db
          .update(optimizations)
          .set({
            rewrites,
            status: "done",
            tokenUsage: totalTokens,
          })
          .where(eq(optimizations.id, row.id));

        await logAudit(userId, "cv.optimized", {
          optimizationId: row.id,
          matchScore: gapAnalysis.match_score,
          tokens: totalTokens,
        });

        controller.enqueue(
          sseEncode({
            step: "done",
            result: {
              id: row.id,
              cvParsed,
              jdParsed,
              gapAnalysis,
              rewrites,
              matchScore: gapAnalysis.match_score,
            },
          }),
        );
      } catch (err) {
        const failedStep = !cvParsed || !jdParsed ? "parsing" : !gapAnalysis ? "analyzing" : "rewriting";

        console.error(`[optimize] failed at ${failedStep}:`, err);

        await db.update(optimizations).set({ status: "error" }).where(eq(optimizations.id, row.id));

        controller.enqueue(
          sseEncode({
            step: "error",
            failedStep,
            message: userMessage(err),
            partialResult:
              cvParsed && jdParsed
                ? {
                    id: row.id,
                    cvParsed,
                    jdParsed,
                    ...(gapAnalysis ? { gapAnalysis, matchScore: gapAnalysis.match_score } : {}),
                  }
                : null,
          }),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
