import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userV2 } from "./auth-schema";

export const shibaSubmission = sqliteTable("shiba_submission", {
	id: integer("id").primaryKey(),
	userId: text("user_id")
		.references(() => userTable.id)
		.notNull(),
	createdAt: text("created_at").default(sql`(current_timestamp)`).notNull(),
	imageRef: text("image_ref").unique().notNull(),
});

export const shibaSubmissionV2 = sqliteTable("shiba_submission_v2", {
	id: integer("id").primaryKey(),
	userId: text("user_id")
		.references(() => userV2.id)
		.notNull(),
	createdAt: text("created_at").default(sql`(current_timestamp)`).notNull(),
	imageRef: text("image_ref").unique().notNull(),
});

export const userTable = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
	oauthId: text("oauth_id", { length: 255 }).unique().notNull(),
	authType: text("oauth_type", {
		enum: ["google", "github", "twitter"],
	}).notNull(),
	avatarUrl: text("avatar_url"),
	userName: text("user_name").notNull(), // The user alias or handle name
	fullName: text("full_name").notNull(), // Full name of the user
	email: text("email"),
	role: text("role").default("user"), // user | admin | banned
	createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const sessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at").notNull(),
	createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export * from "./auth-schema";
