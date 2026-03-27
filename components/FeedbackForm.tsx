"use client";

import { useState } from "react";
import { toast } from "sonner";

export function FeedbackForm({
  optimizationId,
  existingRating,
}: {
  optimizationId: string;
  existingRating: number | null;
}) {
  const [rating, setRating] = useState(existingRating ?? 0);
  const [hovering, setHovering] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(!!existingRating);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (rating === 0) return;

    setSubmitting(true);

    const res = await fetch(`/api/optimize/${optimizationId}/feedback`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, feedback: feedback || undefined }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      toast.error("Failed to submit feedback");
    }

    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="border border-border rounded-lg p-6 text-center">
        <p className="text-sm text-muted">Thanks for your feedback!</p>
      </div>
    );
  }

  const display = hovering || rating;

  return (
    <div className="border border-border rounded-lg p-6 space-y-4">
      <p className="text-sm font-medium">How useful was this optimization?</p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovering(star)}
            onMouseLeave={() => setHovering(0)}
            className="text-2xl transition-transform hover:scale-110"
          >
            <span className={star <= display ? "text-amber-400" : "text-border"}>★</span>
          </button>
        ))}
      </div>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Anything we could improve? (optional)"
        rows={2}
        className="w-full rounded-lg border border-border bg-bg2 px-3 py-2 text-sm outline-none focus:border-red transition-colors resize-none"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className="bg-red text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red/90 transition-colors disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Submit feedback"}
      </button>
    </div>
  );
}
