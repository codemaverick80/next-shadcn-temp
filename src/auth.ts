import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { Google } from "arctic";
import { env } from "@/env.mjs";
import { Session, sessions } from "@/db/schema/sessions";
import { UserId } from "@/types";
import { database } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { User } from "@/db/schema/user";
import { getSessionCookies } from "./lib/session";

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 days

const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2; // 30 days (2x refresh interval)

/* Google, GitHub Env */
// export const github = new GitHub(
//     env.GITHUB_CLIENT_ID,
//     env.GITHUB_CLIENT_SECRET
// );

/* =========== Setting up Google as Auth Provider
    # Most providers require a client ID, client secret, and redirect URI. 
    # The API is nearly identical across providers but always check each provider's guide before implementing   
============== */

export const googleAuth = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.HOST_NAME}/api/login/google/callback`
);

/* =========== Session Validation Result Type ============== */
export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

/* =========== Auth functions
    # These functions are used to manage sessions in the database

    # generateSessionToken() - Generates a random session token 
    # createSession() - Creates a session in the database
    # validateRequest() - Validates the session token in the request
    # invalidateSession() - Invalidates a session
    # invalidateUserSessions() - Invalidates all sessions for a user
============== */

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  // console.log(`Session token generated => ${token}`)
  return token;
}

export async function createSession(
  token: string,
  userId: UserId
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  //console.log(`Session Id generated => ${sessionId}`);
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
  };
  await database.insert(sessions).values(session);
  return session;
}

export async function validateRequest(): Promise<SessionValidationResult> {
  /* check if session cookie name "auth_session" exists */
  const sessionToken = await getSessionCookies();
  if (!sessionToken) {
    return { session: null, user: null };
  }
  return validateSessionToken(sessionToken);
}

async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const sessionInDb = await database.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  });
  if (!sessionInDb) {
    return { session: null, user: null };
  }
  if (Date.now() >= sessionInDb.expiresAt.getTime()) {
    await database.delete(sessions).where(eq(sessions.id, sessionInDb.id));
    return { session: null, user: null };
  }
  const user = await database.query.users.findFirst({
    where: eq(users.id, sessionInDb.userId),
  });

  if (!user) {
    await database.delete(sessions).where(eq(sessions.id, sessionInDb.id));
    return { session: null, user: null };
  }

  if (
    Date.now() >=
    sessionInDb.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS
  ) {
    sessionInDb.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);
    await database
      .update(sessions)
      .set({
        expiresAt: sessionInDb.expiresAt,
      })
      .where(eq(sessions.id, sessionInDb.id));
  }
  return { session: sessionInDb, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await database.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateAllUserSessions(userId: UserId): Promise<void> {
  await database.delete(sessions).where(eq(users.id, userId));
}
