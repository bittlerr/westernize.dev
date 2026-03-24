import crypto from "node:crypto";

export const VARIANT_CREDITS: Record<string, number> = {
  [process.env.LEMONSQUEEZY_VARIANT_STARTER ?? "starter"]: 5,
  [process.env.LEMONSQUEEZY_VARIANT_HUNT ?? "hunt"]: 50,
};

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);

  hmac.update(rawBody);

  const digest = hmac.digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export function checkoutUrl(variantId: string, email: string): string {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

  return `https://westernize.lemonsqueezy.com/checkout/buy/${variantId}?checkout[email]=${encodeURIComponent(email)}&checkout[custom][store_id]=${storeId}`;
}
