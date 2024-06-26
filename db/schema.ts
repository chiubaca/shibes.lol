import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const shibaSubmission = sqliteTable("shiba_submission", {
  id: integer("id").primaryKey(),
  userId: text("user_id")
    .references(() => userTable.id)
    .notNull(),
  createdAt: text("created_at")
    .default(sql`(current_timestamp)`)
    .notNull(),
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
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});
