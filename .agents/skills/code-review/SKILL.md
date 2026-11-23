---
name: code-review
description: Review Onde Jogamos changes or existing modules for security, correctness, simplicity, tests and product impact. Use for explicit audits, regression investigations and pre-commit reviews of application code.
---

# Code review: risk before style

1. Establish the exact code version and review scope. Read callers, authorization boundaries, persistence constraints and relevant tests before making claims.
2. Check **correctness and security first**: ownership checks, validation, data leaks, unsafe uploads, parameterized queries, races, duplicate requests, transaction boundaries, deletion of historical records and error handling.
3. Check user journeys: mobile and keyboard use, pt-PT/en copy, loading/empty/error states, shared match links, and return-to-match after authentication.
4. Assess engineering quality: can a junior follow the flow? Are functions single-purpose? Is duplication real? Are contracts clear? Is DI helping testability or just adding ceremony?
5. Check that tests cover behavior and failure cases, not just SQL strings or mocked implementation details. Flag missing integration tests for database guarantees.
6. Classify findings by impact and likelihood; give exact file/function references and an actionable minimal fix. Distinguish verified defects from hypotheses and product decisions.
7. For a pre-commit review, confirm the diff has no unrelated files, secrets, destructive migrations or surprising behavior changes. Run or request the appropriate verification checks.

Output significant findings first, with severity and evidence; then coverage gaps, residual risks and the smallest safe next action. If no issues were found, explicitly note what was and was not checked.
