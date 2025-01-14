import {boolean, index, integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {users} from "@/db/schema/user";
import {accountTypeEnum} from "@/db/schema/enums";

export const accounts = pgTable("accounts", {
    id: serial("account_id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, {onDelete: "cascade"}),
    accountType: accountTypeEnum("account_type").notNull(),
    githubId: text("github_id").unique(),
    googleId: text("google_id").unique(),
    password: text("password"),
    salt: text("salt"),
    isApproved: boolean("is_approved").default(false).notNull(),
});