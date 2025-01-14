import {pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";

export const magicLinks = pgTable("magic_links", {
    id: serial("magic_links_id").primaryKey(),
    email: text("email").notNull().unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("token_expires_at", {mode: "date"}),
});