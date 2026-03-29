import type { GapAnalysis as GapAnalysisType } from "@/types";

function Chip({ label, variant }: { label: string; variant: "missing" | "strength" }) {
  return (
    <span
      className={`inline-block text-sm px-3 py-1.5 rounded-full ${
        variant === "missing" ? "bg-red-dim text-red" : "bg-green-dim text-green"
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
          <h3 className="text-base font-medium mb-3">Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {data.missing_keywords.map((kw) => (
              <Chip key={kw} label={kw} variant="missing" />
            ))}
          </div>
        </div>
      )}

      {data.missing_skills.length > 0 && (
        <div>
          <h3 className="text-base font-medium mb-3">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.missing_skills.map((skill) => (
              <Chip key={skill} label={skill} variant="missing" />
            ))}
          </div>
        </div>
      )}

      {data.strengths.length > 0 && (
        <div>
          <h3 className="text-base font-medium mb-3">Strengths</h3>
          <ul className="space-y-2">
            {data.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 text-green shrink-0">&#10003;</span>
                <span className="text-muted">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium mb-2">Summary</h3>
        <p className="text-sm text-muted leading-relaxed">{data.summary}</p>
      </div>
    </div>
  );
}
