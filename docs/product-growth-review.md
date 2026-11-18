# Product, accessibility and acquisition review

## Scope and evidence

Reviewed checkout `7268150`, public production pages and public match data. Browser checks used signed-out Chromium with Portuguese locale. Automated accessibility checks used axe on the home page, selected-area state, login, signup, player directory and match 3 at 390 CSS pixels. Supplementary layout checks used 320 and 1440 pixels.

The public directory showed seven registered players. The public upcoming-match API returned one game, in Chamusca, Santarem district, with zero participant registrations. The organizer appears separately. This is a snapshot, not a measure of visitors, historical attendance or retention.

No analytics integration was found in the application source or loaded page scripts. No traffic, campaign attribution, social reach or completed-game attendance dashboard was supplied. Revenue, conversion and the causes of abandonment therefore remain unmeasured. Browser timings from this review are not representative performance measurements.

## Working diagnosis

The strongest hypothesis is insufficient local game availability. A player needs a suitable game nearby, at a compatible time, with enough people who will actually attend. Nationwide exposure can attract people into districts without that opportunity.

The current product completes discovery and registration, but does little to recover a visitor who finds nothing or to help an organizer bring an existing group. Public player cards support identity and sharing. Prioritize the path from a real local invitation to a completed game for the next iteration.

A second hypothesis is avoidable conversion loss. The authentication flow discards the match context, and game discovery sits below a large pitch suggestion section. Both are observable problems, although their contribution to abandonment needs measurement.

## Features already present

- Public upcoming games, district selection and saved district preference.
- Pitch discovery, municipality data and community-created pitches.
- Account registration, login, game creation, editing and deletion.
- Registration and cancellation of a player's game participation.
- Organizer identity, participant list and public player profile links.
- Shareable player cards, portraits, founder styling and PNG sharing.
- WhatsApp sharing of individual games and a community invite in the footer.
- Portuguese and English interface copy.

## Findings and priorities

| Priority | Evidence | Effect on the player | Smallest useful change |
| --- | --- | --- | --- |
| P0 | `home-client.tsx` renders pitch suggestions before `MatchList`. Four pitch suggestions stack on small screens. | Finding a game requires scrolling past a creation flow. | Put upcoming games immediately after location selection. Keep pitch creation within organizing. |
| P0 | `RequireAuthModal` navigates to bare login/signup URLs. `AuthForm` always redirects home, with signup callback `/`. Reproduced the match-to-signup navigation. | A person arriving through a shared game must find the game again after registering. | Carry a validated internal return URL through login, signup and their cross-links. Return to the game and offer explicit participation confirmation. |
| P0 | `NoMatchesFound` offers creation only. No notification subscription or delivery flow was found. | A player who needs teammates leaves without a way back. | Offer “Notify me about games in this municipality”. Start with an explicit opt-in and one delivery channel. A manual pilot can precede automated email. |
| P0 | `AreaSelector` and the public game query filter by district, with no municipality control in the feed. | The “near you” promise can still produce impractical journeys. | Add municipality selection and reflect the selected place in a shareable URL. |
| P0 | Game descriptions are stored and queried but neither `MatchDetailsInfo` nor its parent renders them. | Organizers' instructions never reach participants. | Render the saved description in game details. Include a clear contact route and explain meeting point, expected level and whether the pitch is reserved or free to use. |
| P1 | No structured cost, confirmation/reminder or organizer contact flow was found. | A stranger has limited information to decide or recover from a change of plans. | Show cost/free status and organizer-approved contact. Add a reminder and a post-game attendance confirmation after the pilot validates the need. |
| P1 | The full-game state still allows registrations, with no separate waiting-list status. | “Participating” does not clearly indicate a guaranteed place. | Define the organizer's capacity and separate confirmed places from waiting. Implement when games start filling. |
| P1 | No password recovery UI or recovery email handler was found. | A returning player who forgets their password has no recovery path. | Add password reset with a working email delivery service. |
| P1 | Repeating a game requires recreating it. | Weekly organizers repeat setup work. | Add “Create another game like this” before building a recurrence system. |
| P1 | The location count join repeats `p.municipality = l.municipality` and never compares the area. | Counts can be wrong for municipality names shared across areas. | Join on both area and municipality. |
| P2 | Long-standing components still exceed the agreed 100-line limit, including auth and date selection. | Changes to central user flows are harder to review and verify. | Split these when changing the relevant flow. |

The code also lacks a complete canceled/past-game participation check in the attendance service. Repeated participation submissions can surface a generic server error instead of an idempotent result. These are reliability issues to address alongside the participation flow, not proven acquisition causes.

## Accessibility results

| Finding | Evidence | Action |
| --- | --- | --- |
| Unnamed area-clear button | axe `button-name` finding after selecting a district. The button contains only a Close icon. | Add a localized accessible name describing the action. |
| Small, crowded footer links | axe `target-size` findings on all five reviewed routes. Links were about 20px high, with insufficient separation. | Increase clickable padding and spacing. Use 44px touch targets where practical. |
| Unnamed loading indicator | axe `aria-progressbar-name` in the selected-area loading state. | Name the loading operation and announce loading/error/empty results. |
| Missing primary heading | axe best-practice finding on home, match details and player directory. | Add a descriptive h1 and consistent heading hierarchy. This finding alone is not a WCAG conformance verdict. |
| Hidden instructions | Stored game descriptions are absent from the detail view. | Show essential instructions as readable text before asking for commitment. |

The baseline audit reported no color-contrast violations in the scanned states. The inspected public pages showed no horizontal overflow at 390px; the home page also passed this layout check at 320px and 1440px. These results do not cover every state, zoom level, screen reader or authenticated editing form.

