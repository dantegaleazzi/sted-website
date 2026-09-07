# Sted content tunnel preview

Branch: `feature/sted-content-tunnel` (from `redesign/visual-refresh`).
Preview: run `npm run dev` and open `/dev/content-tunnel/`.

Isolated landing preview with the title “Everything You Save / Finally Useful”, official design-repository wordmark, and a CSS 3D inward content stream. Desktop uses 12 slots per side, 24 unique mock items, a 7.5-second cycle, nonlinear perspective compression, and offset phases between sides. Includes subtle parallax, hover lift, pause/resume and reduced-motion styles. Existing production pages are not changed or integrated.

The link input adds a URL to the in-memory preview only. The iOS button displays an availability dialog; it does not download an app.

Validation: typecheck, lint, existing test suite and production build passed. Live motion was compared with Melius for over 35 seconds; mascot position stayed fixed and no application console errors were observed. The production build retains its existing large-chunk warning. Browser reduced-motion emulation remains unverified.

Known blocker: `assets/sted-mascot.svg` is copied unchanged from `sted-design/brand/assets/mascot/neutral/reference.svg`. Its embedded Base64 image is invalid and renders blank. Awaiting the user's correct SVG or exact source path. Do not substitute the flat brand mark for the mascot. Landing visual validation remains incomplete pending this asset.

Existing unrelated working-tree changes (package files, homepage files and the earlier tunnel prototype) were preserved. This experiment uses the Framer Motion dependency already installed in the working tree. No deployment or merge performed.
