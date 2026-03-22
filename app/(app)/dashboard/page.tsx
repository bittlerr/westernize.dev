import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { optimizations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/dates";
import { db } from "@/lib/db";
import type { JdParsed } from "@/types";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const rows = await db
    .select()
    .from(optimizations)
    .where(eq(optimizations.userId, session.user.id))
    .orderBy(desc(optimizations.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <Link
          href="/optimize"
          className="bg-red text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red/90 transition-colors"
        >
          New optimization
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-20 border border-border rounded-lg">
          <p className="text-muted mb-4">No optimizations yet</p>
          <Link href="/optimize" className="text-red hover:underline text-sm">
            Optimize your first CV
          </Link>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg2">
                <th className="text-left px-4 py-3 font-medium text-muted">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Role</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Score</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const jd = row.jdParsed as JdParsed | null;
                return (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3">{jd?.role ?? "—"}</td>
                    <td className="px-4 py-3">
                      {row.matchScore != null ? (
                        <span
                          className={
                            row.matchScore < 50 ? "text-red" : row.matchScore < 75 ? "text-amber-400" : "text-green-400"
                          }
                        >
                          {row.matchScore}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded-full ${
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
                    <td className="px-4 py-3 text-right">
                      {row.status === "done" && (
                        <Link href={`/result/${row.id}`} className="text-red hover:underline text-xs">
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