In the 390px-wide home-page sample, the upcoming-games heading began around 1,594px down the document. The first game's details link was around 2,079px down. The viewport was 844px tall. Pitch suggestions change between loads, so exact positions will vary.

Use WCAG 2.2 AA as the acceptance target. The target-size AA rule is 24px with defined exceptions and spacing conditions. A 44px design target improves touch usability but is not the AA minimum.

Sources:
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/

## Discovery and sharing

The home page has useful Portuguese title, description and Open Graph metadata. WhatsApp sharing and public profiles already provide a distribution mechanism.

Production `/robots.txt` and `/sitemap.xml` returned 404. Neither endpoint is required for Google to index a website. Their absence alone does not establish an SEO failure.

Games are loaded client-side through `/api/matches`. Google can render JavaScript, but this adds a rendering dependency for discovery. Local landing URLs and server-rendered upcoming games would make local intent and links easier to discover.

Match pages inherit the generic site metadata. Add game-specific title, locality, date, available places and a suitable social preview. The existing player-card previews are more specific than the previews for the event the product needs people to join.

A limited search did not return a clearly identifiable site result for the domain queries used. Confirm indexing and actual search demand with Search Console before treating that observation as an indexing diagnosis.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide

## Four-week low-cost acquisition experiment

Treat these targets as proposed experiment gates, not forecasts.

Start in one municipality with a reachable organizer. Chamusca is the default pilot because the only upcoming public game is there. Choose another municipality if the owner has stronger real-world access to regular games.

| Week | Product and operations | Acquisition | Evidence to collect |
| --- | --- | --- | --- |
| 1 | Interview three organizers and two players. Fix return-to-game, show descriptions, move the feed up, correct the accessibility issues. Define basic events. | Identify ten relevant local organizers, groups, clubs or pitch contacts. Prepare individual invitations for owner approval. | Current recruitment method, last missed game, willingness to accept newcomers, preferred area and time. |
| 2 | Help two organizers publish real games with their existing core players. Display existing group size clearly, separately from app registrations. | Ask group administrators for permission to share one concrete game. Put a QR link at a participating pitch with permission. | Visits by source, game views, signup starts/completions and confirmed participation. |
| 3 | Run the games. Record actual attendance and the reasons for withdrawals. Pilot local opt-in alerts manually. | Share real remaining places and an organizer-approved photo or short recap. Link directly to the next game. | Newcomers who attended, no-shows, places filled through the product and notification opt-ins. |
| 4 | Help organizers publish the next session. Review the funnel and interview people who registered but did not attend. | Repeat the source that produced actual players. Test paid local reach only after the registration-to-game path works. | Repeat players, repeat organizers and completed games. |

Proposed four-week decision gate: three real games completed, at least fifteen distinct attendees across them, five players returning for another game and two organizers willing to repeat. Record which attendees were already in the organizers' groups and which were recruited through Onde Jogamos.

If attendance is healthy but nobody registers, investigate the product's value versus the existing WhatsApp workflow. If qualified local visitors never open a game, investigate the offer and discovery. If signups happen but attendance does not, investigate commitment, timing, location and communication.

### Message and channel plan

Lead with a specific opportunity. Explain locality, date, time, format, cost, remaining places and whether solo newcomers are welcome. Use accurate counts from the organizer.

Portuguese example template:

> Faltam [N] para uma futebolada em [local], [dia] às [hora]. [Formato], [preço ou gratuito]. Podes vir sozinho. Confirma aqui [link direto do jogo].

For organizers:

> Costumam faltar-vos um ou dois para fechar a equipa? Publiquem o próximo jogo e partilhem o link no vosso grupo. Ajudamos a encontrar quem falta na zona.

Use local WhatsApp/Facebook groups where the owner has permission, existing organizers and the pitch itself. Broad Facebook/X posts can support awareness, but their success must be assessed by relevant local visits and attended games.

Community demand examples show the importance of a fixed location, weekly time and specific missing players. They are anecdotes, not a market-size estimate:
- https://www.reddit.com/r/Coimbra/comments/1fuc1u4/futebolada_indoor_5vs5_coimbra/
- https://www.reddit.com/r/porto/comments/112y1ed

## Measurement

Track the following funnel without capturing names, email addresses or sensitive data in event properties:

`local_campaign_visit -> match_view -> join_intent -> signup_complete -> attendance_registered -> attendance_confirmed -> repeat_attendance`

Also track `empty_search`, `local_alert_opt_in`, `match_created` and `match_shared`. Attribute campaign sources with UTM parameters and retain game context through authentication.

Report raw counts alongside conversion rates while traffic is small. Define the denominator for every rate. Confirmed physical attendance requires an organizer check; the existing “finished games with registration” stat is not proof of attendance.

The primary product outcome should be completed local games with real attendance and repeat participation. Registrations, cards, followers and likes are supporting indicators.

## Next delivery

The next small release should include return-to-game after auth, descriptions in game details, feed-first ordering, the district-clear accessible name, loading labels and usable footer targets. Locality filters and opt-in alerts follow immediately behind it.

Acceptance checks for that release:

- A signed-out visitor opens a game, registers and returns to the same game with a clear participation confirmation action.
- The user's intended game survives a switch between login and signup.
- External return URLs are rejected.
- Saved organizer instructions appear in the game detail view.
- Upcoming games appear before pitch suggestions at 320px and 390px.
- A no-results state offers a concrete next step for someone who only wants to play.
- Keyboard and screen-reader names identify location clearing, loading and the primary action.
- Footer links pass target-size checks, and the reviewed routes have a useful primary heading.

Validate with five local users and real games before allocating substantial work to new badges, premium field billing or a backoffice.
