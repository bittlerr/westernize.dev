import { count, desc, gte } from "drizzle-orm";
import { auditLogs, optimizations, users } from "@/db/schema";
import { formatDateTime, oneWeekAgo } from "@/lib/dates";
import { db } from "@/lib/db";

export default async function AdminOverview() {
  const [totalUsers] = await db.select({ count: count() }).from(users);
  const [totalOpts] = await db.select({ count: count() }).from(optimizations);

  const [recentSignups] = await db.select({ count: count() }).from(users).where(gte(users.createdAt, oneWeekAgo()));

  const recentAudit = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(20);

  const metrics = [
    { label: "Total Users", value: totalUsers.count },
    { label: "Total Optimizations", value: totalOpts.count },
    { label: "Signups (7d)", value: recentSignups.count },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-8">Admin Overview</h1>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {metrics.map((m) => (
          <div key={m.label} className="border border-border rounded-lg p-6 bg-bg2">
            <p className="text-sm text-muted mb-1">{m.label}</p>
            <p className="font-display text-3xl font-bold">{m.value}</p>
          </div>
        ))}
      </div>

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
