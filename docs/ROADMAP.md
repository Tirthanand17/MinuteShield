# Roadmap

## Phase 0 — completed in the current prototype

- Deterministic workflow parser and cost model.
- Current standard hosted-runner rate table.
- Static matrix expansion and cron-frequency estimation.
- Historical run/job calibration through GitHub Actions APIs.
- Base-branch policy enforcement.
- PR sticky comment, job summary, and blocking threshold.
- Security-oriented data path that does not execute PR code.
- Unit tests and CI workflow.

## Phase 1 — pre-public-release hardening

- Fixtures for reusable workflows, job-level concurrency, expressions, and renamed workflows.
- Pagination/sampling controls for very large repositories.
- Larger-runner SKU mapping and optional included-minutes model.
- Confidence score with explicit low-history explanations.
- SARIF/annotations for findings.
- Integration test against a disposable private repository.
- Marketplace release workflow and signed version tags.

## Phase 2 — self-serve growth

- Static SEO landing site and public cost calculator.
- GitHub Marketplace listing.
- Anonymous telemetry only with explicit opt-in; default remains no vendor data transfer.
- Documentation examples for common monorepo and matrix patterns.

## Phase 3 — paid cloud

- Organization dashboard and shared policy sets.
- Signed ingestion API containing metadata only.
- Authentication and tenant isolation.
- Billing/entitlements through an eligible business/payment account.
- Weekly savings reports and webhook integrations.
- Data retention/deletion controls and audit export.
