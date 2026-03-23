import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { GapAnalysis } from "@/components/GapAnalysis";
import { RewritePanel } from "@/components/RewritePanel";
import { ScoreCard } from "@/components/ScoreCard";
import { optimizations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { GapAnalysis as GapAnalysisType, Rewrites } from "@/types";

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

  const gapAnalysis = row.gapAnalysis as GapAnalysisType;
  const rewrites = row.rewrites as Rewrites;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-2xl font-bold mb-8">Optimization Result</h1>

      <div className="space-y-10">
        <div className="flex items-start gap-10">
          <ScoreCard score={row.matchScore ?? 0} />
          <div className="flex-1">
            <GapAnalysis data={gapAnalysis} />
          </div>
        </div>

        <RewritePanel data={rewrites} readOnly />
      </div>
    </div>
  );
}
