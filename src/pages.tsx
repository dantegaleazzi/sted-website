import { useState, type FormEvent, type ReactNode } from 'react'
import { GuidePage, GuidesIndexPage } from './guides'

// While Sted is in App Store review, the site is kept to product + legal/support only.
// Flip this back to true to restore Build in Public and Guides — no content is deleted.
export const SHOW_BUILD_IN_PUBLIC = false

const SUPPORT_MESSAGE_MIN = 10
const SUPPORT_MESSAGE_MAX = 2000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type LogItem = { label: string; status: 'Done' | 'Next' }
type LogStat = { icon: string; label: string }
type BuildLog = { day: number; date: string; title: string; summary: string; items?: LogItem[]; stats?: LogStat[]; published?: boolean; slug?: string; body?: string[]; bodyAfterStats?: string[]; ctaHref?: string; ctaLabel?: string }

const TOTAL_DAYS = 43

const stedLogs: BuildLog[] = [
  {
    day: 14,
    date: 'SEP 1, 2026',
    title: 'Sted becomes a character',
    summary: 'The product already had a name and an app. Today we started giving Sted a personality of its own.',
    items: [
      { label: 'Sted character introduced', status: 'Done' },
      { label: 'New visual identity taking shape', status: 'Done' },
      { label: 'Character system explored for product + content', status: 'Done' },
      { label: 'Branding moving beyond just a logo', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '⏳', label: '29 days left' },
    ],
  },
  {
    day: 13,
    date: 'AUG 31, 2026',
    title: 'In review. Back to the brand.',
    summary: 'The app is with Apple, so today shifted from shipping the first build to shaping the next version of Sted’s identity.',
    items: [
      { label: 'App Store review underway', status: 'Done' },
      { label: 'First release candidate locked', status: 'Done' },
      { label: 'New branding direction explored', status: 'Done' },
      { label: 'Sted character + visual system evolving', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '⏳', label: '30 days left' },
    ],
  },
  {
    day: 12,
    date: 'AUG 30, 2026',
    title: 'Building distribution alongside the product',
    summary: 'Today was less about adding features and more about building the content system around Sted.',
    items: [
      { label: 'Build-in-public content system refined', status: 'Done' },
      { label: 'Hooks and formats tested', status: 'Done' },
      { label: 'Content workflow improved', status: 'Done' },
      { label: 'Product story becoming part of distribution', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '⏳', label: '31 days left' },
    ],
  },
  {
    day: 11,
    date: 'AUG 29, 2026',
    title: 'The AI development loop',
    summary: 'Sted is being built through a tight human + AI workflow rather than a traditional solo coding process.',
    items: [
      { label: 'Ideas translated into scoped AI tasks', status: 'Done' },
      { label: 'Claude used for implementation workflows', status: 'Done' },
      { label: 'Codex used for code-level execution and validation', status: 'Done' },
      { label: 'Tests + real-device checks close the loop', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '⏳', label: '32 days left' },
    ],
  },
  {
    day: 10,
    date: 'AUG 28, 2026',
    title: 'Submitted to the App Store',
    summary: 'The first version of Sted is officially out of my hands and waiting for Apple.',
    items: [
      { label: 'App Store submission completed', status: 'Done' },
      { label: 'Privacy + Terms reviewed', status: 'Done' },
      { label: 'In-app account deletion verified', status: 'Done' },
      { label: 'Review Notes prepared', status: 'Done' },
      { label: 'Final TestFlight build tested', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '⏳', label: '33 days left' },
    ],
  },
  {
    day: 9,
    date: 'AUG 27, 2026',
    title: 'Sted is on TestFlight',
    summary: 'The paper prototype became a real installable iPhone app.',
    items: [
      { label: 'First TestFlight build uploaded', status: 'Done' },
      { label: 'Native iOS app running on real devices', status: 'Done' },
      { label: 'Share Extension working', status: 'Done' },
      { label: 'Backend connected end-to-end', status: 'Done' },
      { label: 'Ready for real-world testing', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '⏳', label: '34 days left' },
    ],
  },
  {
    day: 8,
    date: 'AUG 26, 2026',
    title: 'The 24-hour build starts',
    summary: 'The prototype phase is over. Today the goal became getting the smallest real version of Sted onto an iPhone as fast as possible.',
    items: [
      { label: 'MVP scope frozen', status: 'Done' },
      { label: 'Native iOS build underway', status: 'Done' },
      { label: 'Share Extension connected', status: 'Done' },
      { label: 'Backend + authentication integrated', status: 'Done' },
      { label: 'TestFlight became the next milestone', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '⏳', label: '35 days left' },
    ],
  },
  {
    day: 7,
    date: 'AUG 25, 2026',
    title: 'From paper sketch to native prototype',
    summary: 'The MVP direction locked in today — save-first capture, project-based organization, and a working extraction + understanding pipeline — while the iOS prototype and backend took shape in parallel.',
    items: [
      { label: 'MVP direction locked: save-first context layer', status: 'Done' },
      { label: 'Gemini 3.5 Flash-Lite selected for content understanding', status: 'Done' },
      { label: '≥0.90 confidence auto-assigns project; manual always wins', status: 'Done' },
      { label: 'URL extraction ladder shipped: HTTP + deterministic retry', status: 'Done' },
      { label: 'iOS prototype + Share Extension; backend schema, auth, search', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '⏳', label: '36 days left' },
    ],
  },
  {
    day: 6,
    date: 'AUG 24, 2026',
    title: 'I have a name. Now I have a face.',
    summary: 'The name was already decided. Today the identity around it started becoming real — a simpler visual system, a character, and the first version of Sted’s own voice.',
    items: [
      { label: 'Brand direction defined', status: 'Done' },
      { label: 'Sted character direction defined', status: 'Done' },
      { label: '2D identity being finalized', status: 'Done' },
      { label: 'Brand voice and Dante × Sted relationship defined', status: 'Done' },
      { label: 'First Sted guide created: “How to choose a name”', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '⏳', label: '37 days left' },
    ],
  },
  {
    day: 5,
    date: 'AUG 23, 2026',
    title: 'Making the story shareable',
    summary: 'No new feature today — the real work was making sure Sted actually looks like Sted when the build-in-public story gets shared.',
    items: [
      { label: 'Branded social preview image created', status: 'Done' },
      { label: 'Open Graph metadata fixed (og:image, og:url)', status: 'Done' },
      { label: 'X/Twitter card switched to large-image format', status: 'Done' },
      { label: 'Day 3 and Day 4 build log content published live', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '⏳', label: '38 days left' },
    ],
  },
  {
    day: 4,
    date: 'AUG 22, 2026',
    title: 'Content keeps compounding',
    summary: 'Kept making videos and posting consistently — Sted’s Instagram just crossed 200 followers.',
    items: [
      { label: 'Video content continues', status: 'Done' },
      { label: 'Consistent posting cadence', status: 'Done' },
      { label: 'Instagram passed 200 followers', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '📸', label: '200 IG followers' },
      { icon: '⏳', label: '39 days left' },
    ],
  },
  {
    day: 2,
    date: 'AUG 20, 2026',
    title: 'Starting to make Sted real',
    summary: 'Today I finally explained the idea behind Sted publicly and started turning it into the first actual product mockups.',
    items: [
      { label: 'Sted explained publicly', status: 'Done' },
      { label: 'First product mockups', status: 'Done' },
      { label: 'Core idea: save → understand → find again', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '📱', label: 'First mockups' },
      { icon: '⏳', label: '41 days left' },
    ],
  },
  {
    day: 1,
    date: 'AUG 19, 2026',
    title: 'The experiment is live',
    summary: 'The first build-in-public video is live and the 43-day experiment has officially started.',
    items: [
      { label: 'First build-in-public video published', status: 'Done' },
      { label: 'Sted social accounts live', status: 'Done' },
      { label: 'D-U-N-S application submitted', status: 'Done' },
      { label: 'Mercury account opened', status: 'Done' },
      { label: 'Content system/research', status: 'Done' },
      { label: 'Website + newsletter work', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '💻', label: '0 lines of mobile app code' },
      { icon: '⏳', label: '42 days left' },
    ],
  },
  {
    day: 0,
    date: 'AUG 18, 2026',
    title: 'It starts here',
    summary: 'The first day building Sted and the first lines of the story.',
    items: [
      { label: 'Website online', status: 'Done' },
      { label: 'Logo v0', status: 'Done' },
      { label: 'Banners', status: 'Done' },
      { label: 'Social accounts', status: 'Done' },
      { label: 'First product sketch', status: 'Done' },
      { label: 'Backend setup for emails', status: 'Done' },
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '💻', label: '0 lines of code for the mobile app' },
    ],
  },
]

