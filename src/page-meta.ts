import { ARCHIVE_PAGES } from './archive-paths'
import { COMPARE_PAGES } from './components/compare/compare-paths'

/**
 * Title and description of each page besides the landing (the landing's live in index.html). The
 * build-time prerender writes them into each page's HTML, so crawlers and link previews get the right
 * ones; the pages set them again in the browser.
 */
export const PAGE_META: Record<string, { title: string; description: string }> = {
  ...Object.fromEntries(ARCHIVE_PAGES.map(page => [page.path, { title: page.title, description: page.description }])),
  ...Object.fromEntries(COMPARE_PAGES.map(page => [page.path, { title: page.title, description: page.description }])),
  '/about': { title: 'About Sted | Everything you save, finally useful', description: 'Sted is an iPhone app that reads what you save, writes the summary and key ideas, sorts it into topics, and lets you ask about any of it.' },
  '/contact': { title: 'Contact Sted | Get in touch', description: 'Questions, ideas or feedback about Sted? Contact the team at hello@sted.ai.' },
  '/support': { title: 'Sted Support | Get help with your account', description: 'Get help with your Sted account, report a bug or send another support request.' },
  '/privacy': { title: 'Privacy Policy | Sted', description: 'Learn how Sted and Finiks Labs LLC process saved content, Chat conversations, optional AI features, retention, deletion, and privacy rights.' },
  '/terms': { title: 'Terms of Use | Sted', description: 'Read the Terms of Use for Sted, including saved content, Sted Chat, AI-enabled features, subscriptions, acceptable use, and user responsibilities.' },
  '/delete-account': { title: 'Delete your Sted account', description: 'How to delete your Sted account and the data linked to it, from the app or by email.' },
  '/how-to-use': { title: 'How to use Sted | Guide', description: 'How to use Sted in seven steps: save from any app, read the summary and key ideas, see what matters in The Recap, ask Sted about anything you saved, and go Pro.' },
  '/pocket-alternative': { title: 'Pocket alternative: Sted, the app that reads what you save', description: 'Pocket shut down in 2025. Sted is a free iPhone app that saves links, posts, videos and podcasts from any app, then gives you the summary, the key ideas, The Recap and a chat with everything you saved.' },
  '/start': { title: 'Sted — Get started', description: 'Tell Sted what you save and see what it does with it. Start free, or go Pro.' },
}
