"use server";
import { AuthenticationError } from "@/app/util";
import { cache } from "react";
import { cookies } from "next/headers";
import { createSession, generateSessionToken, validateRequest } from "@/auth";
import { env } from "@/env.mjs";
import { UserId } from "@/types";
import { getUserRoles, getUserPermissions } from "@/app-services/auth.services";

const SESSION_COOKIE_NAME = "auth_session";

/* =========== Auth functions
    # These functions are used to manage cookies

    # setSessionTokenCookie() - Sets the session token cookie
    # deleteSessionTokenCookie() - Deletes the session token cookie
    # getSessionCookies() - Gets the session token cookie
    # getCurrentUser() - Gets the current user from the session
    # assertAuthenticated() - Asserts that the user is authenticated
    # setSession() - Sets the session in the database      
============== */

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const allCookies = await cookies();

  allCookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const allCookies = await cookies();
  allCookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function getSessionCookies(): Promise<string | undefined> {
  const allCookies = await cookies();
  const sessionCookie = allCookies.get(SESSION_COOKIE_NAME)?.value;
  return sessionCookie;
}

export const getCurrentUser = cache(async () => {
  const { user } = await validateRequest();
  return user ?? undefined;
});

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};

export async function setSession(userId: UserId) {
  const token = generateSessionToken();

  // Get user roles and permissions
  const roles = await getUserRoles(userId);
  const permissions = await getUserPermissions(userId);

  const session = await createSession(token, userId);
  await setSessionTokenCookie(token, session.expiresAt);

  // Store roles and permissions in the session cookie
  const allCookies = await cookies();
  allCookies.set("user_roles", JSON.stringify(roles.map((r) => r.name)), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires: session.expiresAt,
    path: "/",
  });

  allCookies.set("user_permissions", JSON.stringify(permissions), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires: session.expiresAt,
    path: "/",
  });
}
