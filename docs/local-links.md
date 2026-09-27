# Local links (review)

Start the dev server with the `sted-dev` entry in `.claude/launch.json` (`npm run dev`, port 5173).

## Landing (Pro launch)

| What | Link |
|---|---|
| Landing: founding bar on top, "See how it works" opens the short onboarding | http://localhost:5173/ |
| Pricing: founding offer + Free vs Pro | http://localhost:5173/#pricing |
| Roadmap | http://localhost:5173/#roadmap |

## Full-page funnel (`/start`, for ads)

| What | Link |
|---|---|
| Funnel, full page | http://localhost:5173/start |
| Funnel as if coming from Pricing | http://localhost:5173/start?period=annual |
| Jump to the funnel's last screen ("Here it is in Sted." + See my plan) | http://localhost:5173/start?review=result |
| Landing with the funnel as a modal (review surface) | http://localhost:5173/internal/funnel/c?open=1 |

## Founding offer switch

- `FOUNDING_FUNNEL_URL` in `src/components/landing-4c/app-links.ts`. While it's `null`, the offer (bar, $79.99 → $19.99, "Get Sted Pro · $19.99") shows **only in DEV and the preview build**; production shows the regular prices and sends every CTA to the regular funnel.
- Paste the RevenueCat founding funnel link there to turn it on. Set it back to `null` (and disable that funnel in RevenueCat) when the 100 spots are gone.
- Terms live in `src/components/growth-funnel/founding-offer.ts` ($19.99 first year, 100 spots). The roadmap is `src/components/landing-4c/roadmap.ts`.

The regular funnel is `https://signup.cat/ZfSBmYBUIHRKvlzo/`. Its checkout is live Stripe: don't pay unless you mean to.
