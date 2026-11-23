---
name: risk-based-testing
description: Design, add and run risk-based tests for Onde Jogamos features and fixes. Use for testing strategy, regressions, API/DB changes and verification before shipping code.
---

# Testing: confidence, not coverage theater

1. Identify the behavior and its cost of failure. Prioritize authorization, writes, scheduling conflicts, attendance, data loss, profile privacy, file uploads and cross-user operations.
2. Choose the smallest test level that can prove the behavior:
   - Pure rules and validation: fast unit tests, including boundaries.
   - Database constraints, transactions, concurrency and query semantics: integration tests against a real disposable PostgreSQL database when available.
   - Authentication, API status/error mapping, and critical join/create/share flows: integration or focused end-to-end tests.
3. For every bug fix, add a regression test that would fail before the fix. Include forbidden/invalid/duplicate/retry paths where relevant.
4. Favor behavioral assertions and simple fixtures. Mock external systems at boundaries when useful, but do not claim database correctness from a mocked SQL string. Keep tests isolated and deterministic; never operate on production data.
5. Follow existing `node:test` + `tsx` conventions unless there is a concrete reason to change them. Ensure new tests are included in `npm test`.
6. Run relevant targeted tests, then `npm test`, `npx tsc --noEmit`, `npm run lint` and `npm run build` when possible. Inspect failures rather than hiding or disabling checks.
7. Report each check as **passed**, **failed** or **not run** with its reason. If risk-critical checks are unavailable, clearly flag the blocker and seek a decision before shipping a high-risk change.

Do not optimize for a coverage percentage. Optimize for detecting defects that would matter to real players and organizers.
