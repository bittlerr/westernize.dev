import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const freeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "3 h"),
  prefix: "rl:free",
});

const paidLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "20 h"),
  prefix: "rl:paid",
});

export async function checkRateLimit(
  userId: string,
  isPaid: boolean,
): Promise<{ allowed: true } | { allowed: false; error: string }> {
  const limiter = isPaid ? paidLimiter : freeLimiter;
  const { success } = await limiter.limit(userId);

  if (!success) {
    return { allowed: false, error: "Rate limit exceeded, try again later" };
  }

  return { allowed: true };
}
