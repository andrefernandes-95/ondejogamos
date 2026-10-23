# Project instructions

- Keep functions focused and under 200 lines. Split longer work into small, named helpers that describe the intent. Testable code all the time - isolation helps tests.
- Add unit tests with real value when justified, especially for business rules, shared helpers, edge cases, and error handling. Avoid tests that only mirror trivial implementation details.
- Always use braces for `if` and `else` bodies, including single-line statements. Never write `if (...) return ...` or another unbraced conditional body.

- Reuse shared helpers for behavior repeated across routes or components; avoid copying parsing, validation, and response handling.

- API errors use `{ error: { code, details? } }`. Return a stable error code and the appropriate HTTP status; keep user-facing translations in `app/messages/`.

- Parse untrusted API responses through a shared helper and provide a safe fallback for malformed or unknown error codes.

- Keep changes straightforward. Avoid adding abstractions or dependencies unless they remove meaningful duplication or complexity.

- No over engineered solutions. useRefs and useEffects avoid first as they can bring code smells.
