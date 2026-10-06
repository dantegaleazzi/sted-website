/**
 * The Shipaton archive: the old guides, kept online for the Shipaton submission but out of search.
 * Reachable only by direct link: noindex (header in worker.ts, meta in the prerendered HTML), not in
 * the sitemap, llms.txt or IndexNow, and not linked from the site. Content lives in src/guides.tsx
 * (SHOW_SHIPATON_ARCHIVE in src/flags.ts). The build-in-public log stays off.
 */
export const ARCHIVE_PAGES: { path: string; title: string; description: string }[] = [
  { path: '/guides', title: 'Guides — Sted', description: 'Free resources from building Sted.' },
  { path: '/guides/build-an-app-in-24-hours', title: 'How to Build an App in 24 Hours with AI | Sted', description: 'The exact prompts and AI workflow used to turn a paper sketch into a working iPhone app using ChatGPT and Claude Code.' },
  { path: '/guides/how-to-choose-a-name', title: 'How to choose a name — Sted', description: 'A simple naming framework + the prompts I used to find Sted.' },
  { path: '/guides/app-store-review-checklist', title: 'Before Apple Reviews Your App — App Store Submission Checklist | Sted', description: '5 checks to run before submitting your iOS app to Apple, plus the exact ChatGPT and Claude prompts used to audit each one before submitting Sted.' },
]

export const ARCHIVE_PATHS = ARCHIVE_PAGES.map(page => page.path)
