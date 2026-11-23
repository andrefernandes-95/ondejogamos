# CI and Railway deployments

## Automated checks

The `.github/workflows/ci.yml` workflow runs for every push to `main`,
pull request targeting `main`, and manual dispatch. It uses Node.js 22,
`npm ci` with the committed `package-lock.json`, then runs these commands
separately so failures are easy to locate:

1. `npm test` — the existing unit and regression test suite.
2. `npm run typecheck` — Next.js `typegen` followed by `tsc --noEmit`.
3. `npm run lint` — ESLint.
4. `npm run build` — the actual Next.js production build.

Next.js route helpers such as `LayoutProps` require generated types.
Run `npm run typecheck` rather than invoking `tsc` alone in a clean checkout.

The CI environment uses **dummy** database and auth variables for build-time
initialization, not production credentials. It does not provision a database
or run data migrations. If future tests require PostgreSQL, use a disposable
CI database, never production data.

## Railway: one-time integration setting

The `ondejogamos-app` service already reports its deployment statuses back
to commits on GitHub, and currently deploys from `main`. The GitHub workflow
alone does **not** block Railway: both systems can start on the same push.

To stop a failed CI run from proceeding to deployment, an authorized project
member must go to **Railway → ondejogamos-app → Service Settings → Wait for CI**
and enable it. Confirm that the Railway GitHub App has the required permissions.
Railway requires a workflow triggered by `push` to `main`, which this file
provides. With Wait for CI enabled, a failed GitHub Actions workflow prevents
that commit from deploying.

Official documentation:
https://docs.railway.com/deployments/github-autodeploys

**Verification still required in Railway:** this repository does not expose
the service's Wait for CI switch. We cannot infer that it is enabled from a
successful GitHub commit or a successful Railway status alone.

## Daily release checks

- Before merging a PR, verify that the CI job is green.
- For direct commits to `main`, check both the CI job and the Railway
  deployment status in GitHub. A green CI check is not a live deploy.
- If CI fails, inspect the failing step and fix it; do not disable the check.
- If Railway fails, inspect its build/deploy logs. Do not state that the
  change is live until Railway confirms success.
- The `main` branch is currently not protected by required checks.
  If a strict pre-merge gate is wanted, configure branch protection/rulesets
  and use pull requests. `Wait for CI` gates deployment, not Git pushes.