const danteLogs: BuildLog[] = [
  {
    day: 14,
    date: 'SEP 1, 2026',
    title: 'Meet Sted',
    summary: 'After two weeks building the product, Sted finally became a character. Today I started turning the little guy behind the name into the face of the product.',
  },
  {
    day: 13,
    date: 'AUG 31, 2026',
    title: 'Apple is reviewing Sted',
    summary: 'Sted is now in Apple’s hands. While I wait, I’m using the time to rethink the brand and what Sted should feel like beyond the app.',
  },
  {
    day: 12,
    date: 'AUG 30, 2026',
    title: 'Building the content machine',
    summary: 'Shipping the app is only half the job. Today was about figuring out how to consistently tell the story of building Sted while I’m still building it.',
  },
  {
    day: 11,
    date: 'AUG 29, 2026',
    title: 'My vibe coding workflow',
    summary: 'I’m not building Sted by writing every line myself. Today I broke down the workflow I’m using to go from idea → AI → code → test → working product.',
  },
  {
    day: 10,
    date: 'AUG 28, 2026',
    title: 'I submitted Sted to Apple',
    summary: 'Today Sted went to the App Store. Before submitting it, I went through privacy, account deletion, review notes, TestFlight and the little things Apple can reject you for.',
  },
  {
    day: 9,
    date: 'AUG 27, 2026',
    title: 'From drawing to TestFlight',
    summary: 'A few days ago Sted was a drawing. Today the actual iPhone app is running through TestFlight and I can finally give it to real people to break.',
  },
  {
    day: 8,
    date: 'AUG 26, 2026',
    title: 'Can we build the app in 24 hours?',
    summary: 'Apple review might take longer than building the app itself, so the new goal is ridiculous: turn yesterday’s prototype into a real iPhone app in 24 hours.',
  },
  {
    day: 7,
    date: 'AUG 25, 2026',
    title: 'Hackathon inside the hackathon',
    summary: 'I learned Apple review can take 15+ days, so I gave myself 24 hours to turn a paper sketch of Sted into a TestFlight-ready iPhone app — and 48 to get it App Store-ready.',
    published: true,
    slug: 'day-7',
    body: [
      'This one is going to be longer than usual, because a lot happened.',
      'I thought I had weeks left before I needed to think about the App Store. Then I saw developers reporting that Apple review can take 15 or more days in some cases — sometimes much longer.',
      'I don’t know if every review actually takes that long. That’s not really the point. The point is that if I wait until the end of the Shipaton to submit Sted, and it turns out review takes two or three weeks, I’m already too late.',
      'So today I created a deadline inside the deadline.',
      '24 hours: turn the current sketches into a functional iPhone MVP and get it into TestFlight.',
      '48 hours: have the first App Store version ready to submit.',
      'A hackathon inside the hackathon.',
      '## Starting on paper',
      'I’m not a developer. So instead of opening Xcode, I opened a notebook.',
      'I drew Sted’s screens by hand — onboarding, the save flow, the library, item detail. Then I photographed the sketches and sent them to ChatGPT.',
      'ChatGPT turned the drawings into actual mockups, and I iterated on the UX from there, using Mobbin as a reference for how similar apps handle capture and organization.',
      'Once the direction felt right, I turned it into a build plan — and that’s where Claude Code took over, building the native iOS prototype screen by screen while I kept refining the product decisions in parallel.',
      'Paper, photo, ChatGPT, mockup, build plan, Claude Code. That’s the pipeline that produced most of today’s product.',
      '## What Sted actually is now',
      'Today the product direction got a lot more specific. Sted isn’t a bookmark manager with AI bolted on.',
      'It’s a context layer for the things you save while you’re working — articles, links, LinkedIn posts, tweets, Instagram posts, YouTube videos, TikToks, documents. You send it to Sted, and Sted saves it, reads what it can, understands it, organizes it around your projects, and makes it retrievable later.',
      'The interaction model matters as much as the idea. We debated a chat-first experience against something closer to a fast-capture tool, and landed firmly on: saving has to require zero thinking. No picking a project, no tags, no waiting for AI, before the thing is saved. Share it to Sted, see “Saved”, go back to what you were doing. Everything else — understanding, organizing — happens afterward.',
      'Save first. Think later.',
      'When something is saved, Sted also tries to figure out which of your projects it belongs to. We only let it decide automatically when it’s confident — in our testing, high-confidence predictions were reliably correct, so anything below that threshold is left uncategorized instead of guessing. You can always correct it, and a manual correction always wins over whatever Sted predicts later.',
      '## The part that turned out to be hard',
      'I expected calling Gemini to understand a saved item to be the hard part. It wasn’t, really — we tested Gemini 3.5 Flash-Lite as Sted’s understanding layer and it was good enough for the MVP. The more interesting problem turned out not to be the model at all.',
      'It was reliably extracting useful information from arbitrary URLs in the first place. Normal web pages are fine. Video and social platforms are not — YouTube gives you metadata but not a transcript, TikTok gives you almost nothing usable, Instagram gives you a caption but not the video itself.',
      'We ended up building an extraction ladder: a first pass with existing HTTP extraction, a second pass with more deterministic retries and better metadata/JSON-LD/OpenGraph parsing, and a third, heavier option using a real browser to render the page. Each item also tracks its own provenance — whether we got the full content, just metadata, or almost nothing — instead of quietly pretending every save is fully understood.',
      'The third tier only helped with one extra case in our sample, at the cost of roughly 12 seconds of latency and a lot of infrastructure complexity. So for today, we’re shipping the first two tiers and keeping the browser-based option experimental rather than forcing it into the MVP. And if all Sted actually saw was a title or a caption, it has to say so — it never gets to claim it watched or listened to something it didn’t.',
      'That’s a decision I’m fairly proud of. When AI can build quickly, the constraint stops being “can I build this” and starts being “is this worth building right now.”',
      '## Where things stand tonight',
      'The iOS prototype can already walk through onboarding, saving, a library, search, item detail and settings. The Share Extension works end to end as a UI flow. The backend has a real schema, auth, search and the extraction pipeline behind it.',
      'None of it is connected to a real deployment yet. Apple Developer access — the thing that unlocks Sign in with Apple, App Groups, provisioning and TestFlight itself — is still not resolved. The backend isn’t deployed. That’s tomorrow’s problem.',
      '## The video',
      'Today’s build-in-public video walked through the same pipeline:',
      'I have 24 hours to turn this drawing into an iPhone app.',
      'Why? I just learned Apple can take 15 or more days to review it.',
      'So I’m building it in 24 hours. Check the comments for every prompt I use.',
      'Here’s the workflow:',
      'Draw the app. Take a picture. Send it to ChatGPT. Turn the sketch into a mockup. Ask ChatGPT for the build plan. Then Claude Code does the magic.',
      'That’s it.',
      'Tomorrow, we try to get it into TestFlight.',
      '## What I actually learned today',
      'AI makes execution dramatically faster. It does not make product decisions for you, and it doesn’t make Apple’s bureaucracy move any faster.',
      'The question stopped being “can I code this” a while ago. Today it became “can I make the right calls and coordinate everything fast enough.”',
      'The clock is still running. Sted is not in TestFlight yet.',
    ],
  },
  {
    day: 6,
    date: 'AUG 24, 2026',
    title: 'How I chose the name Sted',
    summary: 'Today I finally shared why I chose the name Sted — and the simple tests I used to decide whether a name was worth keeping.',
    published: true,
    slug: 'day-6',
    body: [
      'I went through a lot of names before choosing Sted.',
      'I wanted something that was short, easy to say, easy to spell, easy to remember, easy to pronounce in both English and Spanish, and capable of becoming a brand instead of just describing the product.',
      'Eventually I landed on Sted.',
      '## The four tests',
      'Before committing to a name, I used four simple questions.',
      'Can people say it? If you have to explain how to pronounce it, that’s friction every time someone talks about you.',
      'Can they spell it without asking? A name someone can’t type into a search bar from memory loses them.',
      'Will they remember it tomorrow? Most names get heard once, in passing — if it doesn’t stick, it doesn’t matter how clever it is.',
      'Can I get a good domain? Not necessarily the exact .com, just something clean enough that it doesn’t undercut the name itself.',
      'These are practical filters, not universal naming laws — just what worked for me.',
      '## The domain problem',
      'There was one problem: sted.com was already registered.',
      'But I realized I was putting too much importance on owning the exact .com. A good name doesn’t necessarily need it — you can sometimes use alternatives like get[name], use[name], hey[name], or choose a TLD that makes sense for the product.',
      'For Sted, sted.ai was available. That was enough.',
      '## Stop naming. Start building.',
      'You can spend weeks searching for the perfect name. But eventually the name matters less than what you build behind it.',
      'Sted passed the tests I cared about, so I stopped searching. Now I have to build something worth remembering.',
      '## The prompts',
      'I also turned this whole process into a free guide with the naming framework and the exact prompts I used.',
    ],
    ctaHref: '/guides/how-to-choose-a-name',
    ctaLabel: 'Try the naming prompts →',
    bodyAfterStats: [
      'Until now, I’ve been the one talking about Sted.',
      'Tomorrow, Sted gets to introduce itself.',
    ],
  },
  {
    day: 5,
    date: 'AUG 23, 2026',
    title: 'Fixing how Sted looks when it’s shared',
    summary: 'While pushing the last few days of content out, I noticed every shared Sted link showed a generic icon instead of the brand — so today I fixed it.',
    published: true,
    slug: 'day-5',
    body: [
      'Day 5 didn’t produce a new video or a big product update.',
      'Most of it went into something less visible: making sure the story I’ve been telling actually looks right when someone else shares it.',
      'I was sending the Day 3 and Day 4 posts around — DMs, group chats, comments — and kept noticing the same thing. Every link to sted.ai showed a plain, generic icon instead of anything that looked like Sted.',
      'For a project that’s supposed to be built and shared in public, that’s a real problem. The first impression of the whole experiment was a broken preview.',
      'So today I fixed it. I built a proper social preview image — the actual Sted look, not a placeholder — and corrected the metadata so X, LinkedIn and iMessage all pick it up correctly.',
      'It’s a small, unglamorous fix. No new feature, no new user, nothing to film.',
      'But it’s the kind of thing that matters more than it looks like it does — if the story is worth sharing, it should at least look like it when someone does.',
      'Lesson for today: distribution isn’t just posting. It’s making sure what you post actually represents you once it leaves your hands.',
      'Tomorrow I go back to something more personal: why I picked the name Sted in the first place.',
    ],
  },
  {
    day: 4,
    date: 'AUG 22, 2026',
    title: 'Choose something you care about',
    summary: 'If you’re going to build something of your own, don’t pick it just because it might make money — pick something you actually care about, because it takes longer than you think.',
    published: true,
    slug: 'day-4',
    body: [
      'If you’re thinking about building something of your own, here’s the part nobody tells you clearly enough: don’t choose it just because you think it’ll make money.',
      'Building almost anything takes longer than you expect. A personal brand, an app, a business, a project of your own. Whatever amount of time you’re imagining right now, multiply it by ten.',
      'Which means you should pick something you actually care about, because you’re going to be spending a lot of time with it.',
      'That’s a big part of why I’m building Sted. It’s not a problem I made up for this experiment — I’ve wanted something like this for years, since before ChatGPT even existed.',
      'And it’s not really about having too many bookmarks. The tools I already use for saving things — links, screenshots, notes — turn into databases that are painful to go back through. You save something, then later you forget you saved it, or you can’t find it when you actually need it.',
      'I want Sted for myself. I’m basically my first user. AI is what finally makes it possible for me to try building it, even without knowing how to code.',
      'If you’re building your own thing too: choose wisely. You’ll be spending a lot of time with it.',
    ],
  },
  {
    day: 3,
    date: 'AUG 21, 2026',
    title: 'Can one person do this?',
    summary: 'I used to run a creative studio with more than 15 people. Now it’s just me and the computer, and I’m starting to realize coding might not be the hardest part.',
    published: true,
    slug: 'day-3',
    body: [
      'I used to run a creative studio. At one point we had a team of more than 15 people.',
      'Now it’s just me. The computer and a coffee.',
      'When I decided to build Sted, I assumed coding would be the hard part, since I don’t actually know how to code.',
      'A few days in, I’m realizing that’s not really it.',
      'Building something alone means doing everything: product, design, coding, marketing, content, research, operations, and whatever else shows up along the way that nobody warns you about.',
      'All of it, at the same time, with no one to hand it off to.',
      'So the question I keep coming back to is simple: can one person actually do the work that used to take a team of 15 or more, using AI?',
      'I don’t know yet. That’s part of what this whole thing is trying to find out.',
    ],
  },
  {
    day: 2,
    date: 'AUG 20, 2026',
    title: 'The first 100 followers',
    summary: 'Published the second video, looked at the first analytics, and started figuring out how to make this content system less manual.',
    published: true,
    slug: 'day-2',
    body: [
      'Yesterday I published my first video talking to a camera in a language that isn’t my own.',
      'Then I did what any sophisticated growth strategy would recommend: I sent it to more than 100 friends, family members and old colleagues on WhatsApp.',
      'It worked.',
      'I started the day looking at the first analytics. Instagram crossed 100 followers, while X and LinkedIn each gained... one.',
      'Not exactly viral yet.',
      'But honestly, getting the first video out was probably more important than the numbers. Filming myself, listening to my own voice, doing it in English and then voluntarily putting it on the internet was way more uncomfortable than I expected.',
      'Today I did it again.',
      'I filmed and edited the second video, this time finally explaining what Sted is and the problem I’m trying to solve.',
      'I also got a reply on X from one of RevenueCat’s co-founders, which was pretty cool considering this whole thing exists because I decided to enter their competition.',
      'The other thing becoming obvious very quickly is that building in public means a ridiculous amount of manual publishing.',
      'One video needs to go to Instagram, TikTok, YouTube, LinkedIn and X, plus there are the Sted accounts. So I spent some time today figuring out how I can automate more of this with AI instead of spending hours uploading the same thing everywhere.',
      'If I manage to build a good system for it, I’ll share the whole thing.',
      'Today’s numbers:',
    ],
    stats: [
      { icon: '📸', label: 'Instagram: +100 followers' },
      { icon: '🐦', label: 'X: +1 follower' },
      { icon: '💼', label: 'LinkedIn: +1 follower' },
      { icon: '👤', label: 'Sted users: 0' },
      { icon: '💰', label: 'Revenue: $0' },
    ],
    bodyAfterStats: [
      'On the product side, the first Sted mockups are starting to exist.',
      'Still very early. Still a lot more publishing than coding.',
      'Keep building.',
      '41 days left.',
    ],
  },
  {
    day: 1,
    date: 'AUG 19, 2026',
    title: 'I finally launched',
    summary: 'Yesterday I didn’t make it. Today the first video went live and the 43-day experiment officially started. Most of the day disappeared into D-U-N-S, banking, verification, websites, content and company setup. The actual mobile app? Still 0 lines of code.',
    published: true,
    slug: 'day-1',
    body: [
      'Yesterday was Day 0 because I didn’t manage to launch.',
      'Today, I finally did.',
      'The first video is out, the Sted accounts are live, and the build in public experiment has officially started.',
      'It feels slightly ridiculous that I’m now publicly documenting myself trying to build a mobile app when the current number of lines of mobile app code is still exactly zero.',
      'But that’s kind of the point.',
      'A big part of today was still doing all the boring stuff around building a company that nobody really talks about.',
      'I submitted the D-U-N-S application I need to enroll Sted as an organization in the Apple Developer Program. I opened a Mercury account. I also tried opening a Brex account, only to find out I need a physical US business address they accept.',
      'Between banking, SMS verification issues and company setup, I somehow lost more than two hours.',
      'I also spent time researching content and figuring out how I want to document these 43 days, updated my personal website, set up the newsletter backend, and continued working on Sted’s website and social accounts.',
      'And then there was the actual launch.',
      'I published the first video and started putting Sted out into the world.',
      'No users magically appeared.',
      'No revenue either.',
      'And I still haven’t started coding the mobile app.',
      'Current Sted stats:',
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '💻', label: '0 lines of code for the mobile app' },
    ],
    bodyAfterStats: [
      'On the personal side: another ~12 hours on the computer, one coffee, one Coke Zero, no gym, no yoga, and an unreasonable amount of time spent configuring things that I assumed would take five minutes.',
      'Day 1 is done.',
      'The infrastructure is slowly getting out of the way.',
      'Tomorrow, I really need to start building the actual product.',
      '42 days left.',
    ],
  },
  {
    day: 0,
    date: 'AUG 18, 2026',
    title: 'I didn’t launch',
    summary: 'I was supposed to launch Sted today. I didn’t make it — so I’m calling this Day 0. The website is online, but the app doesn’t exist yet. Tomorrow is Day 1.',
    published: true,
    slug: 'day-0',
    body: [
      'This one will be short.',
      'I was supposed to launch Sted today. I didn’t make it.',
      'The first video is actually filmed and edited, but by the time I finished setting everything else up, it was almost midnight where I am. I still had to prepare the posts, the accounts, and everything that comes with trying to launch something properly.',
      'So instead of rushing it, I’m calling this Day 0.',
      'Today was mostly setup: I got the website online, worked on the logo, colors and fonts, created the social accounts, made the banners, set up the waitlist and email backend, and a bunch of other things I didn’t expect.',
      'On the personal side: around 12 hours on the computer, three coffees, one yoga class, way too many AI prompts, and one mild existential crisis about whether doing all of this publicly is actually a good idea.',
      'Current Sted stats:',
    ],
    stats: [
      { icon: '👤', label: '0 users' },
      { icon: '💰', label: '$0 revenue' },
      { icon: '💻', label: '0 lines of code for the mobile app' },
    ],
    bodyAfterStats: [
      'The website exists. The app doesn’t.',
      'Tomorrow is Day 1.',
      '43 days left to build my first mobile app, get it on the App Store, and see how far I can get without knowing how to code.',
    ],
  },
]

