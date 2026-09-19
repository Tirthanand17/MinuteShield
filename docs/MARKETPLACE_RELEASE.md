# GitHub Marketplace release checklist

This document is the operator checklist for MinuteShield's first public GitHub Marketplace release.

## Current private-release gates

- [x] Root `action.yml` exists and declares a JavaScript Action.
- [x] Action runtime is Node 24.
- [x] Production `dist/index.js` is committed.
- [x] Unit tests pass.
- [x] GitHub-hosted CI passes.
- [x] Controlled end-to-end PR test passes.
- [x] Sticky PR comment behavior is verified.
- [x] Security/reporting documentation exists.
- [x] Changelog exists.
- [x] Install example points at the real repository.
- [ ] Release-prep PR merged to `main`.
- [ ] Repository visibility intentionally changed from private to public.
- [ ] GitHub Marketplace Developer Agreement accepted for the publishing account.
- [ ] GitHub's Marketplace banner confirms the action name is available and metadata is valid.
- [ ] `v0.1.0` release created from the verified `main` commit.
- [ ] "Publish this Action to the GitHub Marketplace" selected on that release.
- [ ] Primary category selected: **Continuous integration**.
- [ ] Secondary category selected: **Utilities** (if available/applicable in the publishing UI).
- [ ] Release notes reviewed against `CHANGELOG.md`.
- [ ] Two-factor authentication requirement satisfied for release publication.

## Public-release sequence

1. Merge the release-prep pull request only after CI is green.
2. Re-run/confirm `MinuteShield CI` on `main`.
3. Change repository visibility to public only when intentionally ready to launch.
4. Open the root `action.yml` on GitHub and use the Marketplace publication banner.
5. Accept the Marketplace Developer Agreement if GitHub prompts for it.
6. Draft release `v0.1.0` from the exact green `main` commit.
7. Enable Marketplace publication, choose categories, and publish the release.
8. Confirm the Marketplace listing renders the description, branding, inputs, and README correctly.
9. Test installation from a second repository using `Tirthanand17/MinuteShield@v0.1.0`.
10. After validation, consider a stable moving major tag when the project reaches `v1.x`.

## Release notes for v0.1.0

MinuteShield brings CI cost feedback into pull-request review. It estimates the monthly GitHub Actions cost impact of workflow changes, uses recent runtime history when available, highlights common sources of CI-minute waste, and can enforce a trusted base-branch cost policy before merge.

The first release includes Linux/Windows/macOS runner pricing, static matrix expansion, workflow-frequency estimation, sticky PR reports, base-branch policy enforcement, and a security model that parses PR workflow YAML as data rather than executing it.

## Important limitations to state publicly

MinuteShield produces preventive estimates, not invoices. Actual GitHub billing can differ because of included minutes, enterprise arrangements, taxes, dynamic workflow behavior, conditional execution, self-hosted/custom runner economics, and future pricing changes.
