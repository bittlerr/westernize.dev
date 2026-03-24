import { eq, sql } from "drizzle-orm";
import { users } from "@/db/schema";
import { logAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { VARIANT_CREDITS, verifyWebhookSignature } from "@/lib/lemonsqueezy";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload.meta?.event_name;

  if (eventName !== "order_created") {
    return Response.json({ ok: true });
  }

  const email = payload.data?.attributes?.user_email;
  const variantId = String(payload.data?.attributes?.first_order_item?.variant_id ?? "");

  if (!email) {
    return Response.json({ error: "No email" }, { status: 400 });
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((r) => r[0]);

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const credits = VARIANT_CREDITS[variantId];

  if (typeof credits === "number") {
    await db
      .update(users)
      .set({ credits: sql`${users.credits} + ${credits}` })
      .where(eq(users.id, user.id));

    await logAudit(user.id, "credits.purchased", {
      amount: credits,
      variantId,
    });
  }

  return Response.json({ ok: true });
}
