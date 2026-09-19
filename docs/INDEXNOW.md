# IndexNow setup

MinuteShield uses IndexNow as a lightweight search-discovery signal for the public GitHub Pages site.

## Verification

IndexNow key: `5650add5d75246af8189b6dc9f2a0be8`

Public key location after Pages deployment:

`https://tirthanand17.github.io/MinuteShield/5650add5d75246af8189b6dc9f2a0be8.txt`

Because the key file is hosted inside `/MinuteShield/` rather than at the `github.io` host root, submissions must include that exact URL as `keyLocation`. Under IndexNow's path-scoped verification rules, this key can verify URLs below `https://tirthanand17.github.io/MinuteShield/`.

## URLs submitted

- `https://tirthanand17.github.io/MinuteShield/`
- `https://tirthanand17.github.io/MinuteShield/github-actions-cost-calculator.html`
- `https://tirthanand17.github.io/MinuteShield/github-actions-macos-vs-linux-cost.html`
- `https://tirthanand17.github.io/MinuteShield/reduce-github-actions-cost.html`

## Notes

A successful IndexNow API response means the URLs were received; it does not guarantee ranking or indexing. A first submission can return HTTP 202 while the public key file is being validated. Later accepted submissions generally return HTTP 200.

Only notify IndexNow when public pages are added, materially updated, or removed; avoid repeated submissions without a content change.
