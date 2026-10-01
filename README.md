# Onde Jogamos

A simple way to find and organize football games: choose when and where to play, fill the available spots, and see who is coming.

## Problem

When a game is organized across chat messages, it becomes hard to know the final time and place, who has confirmed, and how many players are still needed.

## Product decisions

- The first release is for football only.
- Games are public and discoverable. Private games may be added later.
- Anyone can browse games without signing in.
- Creating a game or pitch and joining a game requires signing in with a code sent by email. On first sign-in, the player chooses a public display name.
- Each account can join a game once and manage its own participation from another browser or device.
- The organizer chooses a pitch in the selected municipality and can add one if it is missing.

The initial audience is still a hypothesis: groups and players in Portugal who need to fill football games.

## Core journey

1. The organizer signs in, selects a municipality and pitch, and adds a pitch if needed.
2. They set the date, time, player capacity, and an optional note, then publish the game.
3. The game appears in the public list and has a shareable page.
4. A player browses the game without signing in. To join, they sign in with an email code and choose a display name on first use.
5. Everyone can see confirmed players and open spots. A player can later sign in and withdraw.
6. The organizer can later sign in to edit or cancel the game.

## MVP scope

- Public game listing with a municipality filter.
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

## Local development first

The proposed stack is **Next.js with TypeScript for the UI and server, plus PostgreSQL**. Email code sign-in can run locally with Better Auth and Mailpit: Mailpit captures the messages so developers can read codes in a local browser without sending real email. The setup and implementation sequence are in [Local development](docs/local-development.md).

We will get the complete user journey working locally before planning hosting or deployment.

## Earlier project

[tresquatrotres](https://github.com/andrefernandes-95/tresquatrotres/tree/main) already explores Portuguese areas and municipalities, a pitches table, and an initial game creation form. Its geographic data and product ideas can inform this project. The game and participation flows still need to be built.

**Initial success signal:** an organizer can publish a game and fill its spots through the app without rebuilding the participant list in chat.
