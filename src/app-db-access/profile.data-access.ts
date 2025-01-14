import {database as db} from "@/db";
import {UserId} from "@/types";
import {profiles} from "@/db/schema";
import {eq} from "drizzle-orm";

export async function createProfile(
    userId: UserId,
    displayName: string,
    image?: string,
    givenName?: string,
    familyName?: string,
) {

    const [profile] = await db
        .insert(profiles)
        .values({
            userId,
            image,
            displayName,
            familyName,
            givenName
        })
        .onConflictDoNothing()
        .returning();
    return profile;
}


export async function getProfile(userId: UserId) {
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, userId),
    });
    return profile;
}