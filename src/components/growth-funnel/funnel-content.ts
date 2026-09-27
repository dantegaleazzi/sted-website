// Copy and example saves for the conversational funnel.
// Every example is a real public link. `screen` points to a real iPhone screenshot of that link
// saved in Sted; until it's supplied, the funnel draws the app's item screen from this data.

/** Real saves fanned out under the opening statement (funnel intro, How it works). */
export const INTRO_SAVES = [
  '/content/landing-4c/pour-over-method.webp',
  '/content/landing-4c/x-post-falling-into-hole.webp',
  '/content/landing-4c/fushimi-inari-kyoto.webp',
  '/content/real/spotify-lennys-podcast-ian-silber.jpg',
  '/content/real/karakeep.png',
]

export const PERSONAS = [
  { id: 'developer', label: 'Developer', reply: 'A developer. I bet half your saves are repos and threads.' },
  { id: 'creator', label: 'Content creator', reply: 'A creator. Saving ideas for later is basically your job.' },
  { id: 'founder', label: 'Founder', reply: 'A founder. Lots of tabs, not much time. I can help with that.' },
  { id: 'student', label: 'Student', reply: 'A student. Let’s make studying a little lighter.' },
  { id: 'designer', label: 'Designer', reply: 'A designer. Inspiration everywhere, all at once.' },
  { id: 'other', label: 'Other', reply: 'Good. People save all kinds of things with me.' },
] as const
export type Persona = (typeof PERSONAS)[number]['id']

/** Where the links come from (source-icons tiles). */
export const SOURCES = [
  { name: 'Instagram', icon: 'instagram' },
  { name: 'TikTok', icon: 'tiktok' },
  { name: 'YouTube', icon: 'youtube' },
  { name: 'X', icon: 'x' },
  { name: 'LinkedIn', icon: 'linkedin' },
  { name: 'Reddit', icon: 'reddit' },
  { name: 'Pinterest', icon: 'pinterest' },
  { name: 'Spotify', icon: 'spotify' },
  { name: 'Websites', icon: 'web' },
] as const
export const EVERYWHERE = 'Everywhere'

/** Where the links end up today. */
export const STORAGE = [
  { id: 'notes', label: 'Notes app' },
  { id: 'messages', label: 'Messages to myself' },
  { id: 'bookmarks', label: 'Browser bookmarks' },
  { id: 'tabs', label: 'Open tabs' },
  { id: 'screenshots', label: 'Screenshots' },
  { id: 'in_app', label: 'Saved in each app' },
  { id: 'docs', label: 'Notion or docs' },
  { id: 'nowhere', label: 'Nowhere. I lose them' },
] as const
export type Storage = (typeof STORAGE)[number]['id']

export const PURPOSES = [
  { id: 'work', label: 'Work & projects' },
  { id: 'learning', label: 'Learning' },
  { id: 'content', label: 'Creating content' },
  { id: 'personal', label: 'Personal interests' },
  { id: 'everything', label: 'A bit of everything' },
] as const
export type Purpose = (typeof PURPOSES)[number]['id']

export const NEEDS = [
  { id: 'find', label: 'Find things again fast' },
  { id: 'remember', label: 'Remember what it was about' },
  { id: 'keypoints', label: 'Get the key points without rereading' },
] as const
export type Need = (typeof NEEDS)[number]['id']

/** What Sted says on the "pick one" and result screens, per need. */
export const NEED_COPY: Record<Need, { pick: string; result: string }> = {
  find: {
    pick: 'Let me show you how I file things. Pick one and I’ll save it.',
    result: 'Saved, with topics and a project, so search finds it later.',
  },
  remember: {
    pick: 'Let me show you what I remember for you. Pick one and I’ll save it.',
    result: 'Saved. The summary tells you what it was about at a glance.',
  },
  keypoints: {
    pick: 'Let me pull out the useful parts. Pick one and I’ll save it.',
    result: 'Saved. The key ideas are right there. No rereading.',
  },
}

export type SourceType = 'x' | 'instagram' | 'youtube' | 'github' | 'web' | 'pinterest' | 'spotify'

