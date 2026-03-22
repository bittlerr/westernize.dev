import { z } from "zod";

// Step 1 — Extract CV structure
export const CvParsedSchema = z.object({
  name: z.string(),
  email: z.string(),
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      dates: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      school: z.string(),
      year: z.string(),
    }),
  ),
});

// Step 2 — Extract JD requirements
export const JdParsedSchema = z.object({
  role: z.string(),
  company: z.string(),
  required_skills: z.array(z.string()),
  preferred_skills: z.array(z.string()),
  keywords: z.array(z.string()),
  seniority_level: z.string(),
  location_type: z.string(),
});

// Step 3 — Gap analysis + scoring
export const GapAnalysisSchema = z.object({
  match_score: z.number().int().min(0).max(100),
  missing_keywords: z.array(z.string()),
  missing_skills: z.array(z.string()),
  weak_bullets: z.array(z.string()),
  strengths: z.array(z.string()),
  summary: z.string(),
});

// Step 4 — Rewrite bullets
export const RewritesSchema = z.object({
  rewrites: z.array(
    z.object({
      original: z.string(),
      rewritten: z.string(),
    }),
  ),
});

export type CvParsed = z.infer<typeof CvParsedSchema>;
export type JdParsed = z.infer<typeof JdParsedSchema>;
export type GapAnalysis = z.infer<typeof GapAnalysisSchema>;
export type Rewrites = z.infer<typeof RewritesSchema>;
