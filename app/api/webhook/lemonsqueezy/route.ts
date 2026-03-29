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

  if (eventName !== "order_created" && eventName !== "order_refunded") {
    return Response.json({ ok: true });
  }

  const customUserId = payload.meta?.custom_data?.user_id as string | undefined;
  const email = payload.data?.attributes?.user_email;
  const variantId = String(payload.data?.attributes?.first_order_item?.variant_id ?? "");

  const user = customUserId
    ? await db
        .select()
        .from(users)
        .where(eq(users.id, customUserId))
        .then((r) => r[0])
    : null;

  const resolvedUser =
    user ??
    (email
      ? await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .then((r) => r[0])
      : null);

  if (!resolvedUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const credits = VARIANT_CREDITS[variantId];

  if (typeof credits !== "number") {
    return Response.json({ ok: true });
  }

  if (eventName === "order_created") {
    await db
      .update(users)
      .set({ credits: sql`${users.credits} + ${credits}` })
      .where(eq(users.id, resolvedUser.id));

    await logAudit(resolvedUser.id, "credits.purchased", {
      amount: credits,
      variantId,
    });
  } else {
    await db
      .update(users)
      .set({ credits: sql`GREATEST(${users.credits} - ${credits}, 0)` })
      .where(eq(users.id, resolvedUser.id));

    await logAudit(resolvedUser.id, "credits.refunded", {
      amount: credits,
      variantId,
    });
  }

  return Response.json({ ok: true });
}
