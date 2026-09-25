# Sted conversational funnel (v2)

Branch `sted-pricing-pro` (started as `sted-funnel-v2`, from `290ec4d`). Funnel C's design (Sted talks to you in a bubble on every screen) with new questions and a real result. Code: `src/components/growth-funnel/ConversationalFunnel.tsx`. A and B stay in DEV for comparison.

## Flow

| # | Sted's bubble | Screen | Advances |
|---|---|---|---|
| 1 | "Hi, I'm Sted. I turn what you save into something useful." | **"You saved it for a reason."** + real saves fanned out (no video yet) | "Show me how" |
| 2 | "A few quick questions, so I can show you something useful." | **"What best describes you?"** Developer / Content creator / Founder / Student / Designer / Other | Tap |
| 3 | Reply to the persona ("A creator. Saving ideas for later is basically your job.") | **"Where do you save links from?"** Instagram / TikTok / YouTube / X / LinkedIn / Reddit / Pinterest / Spotify / Websites · A bit of everywhere · I'm just exploring | Continue |
| 4 | Reply to the places ("TikTok and YouTube. Lots of things worth keeping.") | **"And where do they end up?"** Notes app / Messages to myself / Browser bookmarks / Open tabs / Screenshots / Saved in each app / Notion or docs / Nowhere. I lose them | Continue |
| 5 | Reply to where they end up ("Texting links to yourself. A classic.") | **"What do you save things for?"** Work & projects / Learning / Creating content / Personal interests / A bit of everything | Continue |
| 6 | "Got it. I'll keep those together for you." | **"What would help most?"** Find things again fast / Remember what it was about / Get the key points without rereading | Tap |
| 7 | Per need ("Let me pull out the useful parts. Pick one and I'll save it.") | **"Pick one to save."** 2 real links per persona with real thumbnails; the ones from the places you picked come first | Tap |
| 8 | Per need ("Saved. The key ideas are right there. No rereading.") | **"Here it is in Sted."** The save in an iPhone frame: the real app screenshot | **"See my plan" → RevenueCat Funnel** |

The close button (×) is the only way out; there is no "get it free" link inside the funnel. No pricing screen of our own: RevenueCat owns plans and checkout.

## Real screenshots (pending from Dante)

Each example is a real public link. Save it in Sted on iPhone, open the item, screenshot, and drop the file (no bezel, portrait) in `public/content/funnel/screens/`, then set `screen` on that example in `funnel-content.ts`. Until then the funnel draws the same item layout from the example data.

| Persona | Links | Screenshot |
|---|---|---|
| Developer | github.com/karakeep-app/karakeep · x.com/shadcn/status/2087153563340325341 | pending |
| Content creator | x.com/thedankoe/article/2010751592346030461 · instagram.com/p/Dc0rlpZCAkC | Dan Koe ✓ (from the landing's app shot) · Osmo pending |
| Founder | revenuecat.com/blog/engineering/ios-in-app-subscription-tutorial-with-storekit-2-and-swift · firecrawl.dev | pending |
| Student | youtube.com/watch?v=-a0ecQMq-rM · developers.openai.com/blog/codex-as-a-platform | pending |
| Designer | uk.pinterest.com/pin/exterior-modern-style--7177680653110489 · open.spotify.com/episode/3Ac9iIUCIp25qHpDaNugZS | pending |
| Other | youtube.com/watch?v=UdvPCv4DJfg · instagram.com/p/DcgDDydsiqL | pending |

The drawn placeholders use short summaries written from each link's title and description; the real screenshots replace them.

## RevenueCat handoff: the only injection point

- `REVENUECAT_FUNNEL_URL` in `src/components/landing-4c/app-links.ts`: the production Web-to-App funnel `https://signup.cat/ZfSBmYBUIHRKvlzo/` (Offering `default`: paywall → Stripe checkout → "Redeem Now" redemption link that opens the app).
- `buildPlanUrl()` in `funnel-session.ts` adds the visitor's UTMs plus `sted_session_id`, `persona`, `sources`, `storage`, `purpose`, `need`, `example`, and `period` when the visitor came from the landing Pricing (`/start?period=annual|monthly`). No `app_user_id`, email or other personal data: RevenueCat creates an anonymous user.
- RevenueCat reads UTMs automatically. The other parameters only reach RevenueCat's analytics and branching once they're registered in the Funnel Editor → Settings → Parameters (strings; `sources`, `storage`, `purpose` are comma-separated lists).
- If the URL were ever missing, "See my plan" says plans aren't available and logs a console error; it never builds a checkout URL by hand.

## Session and events

Random per-tab `sted_session_id`, UTMs kept for the session. Events: `funnel_started`, `step_viewed`, `persona_selected`, `sources_selected`, `storage_selected`, `purpose_selected`, `need_selected`, `example_selected`, `result_viewed`, `plan_clicked`, `funnel_closed`. Stored in sessionStorage, broadcast as a `sted:funnel` DOM event, and sent to Supabase only when `VITE_FUNNEL_EVENTS_TABLE` is set after the backend owner applies `docs/funnel-events.sql`.

## Routes

- `/internal/funnel` and `/internal/funnel/c`: landing + modal (`?open=1` opens it, `?review=result` jumps to the result). Also `/` in the funnel-preview build.
- `/start`: the same funnel as a full page (for social links, ads and the landing's "Get Sted Pro"). Live in every build.
- `/internal/funnel/a`, `/b`: the older prototypes, DEV only.

## Open before launch

1. Register the custom parameters in the RevenueCat funnel (see above).
2. The 11 remaining iPhone screenshots.
3. Apply `docs/funnel-events.sql`, set `VITE_FUNNEL_EVENTS_TABLE`, and mention anonymous funnel answers in the privacy policy.
4. The landing Pricing (white Sted Pro card + "Sted is free, forever" footer) reads prices ($9.99 / $12.99 / $79.99) and capacities from `funnel-pricing.ts`; keep it in sync with RevenueCat. Its "Get Sted Pro" goes to `/start?period=…`.
