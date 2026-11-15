# Player cards

- **Status:** Implemented locally.
- **Baseline:** Editable player preferences (`53fa3dc`)

## Goal

Give players a recognisable football card they can share when looking for a game. Opening the card should tell someone who the player is, where they like to play and how to find games on Onde Jogamos.

## Player experience

- **Open `/profile`.** Signed-in players see a centred card with edit and share actions below it. An account with no profile row gets a standard card with its display name and a placeholder portrait.
- **Edit card.** A separate editor lets the owner upload, replace or remove a portrait, set a preferred position, and choose a preferred area from the existing location list. Selecting a new photo enables its visibility in the draft. The editor tells the owner when saving will show the photo on a published card. Preserve existing position text and area values.
- **Choose what to display.** Keep the display name and Onde Jogamos branding on every card. Provide separate visibility controls for photo, position, area, matches played and games created. Enable position, area and matches played on the private card by default. Leave photo and games created off until the owner enables them. Badges have their own selection controls. Optional empty values disappear from the shared card. An enabled stat can display zero.
- **Preview and save.** Changes appear in a private preview. The card, public page and downloads use saved settings. The editor still shows fields the player has hidden. When publishing for the first time, show exactly what will become public.
- **Visual design.** Use an original football collectible style with a shield silhouette, large portrait, display name and a compact stats row. Give the standard card its own palette. Founder uses a green palette and a visible label so the distinction is readable without colour.

## Badges and themes

- Compute **Founder** from the account creation timestamp. An account qualifies if it was created by the end of **31 December 2026**, in the **Europe/Lisbon** timezone. The card query calculates `is_founder` when read.
- Keep earned badges separate from the owner's ordered selection. Only the owner can select or reorder their earned badges. The **first selected badge** sets the card theme. Selecting Founder as the first badge makes the card green. Choosing **Standard** clears the selection and uses the normal palette. Switching styles never revokes the award.
- Start with Founder as the sole badge. Keep the ordering and theme rule reusable when another badge is added.

## Statistics

| Card field | Initial query rule |
| --- | --- |
| Finished games joined | Count distinct, uncancelled matches whose scheduled end has passed and for which the player still has an attendance registration. Exclude withdrawn registrations and deleted matches. |
| Games created | Count existing, uncancelled matches created by the player, including upcoming matches. Show this secondary stat only when enabled. |

The existing attendance table records sign-ups. Label the count «Jogos terminados com inscrição» and explain in the editor that attendance is yet to be confirmed. Revisit the label or query when actual attendance is recorded. Organisers count as players only if they also have an attendance registration. Compute both stats on the server and treat them as read-only.

## Public URL and Instagram sharing

- **Private by default.** Publishing enables a public, signed-out view at `/players/<username>`. Suggest a unique username from the part of the email before the @, with a suffix for duplicates. The owner can edit it. Retired usernames remain reserved so a stale link cannot lead to someone else's card. Older public UUID links redirect to the current username for published cards. Unpublishing disables the public page and its image endpoint.
- **One public card model.** The public page, social preview and PNG export receive only the display name, enabled fields and selected badges. Keep contact data, date of birth, storage keys and internal account IDs out of public responses. Apply visibility rules before rendering. Return 404 for an unpublished or unknown card. Launch with sharing by link and keep discovery through the player directory out of this epic.
- **Share the link.** Provide a copy action and a social preview based on the visible card. The public page includes a simple link to find football games. Keep the card URL valid independently of how the user shares it.
- **Share the image.** Provide a **1080 × 1920 PNG** for Instagram Stories with readable text and Onde Jogamos branding. Offer the device share sheet when file sharing is supported and a PNG download everywhere else. A downloaded image can be posted manually even if the profile stays private. When a public link is available, offer a separate copy action for the Story link sticker. Downloaded images and social platform caches can outlive changes to the card.
- **Photos.** Reuse the existing S3 client and keep portrait objects private. Accept JPEG, PNG and WebP up to 5 MB, validate decoded type and dimensions, and re-encode to strip metadata. Authorise upload, replacement and removal against the session. Serve only the current saved portrait according to the card's visibility. Prevent stale public responses under our control with cache headers or invalidation. A failed replacement leaves the previous portrait intact. Delete superseded uploads after the database update succeeds, with retryable cleanup.

## Implementation tasks

| ID | Task | Depends on | Done when |
| --- | --- | --- | --- |
| PC-01 | Add public ID, publication state, field visibility and badge selection to the profile data model | — | Migration preserves existing profile values. Existing accounts remain private. IDs are unique and generated safely on first use. |
| PC-02 | Extract a reusable player card and make it the first view of `/profile` | PC-01 | A signed-in player sees their card without opening the editor. Existing players and accounts without a profile render correctly on mobile. |
| PC-03 | Add the editor, visibility controls and preview | PC-02 | Preferences and visibility survive reload. Hidden values remain editable and are excluded from card output. Cancelling does not save. |
| PC-04 | Add date-based Founder eligibility and badge selection | PC-01, PC-03 | Accounts before midnight on 1 January 2027 qualify, later accounts cannot select Founder, and Standard restores the normal theme. |
| PC-05 | Add private portrait upload, replacement and removal | PC-03 | Allowed images render, invalid files are rejected, and a failure or a concurrent edit cannot delete the active portrait. |
| PC-06 | Add read-only statistics queries and wire visibility | PC-02 | Ended, upcoming, cancelled, deleted and withdrawn cases follow the query rules. Games created is hidden by default. |
| PC-07 | Add publish controls, public route and social preview image | PC-03 to PC-06 | A signed-out visitor can open a published URL. Unpublished cards, hidden fields and hidden portraits are inaccessible via public endpoints. |
| PC-08 | Add PNG export and share controls | PC-07 | Download works on desktop and mobile. Supported devices can share the PNG. Export and link preview show the same saved content as the card. |
| PC-09 | Verify the complete flow locally | PC-08 | Check keyboard use, small screens, long names, zero stats, unauthorised requests, upload failures, the Founder date boundary and an Instagram Story handoff on a phone. |

Deliver PC-01 to PC-03 as the first reviewable slice, then add badges, photos and stats. Enable public sharing after the visibility checks pass. Keep application source files within 100 lines per file. Separate the renderer, editor, data queries and publication rules. Retain Portuguese and English interface translations.

## Decisions to verify before rollout

- Review the standard and Founder palettes and the Story layout with the product owner.
- Verify the mobile share sheet and manual Instagram upload on a real device. Link preview refresh is controlled by the receiving platform.

## Local setup and rollout

1. Start the local database with `docker compose up -d db`.
2. Apply the schema with `npx dbmate --no-dump-schema migrate`. Run `npm run seed-locations` if the local database has no locations.
3. Portraits use PostgreSQL by default. Set `PLAYER_PORTRAIT_BUCKET` to an accessible private S3 bucket to store new uploads there. Existing database portraits remain readable. Legacy local files remain readable in development.
4. If using S3, schedule `node --env-file=.env --import tsx scripts/clean-player-portraits.ts` in the application environment to retry pending file cleanup.
