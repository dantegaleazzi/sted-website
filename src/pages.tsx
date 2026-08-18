import type { FormEvent, ReactNode } from 'react'

type LogItem = { label: string; status: 'Done' | 'Next' }
type BuildLog = { day: number; date: string; title: string; summary: string; items?: LogItem[]; published?: boolean }

const stedLogs: BuildLog[] = [
  {
    day: 1,
    date: 'AUG 18, 2026',
    title: 'It starts here',
    summary: 'The first day building Sted and the first lines of the story.',
    items: [
      { label: 'Web created', status: 'Done' },
      { label: 'Logo v1 created', status: 'Done' },
      { label: 'Waitlist connected to Supabase', status: 'Done' },
      { label: 'Privacy Policy and Terms added', status: 'Done' },
      { label: 'Libre Baskerville + Inter served locally', status: 'Done' },
      { label: 'Social accounts and launch banners', status: 'Next' },
    ],
  },
]

const danteLogs: BuildLog[] = [
  {
    day: 1,
    date: 'AUG 18, 2026',
    title: 'Building Sted from scratch.',
    summary: 'The daily post about what I built, what I learned and what comes next.',
    published: false,
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
      {kind === 'dante' && log.published === false && <span className="chip chip-pending">Coming later today</span>}
    </div>
  </article>
}

type LandingPageProps = { email: string; status: string; isSubmitting: boolean; onEmailChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }

function BuildPreviewSection() {
  const stedLog = stedLogs[0]
  const danteLog = danteLogs[0]
  return <section className="build-preview shell" aria-labelledby="build-preview-title">
    <p className="eyebrow">DAY {stedLog.day} OF 45</p>
    <h2 id="build-preview-title">Building Sted in public.</h2>
    <div className="build-preview-grid">
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
      <div className="preview-col">
        <p className="section-label">FOUNDER LOG — DANTE</p>
        <div className="preview-day">
          <span className="preview-day-number">{String(danteLog.day).padStart(2, '0')}</span>
          <div><h3>{danteLog.title}</h3><p className="preview-date">{danteLog.date}</p></div>
        </div>
        <p className="preview-quote">{danteLog.published === false ? '“Tonight: the story of how day one actually went.”' : `“${danteLog.summary}”`}</p>
        <p className="preview-status">{danteLog.published === false ? 'Coming later today' : 'Read the post'}</p>
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
  return <main className="build-page shell" aria-labelledby="build-title">
    <div className="build-status" aria-label="Build status"><span className="amber-dot" /> <span>Day 1 / 45</span><span className="status-separator">·</span><span>Building Sted in public</span></div>
    <p className="section-label">BUILDING IN PUBLIC</p>
    <h1 id="build-title">Day 1 — It starts here.</h1>
    <p className="simple-lede">I’m building Sted from scratch in 45 days and sharing everything along the way.</p>
    <div className="build-timeline">
      {stedLogs.slice(0, 3).map((log) => <TimelineEntry key={`sted-${log.day}`} log={log} kind="sted" />)}
      {danteLogs.slice(0, 3).map((log) => <TimelineEntry key={`dante-${log.day}`} log={log} kind="dante" />)}
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

export function RoutePage({ route, ...landingProps }: { route: 'landing' | 'about' | 'build' | 'contact' } & LandingPageProps): ReactNode {
  if (route === 'about') return <AboutPage />
  if (route === 'build') return <BuildPublicPage />
  if (route === 'contact') return <ContactPage />
  return <LandingPage {...landingProps} />
}
