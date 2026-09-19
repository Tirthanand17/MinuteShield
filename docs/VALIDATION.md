# Market validation — 19 September 2026

## Research loop

The selection loop used four gates: recurring pain -> willingness/financial impact -> competitive whitespace -> self-serve distribution and low operating cost. Ideas that failed a gate were dropped rather than rationalized into the build.

### Candidate A: AI crawler / GEO audit

Rejected. There is visible demand, but low-cost/free audit tools are already abundant and parts of the `llms.txt` narrative remain disputed. It would be difficult to defend a recurring subscription on a ₹3,000 starting budget.

### Candidate B: reactive GitHub Actions cost dashboard

Rejected as the primary product. The pain is real, but products already offer per-workflow cost dashboards and alerts. A dashboard mainly tells users what already happened.

### Candidate C: MinuteShield — preventive Actions cost gate

Selected for the MVP. The product places the estimated monthly dollar impact directly in the PR **before** a workflow configuration lands. Static linting is not enough; the differentiator is combining GitHub's current rates with the repository's recent run frequency and runtime history.

## Demand evidence

Community evidence shows repeated CI cost and waste problems: accidental expensive runner selection, large amounts of failed/cancelled parallel compute, and recurring complaints about slow or inefficient Actions workflows. These are financially measurable rather than purely cosmetic problems.

Primary public references:

- GitHub Actions billing and runner pricing: https://docs.github.com/en/billing/concepts/product-billing/github-actions
- GitHub Actions runner pricing: https://docs.github.com/en/enterprise-cloud@latest/billing/reference/actions-runner-pricing
- Developer report of accidental macOS-runner spend (May 2026): https://www.reddit.com/r/devops/comments/1tj0gdi/
- Developer analysis of failed/cancelled CI compute waste (March 2026): https://www.reddit.com/r/devops/comments/1rxlfxd/
- Recurring GitHub Actions pain discussion (September 2026): https://www.reddit.com/r/devops/comments/1wfw0o1/

## Competitive evidence

Competition validates the category but narrows the product gap:

- `actionbudget` statically lints Actions workflows for CI-minute waste.
- Existing cost dashboards focus on historical visibility/alerts.
- Terraform and LLM-cost tools show that cost-delta comments in PR review are an understandable developer UX.

MinuteShield therefore must win on **predictive before/after dollar delta, calibrated by the repo's own execution history**, not on a generic lint checklist.

## What the evidence does NOT prove

This research does not guarantee $1,000 MRR. No responsible research can guarantee that before real paid conversions exist. It does establish a real recurring problem, existing spending, clear competitors, a specific product gap, and a low-cost distribution route. The biggest unknown is paid conversion for the central cloud tier.

## Passive validation after release

No cold outreach is required. Measure product-market signal from self-serve sources: Marketplace installs, repeat workflow executions, documentation search traffic, upgrade-page visits, trial starts, activation across additional repositories, and churn. This is behavioral evidence rather than asking friends to say whether they like the idea.
