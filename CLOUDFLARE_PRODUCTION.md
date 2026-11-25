# Cloudflare production deployment — yasirzayed.com

## 1. What this doc covers
Production configuration for the Yasir Zayed site when it runs on Cloudflare Workers.
It is not a how-to for other hosts. It is the canonical note for the production
Cloudflare project only.

## 2. Production origin
- Canonical production host: `https://yasirzayed.com`
- `www.yasirzayed.com` is folded into the apex.
- There is no production `*.workers.dev` endpoint and no Freebuff preview host involved
  in the live production responses.

## 3. Deploy/update path
Development and update pushing go through Freebuff only.

- Development: Freebuff-hosted preview environment.
- Updating production: Freebuff Cloudflare publish flow (sites deploy), then smoke-test
  against `https://yasirzayed.com`.

Do not treat `workers.dev` or any Freebuff preview URL as a production target. The
production responses must not expose or redirect to them.

## 4. What the repo already enforces
- `wrangler.jsonc`: `workers_dev` is `false`; routes are bound to `yasirzayed.com` and
  `www.yasirzayed.com` only.
- `worker.js`: written responses (the HTTP→HTTPS redirect, the `www`→apex redirect, and
  both 404 variants) pin HSTS. The static-asset layer supplies HSTS for served pages and
  assets via `public/_headers`.
- `public/_headers`: sets HSTS, security, and caching headers for the production domain.
- `src/lib/backend.ts`: production Convex URL is the safe default; dev-only env files are
  ignored by `.gitignore`, so a shipped build cannot silently point at a dev backend.
- `public/robots.txt` and `public/sitemap.xml` are generated/written for the production
  origin `https://yasirzayed.com`.

## 5. Verified state of the live production domain
Last verified from the production origin after the deploy of version `68a7ebfc`:

- `https://yasirzayed.com/` → 200 `text/html`, HSTS present.
- `https://yasirzayed.com/contact` → 200 `text/html`, HSTS present.
- `https://yasirzayed.com/nonexistent-xyz-after-deploy` → 404 `text/plain`, HSTS present.
- `https://yasirzayed.com/sitemap.xml` → 200, contains only `https://yasirzayed.com/...`
  URLs. No `workers.dev`, no Freebuff preview host.
- `https://yasirzayed.com/robots.txt` → 200, `Sitemap: https://yasirzayed.com/sitemap.xml`.
  No `workers.dev`, no Freebuff preview host.

## 6. If a deploy is blocked
If a future deploy cannot complete, the usual blockers are:
- Missing Cloudflare Workers deploy auth for the production zone/account.
- Missing production Convex URL in the deploy environment for the build step.

Do not paste or commit real secret values. If one is required to finish a deploy, say
which one is missing and where it must be set, then stop until it is provided.

## 7. Ownership
This file exists so the production rules are not re-derived from memory on every deploy.
If anything about the production domain, the Freebuff dev path, or the deploy flow changes,
update this file at the same time.
