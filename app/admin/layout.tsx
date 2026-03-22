import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r border-border bg-bg2 p-6 flex flex-col gap-1">
        <Link href="/dashboard" className="font-display text-sm font-bold text-red mb-6 block">
          WESTERNIZE
        </Link>
        <span className="text-[9px] font-display uppercase tracking-[0.2em] text-muted mb-3">Admin</span>
        {[
          { href: "/admin", label: "Overview" },
          { href: "/admin/users", label: "Users" },
          { href: "/admin/optimizations", label: "Optimizations" },
          { href: "/admin/audit", label: "Audit Log" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-bg3 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