export type ExampleSave = {
  id: string
  source: SourceType
  /** Label on the pick card, e.g. "GitHub" or "RevenueCat blog". */
  sourceLabel: string
  url: string
  /** Shown in the app screen's link row. */
  displayUrl: string
  title: string
  thumb: string
  summary: string
  keyIdeas: string[]
  topics: string[]
  /** Real iPhone screenshot (no bezel) of this link saved in Sted. */
  screen?: string
}

/** Which answer to "Where do you save links?" each example belongs to. */
export const SOURCE_FOR: Record<SourceType, string> = {
  x: 'X', instagram: 'Instagram', youtube: 'YouTube', github: 'Websites', web: 'Websites', pinterest: 'Pinterest', spotify: 'Spotify',
}

const SAVES = {
  karakeep: {
    id: 'karakeep', source: 'github', sourceLabel: 'GitHub',
    url: 'https://github.com/karakeep-app/karakeep', displayUrl: 'github.com/karakeep-app/karakeep',
    title: 'karakeep-app/karakeep', thumb: '/content/real/karakeep.png',
    summary: 'A self-hostable app for bookmarking everything (links, notes and images) with AI-based automatic tagging and full-text search.',
    keyIdeas: ['Keeps links, notes and images in one place you host yourself.', 'AI tags every bookmark automatically, and full-text search finds it later.'],
    topics: ['Open source', 'Self-hosting', 'Bookmarks'],
  },
  shadcn: {
    id: 'shadcn-chatbot', source: 'x', sourceLabel: 'X · @shadcn',
    url: 'https://x.com/shadcn/status/2087153563340325341', displayUrl: 'x.com/shadcn/status/2087153563340325341',
    title: 'I just open sourced a minimal chatbot template.', thumb: '/content/real/x1.jpg',
    summary: 'shadcn shares an open-source, minimal chatbot template to use as a starting point for building a chat interface.',
    keyIdeas: ['A minimal starting point for a chatbot UI.', 'It’s open source, so you can fork it and adapt it.'],
    topics: ['Open source', 'AI', 'UI'],
  },
  danKoe: {
    id: 'dan-koe', source: 'x', sourceLabel: 'X · @thedankoe',
    url: 'https://x.com/thedankoe/article/2010751592346030461', displayUrl: 'x.com/thedankoe/status/2010751592346030461',
    title: 'How to fix your entire life in 1 day', thumb: '/content/landing-4c/x-post-falling-into-hole.webp',
    summary: 'Dan Koe discusses behavior change, psychology, and productivity, arguing that true life change requires altering one’s identity and deep-seated goals rather than relying on superficial New Year’s resolutions or temporary discipline.',
    keyIdeas: ['New Year’s resolutions usually fail because they rely on surface-level changes rather than transforming who you are.', 'All behavior is goal-oriented, and unconscious goals often drive self-sabotaging actions like procrastination.'],
    topics: ['Behavior change', 'Productivity', 'Personal development'],
    screen: '/content/funnel/screens/x-dan-koe.webp',
  },
  osmo: {
    id: 'dji-osmo', source: 'instagram', sourceLabel: 'Instagram · @osmo_global',
    url: 'https://www.instagram.com/p/Dc0rlpZCAkC/', displayUrl: 'instagram.com/p/Dc0rlpZCAkC',
    title: 'Meet DJI Osmo 360 II. All Angles. All Epic.', thumb: '/content/real/instagram-osmo-global-360-ii.jpg',
    summary: 'DJI introduces the Osmo 360 II, a 360-degree camera that records every angle at once, so you can choose your shot later.',
    keyIdeas: ['Captures everything around you in one take.', 'Frame and reframe your shots after recording.'],
    topics: ['Cameras', 'Video', 'Gear'],
  },
  revenuecat: {
    id: 'revenuecat-storekit', source: 'web', sourceLabel: 'RevenueCat blog',
    url: 'https://www.revenuecat.com/blog/engineering/ios-in-app-subscription-tutorial-with-storekit-2-and-swift', displayUrl: 'revenuecat.com/blog/engineering',
    title: 'iOS In-App Subscription Tutorial with StoreKit 2 and Swift', thumb: '/content/real/revenuecat.png',
    summary: 'A step-by-step tutorial on adding in-app subscriptions to an iOS app with StoreKit 2 and Swift.',
    keyIdeas: ['Set up subscription products, then load and sell them with StoreKit 2.', 'Check a user’s subscription status to unlock paid features.'],
    topics: ['iOS', 'Subscriptions', 'Monetization'],
  },
  firecrawl: {
    id: 'firecrawl', source: 'web', sourceLabel: 'firecrawl.dev',
    url: 'https://www.firecrawl.dev/', displayUrl: 'firecrawl.dev',
    title: 'Firecrawl', thumb: '/content/real/firecrawl.png',
    summary: 'Firecrawl is an API that turns websites into clean, LLM-ready data by scraping single pages or crawling whole sites.',
    keyIdeas: ['Scrape one page or crawl an entire site.', 'Get clean markdown or structured data back, ready for AI apps.'],
    topics: ['AI tools', 'Web scraping', 'APIs'],
  },
  starship: {
    id: 'starship', source: 'youtube', sourceLabel: 'YouTube · SpaceX · 34:16',
    url: 'https://www.youtube.com/watch?v=-a0ecQMq-rM', displayUrl: 'youtube.com/watch?v=-a0ecQMq-rM',
    title: 'Starship - Critical Path', thumb: '/content/real/youtube2.jpg',
    summary: 'A SpaceX video about Starship, its fully reusable launch system, and the critical path of its development.',
    keyIdeas: ['Starship is SpaceX’s fully reusable rocket system.', 'The video focuses on the critical path of its development.'],
    topics: ['Space', 'Engineering'],
  },
  codex: {
    id: 'openai-codex', source: 'web', sourceLabel: 'OpenAI Developers',
    url: 'https://developers.openai.com/blog/codex-as-a-platform', displayUrl: 'developers.openai.com/blog',
    title: 'Codex as a platform: build on the open agent harness', thumb: '/content/real/openai.webp',
    summary: 'OpenAI explains how developers can build on Codex as a platform, using its open agent harness.',
    keyIdeas: ['Codex’s agent harness is open to build on.', 'Developers can create their own tools and workflows on top of it.'],
    topics: ['AI', 'Coding', 'Agents'],
  },
  pinterest: {
    id: 'pinterest-exterior', source: 'pinterest', sourceLabel: 'Pinterest',
    url: 'https://uk.pinterest.com/pin/exterior-modern-style--7177680653110489', displayUrl: 'pinterest.com/pin/exterior-modern-style',
    title: 'Exterior modern style', thumb: '/content/real/pinterest.jpg',
    summary: 'A modern two-story home exterior with dark trim, stone and warm wood, large windows and soft garden lighting.',
    keyIdeas: ['Dark frames with stone and wood feel warm, not cold.', 'Large windows and low lighting shape the whole facade.'],
    topics: ['Architecture', 'Moodboard'],
  },
  lenny: {
    id: 'lenny-ian-silber', source: 'spotify', sourceLabel: 'Spotify · Lenny’s Podcast',
    url: 'https://open.spotify.com/episode/3Ac9iIUCIp25qHpDaNugZS', displayUrl: 'open.spotify.com/episode',
    title: 'Chatbots are not the final interface: OpenAI’s Head of Design on what’s next | Ian Silber', thumb: '/content/real/spotify-lennys-podcast-ian-silber.jpg',
    summary: 'OpenAI’s Head of Design, Ian Silber, talks about why chatbots aren’t the final interface for AI and what might come next.',
    keyIdeas: ['Chat is a starting point for AI products, not the end state.', 'Designers should think about what comes after the chatbot.'],
    topics: ['Design', 'AI', 'Podcasts'],
  },
  pourOver: {
    id: 'pour-over', source: 'youtube', sourceLabel: 'YouTube',
    url: 'https://www.youtube.com/watch?v=UdvPCv4DJfg', displayUrl: 'youtube.com/watch?v=UdvPCv4DJfg',
    title: 'The pour over method, start to finish', thumb: '/content/landing-4c/pour-over-method.webp',
    summary: 'A start-to-finish guide to brewing pour-over coffee at home.',
    keyIdeas: ['Let the grounds bloom before the main pour.', 'Pour slowly and evenly for a cleaner cup.'],
    topics: ['Coffee', 'How-to'],
  },
  kyoto: {
    id: 'kyoto', source: 'instagram', sourceLabel: 'Instagram',
    url: 'https://www.instagram.com/p/DcgDDydsiqL/', displayUrl: 'instagram.com/p/DcgDDydsiqL',
    title: 'Kyoto, Japan', thumb: '/content/landing-4c/fushimi-inari-kyoto.webp',
    summary: 'The torii gates of Fushimi Inari Shrine in Kyoto, one of Japan’s best-known sights.',
    keyIdeas: ['Thousands of torii gates line the trails up the mountain.', 'Going early means quieter paths.'],
    topics: ['Kyoto', 'Travel', 'Japan'],
  },
} satisfies Record<string, ExampleSave>

