import { desc, ilike } from "drizzle-orm";
import Link from "next/link";
import { users } from "@/db/schema";
import { formatDate } from "@/lib/dates";
import { db } from "@/lib/db";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page ?? "1", 10));
  const perPage = 50;

  let query = db.select().from(users).orderBy(desc(users.createdAt)).$dynamic();

  if (q) {
    query = query.where(ilike(users.email, `%${q}%`));
  }

  const rows = await query.limit(perPage).offset((pageNum - 1) * perPage);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Users</h1>

      <form className="mb-6">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by email..."
          className="w-full max-w-sm rounded-lg border border-border bg-bg2 px-4 py-2.5 text-sm outline-none focus:border-red transition-colors"
        />
      </form>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg2">
              <th className="text-left px-4 py-3 font-medium text-muted">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Credits</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Role</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  {user.isLifetime ? <span className="text-green-400">Unlimited</span> : user.credits}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === "admin" ? "bg-red-dim text-red" : "bg-bg3 text-muted"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/users/${user.id}`} className="text-red text-xs hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-4 text-sm">
        {pageNum > 1 && (
          <Link href={`/admin/users?page=${pageNum - 1}${q ? `&q=${q}` : ""}`} className="text-red hover:underline">
            ← Previous
          </Link>
        )}
        {rows.length === perPage && (
          <Link href={`/admin/users?page=${pageNum + 1}${q ? `&q=${q}` : ""}`} className="text-red hover:underline">
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
