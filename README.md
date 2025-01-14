### `pnpm` package manager

### Install packages
```bash
#install all the packages
pnpm i

# build the project to make sure there are no error
pnpm build
```


### PostgreSQL database `nextjs-Oauth-demo`
Make sure `nextjs-Oauth-demo` database is created on PostgreSQL

### `.env or .env.local` variables

```bash
HOST_NAME=http://localhost:3000
## GOOGLE OAUTH
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

## DATABASE
DATABASE_URL="postgresql://<db-user-name>:<db-user-password>@localhost:5432/nextjs-Oauth-demo"

```

### Google cloud console
 - https://console.cloud.google.com/
 - sign into google cloud
 - Go to APIs and Services
 - Go to Credentials
 - Click on `Create Credentials`
 - Choose `OAuth Client ID`
 - Choose `Web Application` as Application type
 - Name your application `nextjs-oauth-app`
 - Add `http://localhost:3000` as Authorised JavaScript origins
 - Add `http://localhost:3000/api/login/google/callback` as Authorised redirect URIs
 - Click [Configure Consent Screen]
 - Add userinfo.email & userinfo.profile to scope and Save and Continue.
 - Go to credential and click on `nextjs-oauth-app`
 - Copy both Client ID and Client secret to .env file variable


### Database migration
Run following command to migrate database schema 
```bash

 pnpm db:generate
 
 pnpm db:migrate
 
 ```

### Run application

```bash

pnpm dev

```









Open [http://localhost:3002](http://localhost:3000) with your browser to see the result.


### Authentication

 - Install following npm packages

```bash
pnpm add @oslojs/encoding @oslojs/crypto
```

 - Create a `auth.ts` file inside `src` folder.

 - Create a `session.ts` file inside `src/lib/`.

 - Login page => `src/(auth)/login/page.tsx`.

 - Google OAuth => `src/app/api/login/google`.
    - `google/route.ts`
    - `google/callback/route.ts`


- GitHub OAuth => `src/app/api/login/github`.
    - `github/route.ts`
    - `github/callback/route.ts`


- Install Drizzle orm and postgreSQL packages
```bash
  pnpm add drizzle-orm pg postgres dotenv
  pnpm add -D drizzle-kit tsx @types/pg
```

- Install T3 Env (https://env.t3.gg/docs/introduction)
```bash 
pnpm add @t3-oss/env-core zod 
```
- Create a `env.mjs` file inside `src` folder and 
- Create a `.env` file in the root of the project and add database connection variable