export const EXAMPLES: Record<Persona, [ExampleSave, ExampleSave]> = {
  developer: [SAVES.karakeep, SAVES.shadcn],
  creator: [SAVES.danKoe, SAVES.osmo],
  founder: [SAVES.revenuecat, SAVES.firecrawl],
  student: [SAVES.starship, SAVES.codex],
  designer: [SAVES.pinterest, SAVES.lenny],
  other: [SAVES.pourOver, SAVES.kyoto],
}

/** Examples for a persona, with the ones from the places you save listed first. */
export function examplesFor(persona: Persona, sources: readonly string[]): ExampleSave[] {
  const picked = EXAMPLES[persona]
  if (!sources.length || sources.includes(EVERYWHERE)) return [...picked]
  const matches = (example: ExampleSave) => sources.includes(SOURCE_FOR[example.source])
  return [...picked.filter(matches), ...picked.filter(example => !matches(example))]
}

export function findExample(persona: Persona | null, id: string | null) {
  return persona ? EXAMPLES[persona].find(example => example.id === id) ?? null : null
}

/** "A bit of everything" can't be combined with the specific purposes. */
export function togglePurpose(current: readonly Purpose[], id: Purpose): Purpose[] {
  if (id === 'everything') return current.includes(id) ? [] : [id]
  const specific = current.filter(item => item !== 'everything')
  return specific.includes(id) ? specific.filter(item => item !== id) : [...specific, id]
}

