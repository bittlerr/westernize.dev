import type { CvParsed, GapAnalysis, JdParsed, Rewrites } from "./schemas";

export {
  type CvParsed,
  CvParsedSchema,
  type GapAnalysis,
  GapAnalysisSchema,
  type JdParsed,
  JdParsedSchema,
  type Rewrites,
  RewritesSchema,
} from "./schemas";

export type OptimizationStatus = "pending" | "parsing" | "analyzing" | "rewriting" | "done" | "error";

export type SSEEvent =
  | { step: "parsing"; message: string }
  | { step: "analyzing"; message: string }
  | { step: "rewriting"; message: string }
  | { step: "done"; result: OptimizationResult }
  | { step: "error"; failedStep: string; partialResult: Partial<OptimizationResult> | null };

export interface OptimizationResult {
  id: string;
  cvParsed: CvParsed;
  jdParsed: JdParsed;
  gapAnalysis: GapAnalysis;
  rewrites: Rewrites;
  matchScore: number;
}
