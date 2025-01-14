import {integer, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {users} from "@/db/schema/user";


export const sessions = pgTable("session", {
    id: text("session_id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, {onDelete: "cascade"}),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull()
});

export type Session = typeof sessions.$inferSelect;