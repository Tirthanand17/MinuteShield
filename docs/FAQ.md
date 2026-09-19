# MinuteShield FAQ

## Is the reported dollar amount my GitHub invoice?

No. MinuteShield is a preventive estimate for reviewing workflow changes. Actual billed spend can differ because of included minutes, public-repository treatment, enterprise arrangements, taxes, conditional execution, larger runners, self-hosted infrastructure and future pricing changes.

## Does MinuteShield execute code from the pull request?

No. The action fetches changed workflow YAML through GitHub APIs and parses it as data. Its enforcement configuration is loaded from the trusted base revision so a pull request cannot raise its own allowed cost threshold.

## Why does MinuteShield ask for `actions: read`?

When available, recent Actions history lets MinuteShield calibrate workflow frequency and job duration instead of relying only on fallback assumptions. The recommended workflow also uses `contents: read` and `pull-requests: write` so it can read repository data and maintain its PR report.

## Can I disable the PR comment?

Yes. Set the `comment` input to `false`. The action still exposes numeric outputs and can write the GitHub Actions job summary. Review whether `pull-requests: write` is still needed for your chosen integration.

## What happens for a brand-new workflow with no history?

MinuteShield uses configured fallback assumptions for run frequency and runtime, then marks the estimate with the limitations implied by sparse history. Once real history exists, later estimates can use that evidence.

## Does it understand matrices?

Static matrices are expanded so their multiplicative cost is represented. Dynamic expressions cannot always be resolved safely from YAML alone, so MinuteShield treats them conservatively and lowers confidence instead of pretending to know the final fan-out.

## Does it price self-hosted or custom runners?

MinuteShield flags runners it cannot price using its standard GitHub-hosted rate table. Self-hosted economics depend on infrastructure the repository owner controls, so fabricating a GitHub-style per-minute price would be misleading.

## Why flag macOS jobs?

Standard GitHub-hosted macOS runners have a materially higher per-minute baseline rate than standard Linux runners. The finding is a review prompt, not a command to migrate: Apple builds, signing, simulators and macOS-specific behavior may legitimately require macOS.

## What about public repositories?

GitHub's billing treatment for standard hosted runners differs between public and private repositories. MinuteShield's PR delta is most useful as a relative cost signal for workflow design; teams should interpret the dollar estimate in the context of their account, repository visibility and included usage.

## Can a pull request change `.minuteshield.yml` to bypass policy?

The enforcement policy is loaded from the base revision, not trusted from the proposed pull request, specifically to prevent a PR from raising its own threshold before being evaluated.

## Is there a paid version?

The first release is designed as a free, self-serve Action. Organization-wide policy, fleet-level reporting, budget ownership and central history are potential cloud features only after real usage demonstrates recurring demand.
