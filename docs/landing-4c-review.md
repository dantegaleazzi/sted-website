# Landing 4c review — findings, prototypes and open questions

Branch: `sted-new-web-c` (from `sted-new-web-b` @ `ad9011b`). Route: `/internal/landing-4c`.
Reviewed as a first-time visitor and as a designer/engineer at 1440, 1512, 1920, 1024, 768 and 390px.
Screenshots referenced below live in `docs/landing-4c-audit/` (`0-ad9011b-*` is the starting point, `5-ae0935c-*` is the end of this branch; intermediate numbers are the state after each commit).

Contents

1. [Verdict in one paragraph](#1-verdict)
2. [Findings ranked by impact](#2-findings-ranked-by-impact)
3. [What was prototyped (one commit each, before/after)](#3-prototyped-on-this-branch)
4. [Mobile composition proposal](#4-mobile-composition-proposal)
5. [Proposals that touch "already decided" items](#5-proposals-that-touch-already-decided-items)
6. [Open questions for Dante](#6-open-questions-for-dante)
7. [Method and measurements](#7-method-and-measurements)

---

## 1. Verdict

The desktop hero does its job: within five seconds a visitor reads *save things → Sted → projects, chat, summaries, topics* and sees the App Store badge twice. The page is short, honest and on-brand. The problems are below the surface: the hero is a fixed 1600px canvas that becomes a postage stamp on anything narrower than a laptop (14px title on a phone), there is a quarter-screen of empty cream between the hero and the first section, colours and type sizes are hardcoded and drift from the design system, the Android "notify" flow files sign-ups where they cannot be found again, and the landing route ships the whole old site (709KB of JavaScript, including framer-motion and the tunnel fixtures) to render a page that needs none of it. All of these are fixed on this branch; what remains are product decisions listed in §6.

## 2. Findings ranked by impact

Effort: S = under an hour, M = half a day, L = more than a day. "Status" says whether this branch already prototypes the fix.

### F1. Below ~1100px the hero is unreadable (Responsive) — Impact: critical, Effort: M, Status: fixed (commit 3)

**Problem.** The hero is a 1600×790 canvas scaled by `transform: scale(100cqw / 1600px)`. Everything in it, including the header and the CTA, shrinks with the viewport. There is no reflow at all.

**Evidence** (`0-ad9011b-390.jpg`, `before-1024.jpg`, `before-768.jpg`; measured with `getBoundingClientRect` × scale):

| Viewport | Hero title | Nav links | Subcopy | App Store badge height |
|---|---:|---:|---:|---:|
| 1512 | 58.6px | 14.7px | 18.3px | 53px |
| 1024 | 39px | 9.8px | 12.2px | 35px |
| 390 | **14.3px** | **3.6px** | **4.5px** | **13px** |

Apple's badge guidelines require a minimum height of 40px. At 390px the entire hero, including the primary CTA, is 177px tall.

**Fix.** Keep the canvas above 1100px (title is still ~48px effective there) and reflow the same DOM into a stacked composition below it. See §4 for the composition.

### F2. Dead space between the hero and the first section (Rhythm) — Impact: high, Effort: S, Status: fixed (commit 2)

**Problem.** The canvas is 790px tall but its last element (the Starter Story card / tagline) ends at ~y=690 in canvas units. Add the showcase's `margin-top: 150px` and the first section title sits 250px (1512) to 370px (1920) below the last hero element. It reads as "the page ended".

**Evidence.** `0-ad9011b-1512.jpg`: last hero element bottom y=646, showcase title y=897. On `before-1920.jpg` the gap is the height of the hero copy column.

**Fix.** Canvas 790 → 720 (content still has 20–30px of air), hero copy nudged 12px up to keep its optical centre with the larger title, every section gap on the 128px spacing token. Gap now 172px at 1512 (`2-570b4a2-1512.jpg`).

### F3. Hardcoded colours and sizes, off-system values (Design system) — Impact: high, Effort: S, Status: fixed (commit 1)

**Problem.** Both stylesheets and the TSX repeat `#141313`, `#FCF3EB`, `#FFD400`, ad-hoc `rgba(20,19,19,0.xx)` greys (0.26, 0.34, 0.5, 0.55, 0.6, 0.62, 0.66, 0.68, 0.72) and three different card shadows. Specific drift from `sted-design-new/design-system.md`:

- Purple tint is `#B79CF2`; the official Supportive Purple is `#C998FA`.
- Hero title is 64px; the system's hero display is 72–96px (desktop) and 44–56px (mobile).
- Section H2 jumps from 52px to 38px at exactly 1100px instead of scaling.
- Secondary text uses eight different ink opacities instead of Text secondary `#6F6D69`.
- Shadows are three hand-rolled variants, none of them the token values.

**Fix.** `src/components/landing-4c/landing-4c-tokens.css` declares the subset of the shared tokens (same names, same values) scoped to `.l4c-page`, so it can be replaced by the shared `tokens.css` when the whole site adopts it. Hero title on the display size (72px, flagged in §5), H2 and final title on fluid clamps.

### F4. Android sign-ups cannot be found again, and the copy over-promises (Conversion) — Impact: high, Effort: S, Status: fixed (commit 4)

**Problem.** `joinWaitlist` inserts into the same `waitlist` table as the original waitlist with `source = ?ref` (usually `null`). An Android sign-up and a 2025 waitlist sign-up are indistinguishable, so there is no way to email "everyone who asked about Android". The success message says "We'll email you when Android is ready" but nothing sends any email: the insert is the whole flow.

**Fix.** `source` is now `android` (or `android:<ref>` when a `?ref=` is present); the copy says "We'll let you know", which is a promise Dante can keep manually; the code comment states that no email is sent. The hero modal and the final section share one `AndroidNotify` component (previously two copies of the same state machine). See Q2 in §6 about the column.

### F5. Four dead links in the tab order (Accessibility) — Impact: medium, Effort: S, Status: fixed (commit 4)

**Problem.** `AppStoreBadge` (×3) and `SignInLink` render `<a href="#">` with `preventDefault` while their URLs are pending. Keyboard and screen-reader users reach four links that do nothing and announce "link, Download on the App Store".

**Fix.** While the URL is `null` they render as `<span>` (badge keeps its `alt`, Sign in gets `aria-disabled`). They become real links the moment `APP_STORE_URL` / `SIGN_IN_URL` are set; nothing else changes.

### F6. Contrast (Accessibility) — Impact: medium, Effort: S, Status: partly fixed (commit 4), rest is a brand decision

Measured WCAG ratios:

| Pair | Ratio | Verdict |
|---|---:|---|
| Sted Yellow `#FFD400` on Cream (hero "Finally useful.", final "Make it useful.") | **1.31:1** | Fails even the 3:1 large-text bar |
| Inactive showcase item title (ink at 0.56 opacity on cream) | 4.11:1 | Fails AA for 19px/600 → **fixed**: 0.72 opacity = 7.1:1 |
| Muted text `#6F6D69` on cream | 4.71:1 | AA |
| Ink at 0.62 on white (card domains, meta) | 5.17:1 | AA |
| Input placeholder (ink at 0.4 on white) | 2.58:1 | Placeholder only, label carries meaning |
| Result-row caret (ink at 0.34) | 2.19:1 | Decorative |

The yellow text is the brand's one yellow moment and the sentence still reads without it ("Everything you save." / "You saved it for a reason."), so it is defensible, but it is not accessible text. The design system's accessible pairing is Ink on Yellow (12.96:1). See §5 (P2) for the alternative.

### F7. The landing route ships the whole old site (Performance) — Impact: medium-high, Effort: S, Status: fixed (commit 5)

**Problem.** `main.tsx` statically imports every route, so `/internal/landing-4c` downloads one 709KB JS bundle (209KB gzip) containing framer-motion, the content tunnel, the source-card fixtures and 12 "temporary-*" SVGs it never renders. `index.html` preloads Libre Baskerville (34KB), which no page uses, and does not preload Inter, which every page uses. Hero photos are 640–1200px JPEGs rendered at 119–162px (268KB for a 153×55 thumbnail).

**Evidence.** Build output before: `index-*.js 709.22 kB`. Network log of the landing route lists `framer-motion.js`, `StedContentTunnel.css`, `portal-fixtures.ts`, `temporary-*.svg` (13 files).

**After (commit 5).**

| | Before | After |
|---|---:|---:|
| JS for the landing route | 709KB (209KB gz), 1 chunk | 427KB (123KB gz): entry 194 + supabase 212 + landing 21 |
| Landing images folder | 944KB | 152KB (WebP at 2× rendered size) |
| Font preload | Libre Baskerville (unused) | Inter |
| Below-fold images | eager | `loading="lazy"`, `decoding="async"` |
| Intrinsic sizes on rasters | phone shots only | all |

The remaining 212KB is `@supabase/supabase-js`, loaded only to run one `INSERT`. Replacing it with a `fetch` to the PostgREST endpoint would make the landing a ~215KB route. Not done here because it changes the production insert path and cannot be verified without writing real rows (Q3).

LCP candidate at 1512 is the hero title (text, Inter preloaded now). No layout shift: the hero is absolutely positioned inside a fixed-ratio box and every raster now has width/height.

### F8. Three content widths on one page (Visual consistency) — Impact: medium, Effort: S, Status: fixed (commit 2)

Hero canvas 1600px with 64px margins, sections `max-width: 1568px` + 64px padding (16px narrower than the hero on each side), footer `.shell` at 1160px. On `before-1920.jpg` the hero title, the "Save it." title and the footer logo start at three different x positions. Now all three share the 1600/64 grid.

### F9. Duplicate headline (Narrative / SEO) — Impact: medium, Effort: S, Status: proposal only (copy decision)

The "Steds in action" section's H2 is "Everything you save. Finally useful." — the H1, verbatim. The section's real message is "Sted does things for you while you get on with your day". Suggested H2s: "Sted, on your side." / "Meanwhile, Sted is working." / "What Sted does while you're away." The final CTA already paraphrases the H1 ("You saved it for a reason. Make it useful."), which is the right amount of echo.

### F10. "Steds in action" is placeholder art four times over (Visual) — Impact: medium, Effort: S once assets exist, Status: waiting on assets, but see Q1

Four identical neutral mascots with a pastel icon glued at the hip. The design-system rule is "one expression per composition; props never deform the body". Note that `sted-design-new/assets/mascot/poses/` already contains 15 pose SVGs (reading/glasses, searching/magnifier, organizing/folder, listening/headphones, idea/sparkle…), status PROPOSED. If Dante approves any of them, this section and the floating Steds around the phone are a one-line swap each.

### F11. Two Android forms plus a modal (Narrative) — Impact: low-medium, Effort: S, Status: proposal

The hero's "Get notified" opens a modal with the same form that is 2,300px lower in the final section. A modal for a single email field is heavy; the link could simply scroll to `#download` (the final section, which already has the form and the App Store badge). Keeping both is fine for launch, but it is one more surface to maintain. Left as-is because the modal is part of the approved hero.

### F12. Hero canvas is fragile to content changes (Code) — Impact: medium, Effort: L, Status: documented, not changed

Every card and row inside the illustration is absolutely positioned in a 1040×620 box that is scaled by 0.94038 inside a 1600×720 box that is scaled by the container width. Changing one card's copy or adding a row means re-tuning `top`/`left` by hand at three levels of nesting. It faithfully reproduces the approved 4c composition, so this is the right tool for *this* hero, but treat the illustration as an image: do not extend it. If the hero ever needs to change, a flex/grid layout for the results column (which is a plain list) and a small "scatter" grid for the cards would cut the coordinate count from ~30 to ~8.

### F13. Reduced motion and focus (Accessibility) — Impact: low, Status: mostly fine

The showcase honours `prefers-reduced-motion` (no auto-advance, no transitions) and the `html:has(.l4c-page)` smooth-scroll is disabled under it. Hero and other sections have no motion. Global focus outline (ink, 4px offset) exists; commit 4 adds explicit `:focus-visible` rings on the notify button, the inline "Get notified" button and the secondary CTA which had none. Heading order is H1 → H2 → H2 → H2 (modal H2 only when open); fine. Result rows and card titles inside the illustration are real text, so screen readers read a coherent list ("Projects, Sted launch, AI Agents…"), which is acceptable.

### F14. Hero subtitle chips wrap awkwardly (Visual) — Impact: low, Effort: S, Status: proposal

"Save [links] [posts] [videos] [podcasts] and [notes]." wraps so that "and" lands alone on the second line at 1440–1600 (`before-1440.jpg`). Setting the chip group to `white-space: nowrap` per chip is already done; the fix is a `<br>` before "and" or a slightly narrower copy width so the break is deliberate. Cosmetic; left for the copy pass.

### F15. Miscellany (Code) — Status: fixed in passing

- `SHOW_BUILD_IN_PUBLIC` lived in `pages.tsx`, so the footer (used by the landing) pulled in the tunnel and its fixtures. Moved to `src/flags.ts`.
- `src/assets/sted-mascot.svg` and `public/sted-mascot.svg` are byte-identical; only the public one is used by the landing. Not removed (the old site imports the asset one).
- The 4c stylesheet header still said "Internal-only … mobile composition intentionally deferred". Updated.

## 3. Prototyped on this branch

Each commit passes `npm run typecheck && npm run lint && npm run test && npm run build`. Screenshots: `docs/landing-4c-audit/<n>-<sha>-1512.jpg` and `-390.jpg`; the "before" of commit n is the "after" of commit n−1.

| # | Commit | Change | Before → After |
|---|---|---|---|
| 1 | `b1006dd` refactor: adopt Sted design tokens and type scale | F3 | `0-ad9011b-*` → `1-b1006dd-*` (72px title, official purple in the third tile; otherwise pixel-close by design) |
| 2 | `570b4a2` feat: trim hero dead space and align section rhythm | F2, F8 | `1-b1006dd-1512` → `2-570b4a2-1512` (hero 723→666px tall at 1512, gap 251→172px, sections/footer on one grid) |
| 3 | `08ea811` feat: reflow the hero below 1100px | F1 | `2-570b4a2-390` → `3-08ea811-390`; also `before-768/1024` → `after-768/1024` |
| 4 | `a4ea11a` fix: honest Android notify flow, no dead links, contrast | F4, F5, F6 | `3-08ea811-*` → `4-a4ea11a-*`; modal: `after-modal-1512.jpg`, `after-modal-390.jpg` |
| 5 | `ae0935c` perf: split routes, WebP, lazy images, Inter preload | F7, F15 | visually identical; numbers in F7 |

Verified in the browser after commit 5: home `/`, `/privacy`, `/internal/landing-4c`, `/internal/landing-4c/states` and `?feature=` pins all render; the landing's network log no longer contains framer-motion, the tunnel or fixtures; the modal opens with focus in the field and closes on Escape; no horizontal scroll at 390/768/1024.

Not exercised: the Supabase insert itself (it writes to the production table).

## 4. Mobile composition proposal

Implemented in commit 3 as the `@media (max-width: 1099px)` block of `Landing4CPreview.css`; this is the reasoning.

**Principle** (design-system.md §9): remove props and flow lines before removing the main content. The hero's main content is the three-beat story *saves → Sted → results*; the connectors and the "Your knowledge. Organized." tagline are flow lines.

**Stack, top to bottom**

1. **Header**: logo + App Store badge (40px, Apple's minimum). Nav links hidden (they are in-page anchors for a page that is now one thumb-scroll). "Sign in" hidden under 480px because it is pending anyway; it returns at tablet width.
2. **Copy**: title on the mobile display size (44–56px, 47px at 390), subcopy 17px, badge 56px + "See how it works", Android line. Max width 560px so tablets don't get 40-word lines.
3. **Saves strip**: the six cards at their natural size, un-rotated, in a horizontal snap-scroll strip (edge-to-edge, hidden scrollbar). On tablets (≥640px) it wraps and centres instead of scrolling. This keeps the real thumbnails, which are the point of the illustration, at readable size.
4. **Sted**: the badge, centred, 104px.
5. **Results**: the four rows full-width, stacked (two columns from 640px), chips wrapping.

**Below the hero**: same 20px (phone) / 32px (tablet) gutters; showcase stacks copy over the phone stage (stage 440px on phones, phone image 400px); "Steds in action" becomes a swipeable strip of 240px cards on phones instead of four stacked 240px-tall tiles (the old mobile fallback made that section 1,480px tall); the final CTA's badge card and title scale down.

**Result**: 390px page goes from 4,416px to 3,906px tall while the hero grows from 177px to ~1,300px of readable content. Phone title 47px, badges 40/56px, no horizontal overflow.

**Not done**: a bespoke mobile illustration (e.g. a single composite image). The reflow reuses the desktop DOM so the content stays real and editable; if the final art direction wants something more composed on phones, that is an M-size follow-up.

## 5. Proposals that touch "already decided" items

Flagged, not applied, except P1 which is applied and easy to revert.

- **P1 (applied in commit 1): hero title 64px → 72px.** The approved composition was built at 64px; the design system says 72–96px. 72px fits the 480px copy column with the same three line breaks and the copy column was nudged 12px up so the block's optical centre is unchanged. If the 64px is a deliberate part of the 4c approval, revert the one line in `Landing4CPreview.css` (`.l4c-copy h1 { font-size: 72px }` → `64px`) and `top: 168px` → `180px`.
- **P2: yellow text vs. yellow highlight.** "Finally useful." and "Make it useful." in `#FFD400` on cream are 1.31:1. The system's accessible yellow moment is Ink on Yellow. Alternative that keeps the single yellow moment: ink text with a yellow marker-style highlight behind "Finally useful." (`background: var(--sted-yellow); box-decoration-break: clone; padding: 0 .12em`). It changes the hero's look, so it is Dante's call.
- **P3: "Steds in action" headline** (F9) duplicates the H1.
- **P4: the hero "Get notified" modal** (F11) could become a scroll link to `#download`.

## 6. Open questions for Dante

1. **Mascot poses.** `sted-design-new/assets/mascot/poses/svg/` has 15 PROPOSED poses (reading, searching, organizing, listening, idea…). Are any approved enough to use for "Steds in action" and the floaters, or are the variants "being drawn" a different set?
2. **`waitlist.source` semantics.** Commit 4 writes `android` / `android:<ref>` into `source`. Is anything downstream (a dashboard, an export) reading `source` as the `?ref` campaign value? If so, prefer a dedicated `list` column and I'll adjust the insert.
3. **Supabase for one insert.** Is dropping `@supabase/supabase-js` on the landing (a `fetch` to `/rest/v1/waitlist` with the publishable key) acceptable? It removes 212KB (55KB gzip) from the route but needs one test insert against the real table to verify the 409-duplicate handling.
4. **Who emails the Android list, and when?** The copy now promises "we'll let you know". There is no automation; is a manual send from the Supabase export the plan, or should a confirmation email exist before launch?
5. **Yellow text (P2).** Keep the brand moment as yellow text (1.31:1) or switch to ink-on-yellow highlight?
6. **Hero title at 72px (P1).** Keep or revert to the approved 64px?
7. **Nav on mobile.** Hidden below 1100px in the prototype. Do you want a compact menu, or is a landing with no nav on phones fine (it is one scroll long)?
8. **"Sign in" before the dashboard exists.** It currently renders as inert text with a tooltip. Show it now, or hide it until `SIGN_IN_URL` exists?
9. **Section headline for "Steds in action"** (F9): pick one of the suggestions or keep the echo.
10. **`?ref` attribution.** The old site stored `?ref` for the general waitlist. Should the App Store badge also carry a campaign token (`?pt=…&ct=…` on the App Store URL) once the URL exists, so installs from this page are attributable?

## 7. Method and measurements

- Dev server: the branch's own worktree (`sted-new-web-c`), Vite on a free port; `.env` copied from the `sted-new-web-b` worktree.
- Measurements: `getBoundingClientRect()` and computed styles via the in-app browser at 1512×982, 1024×768 and 390×844; effective font sizes = CSS size × rendered scale of the canvas.
- Screenshots: Playwright (Chromium 1243) full-page captures at 390, 768, 1024, 1440, 1512, 1920; the page is scrolled before capture so lazy images load. Stored at 50% (desktop) and 100% (phone) as JPEG q82.
- Contrast: WCAG 2.x relative-luminance formula; translucent inks composited on cream/white first.
- Bundle sizes: `npm run build` output (Vite/rolldown, minified, gzip column as reported).
- Checks run after every commit: `npm run typecheck && npm run lint && npm run test && npm run build`. All green at `ae0935c`.
