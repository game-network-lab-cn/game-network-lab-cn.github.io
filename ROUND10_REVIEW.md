# Round 10: data-quality and result-guidance upgrade

Changes:
- Added a reusable, deterministic data-quality assessment distinguishing limited samples, missing target/time context, unknown real sampling interval, no responses, and ICMP-vs-game-traffic limitations.
- The analyzer now accepts optional target description and testing time; displays interpretation limitations and incorporates them into copied reports.
- A/B comparison points out different sample counts, P95 differences and observed timeout differences without claiming fault attribution.
- Corrected the consecutive timeout explanation: the span between N equally spaced scheduled probes is (N-1) intervals, and even this is conditional on the configured interval matching actual send times. It is not the outage duration.
- Added three data-quality unit tests.

Verification:
- `npm test`: 18/18 passed.
- `npm run validate`: passed.
- `node --check src/lib/ping-analysis.mjs`: passed.
- `npm install --no-audit --no-fund --fetch-retries=0 --fetch-timeout=9000`: failed with EAI_AGAIN connecting to registry.npmjs.org. Astro production build and real-browser E2E remain **NOT VERIFIED**.

Before deployment: install dependencies in a working network environment, run `npm run build`, `npm run preview`, test imported real Windows/Linux/macOS files, keyboard interactions, CSV download, clipboard, and mobile layout. The optional metadata is manually entered and not independently verified.
