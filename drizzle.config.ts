import { env } from "@/env.mjs"
import { type Config } from "drizzle-kit"


export default {
    schema: "./src/db/schema/index.ts",
    dialect: "postgresql",
    out: "./src/db/migrations",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
} satisfies Config
