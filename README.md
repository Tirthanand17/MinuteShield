# MinuteShield

MinuteShield is a preventive GitHub Actions cost guard. It reviews pull requests that change `.github/workflows/*.yml`, estimates the before/after monthly runner cost, flags common CI-minute waste, and can block regressions before they merge.

## Why this exists

GitHub Actions cost problems are usually discovered after the bill or after engineers manually inspect usage. MinuteShield shifts the feedback into code review: **what will this workflow change likely add or save per month?**

## What v0.1 does

- Reads changed workflow YAML from the GitHub API; it does not execute pull-request code.
- Uses current standard GitHub-hosted runner rates.
- Calibrates run frequency and job duration from recent Actions history when permissions allow.
- Expands static matrices and detects dynamic matrices.
- Estimates before/after monthly cost for changed workflows.
- Flags macOS runner cost, missing timeouts, missing PR cancellation, oversized matrices, high-frequency schedules, unpriced custom runners, and potential push+PR duplication.
- Posts an idempotent PR comment and a GitHub Actions job summary.
- Enforces trusted policy thresholds from the **base branch** `.minuteshield.yml`.
- Falls back to configurable assumptions when history is sparse or unavailable.

## Quick start after publishing

```yaml
name: CI cost guard
on:
  pull_request:
    paths: ['.github/workflows/**']
permissions:
  contents: read
  actions: read
  pull-requests: write
jobs:
  minuteshield:
    runs-on: ubuntu-slim
    timeout-minutes: 5
    steps:
      - uses: YOUR_ORG/minuteshield@v1
        with:
          github-token: ${{ github.token }}
```

Copy `.minuteshield.yml.example` to `.minuteshield.yml` and tune the warning/fail thresholds.

## Estimation model

MinuteShield combines runner USD/minute × rounded historical job duration × matrix copies × estimated runs/day × 30. Recent workflow history is preferred. New workflows use configured fallback values. Trigger changes can scale historical frequency, and simple cron schedules are evaluated statically.

The result is a **preventive estimate, not an invoice**. Dynamic matrices, conditional jobs, custom/self-hosted economics, included plan minutes, taxes, enterprise discounts, and future GitHub pricing can make actual billed spend differ.

## Security model

MinuteShield intentionally avoids executing untrusted PR code. It fetches YAML and history through GitHub APIs and parses data only. Policy is loaded from the base SHA, so a PR cannot raise its own cost limit. The example uses `pull_request`, not `pull_request_target`.

## Development

```bash
npm install
npm run check
```

The Marketplace bundle is generated into `dist/` with `@vercel/ncc` and should be committed for releases.

## Product direction

The free Marketplace action is the acquisition layer. A later paid cloud tier can add organization-wide shared policy, multi-repository trends, budget ownership, scheduled reports, and central audit history without changing the local action's safety model. See `docs/ARCHITECTURE.md`, `docs/VALIDATION.md`, and `docs/MONETIZATION.md`.