function TimelineEntry({ log, kind }: { log: BuildLog; kind: 'sted' | 'dante' }) {
  return <article className="timeline-entry">
    <div className="timeline-meta">
      <span className={`timeline-kind kind-${kind}`}>{kind === 'sted' ? 'Sted' : 'Dante'}</span>
      <span className="timeline-day">Day {log.day}</span>
      <span className="timeline-date">{log.date}</span>
    </div>
    <div className="timeline-content">
      <h3 className="timeline-title">{log.title}</h3>
      <p className="timeline-summary">{log.summary}</p>
      {kind === 'sted' && log.items && <ul className="timeline-chips">
        {log.items.map((item) => <li key={item.label} className={`chip ${item.status === 'Done' ? 'chip-done' : 'chip-pending'}`}>{item.label}</li>)}
      </ul>}
      {kind === 'sted' && log.stats && <ul className="timeline-stats">
        {log.stats.map((stat) => <li key={stat.label}><span aria-hidden="true">{stat.icon}</span> {stat.label}</li>)}
      </ul>}
      {kind === 'dante' && log.published === false && <span className="chip chip-pending">Coming later today</span>}
      {kind === 'dante' && log.slug && <a className="post-link" href={`/build/${log.slug}`}><span aria-hidden="true">📖</span> Read the full Day {log.day} blog <span aria-hidden="true">→</span></a>}
    </div>
  </article>
}

