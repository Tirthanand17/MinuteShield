# MinuteShield — Deep Research & Product Decision Report

**Research date:** 19 September 2026

## Executive conclusion

The selected product is **MinuteShield**, a preventive cost guard for GitHub Actions. It estimates how much a pull request that changes workflow YAML is likely to add or save per month, using GitHub's current runner rates plus recent execution history, then comments directly on the PR and can block a change when it exceeds a trusted budget policy.

This is intentionally **not** another historical dashboard and **not** only a static YAML linter. GitHub itself now exposes Actions usage/performance metrics, while commercial tools already sell historical cost dashboards. The product gap is earlier in the lifecycle: put a calibrated dollar delta in code review before the workflow change reaches the default branch.

## Decision loop

The search loop used six tests. A candidate had to survive all six:

1. Recurring problem rather than a one-off convenience.
2. Financial impact that can be measured in dollars or saved engineering time.
3. Evidence from current users/community behavior rather than invented personas.
4. A differentiated wedge despite current competitors and native platform features.
5. Self-serve discovery/distribution without cold sales.
6. Ability to build and operate inside the initial ₹3,000 budget.

### Candidate: AI crawler / GEO audit

**Dropped.** The category is active, but low-cost/free audit products are already common, and some popular optimization claims are disputed. That weakens recurring willingness-to-pay and makes differentiation expensive.

### Candidate: historical GitHub Actions dashboard

**Changed angle rather than built directly.** ActionsCost already sells a $29/month Pro plan with workflow breakdowns, trends and alerts. CostOps targets the same budget with plans beginning at $29/month. GitHub also now has native Actions usage/performance metrics. A new dashboard would enter an already-obvious lane.

### Candidate: static GitHub Actions waste linter

**Changed angle.** The open-source `actionbudget` project already flags missing caching, concurrency cancellation, timeouts, large matrices, duplicate push/PR runs and expensive runners. Static linting alone is not enough differentiation.

### Selected: predictive pre-merge cost gate

**Survived the loop.** MinuteShield combines the repository's own recent run frequency and job runtime with a before/after workflow model. The output is an expected monthly-dollar delta at PR review time, with policy enforcement from the trusted base branch.

## Evidence of the problem

A May 2026 DevOps discussion described accidental recurring spend caused by using a macOS runner for linting, with the mistake only noticed after money had already been burned. A March 2026 discussion quantified large amounts of failed/cancelled parallel CI compute. A September 2026 discussion still shows recurring complaints about slow GitHub Actions, cache failures, and workflow/infrastructure inefficiency.

GitHub's own current documentation confirms that runner selection directly changes per-minute economics: baseline rates currently include $0.002/min for Linux 1-core, $0.006/min for standard Linux x64, $0.005/min for standard Linux arm64, $0.010/min for standard Windows, and $0.062/min for standard macOS. GitHub also rounds partial job minutes upward for billing.

## Competitive map

| Product / capability | Main value today | Gap MinuteShield targets |
|---|---|---|
| GitHub Actions native metrics | Workflow/job usage, runtime and performance visibility | Describes observed usage rather than estimating the cost impact of a PR before merge |
| ActionsCost | Historical cost dashboard, alerts, exports; Pro $29/mo | Mostly reactive monitoring after runs occur |
| CostOps | Historical cost intelligence and optimization; paid tiers from $29/mo | Mostly cost observability/recommendations after execution |
| `actionbudget` | Deterministic static workflow linting | Does not make repository-history-calibrated before/after monthly-dollar prediction the central product |
| MinuteShield | PR cost delta + policy gate | Preventive decision point before workflow configuration lands |

## Product architecture choice

The free product runs on the customer's GitHub runner and needs no MinuteShield backend. That keeps vendor infrastructure nearly zero during validation and makes the product easy to trust: workflow code stays in GitHub, and the analysis can operate from metadata plus workflow YAML.

The Action reads changed workflow files using the GitHub API, reads recent runs/jobs for calibration, parses the base and head workflow, prices jobs, expands static matrices, models trigger changes, applies deterministic findings, and writes one idempotent PR comment plus a job summary. It never needs to execute code from the PR.

The budget policy is loaded from the base SHA. That prevents a workflow PR from simply editing its own threshold to bypass the guard.

## Acquisition strategy without cold outreach

The distribution funnel is designed to be self-serve:

1. Develop privately until the release is safe.
2. Publish the free Action in a dedicated **public** repository because GitHub requires Marketplace Actions to be public.
3. Use a copy-paste install workflow with no mandatory account for the free tier.
4. Publish a free browser calculator and exact-answer documentation pages for GitHub Actions cost questions.
5. Let useful PR comments carry small MinuteShield attribution so the product is seen by reviewers naturally.
6. Offer paid organization-level cloud features only after teams want centralized multi-repo policy/history.

GitHub says Marketplace Actions can be published immediately when they meet its requirements, which creates a low-friction developer distribution channel. A paid GitHub Marketplace **App** is deliberately not the initial monetization path because paid apps require organization ownership/verified publisher status and, for GitHub Apps, at least 100 installations.

## Revenue model

A plausible initial cloud price hypothesis is **$29/month Team** and **$59/month Org**. These are hypotheses, not guaranteed willingness-to-pay.

- 35 Team customers × $29 = **$1,015 MRR**
- 18 Org customers × $59 = **$1,062 MRR**

This shows the $1,000/month target does not require thousands of customers, but research alone cannot guarantee those conversions. The paid conversion rate is the main business uncertainty.

## Initial budget

The core Action requires no vendor server. The public calculator is static. That means the MVP can be built and distributed without spending most of the ₹3,000 budget. Keep the reserve for a domain and later launch/payment costs rather than paid ads.

## Key risks and mitigations

1. **GitHub expands native cost tools.** Mitigation: stay focused on predictive PR gating, not dashboards GitHub can commoditize.
2. **Estimate accuracy on dynamic workflows.** Mitigation: explicitly mark low-confidence inputs, allow custom runner rates, prefer historical medians, and never fabricate unknown runner costs.
3. **Fork/token permissions.** Mitigation: job summary always works; PR comment failure is non-fatal.
4. **Pricing changes.** Mitigation: centralize runner pricing constants and version them with documented source dates.
5. **Paid conversion is unproven.** Mitigation: use passive behavioral evidence after release—installs, repeat executions, multi-repo adoption, upgrade-page visits, trials and churn—rather than relying on friends saying they like the idea.
6. **Age/KYC/payment constraints.** Any paid billing, tax or business account must be operated by an eligible account holder/entity under the provider's rules; do not bypass identity or age requirements.

## Source set

- GitHub Actions billing: https://docs.github.com/en/billing/concepts/product-billing/github-actions
- GitHub Actions runner pricing: https://docs.github.com/en/enterprise-cloud@latest/billing/reference/actions-runner-pricing
- GitHub Actions metrics: https://docs.github.com/en/actions/concepts/metrics
- Publishing Actions in Marketplace: https://docs.github.com/en/actions/how-tos/create-and-publish-actions/publish-in-github-marketplace
- Marketplace app paid-listing requirements: https://docs.github.com/en/apps/github-marketplace/creating-apps-for-github-marketplace/requirements-for-listing-an-app
- ActionsCost pricing: https://www.actionscost.com/pricing
- CostOps pricing: https://costops.dev/pricing
- Community cost mistake: https://www.reddit.com/r/devops/comments/1tj0gdi/
- Community CI waste analysis: https://www.reddit.com/r/devops/comments/1rxlfxd/
- Current recurring Actions pain discussion: https://www.reddit.com/r/devops/comments/1wfw0o1/
