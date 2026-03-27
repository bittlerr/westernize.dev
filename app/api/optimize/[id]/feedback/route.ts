import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { optimizations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { rating: number; feedback?: string };

  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return Response.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const [row] = await db
    .update(optimizations)
    .set({
      rating: body.rating,
      feedback: body.feedback?.trim() || null,
    })
    .where(and(eq(optimizations.id, id), eq(optimizations.userId, session.user.id)))
    .returning({ id: optimizations.id });

  if (!row) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
