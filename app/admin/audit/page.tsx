import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { auditLogs } from "@/db/schema";
import { formatDateTime } from "@/lib/dates";
import { db } from "@/lib/db";

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>;
}) {
  const { action, page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page ?? "1", 10));
  const perPage = 50;

  let query = db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).$dynamic();

  if (action) {
    query = query.where(eq(auditLogs.action, action));
  }

  const rows = await query.limit(perPage).offset((pageNum - 1) * perPage);

  const actions = [
    "all",
    "signup",
    "cv.optimized",
    "cv.exported",
    "credits.purchased",
    "admin.credits.added",
    "admin.lifetime.toggled",
    "admin.role.changed",
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Audit Log</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {actions.map((a) => (
          <Link
            key={a}
            href={`/admin/audit${a === "all" ? "" : `?action=${a}`}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              (a === "all" && !action) || action === a
                ? "border-red text-red"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {a}
          </Link>
        ))}
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg2">
              <th className="text-left px-4 py-3 font-medium text-muted">Time</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Action</th>
              <th className="text-left px-4 py-3 font-medium text-muted">User</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((log) => (
              <tr key={log.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-muted whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-bg3">{log.action}</span>
                </td>
                <td className="px-4 py-3">
                  {log.userId ? (
                    <Link href={`/admin/users/${log.userId}`} className="text-red hover:underline font-mono text-xs">
                      {log.userId.slice(0, 8)}...
                    </Link>
                  ) : (
                    <span className="text-muted">system</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted font-mono text-xs max-w-xs truncate">
                  {log.metadata ? JSON.stringify(log.metadata) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-4 text-sm">
        {pageNum > 1 && (
          <Link
            href={`/admin/audit?page=${pageNum - 1}${action ? `&action=${action}` : ""}`}
            className="text-red hover:underline"
          >
            ← Previous
          </Link>
        )}
        {rows.length === perPage && (
          <Link
            href={`/admin/audit?page=${pageNum + 1}${action ? `&action=${action}` : ""}`}
            className="text-red hover:underline"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
