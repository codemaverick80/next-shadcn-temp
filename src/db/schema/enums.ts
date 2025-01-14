import {pgEnum} from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("type", ["email", "google", "github"]);
