# MinuteShield architecture

## System boundary

MinuteShield v0.1 is a customer-compute GitHub Action. Its core analysis runs inside the customer's GitHub-hosted runner. No MinuteShield server is required for the free product.

```text
Pull request changes workflow YAML
            |
            v
GitHub Action (MinuteShield)
  |-- GitHub API: changed files + base/head YAML
  |-- GitHub API: recent runs/jobs (read-only calibration)
  |-- Config: base branch .minuteshield.yml
  v
Pure analysis engine
  |-- runner price resolver
  |-- matrix expander
  |-- trigger/schedule estimator
  |-- historical runtime/frequency model
  |-- cost delta calculator
  |-- policy/findings engine
  v
PR sticky comment + job summary + pass/fail output
```

## Trust model

1. PR workflow contents are untrusted data and are never executed by MinuteShield.
2. Policy is read from the base SHA rather than the PR head.
3. The Action asks only for contents:read, actions:read, and pull-requests:write in the example workflow.
4. Fork PRs may have read-only tokens; failure to comment is non-fatal and the job summary remains available.
5. Unknown/custom runner prices are excluded unless explicitly configured; they produce a warning rather than fabricated cost.

## Modules

- `src/github.ts`: safe GitHub data acquisition and idempotent comment update.
- `src/history.ts`: recent run/job sampling, median duration, and run-frequency calibration.
- `src/workflow.ts`: YAML parsing, matrices, cron/trigger load, and workflow estimation.
- `src/pricing.ts`: standard runner pricing and custom runner overrides.
- `src/findings.ts`: deterministic cost/reliability rules.
- `src/engine.ts`: before/after orchestration and policy decision.
- `src/report.ts`: human-readable PR report.
- `src/index.ts`: GitHub Action adapter only; core logic stays testable.

## Paid cloud extension (phase 2)

The cloud tier should remain optional. Proposed components:

```text
Action -> signed summary event -> API/queue -> tenant store -> dashboard/reporting
                                  |              |
                                  |              +-- org/repo budgets + history
                                  +-- license/entitlement check
```

Store only cost metadata by default (repo identity, workflow path, estimates, finding codes, timestamps), not source code or workflow bodies. A deletion endpoint and configurable retention are required before launch.

## Scale/cost design

The free Action is essentially zero-infrastructure for the vendor. Phase-2 cloud ingestion should be event-driven and serverless, making operating cost proportional to active repositories rather than idle accounts.
