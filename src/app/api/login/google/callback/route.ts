import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import {googleAuth} from "@/auth";


import { setSession } from "@/lib/session";
import {getAccountByGoogleIdService} from "@/app-services/account.services";
import {createGoogleUserService} from "@/app-services/user.services";


export async function GET(request: Request):Promise<Response>{
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const allCookies = await cookies();
    const storedState = allCookies.get("google_oauth_state")?.value ?? null;
    const codeVerifier = allCookies.get("google_code_verifier")?.value ?? null;

    if (!code || !state || !storedState || state !== storedState || !codeVerifier) {

        return new Response(null, {status: 400}) as Response;
    }

    try {
        const tokens = await googleAuth.validateAuthorizationCode(code,codeVerifier);
        const accessToken = tokens.accessToken();
        const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
        const response = await fetch(
            "https://openidconnect.googleapis.com/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const googleUser: GoogleUser = await response.json();

        console.log(`Google user info : ${googleUser}`)

        //INFO: Check if account exists
        const existingAccount = await getAccountByGoogleIdService(googleUser.sub);

        if (existingAccount) {
            await setSession(existingAccount.userId);

            return new Response(null, {
                status: 302,
                headers: {
                    'Location': "/dashboard",
                },
            })as Response;


            // return new Response(null, {
            //     status: 302,
            //     headers: {
            //         Location: "/dashboard",
            //     },
            // });
        }

        //INFO: If account does not exists, then create it
        const userId = await createGoogleUserService(googleUser);
        await setSession(userId);
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/dashboard",
            },
        })as Response;


    } catch (e) {
        console.error(e);
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
            // invalid code
            return new Response(null, {
                status: 400,
            }) as Response;
        }
        return new Response(null, {
            status: 500,
        })as Response;
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
