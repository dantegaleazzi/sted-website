# Real content — Product Design System

Updated 2026-09-07. Canonical dataset: `src/components/source-cards/real-content-fixtures.ts`.

## Current selection

15 unique user-selected items: articles ×2, videos ×2, X posts ×2, GitHub repos ×2, websites ×2, Instagram ×2, Pinterest ×1 and Spotify ×2. The later request explicitly adds one podcast episode and one playlist, replacing the earlier exclusion of Podcasts. Notes remain excluded. The previous @trycursor example was replaced. The tunnel has eight slots on each side. RevenueCat is duplicated temporarily with user authorization to fill slot 16, pending a new real item. The static dataset remains 15 unique items. Both lanes use the same 7.586102-second loop. Fixture changes remount the entire sequence together so replacement cards cannot start on a different clock.

14 current public thumbnails are frozen byte-for-byte in `public/content/real/`. URLs, SHA-256 hashes, dimensions and retrieval evidence are in `real-content-provenance.json` (which also retains the original replaced Instagram asset's provenance).

## Metadata and media

- User-supplied editorial copy is preserved. YouTube title/channel come from official oEmbed; durations come from public watch-page duration metadata (6:15 and 34:16).
- shadcn media is the linked repository preview; Google Cloud media is the linked X article cover. These are associated previews, not uploaded photographs.
- Real publisher artwork can contain gradients or embedded repository statistics. It is preserved as supplied by the source; statistics embedded in artwork are a frozen snapshot, not live counters.
- Instagram captions, accounts and dates were extracted from public page metadata. Post types could not be verified and are omitted. Full captions are stored; cards show the first paragraph as the title.
- The first new Instagram URL returns @claudeai metadata although the user requests a supplied DJI visual. The second URL returns @osmo_global metadata. This mismatch is preserved, not silently swapped.
- The first Instagram image remains pending: no file was attached or identified by an accessible path. No alternative thumbnail was downloaded. When supplied, copy it byte-for-byte as `instagram-dji-osmo-360-II.jpg`, retaining its aspect ratio.
- Verified fixtures never render synthetic media, sample code, made-up avatars, engagement counts, audio waves or fallback metadata. Failed/missing images are omitted.
- Horizontal Sted logo and source tiles were copied from the supplied design library. Article/website sources use the supplied generic web icon and retain their publisher names as text.

## Review routes

- `/internal/content-tunnel-preview`: existing hero/motion, official horizontal logo and real content.
- `/internal/product-design-system`: all 15 cards with full artwork and links to original sources; Instagram has its own section.
- Original home/legacy dataset remain available. Shared SourceIcon now uses supplied tiles.

## Pending

The supplied DJI image and clarification of the first Instagram URL/image mismatch. Instagram post types and optional unverified metadata stay empty. No new mobile work was performed.