/** "Everywhere" can't be combined with specific places. */
export function toggleSource(current: readonly string[], name: string): string[] {
  if (name === EVERYWHERE) return current.includes(name) ? [] : [name]
  const specific = current.filter(item => item !== EVERYWHERE)
  return specific.includes(name) ? specific.filter(item => item !== name) : [...specific, name]
}

/** Sted's reply to where your links end up, shown on the next screen. */
export function storageReply(storage: readonly Storage[]) {
  if (storage.includes('nowhere')) return 'Honestly? That’s most people. That’s why I’m here.'
  if (storage.length > 2) return 'A bit of everything, everywhere. I can bring it together.'
  if (storage.includes('messages')) return 'Texting links to yourself. A classic.'
  if (storage.includes('tabs')) return 'Those tabs aren’t going anywhere, huh?'
  if (storage.includes('screenshots')) return 'A camera roll full of “for later”. I get it.'
  return 'Got it. Let’s put all of it in one place.'
}

export function toggleStorage(current: readonly Storage[], id: Storage): Storage[] {
  if (id === 'nowhere') return current.includes(id) ? [] : [id]
  const specific = current.filter(item => item !== 'nowhere')
  return specific.includes(id) ? specific.filter(item => item !== id) : [...specific, id]
}

export function sourceReply(sources: readonly string[]) {
  if (sources.includes(EVERYWHERE) || sources.length > 2) return 'A little here, a little there. Sound familiar?'
  if (sources.length) return `${sources.join(' and ')}. Lots of things worth keeping.`
  return 'A link today. Another tomorrow.'
}
