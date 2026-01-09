import { sqliteTable, AnySQLiteColumn, integer, text, numeric, foreignKey, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const d1Migrations = sqliteTable("d1_migrations", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text(),
	appliedAt: numeric("applied_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const session = sqliteTable("session", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	expiresAt: integer("expires_at").notNull(),
	createdAt: text("created_at").default("sql`(current_timestamp)`").notNull(),
});

export const shibaSubmission = sqliteTable("shiba_submission", {
	id: integer().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	createdAt: text("created_at").default("sql`(current_timestamp)`").notNull(),
	imageRef: text("image_ref").notNull(),
},
(table) => [
	uniqueIndex("shiba_submission_image_ref_unique").on(table.imageRef),
]);

export const user = sqliteTable("user", {
	id: text().primaryKey().notNull(),
	oauthId: text("oauth_id", { length: 255 }).notNull(),
	oauthType: text("oauth_type").notNull(),
	avatarUrl: text("avatar_url"),
	userName: text("user_name").notNull(),
	fullName: text("full_name").notNull(),
	email: text(),
	role: text().default("user"),
	createdAt: text("created_at").default("sql`(current_timestamp)`").notNull(),
},
(table) => [
	uniqueIndex("user_oauth_id_unique").on(table.oauthId),
]);

