# Project instructions

- Keep functions focused and under 200 lines. Split longer work into small, named helpers that describe the intent. Testable code all the time - isolation helps tests.

- Reuse shared helpers for behavior repeated across routes or components; avoid copying parsing, validation, and response handling.

- API errors use `{ error: { code, details? } }`. Return a stable error code and the appropriate HTTP status; keep user-facing translations in `app/messages/`.

- Parse untrusted API responses through a shared helper and provide a safe fallback for malformed or unknown error codes.

- Keep changes straightforward. Avoid adding abstractions or dependencies unless they remove meaningful duplication or complexity.

- No over engineered solutions. useRefs and useEffects avoid first as they can bring code smells.
