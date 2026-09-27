# Local links (review)

Start the dev server with the `sted-dev` entry in `.claude/launch.json` (`npm run dev`, port 5173).

| What | Link |
|---|---|
| Funnel, full page (the `/start` onboarding) | http://localhost:5173/start |
| Funnel as if coming from Pricing | http://localhost:5173/start?period=annual |
| Jump to the funnel's last screen ("Here it is in Sted." + See my plan) | http://localhost:5173/start?review=result |
| Landing | http://localhost:5173/ |
| Landing Pricing | http://localhost:5173/#pricing |
| Landing with the funnel as a modal (review surface) | http://localhost:5173/internal/funnel/c?open=1 |

"See my plan" and "Get Sted Pro" open the production RevenueCat funnel (`https://signup.cat/ZfSBmYBUIHRKvlzo/`). Its checkout is live Stripe: don't pay unless you mean to.