type LandingPageProps = { email: string; status: string; isSubmitting: boolean; onEmailChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }

function BuildPreviewSection() {
  const stedLog = stedLogs[0]
  const danteLog = danteLogs[0]
  const latestDay = Math.max(stedLog.day, danteLog.day)
  return <section className="build-preview shell" aria-labelledby="build-preview-title">
    <p className="eyebrow">DAY {latestDay} OF {TOTAL_DAYS}</p>
    <h2 id="build-preview-title">Building Sted in public.</h2>
    <div className="build-preview-grid">
      <div className="preview-col">
        <p className="section-label preview-label-dante">FOUNDER LOG — DANTE</p>
        <div className="preview-day">
          <span className="preview-day-number">{String(danteLog.day).padStart(2, '0')}</span>
          <div><h3>{danteLog.title}</h3><p className="preview-date">{danteLog.date}</p></div>
        </div>
        <p className="preview-quote">{danteLog.published === false ? '“Tonight: the story of how day one actually went.”' : `“${danteLog.summary}”`}</p>
        <p className="preview-status">{danteLog.published === false ? 'Coming later today' : 'Read the post'}</p>
      </div>
      <div className="preview-col">
        <p className="section-label">STED LOG</p>
        <div className="preview-day">
          <span className="preview-day-number">{String(stedLog.day).padStart(2, '0')}</span>
          <div><h3>{stedLog.title}</h3><p className="preview-date">{stedLog.date}</p></div>
        </div>
        {stedLog.items && <ul className="preview-checklist">
          {stedLog.items.map((item) => <li key={item.label} className={item.status === 'Done' ? 'is-done' : 'is-next'}><span className="preview-dot" />{item.label}</li>)}
        </ul>}
      </div>
    </div>
    <a className="preview-cta" href="/build">Read the full build log <span aria-hidden="true">↗</span></a>
  </section>
}

