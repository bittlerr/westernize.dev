import { and, eq, gt, sql } from "drizzle-orm";
import { users } from "@/db/schema";
import { db } from "@/lib/db";

export async function hasCredit(userId: string): Promise<boolean> {
  const user = await db
    .select({ credits: users.credits, isLifetime: users.isLifetime })
    .from(users)
    .where(eq(users.id, userId))
    .then((r) => r[0]);

  if (!user) return false;

  return user.isLifetime || user.credits > 0;
}

export async function deductCredit(userId: string): Promise<boolean> {
  const user = await db
    .select({ isLifetime: users.isLifetime })
    .from(users)
    .where(eq(users.id, userId))
    .then((r) => r[0]);

  if (user?.isLifetime) return true;

  const result = await db
    .update(users)
    .set({ credits: sql`${users.credits} - 1` })
    .where(and(eq(users.id, userId), gt(users.credits, 0)));

  return result.length > 0;
}
