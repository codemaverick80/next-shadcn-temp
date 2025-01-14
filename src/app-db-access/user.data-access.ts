
import {database as db,} from "@/db";
import {users} from "@/db/schema";
import {GoogleUser} from "@/app/api/login/google/callback/route";
import {eq} from "drizzle-orm";
export async function createGoogleUser(googleUser: GoogleUser) {
    const [user] = await db
        .insert(users)
        .values({
            email: googleUser.email,
            name: googleUser.name
        })
        .returning();
    return user;
}


export async function getUserByEmail(email: string) {

    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    return user;
}