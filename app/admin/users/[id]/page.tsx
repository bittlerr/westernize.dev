import { eq, sql } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { users } from "@/db/schema";
import { logAudit } from "@/lib/audit";
import { formatDateTime } from "@/lib/dates";
import { db } from "@/lib/db";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .then((r) => r[0]);

  if (!user) notFound();

  async function addCredits(formData: FormData) {
    "use server";
    const amount = parseInt(formData.get("amount") as string, 10);
    if (!amount || amount < 1) return;
    await db
      .update(users)
      .set({ credits: sql`${users.credits} + ${amount}` })
      .where(eq(users.id, id));
    await logAudit(null, "admin.credits.added", { userId: id, amount });
    redirect(`/admin/users/${id}`);
  }

  async function toggleLifetime() {
    "use server";
    await db.update(users).set({ isLifetime: !user.isLifetime }).where(eq(users.id, id));
    await logAudit(null, "admin.lifetime.toggled", {
      userId: id,
      isLifetime: !user.isLifetime,
    });
    redirect(`/admin/users/${id}`);
  }

  async function toggleAdmin() {
    "use server";
    const newRole = user.role === "admin" ? "user" : "admin";
    await db.update(users).set({ role: newRole }).where(eq(users.id, id));
    await logAudit(null, "admin.role.changed", {
      userId: id,
      newRole,
    });
    redirect(`/admin/users/${id}`);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">User Detail</h1>

      <div className="border border-border rounded-lg p-6 bg-bg2 mb-8 space-y-3 text-sm">
        <p>
          <span className="text-muted">Email:</span> {user.email}
        </p>
        <p>
          <span className="text-muted">Name:</span> {user.name ?? "—"}
        </p>
        <p>
          <span className="text-muted">Role:</span>{" "}
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              user.role === "admin" ? "bg-red-dim text-red" : "bg-bg3 text-muted"
            }`}
          >
            {user.role}
          </span>
        </p>
        <p>
          <span className="text-muted">Credits:</span>{" "}
          {user.isLifetime ? <span className="text-green-400">Unlimited (Lifetime)</span> : user.credits}
        </p>
        <p>
          <span className="text-muted">Joined:</span> {formatDateTime(user.createdAt)}
        </p>
      </div>

      <h2 className="font-display text-lg font-bold mb-4">Actions</h2>

      <div className="flex flex-wrap gap-4">
        <form action={addCredits} className="flex gap-2">
          <input
            name="amount"
            type="number"
            min="1"
            defaultValue="5"
            className="w-20 rounded-lg border border-border bg-bg2 px-3 py-2 text-sm outline-none focus:border-red"
          />
          <button
            type="submit"
            className="bg-red text-white text-sm px-4 py-2 rounded-lg hover:bg-red/90 transition-colors"
          >
            Add credits
          </button>
        </form>

        <form action={toggleLifetime}>
          <button
            type="submit"
            className="border border-border text-sm px-4 py-2 rounded-lg text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
          >
            {user.isLifetime ? "Revoke lifetime" : "Grant lifetime"}
          </button>
        </form>

        <form action={toggleAdmin}>
          <button
            type="submit"
            className="border border-border text-sm px-4 py-2 rounded-lg text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
          >
            {user.role === "admin" ? "Remove admin" : "Make admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