export function LandingPage({ email, status, isSubmitting, onEmailChange, onSubmit }: LandingPageProps) {
  return <>
    <section className="hero shell" aria-labelledby="hero-title">
      <p className="eyebrow">A new way to keep what matters</p>
      <h1 id="hero-title"><span>Everything you save.</span><span><em>Finally useful.</em></span></h1>
      <p className="hero-copy">Links, screenshots, notes, ideas.<br />Sted organizes it around your projects and helps you find it again.</p>
      <form id="waitlist" className="waitlist-form" onSubmit={onSubmit} noValidate>
        <label className="sr-only" htmlFor="email">Your email address</label>
        <input id="email" name="email" type="email" required value={email} onChange={(event) => onEmailChange(event.target.value)} placeholder="your@email.com" aria-describedby="form-note form-status" />
        <button className="button button-amber" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Joining…' : 'Join the waitlist'} <span aria-hidden="true">↗</span></button>
      </form>
      <p id="form-note" className="form-note"><span className="tiny-dot" /> Early access <span className="note-divider">·</span> No spam. Just updates.</p>
      <p id="form-status" className="form-status" role="status">{status}</p>
    </section>
    {SHOW_BUILD_IN_PUBLIC && <BuildPreviewSection />}
  </>
}

export function AboutPage() {
  return <main className="simple-page shell" aria-labelledby="about-title">
    <p className="section-label">ABOUT STED</p>
    <h1 id="about-title">Keep the things<br />worth coming back to.</h1>
    <p className="simple-lede">Sted is being built for the links, screenshots, notes and ideas you save because they might matter later.</p>
    <div className="simple-page-grid"><div><p className="section-label">THE IDEA</p><h2>A calmer place for what you keep.</h2></div><p>Sted helps you understand what you save, organize it around your projects and find it when you need it. It is being built in public, one day at a time.</p></div>
  </main>
}

