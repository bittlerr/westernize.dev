import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { FeedbackForm } from "@/components/FeedbackForm";
import { GapAnalysis } from "@/components/GapAnalysis";
import { ResultActions } from "@/components/ResultActions";
import { ScoreCard } from "@/components/ScoreCard";
import { optimizations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { CvParsed, GapAnalysis as GapAnalysisType, Rewrites } from "@/types";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const row = await db
    .select()
    .from(optimizations)
    .where(and(eq(optimizations.id, id), eq(optimizations.userId, session.user.id)))
    .then((r) => r[0]);

  if (!row || row.status !== "done") notFound();

  const cvParsed = row.cvParsed as CvParsed;
  const gapAnalysis = row.gapAnalysis as GapAnalysisType;
  const rewrites = row.rewrites as Rewrites;

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-6 md:py-10">
      <h1 className="font-display text-xl md:text-2xl font-bold mb-6 md:mb-8">Optimization Result</h1>

      <div className="space-y-8 md:space-y-10">
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-10">
          <ScoreCard score={row.matchScore ?? 0} />
          <div className="flex-1 w-full">
            <GapAnalysis data={gapAnalysis} />
          </div>
        </div>

        <ResultActions optimizationId={row.id} rewrites={rewrites} cvParsed={cvParsed} />

        <FeedbackForm optimizationId={row.id} existingRating={row.rating} />
      </div>
    </div>
  );
}
