import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  emailAndPassword: {
    enabled: true,
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
