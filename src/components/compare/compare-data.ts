import { foundingTerms } from '../growth-funnel/founding-offer'
import { PLAN_CAPACITY } from '../growth-funnel/funnel-pricing'

/**
 * Content of the comparison pages (/vs, /alternatives, /best). Rules: every fact about another app
 * comes from that app's own site (listed in `sources`) and is dated by CHECKED; say plainly where
 * the other app is better; never claim something about Sted that isn't live. Sted's prices and limits
 * come from the same modules as Pricing.
 */
export const CHECKED = 'October 2026'
export const UPDATED = 'October 3, 2026'

const n = (value: number) => value.toLocaleString('en-US')
const offer = foundingTerms()
const free = PLAN_CAPACITY.free

export const STED = {
  platforms: 'iPhone today; a web app, Android and browser extensions are on the way',
  free: `Up to ${n(free.saves)} saves and ${n(free.aiSavesPerMonth)} AI summaries a month`,
  paid: `Pro: ${offer.price}/year founding price for the first 100 members (regular ${offer.regular}/year)`,
  saves: 'Links from any app: posts, reels, videos, podcasts, articles and repos',
  ai: 'Every save gets a summary, key ideas and topics, automatically',
  chat: 'Ask Sted: chat with everything you saved, with the saves each answer is based on',
  recap: 'The Recap, put together every 10 saves',
  privacy: 'Doesn’t sell what you save or use it for ads',
  price: `Free; Pro ${offer.price}/year (founding)`,
  worksOn: 'iPhone',
} as const

export type Row = { feature: string; them: string; sted: string }
export type Faq = { question: string; answer: string }

export type Competitor = {
  slug: string
  name: string
  site: string
  /** One sentence: what the app is, in its own terms. */
  is: string
  rows: Row[]
  theyWin: string[]
  stedWins: string[]
  chooseThem: string
  chooseSted: string
  /** Honest reasons people look for something else. */
  whySwitch: string[]
  stayIf: string
  others: { name: string; slug?: string; why: string }[]
  faq: Faq[]
  sources: string[]
}

