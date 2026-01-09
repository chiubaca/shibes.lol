import type { Config } from "drizzle-kit";

const config: Config = {
	out: "./src/infrastructure/database/drizzle/out",
	schema: "./src/infrastructure/database/drizzle/schema.ts",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
		token: process.env.CLOUDFLARE_D1_TOKEN!,
	},
	tablesFilter: ["!_cf_KV"],
};

export default config satisfies Config;
