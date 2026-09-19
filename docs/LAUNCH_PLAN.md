# MinuteShield launch plan

## Objective

Launch MinuteShield as a self-serve GitHub Action that solves a search-driven developer problem: understanding the cost impact of GitHub Actions workflow changes before merge. The free Action should generate organic discovery; a later cloud product can monetize multi-repository governance and reporting.

## Acquisition loop

```text
Developer searches for GitHub Actions cost / expensive CI
        ↓
Marketplace listing or calculator page
        ↓
One-workflow install
        ↓
MinuteShield comments on real PRs
        ↓
Visible savings / findings inside code review
        ↓
Team adopts across more repositories
        ↓
Need for organization-wide policy, history, ownership, reports
        ↓
Paid cloud upgrade opportunity
        ↺
```

## Self-serve surfaces

1. GitHub Marketplace listing — primary install surface.
2. Repository README — technical trust and copy/paste installation.
3. Static cost calculator — search/education surface.
4. PR comment — recurring in-product demonstration of value.
5. Changelog and security policy — trust surface for engineering teams.

## SEO/topic cluster for the public site

Core intent:
- GitHub Actions cost calculator
- GitHub Actions pricing calculator
- reduce GitHub Actions cost
- CI cost optimization
- GitHub Actions macOS cost
- GitHub Actions workflow cost

Educational pages to add after the first release, based on real product behavior rather than generic content:
- How GitHub Actions billing rounds job minutes.
- Linux vs Windows vs macOS Actions cost comparison.
- Why duplicate push + pull_request triggers waste CI minutes.
- How `concurrency.cancel-in-progress` reduces obsolete PR runs.
- Matrix build cost calculator and examples.

## Monetization path

Keep v0.1 local and free. Do not add a paid backend until the Action has enough real usage to prove which organization-level problems recur. Candidate paid capabilities remain shared policy, repo fleet dashboards, ownership/budget mapping, historical savings reports, scheduled digests, and central audit history.

The revenue target is a business goal, not a guaranteed outcome; acquisition, retention, willingness to pay, and conversion must be measured after launch.
