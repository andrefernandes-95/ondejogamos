# Local development plan

This plan covers a local-first build. The repository currently contains planning documents; the application and local services have not been set up yet.

## Proposed stack

| Part | Choice | Local role |
| --- | --- | --- |
| UI and server | Next.js with TypeScript | Pages, forms, server-side operations, and API routes on `localhost:3000` |
| Database | PostgreSQL | Users, sessions, locations, pitches, games, and participation |
| Authentication | Better Auth with its Email OTP plugin | Email code sign-in and session handling backed by PostgreSQL |
| Development email | Mailpit | Captures sign-in messages through local SMTP; inbox at `localhost:8025` |

Better Auth documents [Next.js integration](https://better-auth.com/docs/integrations/next), a [PostgreSQL adapter](https://better-auth.com/docs/adapters/postgresql), and an [Email OTP plugin](https://better-auth.com/docs/1.6/plugins/email-otp). Mailpit documents its [local SMTP and inbox ports](https://mailpit.axllent.org/docs/install/): `1025` and `8025`.

## Local sign-in flow

1. A visitor can browse public games without signing in.
2. When they try to create a game or pitch or join a game, they enter an email address.
3. The server generates a one-time code and sends it to Mailpit over local SMTP.
4. The developer opens the Mailpit inbox at `http://localhost:8025`, reads the code, and enters it in the app.
5. Better Auth verifies the code and manages the session in PostgreSQL. First-time users choose a display name.
6. The app uses the account ID to authorize game editing and participation changes. Email addresses stay off public pages.

Mailpit captures messages locally; no external email account or delivery service is needed for this development flow.

## Build order

1. Scaffold the Next.js app and connect it to a local PostgreSQL instance.
2. Add a local Mailpit service and complete the email code sign-in flow end to end.
3. Add locations and pitches, using the earlier project's data and schema as a reference.
4. Build the public game list, game page, and organizer creation flow.
5. Add participation, capacity rules, and organizer/player permissions.
6. Verify the whole journey with at least two test accounts locally.

The first runnable milestone is complete when a developer can start the local services, request a code, read it in Mailpit, sign in, and refresh the page while remaining signed in.

## Current machine status

Node.js and npm are available. The `docker`, `psql`, and PostgreSQL server commands are not currently available in this environment. The local services can be run either from a Docker setup or native Windows installations; we will choose one before implementing and testing the first milestone.
