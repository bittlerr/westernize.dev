import type { GapAnalysis as GapAnalysisType } from "@/types";

function Chip({ label, variant }: { label: string; variant: "missing" | "strength" }) {
  return (
    <span
      className={`inline-block text-xs px-2.5 py-1 rounded-full ${
        variant === "missing" ? "bg-red-dim text-red" : "bg-green-500/10 text-green-400"
      }`}
    >
      {label}
    </span>
  );
}

export function GapAnalysis({ data }: { data: GapAnalysisType }) {
  return (
    <div className="space-y-6">
      {data.missing_keywords.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {data.missing_keywords.map((kw) => (
              <Chip key={kw} label={kw} variant="missing" />
            ))}
          </div>
        </div>
      )}

      {data.missing_skills.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.missing_skills.map((skill) => (
              <Chip key={skill} label={skill} variant="missing" />
            ))}
          </div>
        </div>
      )}

      {data.strengths.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Strengths</h3>
          <div className="flex flex-wrap gap-2">
            {data.strengths.map((s) => (
              <Chip key={s} label={s} variant="strength" />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium mb-2">Summary</h3>
        <p className="text-sm text-muted leading-relaxed">{data.summary}</p>
      </div>
    </div>
  );
}
