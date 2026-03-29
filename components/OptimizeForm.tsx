"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { UpgradeDialog } from "@/components/UpgradeDialog";
import type { OptimizationResult, SSEEvent } from "@/types";

const STEPS = [
  { id: "parsing", label: "Parsing" },
  { id: "analyzing", label: "Analyzing" },
  { id: "rewriting", label: "Rewriting" },
] as const;

type InputMode = "paste" | "upload";

export function OptimizeForm({ onComplete }: { onComplete: (result: OptimizationResult) => void }) {
  const [cvText, setCvText] = useState("");
  const [jdText, setJdText] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("paste");
  const [pdfName, setPdfName] = useState("");
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [stepMessage, setStepMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  async function handlePdfUpload(file: File) {
    if (!file.name.endsWith(".pdf")) {
      toast.error("Only PDF files are accepted");

      return;
    }

    setUploading(true);
    setPdfName(file.name);

    const form = new FormData();

    form.append("file", file);

    try {
      const res = await fetch("/api/parse-pdf", { method: "POST", body: form });

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        toast.error(data?.error || "Upload failed. Please try again.");
        setPdfName("");

        return;
      }

      const data = await res.json();

      setPdfBase64(data.pdfBase64);
      setCvText(`[PDF: ${file.name} — ${data.pageCount} pages]`);
    } catch {
      toast.error("Connection error. Please try again.");
      setPdfName("");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current++;
    setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current--;

    if (dragCounter.current === 0) setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);

    const file = e.dataTransfer.files[0];

    if (file) handlePdfUpload(file);
  }

  function clearPdf() {
    setPdfName("");
    setPdfBase64(null);
    setCvText("");
    setInputMode("paste");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setCurrentStep(null);

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          jdText,
          ...(pdfBase64 ? { pdfBase64 } : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        if (res.status === 402) {
          setShowUpgrade(true);
        } else {
          toast.error(data.error);
        }

        setLoading(false);

        return;
      }

      const reader = res.body?.getReader();

      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;

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
            finished = true;
            onComplete(event.result);
          } else if (event.step === "error") {
            finished = true;
            setCurrentStep(null);
            toast.error(event.message);
          } else {
            setCurrentStep(event.step);
            setStepMessage(event.message);
          }
        }

        if (finished) break;
      }

      if (!finished) {
        toast.error("Connection lost. Please try again.");
        setCurrentStep(null);
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <>
      <UpgradeDialog open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CV INPUT */}
          <div>
            <div className="flex items-center justify-between mb-3 min-h-[32px]">
              <label className="text-sm font-medium">Your CV</label>
              {!pdfBase64 && (
                <div className="flex rounded-lg border border-border overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setInputMode("paste")}
                    className={`px-3 py-1.5 transition-colors ${inputMode === "paste" ? "bg-bg3 text-foreground" : "text-muted hover:text-foreground"}`}
                  >
                    Paste text
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("upload")}
                    className={`px-3 py-1.5 transition-colors ${inputMode === "upload" ? "bg-bg3 text-foreground" : "text-muted hover:text-foreground"}`}
                  >
                    Upload PDF
                  </button>
                </div>
              )}
            </div>

            {pdfBase64 ? (
              <div className="h-64 rounded-lg border border-green-500/30 bg-green-500/5 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 10l3 3 7-7"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{pdfName}</p>
                  <p className="text-xs text-muted mt-1">PDF uploaded and parsed</p>
                </div>
                <button
                  type="button"
                  onClick={clearPdf}
                  className="text-xs text-muted hover:text-red transition-colors mt-1"
                >
                  Remove
                </button>
              </div>
            ) : inputMode === "upload" ? (
              <label
                onDragEnter={handleDragEnter}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`h-64 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                  dragging
                    ? "border-red bg-red-dim scale-[1.02]"
                    : uploading
                      ? "border-border bg-bg2"
                      : "border-border hover:border-red/50 hover:bg-bg2"
                }`}
              >
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
                {uploading ? (
                  <>
                    <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted">Uploading {pdfName}...</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-bg3 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M10 3v10M6 7l4-4 4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted"
                        />
                        <path
                          d="M3 15h14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          className="text-muted"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm">
                        <span className="text-red font-medium">Click to upload</span>
                        <span className="text-muted"> or drag and drop</span>
                      </p>
                      <p className="text-xs text-muted mt-1">PDF up to 5MB (10MB for paid)</p>
                    </div>
                  </>
                )}
              </label>
            ) : (
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your full CV text here — work experience, skills, education..."
                rows={10}
                required={!pdfBase64}
                className="w-full h-64 rounded-lg border border-border bg-bg2 px-4 py-3 text-sm outline-none focus:border-red transition-colors resize-none"
              />
            )}
          </div>

          {/* JD INPUT */}
          <div>
            <div className="flex items-center justify-between mb-3 min-h-[32px]">
              <label className="text-sm font-medium">Job Description</label>
            </div>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job posting — requirements, responsibilities, qualifications..."
              rows={10}
              required
              className="w-full h-64 rounded-lg border border-border bg-bg2 px-4 py-3 text-sm outline-none focus:border-red transition-colors resize-none"
            />
          </div>
        </div>

        {/* PROGRESS STEPPER */}
        {loading && currentStep && (
          <div className="border border-border rounded-lg p-6 bg-bg2">
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, i) => (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        i < stepIndex
                          ? "bg-green-500/20 text-green-400"
                          : i === stepIndex
                            ? "bg-red text-white animate-pulse"
                            : "bg-bg3 text-muted"
                      }`}
                    >
                      {i < stepIndex ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs mt-2 ${i === stepIndex ? "text-foreground font-medium" : "text-muted"}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 mx-3 mb-5">
                      <div className="h-0.5 rounded-full bg-bg3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            i < stepIndex ? "bg-green-400 w-full" : "bg-bg3 w-0"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted text-center">{stepMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!cvText && !pdfBase64) || !jdText}
          className="w-full bg-red text-white font-semibold rounded-lg px-4 py-3.5 text-sm hover:bg-red/90 transition-all disabled:opacity-50 disabled:hover:bg-red"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Optimizing...
            </span>
          ) : (
            "Westernize my CV"
          )}
        </button>
      </form>
    </>
  );
}
