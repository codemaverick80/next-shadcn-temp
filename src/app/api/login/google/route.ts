import { googleAuth } from "@/auth";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateState } from "arctic";

/* =========== Create authorization URL
    # Generate a state and code verifier using generateState() and generateCodeVerifier(). 
    # Use them to create an authorization URL with createAuthorizationURL(), store the state and code verifier as cookies, 
    # and redirect the user to the authorization url.
============== */

export async function GET(): Promise<Response> {
  console.log("google/route   => BEGIN");
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["email", "profile"];

  const url = await googleAuth.createAuthorizationURL(
    state,
    codeVerifier,
    scopes
  );

  // console.log(
  //   `Create auth URL Values \n state: ${state} \n codeVerifier: ${codeVerifier} \n Auth_URL: ${url}`
  // );

  const allCookies = await cookies();

  // store state as cookie
  allCookies.set("google_oauth_state", state, {
    secure: true,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
  });

  // store code verifier as cookie
  allCookies.set("google_code_verifier", codeVerifier, {
    secure: true,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
  });

  console.log("google/route   => END");
  return Response.redirect(url);
}
