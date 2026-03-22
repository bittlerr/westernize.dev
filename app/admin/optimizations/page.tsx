import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { optimizations, users } from "@/db/schema";
import { formatDate } from "@/lib/dates";
import { db } from "@/lib/db";
import type { JdParsed } from "@/types";

export default async function AdminOptimizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page ?? "1", 10));
  const perPage = 50;

  let query = db
    .select({
      id: optimizations.id,
      userId: optimizations.userId,
      userEmail: users.email,
      status: optimizations.status,
      matchScore: optimizations.matchScore,
      jdParsed: optimizations.jdParsed,
      createdAt: optimizations.createdAt,
    })
    .from(optimizations)
    .leftJoin(users, eq(optimizations.userId, users.id))
    .orderBy(desc(optimizations.createdAt))
    .$dynamic();

  if (status) {
    query = query.where(eq(optimizations.status, status));
  }

  const rows = await query.limit(perPage).offset((pageNum - 1) * perPage);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Optimizations</h1>

      <div className="flex gap-2 mb-6">
        {["all", "pending", "done", "error"].map((s) => (
          <Link
            key={s}
            href={`/admin/optimizations${s === "all" ? "" : `?status=${s}`}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              (s === "all" && !status) || status === s
                ? "border-red text-red"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg2">
              <th className="text-left px-4 py-3 font-medium text-muted">Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted">User</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Role</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Score</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const jd = row.jdParsed as JdParsed | null;
              return (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    {row.userId ? (
                      <Link href={`/admin/users/${row.userId}`} className="text-red hover:underline">
                        {row.userEmail}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">{jd?.role ?? "—"}</td>
                  <td className="px-4 py-3">{row.matchScore != null ? `${row.matchScore}%` : "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        row.status === "done"
                          ? "bg-green-500/10 text-green-400"
                          : row.status === "error"
                            ? "bg-red-dim text-red"
                            : "bg-bg3 text-muted"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-4 text-sm">
        {pageNum > 1 && (
          <Link
            href={`/admin/optimizations?page=${pageNum - 1}${status ? `&status=${status}` : ""}`}
            className="text-red hover:underline"
          >
            ← Previous
          </Link>
        )}
        {rows.length === perPage && (
          <Link
            href={`/admin/optimizations?page=${pageNum + 1}${status ? `&status=${status}` : ""}`}
            className="text-red hover:underline"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