export function BuildPublicPage() {
  const latestDante = danteLogs[0]
  const latestDay = Math.max(stedLogs[0].day, danteLogs[0].day)
  return <main className="build-page shell" aria-labelledby="build-title">
    <div className="build-status" aria-label="Build status"><span className="amber-dot" /> <span>Day {latestDay} / {TOTAL_DAYS}</span><span className="status-separator">·</span><span>Building Sted in public</span></div>
    <p className="section-label">BUILDING IN PUBLIC</p>
    <h1 id="build-title">Day {latestDante.day} — {latestDante.title}.</h1>
    <p className="simple-lede">A simple naming framework, the constraints I used, and why I stopped looking for the perfect .com.<br />DANTE tracks the journey. STED tracks the product.</p>
    <div className="build-timeline">
      <p className="section-label timeline-track-label">DANTE LOG — THE JOURNEY</p>
      {danteLogs.map((log) => <TimelineEntry key={`dante-${log.day}`} log={log} kind="dante" />)}
      <p className="section-label timeline-track-label">STED LOG — THE PRODUCT</p>
      {stedLogs.map((log) => <TimelineEntry key={`sted-${log.day}`} log={log} kind="sted" />)}
    </div>
  </main>
}

export function BuildLogPostPage({ slug }: { slug: string }) {
  const log = danteLogs.find((entry) => entry.slug === slug)
  if (!log) return <main className="simple-page shell" aria-labelledby="post-title">
    <a className="post-back" href="/build">← Back to the build log</a>
    <h1 id="post-title">Post not found.</h1>
  </main>
  return <main className="simple-page blog-post shell" aria-labelledby="post-title">
    <a className="post-back" href="/build">← Back to the build log</a>
    <p className="section-label preview-label-dante">FOUNDER LOG — DANTE</p>
    <h1 id="post-title">Day {log.day} — {log.title}</h1>
    <p className="post-date">{log.date}</p>
    <div className="post-body">
      {log.body?.map((paragraph, index) => paragraph.startsWith('## ') ? <h2 key={index}>{paragraph.slice(3)}</h2> : <p key={index}>{paragraph}</p>)}
      {log.stats && <ul className="timeline-stats">{log.stats.map((stat) => <li key={stat.label}><span aria-hidden="true">{stat.icon}</span> {stat.label}</li>)}</ul>}
      {log.ctaHref && log.ctaLabel && <a className="post-link" href={log.ctaHref}>{log.ctaLabel}</a>}
      {log.bodyAfterStats?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </div>
  </main>
}

export function ContactPage() {
  return <main className="simple-page contact-page shell" aria-labelledby="contact-title">
    <p className="section-label">CONTACT</p>
    <h1 id="contact-title">Have a thought<br />about Sted?</h1>
    <p className="simple-lede">Questions, ideas or just want to say hello? Send a note to Dante — he’ll personally answer your emails.</p>
    <a className="contact-email" href="mailto:hello@sted.ai">hello@sted.ai <span aria-hidden="true">↗</span></a>
  </main>
}

type SupportStatus = 'idle' | 'sending' | 'success' | 'error'

export function SupportPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — real users never fill this
  const [status, setStatus] = useState<SupportStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (website) return // honeypot tripped — silently drop

    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedMessage = message.trim()

    if (!trimmedName || trimmedName.length > 100) {
      setStatus('error')
      setStatusMessage('Please enter your name.')
      return
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setStatus('error')
      setStatusMessage('Please enter a valid email address.')
      return
    }
    if (trimmedMessage.length < SUPPORT_MESSAGE_MIN || trimmedMessage.length > SUPPORT_MESSAGE_MAX) {
      setStatus('error')
      setStatusMessage(`Please write a message between ${SUPPORT_MESSAGE_MIN} and ${SUPPORT_MESSAGE_MAX} characters.`)
      return
    }

    setStatus('sending')
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, message: trimmedMessage, website }),
      })
      if (!response.ok) throw new Error('Request failed')

      setStatus('success')
      setStatusMessage("Message sent. We'll get back to you soon.")
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
      setStatusMessage('Something went wrong. You can also email us at hello@sted.ai.')
    }
  }

  return <main className="simple-page support-page shell" aria-labelledby="support-title">
    <p className="section-label">SUPPORT</p>
    <h1 id="support-title">How can we help?</h1>
    <p className="simple-lede">Send us a message and we'll get back to you.</p>
    <form className="support-form" onSubmit={handleSubmit} noValidate>
      <div className="support-field-hidden" aria-hidden="true">
        <label htmlFor="support-website">Website</label>
        <input id="support-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>
      <label className="sr-only" htmlFor="support-name">Name</label>
      <input id="support-name" name="name" type="text" required maxLength={100} placeholder="Name" value={name} onChange={(event) => { setName(event.target.value); setStatus('idle') }} />
      <label className="sr-only" htmlFor="support-email">Email</label>
      <input id="support-email" name="email" type="email" required placeholder="Email" value={email} onChange={(event) => { setEmail(event.target.value); setStatus('idle') }} />
      <label className="sr-only" htmlFor="support-message">Message</label>
      <textarea id="support-message" name="message" required minLength={SUPPORT_MESSAGE_MIN} maxLength={SUPPORT_MESSAGE_MAX} rows={6} placeholder="Message" value={message} onChange={(event) => { setMessage(event.target.value); setStatus('idle') }} />
      <button className="button button-amber" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span></button>
    </form>
    <p className="support-status" role="status" data-status={status}>{statusMessage}</p>
    <a className="contact-email" href="mailto:hello@sted.ai">hello@sted.ai <span aria-hidden="true">↗</span></a>
  </main>
}

export function RoutePage({ route, postSlug, guideSlug, onOpenWaitlist, ...landingProps }: { route: 'landing' | 'about' | 'build' | 'contact' | 'post' | 'guides' | 'guide' | 'support'; postSlug?: string | null; guideSlug?: string | null; onOpenWaitlist: () => void } & LandingPageProps): ReactNode {
  if (route === 'about') return <AboutPage />
  if (route === 'build') return <BuildPublicPage />
  if (route === 'post') return <BuildLogPostPage slug={postSlug ?? ''} />
  if (route === 'guides') return <GuidesIndexPage />
  if (route === 'guide') return <GuidePage slug={guideSlug ?? ''} onOpenWaitlist={onOpenWaitlist} />
  if (route === 'support') return <SupportPage />
  if (route === 'contact') return <ContactPage />
  return <LandingPage {...landingProps} />
}
