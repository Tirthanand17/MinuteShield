# Post-launch demand research

Fresh public research after launch found recurring pain around GitHub Actions cost control:

- Accidental macOS usage can create materially higher spend than standard Linux runners.
- Matrix combinations can multiply job cost quickly.
- Missing `concurrency.cancel-in-progress` can leave obsolete runs consuming minutes after new pushes.
- Developers also report difficulty attributing aggregate Actions spend back to individual workflows.

Official GitHub billing documentation currently lists baseline standard rates of $0.002/min for Linux 1-core (`ubuntu-slim`), $0.006/min for standard Linux x64, $0.005/min for standard Linux arm64, $0.010/min for standard Windows, and $0.062/min for standard macOS. GitHub rounds partial job minutes upward.

The immediate product priority from our own public demo is accuracy for newly-added workflows: a workflow created in a PR can accumulate tiny PR-only execution history before MinuteShield analyzes it. That history must not replace the configured fallback frequency/runtime for a workflow that does not exist on the base branch.
