# GitHub Pages deployment

MinuteShield's static launch site lives in `site/`. The repository contains a manual-only Pages workflow at `.github/workflows/pages.yml` so deployment cannot accidentally start before the repository owner has deliberately enabled GitHub Pages.

## Before the first deployment

1. Keep the repository private until the intended public-launch decision is made.
2. In GitHub repository settings, open **Pages** and configure the publishing source to **GitHub Actions**.
3. Confirm the account/repository plan supports Pages for the repository's current visibility. GitHub Pages is available for public repositories on GitHub Free and for public/private repositories on plans that include private Pages support.
4. Run **Deploy MinuteShield site** manually from the Actions tab.
5. Confirm the deployment environment reports the final page URL.
6. Verify these URLs after deployment:
   - `/MinuteShield/`
   - `/MinuteShield/github-actions-cost-calculator.html`
   - `/MinuteShield/github-actions-macos-vs-linux-cost.html`
   - `/MinuteShield/reduce-github-actions-cost.html`
   - `/MinuteShield/sitemap.xml`
   - `/MinuteShield/robots.txt`

The site currently assumes the default project Pages URL `https://tirthanand17.github.io/MinuteShield/` in canonical and sitemap metadata. If a custom domain is later configured, update those URLs before submitting the sitemap to search engines.

## Why the workflow is manual-only before launch

GitHub requires Pages to be enabled/configured before a custom workflow can deploy. Keeping `workflow_dispatch` as the only trigger prevents a private development commit from creating a failed deployment or exposing the intended launch process prematurely.

After the first successful public deployment, a later change may add an automatic trigger such as:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'site/**'
  workflow_dispatch:
```

Only enable automatic deployment after the Pages source and repository visibility are intentionally configured.

## Permissions

The deployment workflow grants only the permissions required for the Pages flow:

- `contents: read`
- `actions: read`
- `pages: write`
- `id-token: write`

The deployment job uses the `github-pages` environment so GitHub can apply environment/deployment protection rules and expose the deployed URL.
