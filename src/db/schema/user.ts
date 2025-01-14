import {pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: serial("user_id").primaryKey(),
    email: text("email").unique(),
    name: text("name"),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
});

export type User = typeof users.$inferSelect;