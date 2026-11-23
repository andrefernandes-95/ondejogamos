---
name: engineering
description: Implement or refactor Onde Jogamos application code with simple TypeScript, technical layers, single-purpose functions, typed contracts and pragmatic dependency injection. Use for application features, bug fixes and refactoring.
---

# Engineering: simple, testable changes

1. Read the current code, `AGENTS.md`, related tests and relevant product docs. For Next.js API/convention changes, consult the installed version's `node_modules/next/dist/docs/` as required by the root instructions; do not assume older Next.js behavior.
2. State the expected behavior and edge cases. Change the fewest coherent units needed; keep a function responsible for one job.
3. Respect technical layers: API routes do HTTP/auth/error mapping; schemas validate input; services implement application rules and persistence; components render and interact; hooks encapsulate React behavior.
4. Put pure calculations in small functions. Pass external dependencies as parameters where that makes the code easier to test. Define interfaces at meaningful boundaries, not for every function. Prefer composition; avoid unnecessary inheritance, factories and generic repositories.
5. Check authorization at the server boundary and inside the relevant data operation. For writes, consider uniqueness, concurrent requests, idempotency, transactions, stale data and retention of historical match/attendance records. Prefer database-enforced invariants over client-only guards.
6. Reuse existing project conventions for errors, localized messages (pt-PT/en), forms and storage. Keep UI mobile-first with keyboard access, visible feedback and helpful empty states.
7. Apply the Boy Scout Rule only in touched code. Avoid unrelated architectural rewrites or speculative abstractions.
8. Use `risk-based-testing` for meaningful checks and `code-review` before committing. Summarize what changed, product effect and any known limitations.

**Prefer:** a few plain functions with explicit inputs and outputs over a framework of classes or layers.
