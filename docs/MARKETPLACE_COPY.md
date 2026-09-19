# GitHub Marketplace copy for MinuteShield v0.1.0

## Listing name

MinuteShield — GitHub Actions Cost Guard

## Short description

Estimate GitHub Actions cost changes before merge and block CI spend regressions with base-branch policy.

## Primary value proposition

MinuteShield reviews pull requests that modify GitHub Actions workflows, estimates the before/after monthly runner-cost impact, flags common CI-minute waste, and can fail the check when a trusted repository policy threshold is exceeded.

## Key points

- Preventive before/after monthly cost estimates in pull requests.
- Historical calibration from recent workflow runs when permissions allow.
- Static matrix expansion and dynamic-matrix warnings.
- Detection for macOS cost, missing timeouts, missing cancellation, high-frequency schedules, oversized matrices, push+PR duplication, and unpriced custom runners.
- Base-branch policy loading so a pull request cannot raise its own budget threshold.
- Idempotent PR comments plus GitHub Actions job summaries.
- No execution of pull-request code.

## Suggested category

Primary: Continuous integration

## Install snippet

```yaml
- uses: Tirthanand17/MinuteShield@v0.1.0
  with:
    github-token: ${{ github.token }}
```

## Accuracy note

MinuteShield provides preventive estimates rather than billing guarantees. Included minutes, enterprise pricing, taxes, conditional jobs, self-hosted/custom runner economics, and future GitHub pricing changes can affect actual spend.

## Launch verification checklist

1. Confirm the Marketplace page renders the repository README, branding, inputs, outputs, and action name correctly.
2. Install `Tirthanand17/MinuteShield@v0.1.0` in a second repository.
3. Open a PR that changes a workflow and verify the check, job summary, and sticky comment.
4. Confirm a configured policy threshold can fail the check.
5. Verify documentation links and the static launch site after GitHub Pages is enabled.
