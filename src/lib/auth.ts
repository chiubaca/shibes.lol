import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzle } from "drizzle-orm/d1";

import * as authSchema from "@/infrastructure/database/drizzle/auth-schema";

export const auth = betterAuth({
	database: drizzleAdapter(drizzle(env.SHIBES_LOL_DB), {
		provider: "sqlite",
		schema: {
			user: authSchema.userV2,
			session: authSchema.sessionV2,
			account: authSchema.account,
			verification: authSchema.verification,
		},
	}),
	baseURL: process.env.VITE_PUBLIC_BETTER_AUTH_URL,
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	plugins: [
		tanstackStartCookies(), // make sure this is the last plugin in the array
	],
});
