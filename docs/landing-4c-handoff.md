# Landing 4c — handoff (September 23, 2026)

Branch: `sted-new-web-c`, from `sted-new-web-b` @ `ad9011b`. 24 commits, all on `/internal/landing-4c` plus a small SEO fix. Nothing merged, nothing deployed. Read this, then `docs/landing-4c-review.md` for the original audit.

## 1. What this branch is

The new Sted landing lives at `/internal/landing-4c` (not linked from the site, not in the sitemap). The current site at `/` is untouched. Dante's decisions along the way are all applied; the remaining work is mobile polish, final assets and shipping (§6).

Route map:

| Route | What | File |
|---|---|---|
| `/internal/landing-4c` | The landing (hero + sections + footer) | `src/components/landing-4c/Landing4CPreview.tsx` |
| `/internal/landing-4c?feature=save\|summary\|feed` | Pins the showcase state, stops rotation (review aid) | same |
| `/internal/landing-4c/states` | The three showcase states stacked | same |
| `/` | Current site (unchanged) | `src/site.tsx` |

## 2. Files

```
src/main.tsx                                   thin router; every surface is a lazy chunk
src/site.tsx                                   the current site shell (was main.tsx's App)
src/flags.ts                                   SHOW_BUILD_IN_PUBLIC (moved out of pages.tsx)
src/components/landing-4c/
  Landing4CPreview.tsx                         header + HERO (copy, ribbons, saves, Sted, outputs, notes)
  Landing4CPreview.css                         hero styles, desktop canvas + <1100px reflow at the end
  Landing4CSections.tsx                        showcase (with the share video), Steds in action, final CTA;
                                               also AppStoreBadge and SignInLink used by the hero
  Landing4CSections.css
  landing-4c-tokens.css                        Sted tokens scoped to .l4c-page (mirror of sted-design-new/tokens/tokens.css)
  app-links.ts                                 APP_STORE_URL and SIGN_IN_URL (both null until launch)
  showcase-rotation.ts (+ .test.ts)            rotation rules for the showcase
public/content/landing-4c/                     hero photos (WebP), pastel icons (WebP), shipaton logo/favicon
public/content/landing-4c/app/                 phone shots (chat/summary/feed .webp), share.mp4 + share-poster.webp
docs/landing-4c-review.md                      the audit, findings, decisions log (§7 there)
docs/landing-4c-audit/                         before/after screenshots per commit of the audit round
```

## 3. How the hero is built

**Canvas.** The hero is a fixed 1600×820px scene (`.l4c-scene`) scaled to the container width with `transform: scale(100cqw / 1600px)` inside `.l4c-scene-outer` (`aspect-ratio: 1600 / 820`). Every hero element is absolutely positioned in canvas pixels. To move something on desktop, edit its `left/top` in `Landing4CPreview.css`. Effective size on screen = canvas px × (viewport width / 1600). At 1440 the hero is 738px tall, which fits a 780px fold.

**Below 1100px** the same DOM reflows (the `@media (max-width: 1099px)` block at the end of the CSS): header → copy → horizontal strip of the saves → Sted → outputs stacked. Ribbons and margin notes are `display: none` there. Do not add desktop-only absolute elements without hiding or restyling them in that block.

**Layers, left to right.**

