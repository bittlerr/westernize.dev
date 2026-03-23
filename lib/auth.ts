import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema";
import { logAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { sendResetPasswordEmail, sendVerificationEmail, sendWelcomeEmail } from "@/lib/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  rateLimit: {
    window: 60,
    max: 5,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      await sendResetPasswordEmail(user.email, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendVerificationEmail(user.email, url);
    },
  },
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          await sendWelcomeEmail(user.email, user.name ?? "");
          await logAudit(user.id, "signup");
        },
      },
    },
  },
  user: {
    additionalFields: {
      credits: {
        type: "number",
        defaultValue: 3,
        fieldName: "credits",
      },
      isLifetime: {
        type: "boolean",
        defaultValue: false,
        fieldName: "isLifetime",
      },
      role: {
        type: "string",
        defaultValue: "user",
        fieldName: "role",
      },
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
