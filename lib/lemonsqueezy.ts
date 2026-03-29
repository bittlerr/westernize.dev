import crypto from "node:crypto";
import { lemonSqueezySetup, createCheckout as lsCreateCheckout } from "@lemonsqueezy/lemonsqueezy.js";

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

export async function createCheckout(variantId: string, userId: string, email: string): Promise<string> {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

  const { data, error } = await lsCreateCheckout(storeId, variantId, {
    checkoutOptions: {
      embed: false,
      media: true,
    },
    checkoutData: {
      email,
      custom: { user_id: userId },
    },
    productOptions: {
      enabledVariants: [Number(variantId)],
      redirectUrl: `${process.env.BETTER_AUTH_URL ?? "https://www.westernize.dev"}/optimize`,
    },
  });

  if (error) {
    console.dir(error.cause, { depth: null });

    throw new Error(`Lemon Squeezy checkout failed: ${error.message}`);
  }

  return data!.data.attributes.url;
}
