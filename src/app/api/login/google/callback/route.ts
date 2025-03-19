import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { googleAuth } from "@/auth";
import * as arctic from "arctic";
import { env } from "@/env.mjs";
import { setSession } from "@/lib/session";
import { getAccountByGoogleIdService } from "@/app-services/account.services";
import { createGoogleUserService } from "@/app-services/user.services";
import { NextRequest, NextResponse } from "next/server";

/* ===========Google Callback
    # The Google callback route is used to exchange the authorization code for an access token and ID token.
    # The ID token is decoded and the user's Google ID is extracted.
    # The user's Google ID is used to check if the user already exists in the database.
    # If the user exists, the user is signed in.
    # If the user does not exist, the user is created and signed in.
    # The user is then redirected to the dashboard.  
================ */

export async function GET(request: NextRequest): Promise<NextResponse> {
  console.log("google/callback/route.ts => BEGIN");

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const allCookies = await cookies();
  const storedState = allCookies.get("google_oauth_state")?.value ?? null;
  const codeVerifier = allCookies.get("google_code_verifier")?.value ?? null;

  // console.log(
  //   `Google Callback GET endpoint# \n code: ${code} \n state: ${state} \n stored_State: ${storedState} \n stored_codeverifier: ${codeVerifier} ${url}`
  // );

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_BASE_URL}/sign-in?error=${encodeURIComponent(
        "Invalid authorization request"
      )}`
    );
  }

  try {
    const tokens = await googleAuth.validateAuthorizationCode(
      code,
      codeVerifier
    );

    /* tokens is an object. looks like this:
          OAuth2Tokens {
            data: {
              access_token: 'XXXXXX',
              expires_in: 3599,
              scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
              token_type: 'Bearer',
              id_token: 'XXXXXX' // this is JWT token
            }
          }
    */

    const accessToken = tokens.accessToken();
    const idToken = tokens.idToken();
    const claims = arctic.decodeIdToken(idToken);

    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const googleUser: GoogleUser = await response.json();
    // console.dir(googleUser);

    //INFO: Check if account exists
    const existingAccount = await getAccountByGoogleIdService(googleUser.sub);

    if (existingAccount) {
      await setSession(existingAccount.userId);
      console.log("google/callback/route.ts => END");
      return NextResponse.redirect(`${env.NEXT_PUBLIC_BASE_URL}/dashboard`);
    }

    //INFO: If account does not exists, then create it
    const userId = await createGoogleUserService(googleUser);
    await setSession(userId);

    console.log("google/callback/route.ts => END");
    return NextResponse.redirect(`${env.NEXT_PUBLIC_BASE_URL}/dashboard`);
  } catch (err) {
    console.error("Callback error:", err instanceof Error ? err.message : err);

    // Handle specific error types
    if (err instanceof OAuth2RequestError) {
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_BASE_URL}/sign-in?error=${encodeURIComponent(
          "Invalid authorization code or credentials"
        )}`
      );
    }
    // Handle other errors
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_BASE_URL}/sign-in?error=${encodeURIComponent(
        `Authentication failed. Please try again. ${err}`
      )}`
    );
  }
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}
