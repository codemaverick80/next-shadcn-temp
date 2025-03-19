"use server";
import { validateRequest, invalidateSession } from "@/auth";
import { redirect } from "next/navigation";

import { deleteSessionTokenCookie } from "@/lib/session";

export async function signOutAction() {
  const { session } = await validateRequest();

  if (!session) {
    redirect("/sign-in");
  }

  await invalidateSession(session.id);
  const sessionCookie = deleteSessionTokenCookie();

  // redirect("/sign-out");
  redirect("/sign-in");
}
