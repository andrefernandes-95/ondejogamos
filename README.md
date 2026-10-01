# Onde Jogamos

A simple way to find and organize football games: choose when and where to play, fill the available spots, and see who is coming.

## Problem

When a game is organized across chat messages, it becomes hard to know the final time and place, who has confirmed, and how many players are still needed.

## Product decisions

- The first release is for football only.
- Games are public and discoverable. Private games may be added later.
- Players can browse games near their current location or choose a municipality themselves.
- When no games match, players can opt in to an alert for that location. Email and WhatsApp are candidate channels; the first release's channel is still to be decided.
- Anyone can browse games without signing in.
- Creating a game or pitch and joining a game requires signing in with a code sent by email. On first sign-in, the player chooses a public display name.
- Each account can join a game once and manage its own participation from another browser or device.
- The organizer chooses a pitch in the selected municipality and can add one if it is missing.

The initial audience is still a hypothesis: groups and players in Portugal who need to fill football games.

## Core journey

1. A player sees games near their current location or chooses a municipality.
2. They open a game and choose **“Vou jogar”**. Browsing does not require an account.
3. To confirm, they enter an email code and choose the display name shown to other players on first use.
4. They see the confirmed player list and remaining spots; they can later sign in and withdraw.
5. If no games match, they can request an alert for that location.
6. An organizer signs in, chooses a municipality and pitch, and adds the pitch if needed.
7. They set the date, time, capacity, and an optional note, then publish the public game.

## MVP scope

- Public game listing near the current location or filtered by municipality.
- An opt-in alert when a new game appears for a location with no current games.
- Public game detail page and shareable link.
- Email code sign-in for actions that change data.
- Pitch selection and pitch creation within a municipality.
- Game creation, editing, and cancellation by its organizer.
- Joining and withdrawing from a game, limited to one spot per account.
- Confirmed-player list, capacity, and remaining spots.
- Portuguese interface designed for mobile use.

## Accounts and permissions

- Email is verified through a sign-in code; passwords are not used.
- Email addresses are private. Display names appear on game pages.
- Only the organizer can edit or cancel their game. Only a player can withdraw their own participation.
- Authentication and session management should use an established library instead of custom anonymous sessions.

## Outside the first release

Private games, payments, pitch bookings, balanced teams, built-in chat, rankings, and automatic notifications.

## Open product rules

- Minimum pitch information. Initial proposal: name, municipality, and an address or map link.
- What happens when a game is full. Initial proposal: show it as full and stop new joins; add a waitlist later.
- Whether an organizer can add players without accounts. Initial proposal: each player joins for themselves.
- Which alert channel to launch with, and whether alerts match a municipality or a distance radius.

## Local development first

The proposed stack is **Next.js with TypeScript for the UI and server, plus PostgreSQL**. Email code sign-in can run locally with Better Auth and Mailpit: Mailpit captures the messages so developers can read codes in a local browser without sending real email. The setup and implementation sequence are in [Local development](docs/local-development.md).

We will get the complete user journey working locally before planning hosting or deployment.

## Earlier project

[tresquatrotres](https://github.com/andrefernandes-95/tresquatrotres/tree/main) already explores Portuguese areas and municipalities, a pitches table, and an initial game creation form. Its geographic data and product ideas can inform this project. The game and participation flows still need to be built.

**Initial success signal:** an organizer can publish a game and fill its spots through the app without rebuilding the participant list in chat.
