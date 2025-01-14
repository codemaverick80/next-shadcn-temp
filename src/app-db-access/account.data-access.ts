import { database as db } from "@/db";
import {eq} from "drizzle-orm";
import {accounts} from "@/db/schema";
import {UserId} from "@/types";


export async function getAccountByGoogleId(googleId: string) {
    return await db.query.accounts.findFirst({
        where: eq(accounts.googleId, googleId)
    });
}


export async function createAccountViaGoogle(userId: UserId, googleId: string) {
    await db
        .insert(accounts)
        .values({
            userId: userId,
            accountType: "google",
            googleId
        })
        .onConflictDoNothing()
        .returning();
}