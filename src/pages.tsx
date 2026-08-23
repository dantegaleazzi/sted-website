import type { FormEvent, ReactNode } from 'react'

type LogItem = { label: string; status: 'Done' | 'Next' }
type LogStat = { icon: string; label: string }
type BuildLog = { day: number; date: string; title: string; summary: string; items?: LogItem[]; stats?: LogStat[]; published?: boolean; slug?: string; body?: string[]; bodyAfterStats?: string[] }

const TOTAL_DAYS = 43

const stedLogs: BuildLog[] = [
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
    <BuildPreviewSection />
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
    <p className="simple-lede">Two timelines, one experiment. I’m building Sted from zero and documenting everything I learn along the way.<br />DANTE tracks the journey. STED tracks the product.</p>
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
      {log.body?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      {log.stats && <ul className="timeline-stats">{log.stats.map((stat) => <li key={stat.label}><span aria-hidden="true">{stat.icon}</span> {stat.label}</li>)}</ul>}
      {log.bodyAfterStats?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </div>
  </main>
}

export function ContactPage() {
  return <main className="simple-page contact-page shell" aria-labelledby="contact-title">
    <p className="section-label">CONTACT</p>
    <h1 id="contact-title">Have a thought<br />about Sted?</h1>
    <p className="simple-lede">Questions, ideas or just want to say hello? Send a note to Dante at Finiks Labs.</p>
    <a className="contact-email" href="mailto:hello@sted.ai">hello@sted.ai <span aria-hidden="true">↗</span></a>
  </main>
}

export function RoutePage({ route, postSlug, ...landingProps }: { route: 'landing' | 'about' | 'build' | 'contact' | 'post'; postSlug?: string | null } & LandingPageProps): ReactNode {
  if (route === 'about') return <AboutPage />
  if (route === 'build') return <BuildPublicPage />
  if (route === 'post') return <BuildLogPostPage slug={postSlug ?? ''} />
  if (route === 'contact') return <ContactPage />
  return <LandingPage {...landingProps} />
}
