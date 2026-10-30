# Round 8 review — 2026-10-30

## Confirmed repairs

- CSV sample identifiers must be sequential (1, 2, 3...) in imports. Duplicated or skipped identifiers now produce an invalid-line warning instead of silently affecting results.
- The CSV header no longer counts against the 5,000-data-row validation limit; imported files containing exactly 5,000 valid samples are accepted.
- The same data-row limit is enforced for single-set and A/B analysis.

## Validation

- `npm test`: 12/12 passed, including two added regression tests.
- `npm run validate`: passed.
- `node --check src/lib/ping-analysis.mjs`: passed.
- `npm run build`: not completed because the current environment does not have Astro installed (`astro: not found`). Consequently production HTML generation and real-browser functionality remain unverified.

## Outstanding release gates

1. Install exact project dependencies on a networked build runner and run `npm run build`.
2. Run realistic browser-based import/analyze/compare/export checks on desktop and mobile.
3. Crawl published URLs, validate structured data and discoverability, and inspect Search Console.
4. Test additional actual Ping log samples; document parser format support and limitations.