export const COMPETITORS: Competitor[] = [
  {
    slug: 'recall',
    name: 'Recall',
    site: 'https://www.recall.it',
    is: 'Recall saves and summarizes articles, videos, podcasts, social posts and PDFs, then connects them in a knowledge base you can chat with and quiz yourself on.',
    rows: [
      { feature: 'Works on', them: 'iOS, Android, web and browser extensions', sted: STED.platforms },
      { feature: 'Free plan', them: 'Unlimited saves, 10 AI summaries a month', sted: STED.free },
      { feature: 'Paid plans', them: 'Plus: $10/month billed yearly. Max: $38/month billed yearly', sted: STED.paid },
      { feature: 'What it saves', them: 'Articles, YouTube, TikTok, Instagram, X, Reddit, LinkedIn, podcasts, PDFs, Google Docs', sted: STED.saves },
      { feature: 'AI on each save', them: 'Summaries (unlimited on Plus) and smart tags', sted: STED.ai },
      { feature: 'Chat with your saves', them: 'Personal AI chat (Plus)', sted: STED.chat },
      { feature: 'Bringing saves back', them: 'Spaced-repetition quizzes and a knowledge graph (Plus)', sted: STED.recap },
      { feature: 'PDFs and documents', them: 'Yes', sted: 'Not yet: screenshots, PDFs, notes and docs are up next' },
      { feature: 'Import from Pocket or bookmarks', them: 'Yes, up to 1,000', sted: 'Not yet' },
    ],
    theyWin: [
      'It works everywhere: phone, web and browser extensions. Sted is iPhone-only today.',
      'It handles more than links: PDFs, Google Docs and Markdown notes, plus imports from Pocket and your bookmarks.',
      'It’s built for studying, with spaced-repetition quizzes and a knowledge graph that connects what you saved.',
    ],
    stedWins: [
      `Price: Sted Pro is ${offer.price} a year at the founding price. Recall Plus is $10 a month, billed yearly.`,
      `A bigger free plan for AI: ${n(free.aiSavesPerMonth)} summaries a month on Sted, 10 on Recall.`,
      'It’s built around your phone and the share sheet, and The Recap brings your best saves back every 10 saves without you scheduling anything.',
    ],
    chooseThem: 'You need it on your computer as well as your phone, you save a lot of PDFs and documents, or you want quizzes to study what you saved.',
    chooseSted: 'You save mostly from your iPhone (posts, reels, videos, podcasts) and want each one read and summarized for you, for a fraction of the price.',
    whySwitch: [
      'The free plan includes 10 AI summaries a month, which goes fast if you save every day.',
      'Plus is $10 a month billed yearly: a lot if you mostly want summaries of what you save on your phone.',
      'It does a lot (a graph, quizzes, tags, imports), which is more than some people need.',
    ],
    stayIf: 'Stay with Recall if you use it on your computer every day, rely on its PDF and Google Docs support, or study with its quizzes. Sted doesn’t do those yet.',
    others: [
      { name: 'Readwise Reader', slug: 'readwise-reader', why: 'if you want to read and highlight long articles, PDFs and newsletters' },
      { name: 'Raindrop.io', slug: 'raindrop', why: 'if you mostly need a free bookmark manager on every device' },
    ],
    faq: [
      { question: 'Is Sted cheaper than Recall?', answer: `Yes. Sted’s free plan includes ${n(free.aiSavesPerMonth)} AI summaries a month (Recall’s includes 10), and Sted Pro is ${offer.price} a year at the founding price, while Recall Plus is $10 a month billed yearly.` },
      { question: 'Does Sted work on the web like Recall?', answer: 'Not yet. Sted is on iPhone today; a web app, browser extensions and Android are on the way.' },
      { question: 'Can Sted import my Recall or Pocket library?', answer: 'Not yet. For now, re-save the links you still care about by sharing or pasting them into Sted.' },
    ],
    sources: ['https://www.recall.it/pricing', 'https://docs.recall.it/supported-content/all-supported-content'],
  },
  {
    slug: 'mymind',
    name: 'mymind',
    site: 'https://mymind.com',
    is: 'mymind is a private, visual place to save images, articles, products, notes and ideas, organized for you with AI tags and visual search.',
    rows: [
      { feature: 'Works on', them: 'iOS, Android, web, Mac and browser extensions', sted: STED.platforms },
      { feature: 'Free plan', them: 'No free plan, only a limited guest mode to try it', sted: STED.free },
      { feature: 'Paid plans', them: 'From $4.99/month. Yearly: $79 (Student of Life) or $129 (Mastermind)', sted: STED.paid },
      { feature: 'Best at', them: 'Visual inspiration: images, products, quotes and moodboards', sted: 'Understanding posts, reels, videos and podcasts you save' },
      { feature: 'AI', them: 'Automatic tags and summaries, depending on the plan', sted: STED.ai },
      { feature: 'Finding things', them: 'Visual search, text inside images and “Same Vibe” matches', sted: 'Search your library, or ask Sted in plain words' },
      { feature: 'Chat with your saves', them: 'Not listed on mymind’s site', sted: STED.chat },
      { feature: 'Privacy', them: 'No tracking, never sells your data (per mymind)', sted: STED.privacy },
    ],
    theyWin: [
      'Nothing beats it for visual inspiration: search inside images, find things by color or “vibe”, build moodboards without trying.',
      'It works everywhere: Android, web, Mac and your browser. Sted is iPhone-only today.',
      'It saves images, notes and PDFs directly, not just links.',
    ],
    stedWins: [
      `A real free plan: ${STED.free.toLowerCase()}. mymind has no free plan.`,
      `Price: Sted Pro is ${offer.price} a year at the founding price; mymind’s yearly plans are $79 and $129.`,
      'Sted reads posts, reels, videos and podcasts for you and writes the key ideas, and you can ask Sted about everything you saved.',
    ],
    chooseThem: 'You save for the look of things (design, interiors, fashion, products) and want a beautiful visual library on every device.',
    chooseSted: 'You save posts, reels, videos and podcasts for what’s in them and want Sted to read them, sum them up and answer your questions.',
    whySwitch: [
      'There’s no free plan, only a limited guest mode.',
      'The AI features depend on the plan, and the top yearly plan is $129.',
      'It’s made for visual inspiration, less for remembering what a video or podcast said.',
    ],
    stayIf: 'Stay with mymind if your library is mostly images and visual references, or you need it on Android or your computer. That’s what it does best.',
    others: [
      { name: 'Raindrop.io', slug: 'raindrop', why: 'if you want visual collections with a free, unlimited plan' },
      { name: 'Recall', slug: 'recall', why: 'if you want summaries on your phone and your computer' },
    ],
    faq: [
      { question: 'Is there a free mymind alternative?', answer: `Yes. Sted’s free plan includes up to ${n(free.saves)} saves and ${n(free.aiSavesPerMonth)} AI summaries a month, and Raindrop.io has a free plan with unlimited bookmarks.` },
      { question: 'Is Sted as visual as mymind?', answer: 'No. Sted is built around understanding what you saved, not around visual search or moodboards. For that, mymind is better.' },
    ],
    sources: ['https://access.mymind.com/pricing'],
  },
  {
    slug: 'raindrop',
    name: 'Raindrop.io',
    site: 'https://raindrop.io',
    is: 'Raindrop.io is a bookmark manager for every device: you save links into collections and tags, and Pro adds full-text search, permanent copies and an AI assistant.',
    rows: [
      { feature: 'Works on', them: 'Web, Mac, iOS, Android and browser extensions', sted: STED.platforms },
      { feature: 'Free plan', them: 'Unlimited bookmarks, collections, highlights and devices', sted: STED.free },
      { feature: 'Paid plan', them: 'Pro: about $3/month or $28/year (varies by region)', sted: STED.paid },
      { feature: 'Organizing', them: 'Collections and tags you manage, with AI suggestions on Pro', sted: 'Topics sorted for you automatically, plus projects' },
      { feature: 'AI', them: 'Stella (beta, Pro): summaries, chat with your bookmarks, help organizing', sted: STED.ai },
      { feature: 'Search', them: 'Full-text search and permanent copies (Pro)', sted: 'Search your library, or ask Sted in plain words' },
      { feature: 'Bringing saves back', them: 'Reminders (Pro)', sted: STED.recap },
    ],
    theyWin: [
      'The free plan is generous: unlimited bookmarks on unlimited devices.',
      'It works everywhere, including your computer and every major browser. Sted is iPhone-only today.',
      'If you like organizing by hand, its collections, tags and full-text search are excellent, and Pro costs less than Sted’s regular price.',
    ],
    stedWins: [
      'Every save is read the moment you save it: summary, key ideas and topics, with no organizing on your side.',
      'It’s built for what you save on your phone, like posts, reels, videos and podcasts, not just pages to bookmark.',
      'The Recap brings your best saves back every 10 saves, and Ask Sted answers with the saves it used.',
    ],
    chooseThem: 'You want a free, unlimited bookmark manager on every device and you enjoy organizing collections yourself.',
    chooseSted: 'You save from your phone and want every save read, summed up and sorted for you, without organizing anything.',
    whySwitch: [
      'Bookmarks pile up unread: Raindrop keeps the link, but you still have to go back through it.',
      'Collections and tags work if you keep them up, and many people don’t.',
      'Its AI assistant is in beta and only on Pro.',
    ],
    stayIf: 'Stay with Raindrop.io if you save mostly from your computer, organize by hand, or need full-text search and permanent copies of pages.',
    others: [
      { name: 'mymind', slug: 'mymind', why: 'if you want a visual library organized for you' },
      { name: 'Recall', slug: 'recall', why: 'if you want summaries on your phone and your computer' },
    ],
    faq: [
      { question: 'Can Sted replace Raindrop.io?', answer: 'If you save mostly from your iPhone and want each save summarized for you, yes. If you need a bookmark manager on your computer and in your browser, not yet: Sted’s web app and browser extensions are on the way.' },
      { question: 'Is Raindrop.io free?', answer: 'Yes, Raindrop.io has a free plan with unlimited bookmarks. Pro adds full-text search, permanent copies and its AI assistant.' },
    ],
    sources: ['https://raindrop.io/pro/buy', 'https://help.raindrop.io/stella'],
  },
  {
    slug: 'readwise-reader',
    name: 'Readwise Reader',
    site: 'https://readwise.io/read',
    is: 'Readwise Reader is a reading app for power readers: articles, PDFs, EPUBs, newsletters, RSS and YouTube transcripts in one place, with highlights that sync to Readwise.',
    rows: [
      { feature: 'Works on', them: 'iOS, Android, web, Mac, Windows and browser extensions', sted: STED.platforms },
      { feature: 'Free plan', them: 'No free plan; a 30-day free trial', sted: STED.free },
      { feature: 'Paid plan', them: '$9.99/month billed yearly ($119.88), or $12.99 month to month', sted: STED.paid },
      { feature: 'What it saves', them: 'Articles, PDFs, EPUBs, newsletters, RSS feeds, YouTube and X threads', sted: STED.saves },
      { feature: 'Built for', them: 'Reading and highlighting long content', sted: 'Getting what matters from your saves without going through each one' },
      { feature: 'AI', them: 'Ghostreader: ask questions, define terms, simplify text', sted: STED.ai },
      { feature: 'Bringing saves back', them: 'Daily review of your highlights (Readwise)', sted: STED.recap },
    ],
    theyWin: [
      'It’s the best tool here for deep reading: highlights, notes, a daily review and exports to Notion and Obsidian.',
      'It reads more formats: PDFs, EPUBs, newsletters and RSS feeds.',
      'It works on every platform, including Windows and Android.',
    ],
    stedWins: [
      `There’s a free plan, and Pro is ${offer.price} a year at the founding price, compared to $119.88 a year for Readwise.`,
      'Sted reads each save for you and writes the key ideas, so you don’t have to read everything you saved.',
      'It’s built for the posts, reels, videos and podcasts you save from your phone, with The Recap and Ask Sted on top.',
    ],
    chooseThem: 'You read long articles, books and PDFs, and you highlight as you go.',
    chooseSted: 'You save more than you have time to read and want the summary and key ideas of each save, on your iPhone.',
    whySwitch: [
      'There’s no free plan, and it’s $119.88 a year.',
      'It’s powerful, with a lot to learn, and it still expects you to do the reading.',
      'If most of what you save is posts and short videos, a full reading app can be more than you need.',
    ],
    stayIf: 'Stay with Readwise Reader if highlighting and reviewing what you read is the point. Sted is built for a different job: understanding saves you may never read in full.',
    others: [
      { name: 'Matter', slug: 'matter', why: 'if you want a beautiful reading app with text-to-speech' },
      { name: 'Instapaper', why: 'if you want a simple read-later app with a free plan, on iPhone and Android' },
    ],
    faq: [
      { question: 'Is there a free alternative to Readwise Reader?', answer: `Yes. Sted has a free plan with up to ${n(free.saves)} saves and ${n(free.aiSavesPerMonth)} AI summaries a month, and Instapaper has a free plan for saving articles.` },
      { question: 'Does Sted have highlights like Readwise?', answer: 'Sted isn’t a highlighting tool. It reads your saves for you and gives you the summary, the key ideas and the topics, and you can ask Sted about anything you saved.' },
    ],
    sources: ['https://readwise.io/pricing', 'https://readwise.io/read'],
  },
  {
    slug: 'matter',
    name: 'Matter',
    site: 'https://getmatter.com',
    is: 'Matter is a beautiful read-later app for Apple devices, with natural text-to-speech, highlights, newsletters and an AI Co-Reader.',
    rows: [
      { feature: 'Works on', them: 'iPhone, iPad, Mac and web (no Android app)', sted: STED.platforms },
      { feature: 'Free plan', them: 'Free for saving and reading articles', sted: STED.free },
      { feature: 'Paid plans', them: 'Pro from $59.99/year on the App Store', sted: STED.paid },
      { feature: 'What it saves', them: 'Articles, newsletters and X threads', sted: STED.saves },
      { feature: 'Listening', them: 'Natural text-to-speech in 15 languages', sted: 'Not a feature' },
      { feature: 'AI', them: 'AI Co-Reader: answers about the text you select', sted: STED.ai },
      { feature: 'Chat across all your saves', them: 'Not listed', sted: STED.chat },
    ],
    theyWin: [
      'It’s one of the nicest ways to read on an iPhone, and its text-to-speech lets you listen to articles.',
      'It brings your newsletters in from Gmail, next to the articles you saved.',
      'It runs on iPad and Mac too.',
    ],
    stedWins: [
      'Sted is built for more than articles: posts, reels, videos and podcasts from any app.',
      'Every save gets a summary and key ideas automatically, and Ask Sted answers questions across everything you saved.',
      `Pro is ${offer.price} a year at the founding price.`,
    ],
    chooseThem: 'You save long articles and newsletters and want to read or listen to them in a beautiful app.',
    chooseSted: 'You save posts, reels, videos and podcasts and want them summed up for you instead of read in full.',
    whySwitch: [
      'It’s built for reading articles, not for the reels, videos and podcasts most people save today.',
      'There’s no Android app.',
      'Its best features are on the paid plans.',
    ],
    stayIf: 'Stay with Matter if you love reading and listening to long articles. It does that better than Sted, which doesn’t read articles out loud.',
    others: [
      { name: 'Instapaper', why: 'if you want a simple read-later app on iPhone and Android' },
      { name: 'Readwise Reader', slug: 'readwise-reader', why: 'if you want highlights and every format, on every platform' },
    ],
    faq: [
      { question: 'Is there a Matter alternative for Android?', answer: 'Instapaper and Readwise Reader both have Android apps. Sted is on iPhone today, with Android on the way.' },
      { question: 'Can Sted read articles out loud like Matter?', answer: 'No. Sted reads your saves for you in a different way: it writes the summary and key ideas, so you get what matters without reading or listening to the whole thing.' },
    ],
    sources: ['https://apps.apple.com/us/app/matter-reading-app/id1501592184'],
  },
]

