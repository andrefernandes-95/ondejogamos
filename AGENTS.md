<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Onde Jogamos working agreement

## Mission and decisions

Build a simple, reliable football match platform. Growth is **organizer-first**,
starting in a focused locality. The North Star is **confirmed matches actually
played** (initially confirmed by the organizer, later supported by player
attendance). Supporting metrics: active and returning organizers. Do not count
elapsed matches or signups as verified attendance.

## Engineering defaults

- **Pragmatic craftsmanship:** readable, beginner-friendly TypeScript; small,
  single-purpose functions; clear names; straightforward control flow.
- Follow SOLID where useful, especially single responsibility and dependency
  inversion. Prefer composition, typed contracts and small dependencies passed
  as arguments over inheritance or frameworks. Do not introduce interfaces,
  classes, factories or abstractions without a concrete need.
- Reuse real shared behavior, not speculative generalizations. Apply the
  Boy Scout Rule only within the task's scope; keep unrelated refactors separate.
- Keep technical layers consistent with the repo: `app/api` for HTTP and auth
  boundaries, `app/validations` and `app/schemas` for validation/contracts,
  `app/services` for application/data behavior, `app/components` for UI and
  `app/hooks` for React behavior. Introduce `models` only if useful; do not
  reorganize by feature or add layers for their own sake.
- Enforce authorization, validation and data integrity on the server. Review
  concurrency, idempotency and historical-data preservation for writes.
- Work mobile-first, accessible (WCAG 2.2 AA target) and in pt-PT/en where
  applicable. Prefer useful empty/error states and short paths from shared
  match links to joining.

## Delivery and Git

- For a well-scoped, low-risk request: inspect relevant code, implement the
  smallest useful change, review the diff, run relevant checks and make a
  focused commit directly on `main`, unless the user requests a review first.
- Never force-push. Ask before destructive/irreversible operations, production
  data changes, sensitive migrations or significant product-policy decisions.
- Test according to risk: business logic and regressions with unit tests;
  critical DB/API behavior with integration tests; essential journeys with
  focused end-to-end checks when possible. Test observable behavior, not
  implementation trivia. No arbitrary coverage target.
- For code changes, run `npm test`, `npx tsc --noEmit`, `npm run lint`
  and `npm run build` when the environment permits, plus targeted checks.
  Do not claim an unrun check passed. Report failures, blocked checks and
  residual risks; do not call unverified work fully done.
- Only add documentation that helps future work. Explain what changed, how
  it was verified, and the user/product effect.

## Contextual skills

Use the matching instructions in `.agents/skills/` when the task warrants it:

- `engineering/SKILL.md`: implementation or focused refactoring.
- `code-review/SKILL.md`: code audits and pre-commit risk reviews.
- `risk-based-testing/SKILL.md`: choosing and running meaningful tests.
- `product-growth/SKILL.md`: product discovery, UX, prioritization and growth.

Product context: `docs/match-discovery-spec.md`,
`docs/product-growth-review.md` (historical snapshot, not live metrics)
and `docs/player-card-spec.md`.
