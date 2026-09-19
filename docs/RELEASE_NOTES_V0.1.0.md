# MinuteShield v0.1.0

MinuteShield is a preventive GitHub Actions cost guard for pull requests. It estimates the monthly runner-cost impact of workflow changes before they merge, highlights common sources of CI-minute waste, and can enforce a repository policy threshold.

## Highlights

- Estimates before/after monthly GitHub Actions runner cost for changed workflows.
- Uses recent Actions history when available to calibrate run frequency and job duration.
- Falls back to configurable assumptions when history is sparse or unavailable.
- Expands static matrices and flags dynamic matrices that cannot be priced precisely.
- Detects expensive runner choices, missing timeouts, missing PR cancellation, oversized matrices, high-frequency schedules, push+PR duplication risk, and unpriced custom runners.
- Loads policy from the base branch so a pull request cannot raise its own budget threshold.
- Posts an idempotent pull-request report and GitHub Actions job summary.
- Parses workflow files as data and does not execute pull-request code.

## Installation

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
      - uses: Tirthanand17/MinuteShield@v0.1.0
        with:
          github-token: ${{ github.token }}
```

Copy `.minuteshield.yml.example` to `.minuteshield.yml` to customize assumptions and policy thresholds.

## Validation before release

- Unit tests: 8/8 passing.
- GitHub-hosted CI: passing.
- Production `dist/index.js` bundle: verified.
- Controlled end-to-end pull-request integration test: passing.
- Sticky pull-request comment/report behavior: verified.
- Release, Pages, support, security, and maintenance runbooks: prepared.

## Important limitations

MinuteShield produces preventive estimates, not invoices. Actual billed spend can differ because of included plan minutes, enterprise arrangements, taxes, conditional jobs, dynamic matrices, custom/self-hosted economics, and future GitHub pricing changes.

## Security model

MinuteShield avoids executing untrusted pull-request code. Workflow YAML and Actions history are read through GitHub APIs and parsed as data. Policy is read from the base branch rather than the pull-request branch.
