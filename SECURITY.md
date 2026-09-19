# Security Policy

## Supported versions

Until the first public release, only the latest commit on the default branch is supported. After `v0.1.0`, security fixes will target the latest published release line.

## Reporting a vulnerability

Please do not disclose an unpatched vulnerability in a public issue.

Use GitHub's **Report a vulnerability** / private vulnerability reporting flow for this repository when it is available. If that option is unavailable, open a minimal issue asking the maintainer for a private security contact and do not include exploit details, secrets, tokens, or sensitive repository data in the public issue.

A useful report includes the affected version, the security boundary involved, the expected behavior, and a minimal non-sensitive reproduction.

## Security design

MinuteShield is designed so pull-request workflow files are treated as untrusted data. It does not execute the pull request's workflow code as part of its analysis. Configuration used for enforcement is loaded from the trusted base revision rather than from the proposed change.

The recommended workflow grants only:

- `contents: read`
- `actions: read`
- `pull-requests: write`

Consumers that do not want PR comments can disable commenting and remove `pull-requests: write` where their integration permits it.