export function competitor(slug: string) {
  return COMPETITORS.find(c => c.slug === slug)
}

// ---------------------------------------------------------------------------------------------------
// "Best app for…" guides

export type Pick = { name: string; mine?: boolean; bestFor: string; price: string; worksOn: string; body: string[]; vs?: string }

export type BestFor = {
  slug: string
  h1: string
  intro: string
  tldr: string
  picks: Pick[]
  /** The idea that decides which pick fits. */
  decides: { title: string; body: string[] }
  myPick: string[]
  faq: Faq[]
  sources: string[]
}

const DISCLOSURE = 'Full disclosure: I make Sted, one of the apps on this list, so I’m biased. Here’s what I’d actually use, including the options that aren’t mine.'

const STED_PICK = (bestFor: string, body: string[]): Pick => ({
  name: 'Sted', mine: true, bestFor, price: `Free (${n(free.aiSavesPerMonth)} AI summaries a month); Pro ${offer.price}/year (founding)`, worksOn: 'iPhone (web and Android on the way)', body,
})

export const BEST_FOR: BestFor[] = [
  {
    slug: 'app-to-save-instagram-reels',
    h1: 'The best app to save Instagram reels',
    intro: `${DISCLOSURE} Short version: saving a reel is easy. Remembering what was in it is the hard part.`,
    tldr: 'If you only save reels to rewatch them, Instagram’s own Saved folder is enough. If you save them for what’s in them (a recipe, a place, a tip, an idea), use an app that reads them for you.',
    picks: [
      STED_PICK('Remembering what was in your reels', [
        'Share a reel to Sted from Instagram and it writes the summary and key ideas, sorts it into topics and brings the best back in The Recap.',
        'Later you can ask Sted things like “what were the Lisbon spots I saved?” and it answers with the reels it’s based on. It’s iPhone-only today.',
      ]),
      { name: 'Instagram Saved', bestFor: 'Rewatching, for free', price: 'Free, built into Instagram', worksOn: 'Wherever you use Instagram', body: [
        'Tap the bookmark icon and the reel goes to Saved, where you can sort it into collections. No extra app, no cost.',
        'The catch: Instagram doesn’t tell you what’s in a reel, so a big Saved folder turns into a long scroll.',
      ] },
      { name: 'Recall', vs: 'recall', bestFor: 'Reels on your phone and your computer', price: 'Free (10 AI summaries a month); Plus $10/month billed yearly', worksOn: 'iOS, Android, web, browser extensions', body: [
        'Recall supports Instagram posts and reels and summarizes them, and it works on the web and in your browser too.',
        'It costs more, and its free plan includes 10 AI summaries a month.',
      ] },
      { name: 'mymind', vs: 'mymind', bestFor: 'Saving for the look', price: 'From $4.99/month; no free plan', worksOn: 'iOS, Android, web, Mac', body: [
        'If you save for the aesthetics (outfits, interiors, design), mymind’s visual search and “Same Vibe” matches are great.',
        'It’s less about what was said in a video, and there’s no free plan.',
      ] },
    ],
    decides: { title: 'Rewatching vs remembering', body: [
      'Most people save reels for one of two reasons. Some want to watch them again. Others want what’s in them: the steps of a recipe, the name of a place, the three tips in a 40-second video.',
      'For the first, any Saved folder works. For the second, you need something that reads the reel and keeps the useful part, because you won’t rewatch 200 reels to find one recipe.',
    ] },
    myPick: [
      'If you save reels to use them later, I’d use Sted on iPhone. If you just rewatch, Instagram’s Saved is fine. If you need your saves on a laptop too, look at Recall.',
    ],
    faq: [
      { question: 'How do I save an Instagram reel to another app?', answer: 'Tap the share button on the reel, then choose the app from the share sheet (tap More if you don’t see it). With Sted, the reel is saved and summarized for you.' },
      { question: 'Is there a free way to remember what’s in my saved reels?', answer: `Yes. Sted’s free plan includes up to ${n(free.saves)} saves and ${n(free.aiSavesPerMonth)} AI summaries a month.` },
    ],
    sources: ['https://www.recall.it/pricing', 'https://docs.recall.it/supported-content/all-supported-content', 'https://access.mymind.com/pricing'],
  },
  {
    slug: 'app-to-summarize-youtube-videos',
    h1: 'The best app to save and summarize YouTube videos',
    intro: `${DISCLOSURE} Short version: Watch Later is where good videos go to be forgotten. A summary is what makes a saved video useful.`,
    tldr: 'If you’ll actually watch it later, Watch Later is fine. If you want what’s in the video without rewatching it, use an app that summarizes it when you save it.',
    picks: [
      STED_PICK('Videos you save from your phone', [
        'Share a video from the YouTube app to Sted and you get the summary and key ideas, sorted into topics, next to everything else you saved.',
        'Ask Sted “what did that video say about pricing?” and it answers with the saves it used. iPhone only for now.',
      ]),
      { name: 'YouTube Watch Later', bestFor: 'Videos you’ll really watch', price: 'Free, built into YouTube', worksOn: 'Everywhere YouTube works', body: [
        'It’s free and one tap away. If you do go back and watch, it’s all you need.',
        'It doesn’t tell you what’s in a video, so the list grows faster than you watch it.',
      ] },
      { name: 'Recall', vs: 'recall', bestFor: 'Learning from long videos on desktop', price: 'Free (10 AI summaries a month); Plus $10/month billed yearly', worksOn: 'iOS, Android, web, browser extensions', body: [
        'Recall summarizes YouTube videos (with or without transcripts), and its browser extension works right on the video page.',
        'It’s more expensive, and the free plan includes 10 AI summaries a month.',
      ] },
      { name: 'Readwise Reader', vs: 'readwise-reader', bestFor: 'Highlighting the transcript', price: '$9.99/month billed yearly; 30-day trial', worksOn: 'iOS, Android, web, Mac, Windows', body: [
        'Reader lets you watch a video and highlight its transcript, like an article. Great for lectures and talks you want to study.',
        'No free plan, and it expects you to do the reading.',
      ] },
      { name: 'Raindrop.io', vs: 'raindrop', bestFor: 'Bookmarking videos with everything else', price: 'Free; Pro about $28/year', worksOn: 'Web, Mac, iOS, Android, extensions', body: [
        'On Pro, its AI assistant (in beta) can summarize a YouTube video from its transcript.',
        'It’s a bookmark manager first: summaries are something you ask for, not something you get on every save.',
      ] },
    ],
    decides: { title: 'Saving a video isn’t the same as watching it', body: [
      'Most saved videos never get watched. That’s fine if the summary tells you what was in them and whether the full video is worth your time.',
      'So the question is simple: do you want a list of videos, or a list of what the videos said?',
    ] },
    myPick: [
      'On iPhone, I’d save videos to Sted and only watch the ones whose summary earns it. If you study long videos on a laptop, Recall or Readwise Reader fit better.',
    ],
    faq: [
      { question: 'Can I get a summary of a YouTube video without watching it?', answer: 'Yes. Apps like Sted, Recall and Raindrop.io (Pro) can summarize a YouTube video for you. With Sted, it happens automatically when you share the video to it.' },
      { question: 'Does YouTube summarize videos in Watch Later?', answer: 'Watch Later is a list of videos. It doesn’t give you a summary of what’s in them.' },
    ],
    sources: ['https://docs.recall.it/supported-content/all-supported-content', 'https://readwise.io/read', 'https://help.raindrop.io/stella'],
  },
  {
    slug: 'read-later-app-for-iphone',
    h1: 'The best read-later app for iPhone',
    intro: `${DISCLOSURE} Short version: since Pocket shut down in 2025, the best read-later app depends on whether you actually read later, or mostly save.`,
    tldr: 'If you read long articles, pick Matter, Instapaper or Readwise Reader. If you save more than you read (posts, videos, podcasts), pick an app that reads them for you.',
    picks: [
      { name: 'Instapaper', bestFor: 'A simple, classic read-later app', price: 'Free; Premium $59.99/year', worksOn: 'iOS, Android, web, Kindle', body: [
        'Save articles and read them without clutter, on iPhone, Android and the web. The free plan covers the basics.',
        'Premium adds full-text search, a permanent archive, Kindle sending and text-to-speech.',
      ] },
      { name: 'Matter', vs: 'matter', bestFor: 'The nicest reading and listening', price: 'Free; Pro from $59.99/year', worksOn: 'iPhone, iPad, Mac, web', body: [
        'A beautiful reader with natural text-to-speech and your newsletters in the same place.',
        'There’s no Android app, and the best features are paid.',
      ] },
      { name: 'Readwise Reader', vs: 'readwise-reader', bestFor: 'Power readers who highlight', price: '$9.99/month billed yearly; 30-day trial', worksOn: 'iOS, Android, web, Mac, Windows', body: [
        'Articles, PDFs, EPUBs, newsletters and RSS in one app, with highlights that sync to Readwise.',
        'No free plan, and it takes some learning.',
      ] },
      STED_PICK('People who save more than they read', [
        'Sted isn’t a classic read-later app. It reads your saves for you: every link gets a summary and key ideas, and The Recap brings the best back every 10 saves.',
        'It’s best for posts, reels, videos and podcasts, the things you’ll never “read later”.',
      ]),
      { name: 'Safari Reading List', bestFor: 'Free, nothing to install', price: 'Free, built into iOS', worksOn: 'iPhone, iPad, Mac', body: [
        'Tap Share, then Add to Reading List, and the page is saved, offline too.',
        'No organization, no search inside articles, and only for pages you open in Safari.',
      ] },
    ],
    decides: { title: 'Do you read later, or just save?', body: [
      'Read-later apps are made for reading: good typography, highlights, sometimes audio. They work if you sit down and read what you saved.',
      'Most people save far more than they read. For them, the useful app is the one that tells you what’s in each save, so the pile stops being a pile.',
    ] },
    myPick: [
      'If you read long articles every week, Matter (Apple only) or Instapaper (iPhone and Android). If you highlight everything, Readwise Reader. If your saves are mostly posts, videos and podcasts, Sted.',
    ],
    faq: [
      { question: 'What’s the best Pocket replacement on iPhone?', answer: 'For reading articles, Instapaper and Matter are the closest to Pocket. If you saved more than you read, Sted gives you the summary and key ideas of each save instead. See our Pocket alternative page for more.' },
      { question: 'Is there a free read-later app for iPhone?', answer: 'Yes: Safari Reading List is built in, Instapaper and Matter have free plans, and Sted has a free plan with AI summaries.' },
    ],
    sources: ['https://www.instapaper.com/premium', 'https://apps.apple.com/us/app/matter-reading-app/id1501592184', 'https://readwise.io/pricing'],
  },
  {
    slug: 'app-to-save-tiktoks',
    h1: 'The best app to save TikToks for later',
    intro: `${DISCLOSURE} Short version: Favorites is fine for rewatching. If you save TikToks for the tip inside, you want that tip written down.`,
    tldr: 'For rewatching, TikTok’s Favorites is enough. For remembering what a TikTok taught you, use an app that summarizes it when you save it.',
    picks: [
      STED_PICK('Remembering the tip inside the TikTok', [
        'Share a TikTok to Sted and it keeps the summary and key ideas, next to the reels, posts and videos you saved elsewhere.',
        'Ask Sted “what were those budgeting tips?” and it finds them across everything you saved.',
      ]),
      { name: 'TikTok Favorites', bestFor: 'Rewatching, for free', price: 'Free, built into TikTok', worksOn: 'Wherever you use TikTok', body: [
        'Tap the bookmark icon to add a video to Favorites, and group them into collections.',
        'Your saves stay inside TikTok, and nothing tells you what each one was about.',
      ] },
      { name: 'Recall', vs: 'recall', bestFor: 'TikToks on your phone and computer', price: 'Free (10 AI summaries a month); Plus $10/month billed yearly', worksOn: 'iOS, Android, web, browser extensions', body: [
        'Recall supports TikTok videos and summarizes them, on every device.',
        'Its free plan includes 10 AI summaries a month, and Plus is $10 a month billed yearly.',
      ] },
    ],
    decides: { title: 'All your saves in one place', body: [
      'The tip you need might be in a TikTok, a reel or a YouTube video. Saving inside each app means three places to search later.',
      'An app you share everything to keeps it together, and an app that reads it means you don’t have to rewatch to find it.',
    ] },
    myPick: [
      'If you save TikToks for what they teach, I’d share them to Sted. If you just want to rewatch, Favorites does the job.',
    ],
    faq: [
      { question: 'How do I save a TikTok to another app?', answer: 'Tap Share on the video, then pick the app (or More to find it). The video’s link is saved there.' },
      { question: 'Can I search inside my TikTok Favorites?', answer: 'Not by what was said in the videos. Apps like Sted and Recall summarize each TikTok, so you can find it by what was in it.' },
    ],
    sources: ['https://docs.recall.it/supported-content/all-supported-content', 'https://www.recall.it/pricing'],
  },
  {
    slug: 'app-to-save-podcast-episodes',
    h1: 'The best app to save podcast episodes and remember them',
    intro: `${DISCLOSURE} Short version: your podcast app can save an episode, but not what you learned from it.`,
    tldr: 'To queue episodes, your podcast app is enough. To remember what an episode said, or find it again by topic, use an app that summarizes it.',
    picks: [
      STED_PICK('Remembering what an episode said', [
        'Share an episode from Spotify to Sted and you get the summary and key ideas, next to your other saves.',
        'Weeks later, ask Sted “which episode talked about pricing?” and it answers with the episode it used.',
      ]),
      { name: 'Your podcast app', bestFor: 'Queuing episodes to listen to', price: 'Free', worksOn: 'Wherever you listen', body: [
        'Spotify and Apple Podcasts both let you save episodes to a list to play later.',
        'They keep the episode, not what was in it.',
      ] },
      { name: 'Recall', vs: 'recall', bestFor: 'Podcasts on phone and computer', price: 'Free (10 AI summaries a month); Plus $10/month billed yearly', worksOn: 'iOS, Android, web, browser extensions', body: [
        'Recall summarizes Apple Podcasts and Spotify episodes (without timestamps, and not paid content).',
        'More expensive, and the free plan includes 10 AI summaries a month.',
      ] },
    ],
    decides: { title: 'Listening vs remembering', body: [
      'Podcasts are where a lot of good ideas come from, and where they’re hardest to find again: you can’t skim audio.',
      'A written summary of each episode you save is what lets you search for an idea instead of re-listening to an hour.',
    ] },
    myPick: [
      'Keep using your podcast app to listen. Share the episodes worth remembering to Sted, so what you learned is searchable later.',
    ],
    faq: [
      { question: 'Can I get a summary of a podcast episode?', answer: 'Yes. Sted and Recall summarize podcast episodes you save to them.' },
      { question: 'How do I save a Spotify episode to Sted?', answer: 'Tap Share on the episode in Spotify and choose Sted. It’s saved and summarized for you.' },
    ],
    sources: ['https://docs.recall.it/supported-content/all-supported-content', 'https://www.recall.it/pricing'],
  },
  {
    slug: 'app-to-plan-trips-from-saved-posts',
    h1: 'The best app to plan a trip from the posts you saved',
    intro: `${DISCLOSURE} Short version: you saved 40 posts about Japan. The hard part is turning them into a plan.`,
    tldr: 'Use Google Maps lists for places on a map, and an app that reads your saved posts and reels to pull out what’s in them: names, tips and why each place was worth saving.',
    picks: [
      { name: 'Google Maps lists', bestFor: 'Seeing places on a map', price: 'Free', worksOn: 'iOS, Android, web', body: [
        'Save places to lists and see them all on the map while you plan and while you’re there.',
        'It only knows the places you add by hand, not the reels and posts you saved them from.',
      ] },
      STED_PICK('Turning saved posts and reels into notes', [
        'Share travel reels, posts and articles to Sted and each one gets a summary with the places and tips in it.',
        'Then ask Sted “what did I save about Kyoto?” and get the list, with the saves it came from. Sted doesn’t make maps, so pair it with Google Maps.',
      ]),
      { name: 'Instagram collections', bestFor: 'Keeping travel inspiration', price: 'Free, built into Instagram', worksOn: 'Wherever you use Instagram', body: [
        'A “Japan” collection is a fine place to start.',
        'But Instagram won’t tell you what’s in each post, so planning means rewatching all of them.',
      ] },
    ],
    decides: { title: 'Inspiration vs a plan', body: [
      'Saved posts are inspiration. A plan needs the names, the neighborhoods and the tips written down.',
      'The fastest path is to let something read the posts for you, then put the places on a map.',
    ] },
    myPick: [
      'Save everything to Sted while you’re dreaming, ask it for the list when you’re planning, and put the places in a Google Maps list for the trip.',
    ],
    faq: [
      { question: 'Can I turn my saved Instagram posts into a travel list?', answer: 'Yes. Share them to Sted and ask “what did I save about [city]?”; it answers with the places and tips from your saves.' },
    ],
    sources: [],
  },
  {
    slug: 'bookmark-app-for-students',
    h1: 'The best bookmark app for students',
    intro: `${DISCLOSURE} Short version: start with a free plan, and pick by what you save most: links and videos, or PDFs and readings.`,
    tldr: 'Saving videos, posts and articles from your phone: Sted. PDFs and studying with quizzes: Recall. A free bookmark manager for research links on your laptop: Raindrop.io.',
    picks: [
      STED_PICK('Videos, posts and articles from your phone', [
        `The free plan covers up to ${n(free.saves)} saves and ${n(free.aiSavesPerMonth)} AI summaries a month. Every save gets a summary and key ideas, sorted into topics.`,
        'Ask Sted to recap what you saved this week before a class. It doesn’t handle PDFs yet.',
      ]),
      { name: 'Recall', vs: 'recall', bestFor: 'Studying, with PDFs and quizzes', price: 'Free (10 AI summaries a month); Plus $10/month billed yearly', worksOn: 'iOS, Android, web, browser extensions', body: [
        'Recall handles PDFs and Google Docs and can quiz you with spaced repetition. Built for learning.',
        'The free plan includes 10 AI summaries a month.',
      ] },
      { name: 'Raindrop.io', vs: 'raindrop', bestFor: 'Research links on your laptop', price: 'Free; Pro about $28/year', worksOn: 'Web, Mac, iOS, Android, extensions', body: [
        'Unlimited bookmarks for free, on every device, with collections for each class.',
        'You organize it yourself, and summaries need Pro.',
      ] },
      { name: 'Readwise Reader', vs: 'readwise-reader', bestFor: 'Reading and highlighting', price: '$9.99/month billed yearly; 30-day trial', worksOn: 'iOS, Android, web, Mac, Windows', body: [
        'Great for highlighting PDFs, EPUBs and articles for papers.',
        'No free plan.',
      ] },
    ],
    decides: { title: 'What do you save most?', body: [
      'Students save two kinds of things: readings (PDFs, papers, chapters) and everything else (videos, posts, articles).',
      'Readings need a tool for PDFs and highlights. Everything else needs a tool that tells you what’s in it, so you can use it in a paper or before an exam.',
    ] },
    myPick: [
      'On a student budget, I’d use Sted’s free plan for what you save on your phone and Raindrop.io’s free plan for research links on your laptop. If your course is PDF-heavy, Recall.',
    ],
    faq: [
      { question: 'What’s the best free bookmark app for students?', answer: `Raindrop.io’s free plan has unlimited bookmarks; Sted’s free plan adds ${n(free.aiSavesPerMonth)} AI summaries a month for what you save on your iPhone.` },
    ],
    sources: ['https://www.recall.it/pricing', 'https://raindrop.io/pro/buy', 'https://readwise.io/pricing'],
  },
  {
    slug: 'app-to-save-inspiration-for-creators',
    h1: 'The best app for creators to save inspiration',
    intro: `${DISCLOSURE} Short version: creators save two things, how something looks and what something says. Different apps are best at each.`,
    tldr: 'For visual references, mymind. For the hooks, ideas and formats inside reels and posts, Sted. For free collections on every device, Raindrop.io.',
    picks: [
      STED_PICK('Hooks, ideas and formats from reels and posts', [
        'Save the reels, TikToks and posts that worked, and Sted writes down what’s in each one: the hook, the key ideas, the topic.',
        'Then ask Sted “what hooks did I save about productivity?” when you sit down to write.',
      ]),
      { name: 'mymind', vs: 'mymind', bestFor: 'Visual references', price: 'From $4.99/month; no free plan', worksOn: 'iOS, Android, web, Mac', body: [
        'Search inside images, find things by “vibe”, build a moodboard without trying.',
        'It’s about how things look, less about what a video said.',
      ] },
      { name: 'Instagram collections', bestFor: 'Keeping it inside Instagram', price: 'Free', worksOn: 'Wherever you use Instagram', body: [
        'Fast, free and right where you find things.',
        'Nothing tells you what each reel was about, and it’s Instagram only.',
      ] },
      { name: 'Raindrop.io', vs: 'raindrop', bestFor: 'Free collections everywhere', price: 'Free; Pro about $28/year', worksOn: 'Web, Mac, iOS, Android, extensions', body: [
        'Unlimited bookmarks and visual collections, free.',
        'You do the organizing.',
      ] },
    ],
    decides: { title: 'How it looks vs what it says', body: [
      'A designer’s inspiration is mostly visual. A writer’s or a short-form creator’s is mostly words: hooks, structures, ideas.',
      'Pick the app that’s best at the kind you save most, or use one of each.',
    ] },
    myPick: [
      'If you make videos or write, I’d save to Sted and ask it for ideas when you’re stuck. If you design, mymind. On a budget, Raindrop.io’s free plan.',
    ],
    faq: [
      { question: 'What’s the best app to save reels for content ideas?', answer: 'One that reads them: Sted saves the summary and key ideas of each reel, so you can search for a hook or an idea later instead of rewatching.' },
    ],
    sources: ['https://access.mymind.com/pricing', 'https://raindrop.io/pro/buy'],
  },
]

export function bestFor(slug: string) {
  return BEST_FOR.find(b => b.slug === slug)
}
