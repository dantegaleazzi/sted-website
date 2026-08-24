# Working agreements for this repo

## Keep verification cheap

- Don't spawn subagents for this project unless explicitly asked. It's a small single-repo site — do the work directly.
- When checking a change in the browser: call `preview_start` **once** per session, reuse that same `tabId`/`serverId` for every subsequent `navigate`/`computer`/`get_page_text` call. Do not call `preview_start` again just to load a different route or resize the viewport — that opens a new tab.
- Prefer `get_page_text` over `computer{screenshot}` to confirm content/copy is correct. Only take a screenshot when you actually need to judge something visual (layout, spacing, color, alignment) that text can't tell you.
- One screenshot per breakpoint you actually need (usually just desktop + mobile), not one per page/route/section.
- Don't re-verify things that didn't change. If you only edited copy in one component, you don't need to re-screenshot every page.

## Standard change loop

1. Make the edit.
2. `npm run typecheck && npm run lint && npm run test && npm run build` — all four, every time, before calling something done.
3. Only open the browser preview if the change is visually/behaviorally observable and worth confirming (per the rules above).
4. Do not commit or deploy (`npx wrangler deploy`) unless the user explicitly says to.

## Content/data changes (build log, guides)

The `/build` page and `/guides` are plain data arrays in `src/pages.tsx` / `src/guides.tsx` — no CMS. Adding a new day or guide is a data-only edit; it doesn't need a design review pass unless the visual system itself is changing.
