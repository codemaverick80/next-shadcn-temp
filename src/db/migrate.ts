import {migrate} from "drizzle-orm/node-postgres/migrator";
import {database, pg} from "@/db/index";

const main = async ()=> {

    try{
        await migrate(database, { migrationsFolder: "./src/db/migrations" });

        await pg.end();

        console.log("Migration successfully!");
    } catch(error){
        console.log(error);
        process.exit(1);
    }
};
main();