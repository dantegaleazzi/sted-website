/**
 * Every comparison page: its path, title and description. Kept apart from the page content so the
 * router, the Worker (PUBLIC_PAGES, sitemap) and the page metadata can list them without loading
 * the pages. compare.test.ts checks that each path here has its content in compare-data.ts.
 */
import { SHOW_COMPARE_PAGES } from '../../flags'

export type ComparePage = { path: string; kind: 'hub' | 'vs' | 'alternative' | 'best'; slug: string; title: string; description: string }

const YEAR = '2026'

const COMPETITOR_PAGES: { slug: string; name: string; vsDescription: string; altDescription: string }[] = [
  {
    slug: 'recall', name: 'Recall',
    vsDescription: 'Sted vs Recall, compared honestly: platforms, free plans, prices, AI summaries and chat. When Recall is the better pick, and when Sted is.',
    altDescription: 'Looking for a Recall alternative? An honest look at Sted and other options for saving and summarizing what you find, with prices checked in October 2026.',
  },
  {
    slug: 'mymind', name: 'mymind',
    vsDescription: 'Sted vs mymind, compared honestly: what each one saves, AI features, platforms and prices. When mymind is the better pick, and when Sted is.',
    altDescription: 'Looking for a mymind alternative? An honest look at Sted and other options, from free plans to visual inspiration boards, with prices checked in October 2026.',
  },
  {
    slug: 'raindrop', name: 'Raindrop.io',
    vsDescription: 'Sted vs Raindrop.io, compared honestly: bookmarks vs saves that get read for you, platforms, AI and prices. When Raindrop is the better pick, and when Sted is.',
    altDescription: 'Looking for a Raindrop.io alternative? An honest look at Sted and other options for saving links, posts and videos, with prices checked in October 2026.',
  },
  {
    slug: 'readwise-reader', name: 'Readwise Reader',
    vsDescription: 'Sted vs Readwise Reader, compared honestly: deep reading and highlights vs saves that get read for you. Platforms, AI and prices.',
    altDescription: 'Looking for a Readwise Reader alternative? An honest look at Sted and other options, from free plans to read-later apps, with prices checked in October 2026.',
  },
  {
    slug: 'matter', name: 'Matter',
    vsDescription: 'Sted vs Matter, compared honestly: a beautiful reading app vs an app that reads your saves for you. Platforms, AI and prices.',
    altDescription: 'Looking for a Matter alternative? An honest look at Sted and other read-later options, including ones that work on Android, with prices checked in October 2026.',
  },
]

const BEST_PAGES: { slug: string; title: string; description: string }[] = [
  { slug: 'app-to-save-instagram-reels', title: `The best app to save Instagram reels (${YEAR})`, description: 'Instagram’s Saved folder, Sted, Recall and mymind compared for saving reels and posts you actually want to come back to. Honest picks, checked October 2026.' },
  { slug: 'app-to-summarize-youtube-videos', title: `The best app to save and summarize YouTube videos (${YEAR})`, description: 'Watch Later, Sted, Recall, Readwise Reader and Raindrop compared for saving YouTube videos and getting what’s in them without rewatching. Honest picks.' },
  { slug: 'read-later-app-for-iphone', title: `The best read-later app for iPhone (${YEAR})`, description: 'Safari Reading List, Instapaper, Matter, Readwise Reader and Sted compared, now that Pocket is gone. Which read-later app fits how you save. Honest picks.' },
  { slug: 'app-to-save-tiktoks', title: `The best app to save TikToks for later (${YEAR})`, description: 'TikTok Favorites, Sted and Recall compared for saving TikToks you want to remember, not just rewatch. Honest picks, checked October 2026.' },
  { slug: 'app-to-save-podcast-episodes', title: `The best app to save podcast episodes and remember them (${YEAR})`, description: 'Your podcast app’s saved episodes, Sted and Recall compared for keeping the episodes worth remembering and what was said in them. Honest picks.' },
  { slug: 'app-to-plan-trips-from-saved-posts', title: `The best app to plan a trip from the posts you saved (${YEAR})`, description: 'Instagram collections, Google Maps lists and Sted compared for turning saved travel posts and reels into an actual plan. Honest picks.' },
  { slug: 'bookmark-app-for-students', title: `The best bookmark app for students (${YEAR})`, description: 'Sted, Recall, Raindrop.io and Readwise Reader compared for students saving articles, videos, posts and PDFs. Free plans first. Honest picks.' },
  { slug: 'app-to-save-inspiration-for-creators', title: `The best app for creators to save inspiration (${YEAR})`, description: 'Instagram collections, mymind, Raindrop.io and Sted compared for content creators saving reels, posts and ideas to use later. Honest picks.' },
]

/** Every comparison page, published or not (the content test checks them all). */
export const ALL_COMPARE_PAGES: ComparePage[] = [
  { path: '/compare', kind: 'hub', slug: '', title: 'Sted vs other apps: honest comparisons and guides', description: 'Honest comparisons of Sted with Recall, mymind, Raindrop.io, Readwise Reader and Matter, and guides to the best apps for saving reels, videos, podcasts and more.' },
  ...COMPETITOR_PAGES.map(c => ({ path: `/vs/${c.slug}`, kind: 'vs' as const, slug: c.slug, title: `Sted vs ${c.name}: honest comparison (${YEAR})`, description: c.vsDescription })),
  ...COMPETITOR_PAGES.map(c => ({ path: `/alternatives/${c.slug}`, kind: 'alternative' as const, slug: c.slug, title: `The best ${c.name} alternative for iPhone (${YEAR})`, description: c.altDescription })),
  ...BEST_PAGES.map(b => ({ path: `/best/${b.slug}`, kind: 'best' as const, slug: b.slug, title: b.title, description: b.description })),
]

/** The ones the site serves: none while SHOW_COMPARE_PAGES is off. */
export const COMPARE_PAGES = SHOW_COMPARE_PAGES ? ALL_COMPARE_PAGES : []

export const COMPARE_PATHS = COMPARE_PAGES.map(page => page.path)

export function comparePage(pathname: string): ComparePage | undefined {
  const path = pathname.replace(/\/$/, '') || '/'
  return COMPARE_PAGES.find(page => page.path === path)
}
