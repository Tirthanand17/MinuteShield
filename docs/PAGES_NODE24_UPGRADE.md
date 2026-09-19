# GitHub Pages Node 24 upgrade

Validated on 2026-09-19 before changing the deployment workflow.

The previous Pages workflow used:

- `actions/configure-pages@v5`
- `actions/upload-pages-artifact@v4`
- `actions/deploy-pages@v4`

GitHub Actions emitted Node.js 20 deprecation warnings for these helper actions during successful Pages deployments.

The current Node-24-era majors verified before this change are:

- `actions/configure-pages@v6`
- `actions/upload-pages-artifact@v5`
- `actions/deploy-pages@v5`

Validation requirement after merge: manually run `Deploy MinuteShield site`, require a successful deployment, verify the live site returns HTTP 200, and confirm that the previous Node.js 20 deprecation warnings no longer appear.
