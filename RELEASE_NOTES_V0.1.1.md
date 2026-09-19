# MinuteShield v0.1.1

MinuteShield v0.1.1 is an accuracy patch for newly-added workflows.

## Fixed

A workflow created inside a pull request can accumulate a tiny amount of PR-only Actions history before MinuteShield analyzes it. v0.1.0 could treat that history as representative production usage, which could materially understate monthly cost.

v0.1.1 now:

- ignores execution history when the workflow does not exist on the trusted base branch;
- uses the configured fallback runtime and run-frequency assumptions for new workflows;
- never estimates a new scheduled workflow below its statically observable cron frequency.

## Regression example

A new standard macOS workflow with only `0.03` observed runs/day and a `1` minute PR-only sample now uses the default `5` runs/day and `8` minute runtime assumptions, producing a materially more conservative estimate instead of trusting the contaminated sample.

## Validation

- strict TypeScript check passes;
- full Vitest suite includes dedicated new-workflow regression cases;
- production `dist/index.js` bundle is rebuilt by CI before release;
- release tag will be created only from a green `main` commit.

MinuteShield estimates are preventive planning estimates, not invoices. Included minutes, conditional execution, enterprise arrangements, taxes, custom runners and future GitHub pricing can change actual billed spend.
