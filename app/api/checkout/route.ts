import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createCheckout } from "@/lib/lemonsqueezy";

const PACKS: Record<string, string | undefined> = {
  starter: process.env.LEMONSQUEEZY_VARIANT_STARTER,
  hunt: process.env.LEMONSQUEEZY_VARIANT_HUNT,
};

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pack } = (await request.json()) as { pack: string };
  const variantId = PACKS[pack];

  if (!variantId) {
    return Response.json({ error: "Invalid pack" }, { status: 400 });
  }

  const url = await createCheckout(variantId, session.user.id, session.user.email);

  return Response.json({ url });
}
