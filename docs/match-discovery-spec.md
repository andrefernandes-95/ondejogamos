# Match discovery and local growth

The first screen helps a player find a real game near them and decide whether
to join. The organizer can schedule a game from the same screen. Start locally
with the existing Next.js, Material UI and PostgreSQL stack.

See the [product review](product-growth-review.md) for the evidence behind this
plan. The first pilot should take place in Chamusca or a municipality where an
organizer can reliably host games.

## 1. Homepage agenda

- Put the weekly agenda immediately after the district and municipality
  filters. Use Monday through Sunday in the Europe/Lisbon time zone. The default
  day is the earliest available game in the selected area, or today if there
  are no games. Mark other days in the week that have scheduled games.
- Let players navigate weeks and select dates. Remember the preferred district
  and support shareable district, municipality and date parameters. A URL
  district takes precedence over the saved district. Changing district clears
  the municipality and date.
- On desktop, each chronological row shows the time on a timeline, a compact
  pitch photo, the venue, municipality, format, players still needed and the
  participation action. Link the venue name to match details.
- On mobile, keep both location fields side by side and put the week arrows
  next to the month. Show the photo beside the time and venue. Put the
  participation action under the photo and venue, next to the player count.
- Use existing pitch photos and a neutral pitch icon when a photo is missing.
  Keep organizing visible beside the agenda title. Keep pitch creation
  available from the organizer flow and the pitch directory.
- Make day, week, loading, empty and error states accessible. Offer the
  nearest upcoming date or broader location in an empty state when available.
  Add an email alerts action once the subscription flow works.

## 2. Match details and participation

- Show the saved organizer description, meeting point, expected level,
  free or paid status, reservation status and an organizer-approved contact
  route. Start with existing description data and introduce structured fields
  only for information that needs independent display or filtering.
- Carry an internal return path through sign-in, signup and their cross-links.
  Return the player to the intended match to confirm participation explicitly.
  Validate the return destination before navigation.
- Make repeat join and cancel requests safe. Reject joins for cancelled or
  started games. Distinguish the minimum players needed from capacity. Add
  confirmed places and a waiting list when games regularly reach capacity.
- Pilot organizer reminders, updates, and post-game attendance confirmation.
  Report actual attendance separately from signups. Add password recovery
  through the email provider and a shortcut to publish a similar game.

## 3. Pitch safety and community conduct

- Show staff supervision and security cameras separately on pitch details.
  Each field supports yes, no and unknown. Default existing pitches to
  unknown. Store the source and date for verified information and let users
  report outdated information. Describe the specific facility features.
- Publish short community rules covering respectful play, harassment,
  discrimination, and how to raise a concern. Link them from game details
  and the footer. Give organizers a clear route to handle reports. Restrict
  report access and keep report contents out of public player profiles.

## 4. Local email alerts

- Allow visitors to opt in by municipality from the agenda and empty state.
  Confirm the email address and let subscribers change their area or
  unsubscribe from each message. Deduplicate subscriptions and delivery.
- Start with one channel and a small pilot. Send a direct link and useful game
  details for new nearby games. Define delivery timing and retries before
  automation. Offer a newsletter only with its own subscription choice.

## 5. Accessibility, sharing and search

- Use a descriptive main heading on home, match details and the player
  directory. Provide visible focus, named controls and status announcements.
  Aim for 44 px touch targets, with usable spacing in the seven-day strip and
  footer. Verify keyboard operation, short and long names, contrast, and
  layout at 320, 390 and desktop widths in Portuguese and English.
- Add game-specific share previews with locality, time and a pitch photo when
  available. Make upcoming games discoverable in the server-rendered page,
  publish indexable locality pages where useful, and add robots and sitemap
  routes. Check actual indexing in Search Console.

## 6. Local pilot and measurement

- Start with two organizers who can publish real games with a core group.
  Share a specific game with local WhatsApp or Facebook groups with their
  permission. The message should give place, day, time, format, cost and spots
  needed. Make it clear when solo newcomers are welcome.
- Measure campaign visit, match view, join intent, signup, participation
  registration, actual attendance and repeat attendance. Track empty searches,
  alert opt-ins, game creation and game sharing. Use UTM sources and avoid
  passing names, emails or report details to analytics.
- Review results after four weeks. Use three completed games, fifteen distinct
  attendees, five repeat attendees and two returning organizers as pilot
  targets. Record how many players were recruited through the product.
  Use the results to decide whether to expand geographically.

## Delivery checks

1. Ship the responsive agenda, location filters, pitch thumbnails and
   accessible loading and empty states. Verify scheduling and participation
   still work from their normal entry points.
2. Fix return-to-match and surface instructions. Add the focused accessibility
   fixes and share previews. Run keyboard and signed-out mobile checks.
3. Add pitch safety, conduct and local email alerts with tests for unknown
   values, reported changes, email confirmation and unsubscribe.
4. Add attendance confirmation and measure the pilot. Revisit capacity,
   recurrence, a map view, newsletter and paid acquisition with evidence.
