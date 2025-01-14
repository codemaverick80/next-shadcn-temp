import { googleAuth } from "@/auth";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateState } from "arctic";

export async function GET(): Promise<Response> {
    console.log('google/route   => BEGIN')
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const scopes = ["openid", "profile"];
    const url = await googleAuth.createAuthorizationURL(state, codeVerifier,scopes);

    const allCookies = await cookies();

    allCookies.set("google_oauth_state", state, {
        secure: true,
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
    });

    allCookies.set("google_code_verifier", codeVerifier, {
        secure: true,
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
    });

    console.log('google/route   => END')
    return Response.redirect(url);
}
