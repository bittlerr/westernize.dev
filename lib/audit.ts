import { auditLogs } from "@/db/schema";
import { db } from "@/lib/db";

export async function logAudit(userId: string | null, action: string, metadata?: Record<string, unknown>) {
  await db.insert(auditLogs).values({
    userId,
    action,
    metadata: metadata ?? null,
  });
}
