---
name: product-growth
description: Shape and prioritize Onde Jogamos product changes with organizer-first, hyperlocal community-led/product-led/SEO growth, mobile UX and privacy-first measurement. Use for features, roadmap, UX reviews and growth experiments.
---

# Product engineering: games that actually happen

## Strategy

- **Primary customer to activate:** recurring match organizers. Start in one locality where real games can happen; recruit both organizers and players through those games, not broad empty-market traffic.
- **Acquisition:** community outreach first, product-led invitations/sharing next, and SEO/locality discovery as a compounding channel. Treat each as a hypothesis to validate.
- **North Star:** games **confirmed actually played**. Phase one: explicit organizer confirmation after the scheduled game. Later: player-confirmed attendance. Never equate scheduled/past games, signups or clicks with completed games.
- **Supporting signals:** monthly active organizers and returning organizers. Also inspect the path from shared invitation -> match view -> signup -> joined -> attended and repeat use, but do not invent current conversion figures.

## Decision workflow

1. Describe the concrete organizer/player problem and evidence; separate existing data from assumptions. Treat `docs/product-growth-review.md` as a historical snapshot.
2. Resolve urgent security, integrity and reliability issues first. Otherwise balance likely user impact, confidence, implementation effort and time to learn.
3. Propose the **smallest measurable solution or experiment**. Name the expected behavior, target segment/location, success signal, and what would cause us to stop or iterate.
4. Make the invited-player journey effortless: mobile-first, clear place/time/format/organizer instructions, shareable match links, return after authentication, accessible feedback and trust signals.
5. Measure only essential, privacy-safe events. Distinguish intent, successful registration, organizer-confirmed game and actual individual attendance. Avoid personal details in third-party analytics, logs or URLs.
6. Consider adoption and distribution alongside implementation: who will share this, why will an organizer return, and how can the next game happen with less work?
7. Review results before scaling to new regions, paid channels or large feature builds. Product impact is a hypothesis until measured.

Use `docs/match-discovery-spec.md` and `docs/player-card-spec.md` for existing requirements. Do not expand privacy-sensitive public data without an explicit product decision.
