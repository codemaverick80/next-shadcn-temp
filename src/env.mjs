import { z } from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
    /*
     * ServerSide Environment variables, not available on the client.
     * Will throw if you access these variables on the client.
     */
    server: {
        HOST_NAME: z.string().min(1),
        NODE_ENV: z.enum(['development', 'test', 'production']),

        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),

        // GITHUB_CLIENT_ID:z.string().min(1),
        // GITHUB_CLIENT_SECRET: z.string().min(1),

        DATABASE_URL:z.string().min(1),
    },


    /* Environment variables available on the client (and server).
         💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
    */
    client: {
        NEXT_PUBLIC_APP_NAME: z.string().optional(),
        NEXT_PUBLIC_GOOGLE_MAP_API_KEY: z.string().optional(),
    },

 /*
  * Due to how Next.js bundles environment variables on Edge and Client,
  * we need to manually destructure them to make sure all are included in bundle.
  *
  * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
  */
    runtimeEnv:{
        HOST_NAME: process.env.HOST_NAME,
        NODE_ENV:process.env.NODE_ENV,
        GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
        // GITHUB_CLIENT_ID:process.env.GITHUB_CLIENT_ID,
        // GITHUB_CLIENT_SECRET:process.env.GITHUB_CLIENT_SECRET,
        DATABASE_URL:process.env.DATABASE_URL,

    }
});
