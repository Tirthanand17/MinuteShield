# Changelog

All notable changes to MinuteShield are documented here.

The project follows semantic versioning for public releases.

## [0.1.0] - Unreleased

### Added

- Pull-request GitHub Actions workflow cost estimation.
- Before/after monthly cost delta reporting.
- Standard Linux, Windows, macOS, and ARM runner pricing support.
- Recent workflow/job history calibration with fallback assumptions.
- Static matrix expansion and dynamic-matrix confidence handling.
- Detection for macOS cost exposure, missing job timeouts, missing PR concurrency cancellation, oversized matrices, high-frequency schedules, custom/unpriced runners, and possible push/PR duplication.
- Sticky pull-request comments and GitHub job summaries.
- Base-branch policy enforcement through `.minuteshield.yml`.
- Exact cost outputs for downstream workflows.
- Node 24 production Action bundle.
- Unit tests, CI, and controlled end-to-end pull-request validation.
- Static cost calculator/landing page.

### Security

- Pull-request workflow YAML is parsed as data and is not executed.
- Policy is loaded from the trusted base revision.
- Recommended installation uses least-privilege `GITHUB_TOKEN` permissions.
