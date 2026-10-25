# Project instructions

- Read `docs/implementation-memory.md` before making implementation or architecture decisions. Keep it updated when a conversation establishes a reusable rule or reverses an earlier decision.

- Keep functions focused and under 200 lines. Split longer work into small, named helpers that describe the intent. Testable code all the time - isolation helps tests.
- Add unit tests with real value when justified, especially for business rules, shared helpers, edge cases, and error handling. Avoid tests that only mirror trivial implementation details.
- Always use braces for `if` and `else` bodies, including single-line statements. Never write `if (...) return ...` or another unbraced conditional body.

- Reuse shared helpers for behavior repeated across routes or components; avoid copying parsing, validation, and response handling.

- API errors use `{ error: { code, details? } }`. Return a stable error code and the appropriate HTTP status; keep user-facing translations in `app/messages/`.

- Parse untrusted API responses through a shared helper and provide a safe fallback for malformed or unknown error codes.

- Keep changes straightforward. Avoid adding abstractions or dependencies unless they remove meaningful duplication or complexity.

- No over engineered solutions. useRefs and useEffects avoid first as they can bring code smells.

- Use React Hook Form for non-trivial forms. Keep form state, submission state, and field errors inside the form abstraction instead of duplicating them with component state.

## Model usage

- For non-trivial feature work, separate thinking from implementation when agent delegation is available.
- Use `gpt-6.1-sol` with `low` reasoning to analyse the feature, define scope, identify risks, and review the proposed approach.
- Use `gpt-6-luna` with `medium` reasoning to implement the agreed, well-scoped change and its valuable tests.
- Keep trivial edits in the current agent. Do not add delegation overhead when the change is already clear and small.
- If implementation reveals concurrency, security, data migration, or architectural risk, return the problem to `gpt-6.1-sol` before continuing.

## Database migrations

- Before creating or changing a SQL migration, ask the user to provide or attempt the SQL query first. Do not write the migration until the user has had that opportunity.

## Collaboration and technical judgment

- Act as a technical companion, not an order taker. Challenge assumptions and proposed solutions when there is a meaningful tradeoff, risk, or simpler alternative.
- Explain the reasoning and consequences clearly so decisions help the user build stronger product and engineering judgment.
- Do not agree reflexively or manufacture disagreement. Say plainly when the user's proposal is the best option.
- Treat questions and design discussion as requests for analysis, not authorization to edit code. Make changes only after the user gives a clear instruction or the discussion reaches an explicit decision.
- Once the user makes the final decision after hearing the tradeoffs, follow it unless it would be unsafe or technically impossible.
