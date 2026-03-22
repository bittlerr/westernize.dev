"use client";

import { useRef, useState } from "react";
import type { OptimizationResult, SSEEvent } from "@/types";

const STEPS = ["parsing", "analyzing", "rewriting", "done"] as const;

export function OptimizeForm({ onComplete }: { onComplete: (result: OptimizationResult) => void }) {
  const [cvText, setCvText] = useState("");
  const [jdText, setJdText] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [fileId, setFileId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [stepMessage, setStepMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handlePdfUpload(file: File) {
    setError("");
    setPdfName(file.name);

    const form = new FormData();

    form.append("file", file);

    const res = await fetch("/api/parse-pdf", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setPdfName("");

      return;
    }

    setFileId(data.fileId);
    setCvText(`[PDF uploaded: ${file.name} — ${data.pageCount} pages]`);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setCurrentStep(null);

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          jdText,
          ...(fileId ? { fileId } : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        setError(data.error);
        setLoading(false);

        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
          const data = line.replace(/^data: /, "").trim();

          if (!data) continue;

          const event: SSEEvent = JSON.parse(data);

          if (event.step === "done") {
            onComplete(event.result);
          } else if (event.step === "error") {
            setError(`Failed at ${event.failedStep} step`);
          } else {
            setCurrentStep(event.step);
            setStepMessage(event.message);
          }
        }
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Your CV</label>
        <div className="flex gap-3 mb-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs px-3 py-1.5 rounded-lg border border-border hover:border-red text-muted hover:text-foreground transition-colors"
          >
            {pdfName || "Upload PDF"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePdfUpload(file);
            }}
          />
          {pdfName && (
            <button
              type="button"
              onClick={() => {
                setPdfName("");
                setFileId(null);
                setCvText("");
              }}
              className="text-xs text-muted hover:text-red transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {!fileId && (
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste your CV text here..."
            rows={8}
            required={!fileId}
            className="w-full rounded-lg border border-border bg-bg2 px-4 py-3 text-sm outline-none focus:border-red transition-colors resize-none"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Job Description</label>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the job description here..."
          rows={8}
          required
          className="w-full rounded-lg border border-border bg-bg2 px-4 py-3 text-sm outline-none focus:border-red transition-colors resize-none"
        />
      </div>

      {error && <div className="bg-red-dim border border-red/20 text-red text-sm rounded-lg px-4 py-3">{error}</div>}

      {loading && currentStep && (
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {STEPS.slice(0, -1).map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === currentStep
                    ? "bg-red animate-pulse"
                    : STEPS.indexOf(step) < STEPS.indexOf(currentStep as (typeof STEPS)[number])
                      ? "bg-green-400"
                      : "bg-border"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted">{stepMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || (!cvText && !fileId)}
        className="w-full bg-red text-white font-medium rounded-lg px-4 py-3 text-sm hover:bg-red/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Optimizing..." : "Optimize CV"}
      </button>
    </form>
  );
}
