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

function LogCard({ log, kind }: { log: BuildLog; kind: 'sted' | 'dante' }) {
  return <details className={`archive-log ${kind}-archive-log`} open={log.day === 1}>
    <summary><div><p className="section-label">{kind === 'sted' ? 'STED BUILD LOG' : 'DANTE BUILD LOG'}</p><h3>Day {log.day} — {log.title}</h3><p>{log.summary}</p><p className="metadata">{log.date} <span>·</span> {log.published === false ? 'POST COMING SOON' : 'OPEN LOG'} <b aria-hidden="true">＋</b></p></div></summary>
    {kind === 'sted' && log.items && <ul className="log-items">{log.items.map((item) => <li key={item.label}><span>{item.label}</span><span>{item.status}</span></li>)}</ul>}
    {kind === 'dante' && <div className="post-placeholder"><p>The Day 1 post will be published here at the end of the day.</p><span className="metadata">COMING LATER TODAY</span></div>}
  </details>
}

type LandingPageProps = { email: string; status: string; isSubmitting: boolean; onEmailChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }

export function LandingPage({ email, status, isSubmitting, onEmailChange, onSubmit }: LandingPageProps) {
  return <>
    <section className="hero shell" aria-labelledby="hero-title">
      <p className="eyebrow">A new way to keep what matters</p>
      <h1 id="hero-title"><span>Everything you save.</span><span><em>Finally useful.</em></span></h1>
      <p className="hero-copy">Links, screenshots, notes, ideas.<br />Sted understands what you save,<br />organizes it around your projects,<br />and helps you find it again.</p>
      <form id="waitlist" className="waitlist-form" onSubmit={onSubmit} noValidate>
        <label className="sr-only" htmlFor="email">Your email address</label>
        <input id="email" name="email" type="email" required value={email} onChange={(event) => onEmailChange(event.target.value)} placeholder="your@email.com" aria-describedby="form-note form-status" />
        <button className="button button-amber" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Joining…' : 'Join the waitlist'} <span aria-hidden="true">↗</span></button>
      </form>
      <p id="form-note" className="form-note"><span className="tiny-dot" /> Early access <span className="note-divider">·</span> No spam. Just updates.</p>
      <p id="form-status" className="form-status" role="status">{status}</p>
    </section>
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
    <p className="section-label">BUILDING IN PUBLIC</p>
    <h1 id="build-title">Day 1 — It starts here.</h1>
    <p className="simple-lede">I’m building Sted from scratch in 45 days and sharing everything along the way.</p>
    <div className="build-archive-grid">
      <section aria-labelledby="dante-logs-title"><p className="section-label">DANTE’S BUILD LOG</p><h2 id="dante-logs-title">The story behind the build.</h2><div className="archive-list">{danteLogs.slice(0, 3).map((log) => <LogCard key={log.day} log={log} kind="dante" />)}</div></section>
      <section aria-labelledby="sted-logs-title"><p className="section-label">STED BUILD LOG</p><h2 id="sted-logs-title">What changed in the product.</h2><div className="archive-list">{stedLogs.slice(0, 3).map((log) => <LogCard key={log.day} log={log} kind="sted" />)}</div></section>
    </div>
  </main>
}

export function ContactPage() {
  return <main className="simple-page contact-page shell" aria-labelledby="contact-title">
    <p className="section-label">CONTACT</p>
    <h1 id="contact-title">Have a thought<br />about Sted?</h1>
    <p className="simple-lede">Questions, ideas or just want to say hello? Send a note to Dante at Finiks Labs.</p>
    <a className="contact-email" href="mailto:hello@finikslabs.com">hello@finikslabs.com <span aria-hidden="true">↗</span></a>
  </main>
}

export function RoutePage({ route, ...landingProps }: { route: 'landing' | 'about' | 'build' | 'contact' } & LandingPageProps): ReactNode {
  if (route === 'about') return <AboutPage />
  if (route === 'build') return <BuildPublicPage />
  if (route === 'contact') return <ContactPage />
  return <LandingPage {...landingProps} />
}
