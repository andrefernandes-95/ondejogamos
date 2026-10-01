# Local development plan

This plan covers a local-first build. The repository now contains the Next.js app shell, email code sign-in, and local PostgreSQL/Mailpit configuration.

## Proposed stack

| Part | Choice | Local role |
| --- | --- | --- |
| UI and server | Next.js with TypeScript | Pages, forms, server-side operations, and API routes on `localhost:3000` |
| Database | PostgreSQL | Users, sessions, locations, pitches, games, and participation |
| Authentication | Better Auth with its Email OTP plugin | Email code sign-in and session handling backed by PostgreSQL |
| Development email | Mailpit | Captures sign-in messages through local SMTP; inbox at `localhost:8025` |

Better Auth documents [Next.js integration](https://better-auth.com/docs/integrations/next), a [PostgreSQL adapter](https://better-auth.com/docs/adapters/postgresql), and an [Email OTP plugin](https://better-auth.com/docs/plugins/email-otp). Mailpit documents its [local SMTP and inbox ports](https://mailpit.axllent.org/docs/install/): `1025` and `8025`.

## Local sign-in flow

1. A visitor can browse public games without signing in.
2. When they try to create a game or pitch or join a game, they enter an email address.
3. The server generates a one-time code and sends it to Mailpit over local SMTP.
4. The developer opens the Mailpit inbox at `http://localhost:8025`, reads the code, and enters it in the app.
5. Better Auth verifies the code and manages the session in PostgreSQL. First-time users choose a display name.
6. The app uses the account ID to authorize game editing and participation changes. Email addresses stay off public pages.

Mailpit captures messages locally; no external email account or delivery service is needed for this development flow.

## Build order

1. Start PostgreSQL and Mailpit, then apply the Better Auth schema.
2. Complete the email code sign-in flow locally.
3. Add locations and pitches, using the earlier project's data and schema as a reference.
4. Build location search, the public game list, game page, and organizer creation flow.
5. Add participation, capacity rules, and organizer/player permissions.
6. Add opt-in alerts for locations without matching games.
7. Verify the whole journey locally with at least two accounts.

## Run locally

1. Install Docker Desktop and start it.
2. Run `npm ci` to install the locked dependencies.
3. Copy `.env.example` to `.env` and set a random `BETTER_AUTH_SECRET` with at least 32 characters.
4. Run `docker compose up -d` to start PostgreSQL and Mailpit.
5. Run `npm run auth:migrate` to create the authentication tables.
6. Run `npm run dev` and open `http://localhost:3000`.
7. Sign in at `http://localhost:3000/sign-in`; open `http://localhost:8025` to read the local code.

Stop the local services with `docker compose down`. The database volume is preserved.

The first runnable milestone is complete when a developer can start the local services, request a code, read it in Mailpit, sign in, and refresh the page while remaining signed in.

## Current machine status

Node.js 22 and npm are available. Docker Desktop is installed, PostgreSQL and Mailpit containers are running, and the Better Auth tables have been created. The email sign-in flow is wired to local SMTP; its first end-to-end sign-in still needs to be confirmed. The game and participation features are not implemented yet.
