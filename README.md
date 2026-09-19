# MinuteShield

MinuteShield is a preventive GitHub Actions cost guard. It reviews pull requests that change workflow YAML, estimates the before/after monthly runner cost, flags common CI-minute waste, and can block cost regressions before merge.

[![CI](https://github.com/Tirthanand17/MinuteShield/actions/workflows/ci.yml/badge.svg)](https://github.com/Tirthanand17/MinuteShield/actions/workflows/ci.yml)
[![GitHub Marketplace](https://img.shields.io/badge/GitHub%20Marketplace-MinuteShield-blue?logo=github)](https://github.com/marketplace/actions/minuteshield)

**Marketplace:** https://github.com/marketplace/actions/minuteshield  
**Live calculator/site:** https://tirthanand17.github.io/MinuteShield/

## Why MinuteShield

GitHub Actions cost problems are often discovered after usage has already accumulated. MinuteShield moves that feedback into code review: **what will this workflow change likely add or save per month?**

## What v0.1 does

- Reads changed workflow YAML from the GitHub API; it does **not** execute pull-request code.
- Uses current standard GitHub-hosted runner rates.
- Calibrates run frequency and job duration from recent Actions history when permissions allow.
- Expands static matrices and detects dynamic matrices.
- Estimates before/after monthly cost for changed workflows.
- Flags macOS runner cost, missing timeouts, missing PR cancellation, oversized matrices, high-frequency schedules, unpriced custom runners, and potential push+PR duplication.
- Posts an idempotent PR comment and a GitHub Actions job summary.
- Enforces trusted policy thresholds from the **base branch** `.minuteshield.yml`.
- Falls back to configurable assumptions when history is sparse or unavailable.
- For brand-new workflows, ignores PR-only execution history and uses trusted fallback assumptions; scheduled workflows are never estimated below their observable cron frequency.

## Install

Install from the [GitHub Marketplace](https://github.com/marketplace/actions/minuteshield), or add this workflow to the repository you want to protect:

```yaml
name: CI cost guard
on:
  pull_request:
    paths:
      - '.github/workflows/**'

permissions:
  contents: read
  actions: read
  pull-requests: write

jobs:
  minuteshield:
    runs-on: ubuntu-slim
    timeout-minutes: 5
    steps:
      - uses: Tirthanand17/MinuteShield@v0
        with:
          github-token: ${{ github.token }}
```

`v0` tracks the latest compatible v0 release; the current patch is `v0.1.1`. Copy `.minuteshield.yml.example` to `.minuteshield.yml` if you want custom warning/fail thresholds. For stricter supply-chain controls, pin the action to an immutable full commit SHA instead of a moving version tag.

## Outputs

| Output | Meaning |
|---|---|
| `monthly-delta-usd` | Estimated monthly cost change for the modified workflows |
| `before-monthly-usd` | Estimated monthly cost before the pull request |
| `after-monthly-usd` | Estimated monthly cost after the pull request |
| `findings-count` | Number of cost/reliability findings |

## Estimation model

MinuteShield combines runner USD/minute × rounded historical job duration × matrix copies × estimated runs/day × 30. Recent workflow history is preferred for workflows that already exist on the trusted base branch; new workflows use configured fallback values. Trigger changes can scale historical frequency, and simple cron schedules are evaluated statically.

The result is a **preventive estimate, not an invoice**. Included plan minutes, dynamic matrices, conditional jobs, custom/self-hosted economics, enterprise arrangements, taxes, and future GitHub pricing can make billed spend differ.

## Security model

MinuteShield avoids executing untrusted PR code. It fetches YAML and workflow history through GitHub APIs and parses the YAML as data only. Policy is loaded from the base SHA so a pull request cannot raise its own allowed cost threshold. The recommended integration uses `pull_request`, not `pull_request_target`.

See [`SECURITY.md`](SECURITY.md) for vulnerability reporting.

## Development

```bash
npm install
npm run check
```

The JavaScript Action bundle is generated into `dist/` with `@vercel/ncc` and committed for release consumption.

## Release status

MinuteShield v0.1.1 is publicly released. Its new-workflow accuracy fix was validated from the separate public [demo repository](https://github.com/Tirthanand17/MinuteShield-demo) using the same workflow path that exposed the v0.1.0 underestimation: the estimate increased from about $1.98/month to $74.40/month and correctly crossed the configured $50 policy threshold while the macOS fixture itself remained skipped. See [`BUILD_STATUS.md`](BUILD_STATUS.md) and [`CHANGELOG.md`](CHANGELOG.md).

## Product direction

The free Marketplace Action is the self-serve acquisition layer. A later paid cloud tier can add organization-wide policy, multi-repository trends, budget ownership, scheduled reports, and central audit history without changing the local action's safety model. See `docs/ARCHITECTURE.md`, `docs/VALIDATION.md`, and `docs/MONETIZATION.md`.

## License

MIT.