- `.l4c-copy`: centred headline (72px), formats line (bold), subcopy (muted), App Store badge (42px) + "See how it works" (secondary, muted). Copy is exactly what Dante approved; do not reword without him.
- `.l4c-flows` SVG (viewBox 1600×820): three yellow ribbons (Sted Yellow, 30% opacity, widths 18/15/12) that thread the gaps between cards and meet at Sted's left edge, plus three thin ink lines from Sted's right edge to the outputs. If you move the Sted badge, update the ribbon end points and the fan start (`M874 …`) in the TSX.
- `.l4c-saves`: six real saves. Four are links (X article, Spotify episode, shipaton.com, GitHub repo) opening in a new tab; Kyoto and the pour-over video are not links yet (Dante will send URLs). Widths are per card in the CSS. Each rotated card has `--l4c-tilt` so the hover lift keeps its rotation.
- `.l4c-mascot-badge`: the one and only mascot in the hero (148px). Design rule from Dante: one Sted in the middle, never more.
- `.l4c-results`: three output cards. Summary & Key Points (196px, primary: grey placeholder lines + yellow-dot lines), Topics & Tags (150px, pills), Your Daily Recap (150px, uppercase list: STED'S PICKS / THE RECAP / YOUR SAVES). Icons are Phosphor regular paths inlined in `PHOSPHOR` (MIT).
- `.l4c-note-*`: margin notes "WHAT YOU SAVE" / "USEFUL OUTPUT" / "STED UNDERSTANDS IT." in Inter italic uppercase with a curved SVG arrow (`CurvedArrow`, 67×59).

**Design system.** Colours, radii, shadows and weights come from `landing-4c-tokens.css` (`--sted-*`). Sted Yellow is `#FFD400` and it is the only yellow. Supportive pastels only as icon tiles/tints. No new colours, no gradients.

## 4. Sections below the hero

- **Showcase** (`FeatureShowcase`): three states, rotation every 6s while in view, hover pauses, click pins, `prefers-reduced-motion` disables. State 1 "Save from anywhere" plays `share.mp4` (a real screen recording, 4.6s, muted, looped) inside a CSS device frame (`.l4s-device`); it plays only while active and never under reduced motion. States 2 and 3 are provisional phone shots (`summary.webp`, `feed.webp`) waiting for final screenshots.
- **Steds in action**: H2 "Meanwhile, Sted is working." Four tiles with the neutral mascot + a pastel prop as placeholders. `sted-design-new/assets/mascot/poses/` has 15 PROPOSED poses; swap when Dante approves.
- **Final CTA**: mascot tile, "You saved it for a reason. Make it useful.", App Store badge, "Free to start".
- **Footer**: the site's shared `SiteFooter`.

## 5. Decisions already made (do not reopen)

- Headline "Everything you save. Finally useful." Hero copy as in the TSX. Sign in stays in the header.
- Android is not mentioned anywhere on this landing (no notify form, no roadmap). Google Play comes when Android ships.
- Chat is not in the hero or the showcase until it ships in the public iOS app. Projects is not in the hero (not automatic).
- No pills in the hero copy; pills are fine inside the Topics card. No numbers in the Recap list. No invented key points, no lorem ipsum, no fake metrics or testimonials.
- Magazine section names are exactly "Sted's Picks", "The Recap", "Your Saves".
- Nav links (How it works / Why Sted / Download) are gone from the header.
- Favicon: keep the cream favicon from `1d69764`; Google just hasn't recrawled the home yet (commit `6f04a79` adds canonical + sizes + www sitemap; after deploy, request indexing in Search Console).

## 6. What is left

1. **Mobile/responsive pass** of the final hero. It works (no overflow at 390/768/1024, strip + stacked outputs), but nobody has done a design pass on it: card order in the strip, "Summary & Key Points" wraps in the narrow card, section spacing. Capture 390 and 768 before/after.
2. **Links** for the Kyoto (Instagram) and pour-over (YouTube) cards when Dante sends them; make them `<a>` like the other four.
3. **Final app screenshots** for the summary and feed states (`public/content/landing-4c/app/`, 715×1427, device frame baked in, transparent background). Optionally re-record `share.mp4` in light mode.
4. **Mascot poses** for "Steds in action" and the showcase floaters once approved.
5. **`APP_STORE_URL` / `SIGN_IN_URL`** in `app-links.ts` at launch: the badge and Sign in become real links automatically.
6. **Ship**: decide whether `/` becomes this landing (swap the route in `src/main.tsx`) or it stays internal; then deploy with `npx wrangler deploy` (only when Dante says so).
7. Optional: "fit to fold" scaling (scale by min(width, height)) so the hero always fits the first screen; dropping `@supabase/supabase-js` from the current site's waitlist for a `fetch` (saves 212KB there).

## 7. Working loop

```bash
cd sted-new-web-c
cp ../sted-new-web-b/.env .env        # Supabase URL + publishable key (only the current site's waitlist uses them)
npm install
npm run dev                            # http://localhost:5173/internal/landing-4c
npm run typecheck && npm run lint && npm run test && npm run build   # all four before calling anything done
```

Rules from `CLAUDE.md`: no subagents, verify cheaply, don't commit or deploy unless asked.

**Screenshots for evidence.** Headless Google Chrome hangs against the Vite dev server on Dante's Mac; Playwright works. Not a dependency of the repo; install it in a scratch folder:

```bash
mkdir -p /tmp/shots && cd /tmp/shots && npm init -y >/dev/null && npm i playwright
cat > shot.js <<'EOF'
// node shot.js <outPrefix> <url> <width,width,...> [full|fold]
const { chromium } = require('playwright');
(async () => {
  const [prefix, url, widths, mode = 'full'] = process.argv.slice(2);
  const browser = await chromium.launch();
  for (const w of widths.split(',').map(Number)) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : w < 1100 ? 768 : 982 } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${prefix}-${w}.png`, fullPage: mode === 'full' });
    await ctx.close();
  }
  await browser.close();
})();
EOF
node shot.js before "http://localhost:5173/internal/landing-4c?feature=summary" 1440,1512,390,768
```

Use `?feature=summary` so the showcase doesn't rotate between shots. Dante reviews on a 1440×780 fold: check that first.

## 8. Commit log of this branch

```
efd21cc output hierarchy, summary as placeholder lines, Sted higher
997dc16 tall output cards, renamed notes, smaller arrows
6f04a79 seo: canonical link, favicon.ico sizes, sitemap on the www host
0fa5ca3 final hero micro-adjustments (ribbons, alignment, rows/outputs -20%)
f4faeea hero refinement pass (header, 72px headline, copy, links, Phosphor, recap list)
f31f25a curved margin arrows
a582dd1 three outputs, notes repositioned
c1880ac subcopy, smaller badges, copy lifted
fb311e8 Websites card, repo card replaces the note
294d117 real-shaped cards and Phosphor icons
aa305ff compact the hero to fit a 1440x780 fold
f6d86b9 remove the top margin above the header
11b5e30 'Meanwhile, Sted is working.', no card implies chat
0e44475 rebuild the hero on the 'messy input' North Star composition
fa31e7b smaller copy column, straight line into Sted, fan out
aa3c5ac drop connector lines (superseded)
0d9f533 hero outcomes with pills, pain-first subcopy, share-sheet video
3ee8507 simplify and premiumize landing hero
ba1f61d docs: landing 4c review
ae0935c perf: route splitting, WebP, lazy images, Inter preload
a4ea11a a11y/conversion fixes
08ea811 reflow the hero below 1100px
570b4a2 hero rhythm and grid
b1006dd design tokens
```
