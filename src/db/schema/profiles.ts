import {integer, pgTable, serial, text} from "drizzle-orm/pg-core";
import {users} from "@/db/schema/user";

export const profiles = pgTable("profile", {
    id: serial("profile_id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, {onDelete: "cascade"})
        .unique(),
    displayName: text("display_name"),
    givenName: text("given_name"),
    familyName: text("family_name"),
    imageId: text("image_id"),
    image: text("image"),
    bio: text("bio"),
});

export type Profile = typeof profiles.$inferSelect;