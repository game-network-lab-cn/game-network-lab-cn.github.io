# Round 7 verification and fixes — 2026-10-30

## Confirmed fixes
- Ping samples now require a standalone numeric / `time=...ms` entry or a recognisable Windows/Linux per-packet reply. Unrelated prose containing `time=...ms` can no longer be silently counted as an RTT observation.
- Imported CSV rows with malformed statuses, nonnumeric RTTs, and invalid row indices are rejected.
- Added a version guard so a late asynchronous file read cannot overwrite samples the user has already edited, reset, or replaced with demo data.
- Added 3 regression tests for these cases.

## Verification
- `npm test`: 10/10 passed.
- `npm run validate`: passed.
- `npm run build`: blocked by missing Astro dependency (`astro: not found`). No production-build or browser-end-to-end claim is made.

## Still needed
1. Install project dependencies in a network-enabled environment and run `npm ci` (if lock file exists), `npm run build`, and `npm run preview`.
2. Browser-test file imports, CSV round trips, reset/edit races, compare controls, mobile layout, and print/download actions.
3. Validate deployed canonical/robots/sitemap and Google Search Console data.
