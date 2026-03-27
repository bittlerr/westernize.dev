import { and, avg, count, desc, eq, gte, isNotNull } from "drizzle-orm";
import { auditLogs, optimizations, users } from "@/db/schema";
import { formatDateTime, oneWeekAgo } from "@/lib/dates";
import { db } from "@/lib/db";

export default async function AdminOverview() {
  const [totalUsers] = await db.select({ count: count() }).from(users);
  const [totalOpts] = await db.select({ count: count() }).from(optimizations);

  const [recentSignups] = await db.select({ count: count() }).from(users).where(gte(users.createdAt, oneWeekAgo()));

  const [ratingStats] = await db
    .select({
      avg: avg(optimizations.rating),
      count: count(optimizations.rating),
    })
    .from(optimizations)
    .where(isNotNull(optimizations.rating));

  const avgRating = ratingStats.avg ? parseFloat(ratingStats.avg).toFixed(1) : "—";

  const recentFeedback = await db
    .select({
      id: optimizations.id,
      rating: optimizations.rating,
      feedback: optimizations.feedback,
      userEmail: users.email,
      createdAt: optimizations.createdAt,
    })
    .from(optimizations)
    .leftJoin(users, eq(optimizations.userId, users.id))
    .where(isNotNull(optimizations.rating))
    .orderBy(desc(optimizations.createdAt))
    .limit(10);

  const recentAudit = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(20);

  const metrics = [
    { label: "Total Users", value: totalUsers.count },
    { label: "Total Optimizations", value: totalOpts.count },
    { label: "Signups (7d)", value: recentSignups.count },
    { label: "Avg Rating", value: `${avgRating} (${ratingStats.count})` },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-8">Admin Overview</h1>

      <div className="grid grid-cols-4 gap-4 mb-10">
        {metrics.map((m) => (
          <div key={m.label} className="border border-border rounded-lg p-6 bg-bg2">
            <p className="text-sm text-muted mb-1">{m.label}</p>
            <p className="font-display text-3xl font-bold">{m.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-lg font-bold mb-4">Recent Feedback</h2>
      {recentFeedback.length === 0 ? (
        <p className="text-sm text-muted mb-10">No feedback yet.</p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg2">
                <th className="text-left px-4 py-3 font-medium text-muted">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted">User</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Rating</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {recentFeedback.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted">{formatDateTime(row.createdAt)}</td>
                  <td className="px-4 py-3">{row.userEmail ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-amber-400">{"★".repeat(row.rating ?? 0)}</span>
                    <span className="text-border">{"☆".repeat(5 - (row.rating ?? 0))}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{row.feedback || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="font-display text-lg font-bold mb-4">Recent Activity</h2>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg2">
              <th className="text-left px-4 py-3 font-medium text-muted">Time</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Action</th>
              <th className="text-left px-4 py-3 font-medium text-muted">User ID</th>
            </tr>
          </thead>
          <tbody>
            {recentAudit.map((log) => (
              <tr key={log.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-muted">{formatDateTime(log.createdAt)}</td>
                <td className="px-4 py-3">{log.action}</td>
                <td className="px-4 py-3 text-muted font-mono text-xs">{log.userId ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
