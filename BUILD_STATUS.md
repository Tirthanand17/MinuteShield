# Build status

## Current public state

- Repository: `Tirthanand17/MinuteShield` — **public**.
- GitHub Marketplace listing — **live**: https://github.com/marketplace/actions/minuteshield
- GitHub Pages site — **live**: https://tirthanand17.github.io/MinuteShield/
- Current patch release: **v0.1.1**.
- Release commit: `b65eaf304285da7effd3762b19fe6f66d28f838b`.
- Tags `v0.1.1`, `v0.1`, and `v0` all point to that verified commit.
- `action.yml` uses the GitHub Actions Node 24 runtime and the committed `dist/index.js` bundle.

## Authoritative CI validation

The v0.1.1 source path passed the GitHub-hosted Node 24 pipeline:

- dependency install — **PASS**
- TypeScript `tsc --noEmit` — **PASS**
- Vitest — **3 files / 10 tests PASS**
- NCC production build — **PASS**
- non-empty `dist/index.js` verification — **PASS**
- generated bundle + lockfile persisted to `main` — **PASS**
- dedicated Release verification workflow on release commit — **PASS** (run `35453450672`)

## v0.1.1 accuracy regression validation

The first public demo exposed a new-workflow estimation issue in v0.1.0: PR-only execution history could make a brand-new workflow appear much cheaper than the configured fallback assumptions.

v0.1.1 fixes this by ignoring history when the workflow is absent from the trusted base branch. New scheduled workflows also cannot be estimated below their statically observable cron frequency.

A separate public regression PR in `Tirthanand17/MinuteShield-demo` reused the same contaminated workflow path:

- Action under test: `Tirthanand17/MinuteShield@v0.1.1`.
- Expensive macOS fixture runtime: **SKIPPED intentionally** with `if: ${{ false }}`.
- Estimated monthly delta: **+$74.40**.
- Estimated runs/day: **5.00**.
- Warning threshold crossed: **PASS**.
- $50 fail threshold crossed: **PASS**; the MinuteShield check failed intentionally because policy enforcement worked.
- Findings included `macos-runner`, `missing-timeout`, and `missing-cancel-in-progress`.
- Demo PR closed without merge after validation.

## Security properties

- Pull-request workflow YAML is fetched and parsed as data; MinuteShield does not execute code from the workflow being analyzed.
- Policy is read from the trusted base SHA so a PR cannot raise its own budget threshold.
- Recommended installation uses `pull_request`, not `pull_request_target`.
- Restricted comment permissions remain non-fatal; the job summary is still available.
- Release-specific tag `v0.1.1` is tied to the verified bundle commit; compatibility tags `v0` and `v0.1` track the current compatible patch.

## Post-launch measurement

A true zero-point baseline was recorded immediately after launch in `docs/POST_LAUNCH_BASELINE.md`: 0 stars, 0 forks, 0 traffic views, 0 clones, and no external referrers at capture time. Future adoption should be measured against that baseline rather than inferred from launch activity.

## Known maintenance follow-up

Issue `#18` tracks GitHub Pages helper actions that currently emit a Node 20 deprecation warning while still deploying successfully. This is not a current outage.

**Current status: PUBLIC + MARKETPLACE LIVE + v0.1.1 VERIFIED + SECOND-REPOSITORY REGRESSION PASSED.**
