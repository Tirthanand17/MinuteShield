# Contributing to MinuteShield

MinuteShield is intentionally small and security-conscious. Contributions should preserve the core boundary: pull-request workflow content is untrusted data and must not be executed as part of cost analysis.

## Before opening a change

- Search existing issues and pull requests for the same problem.
- Prefer a concrete workflow/cost problem over a broad feature request.
- Do not include private repository content, secrets, tokens or customer data in examples.
- For security vulnerabilities, follow `SECURITY.md` instead of opening a public issue with exploit details.

## Development

Requirements: Node.js 24 and npm.

```bash
npm ci
npm run check
```

`npm run check` performs TypeScript checking, the Vitest suite, and the production NCC build.

## Pull requests

A useful pull request should:

1. Explain the user/workflow problem it solves.
2. Add or update tests for behavior changes.
3. Preserve least-privilege GitHub permissions and the base-branch policy trust model.
4. Avoid executing PR-provided scripts, actions or workflow expressions during analysis.
5. Keep estimates explicit about uncertainty rather than presenting them as invoices.

Do not hand-edit the minified `dist/index.js`. The repository's verified build process regenerates the bundle from source for release consumption.

## Pricing changes

Runner pricing is time-sensitive. Any pricing update should cite the current official GitHub billing documentation in the pull-request description and update relevant tests/site copy together.
