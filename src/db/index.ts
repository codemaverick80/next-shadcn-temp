import * as schema from "./schema/index";
import {NodePgDatabase,drizzle} from "drizzle-orm/node-postgres";
import postgres from "postgres";
import {Pool} from "pg";
import {env} from "@/env.mjs";
let database: NodePgDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

if (env.NODE_ENV === "production") {
    pg = postgres(env.DATABASE_URL);

    database = drizzle(pool, { schema });
} else {
    if (!(global as any).database!) {
        pg = postgres(env.DATABASE_URL);
        (global as any).database = drizzle(pool, { schema });
    }
    database = (global as any).database;
}
export { database,pg };

