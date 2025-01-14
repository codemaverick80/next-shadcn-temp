import {integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {users} from "@/db/schema/user";

export const verifyEmailTokens = pgTable("verify_email_tokens", {
    id: serial("verify_email_tokens_id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, {onDelete: "cascade"})
        .unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("token_expires_at", {mode: "date"}),
});