import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { SourceIcon } from '../source-cards/source-icons'
import { SiteFooter } from '../footer/SiteFooter'
import './Landing4CPreview.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const supabase = supabaseUrl && supabasePublishableKey ? createClient(supabaseUrl, supabasePublishableKey) : null

type ResultIconName = 'projects' | 'chat' | 'summary' | 'tags'

const RESULTS: { icon: ResultIconName; color: string; title: string; top: number; chips?: string[]; extra?: string; meta?: string }[] = [
  { icon: 'projects', color: '#B2D78F', title: 'Projects', top: 138, chips: ['Sted launch', 'AI Agents', 'Travel'], extra: '+10' },
  { icon: 'chat', color: '#83B0FC', title: 'Chat with your saved items', top: 228, chips: ['What did I save this week'], extra: '+5' },
  { icon: 'summary', color: '#FCF3EB', title: 'Summary and key points', top: 318, meta: '24 summaries · 86 key points' },
  { icon: 'tags', color: '#FD95A0', title: 'Topics and tags', top: 408, chips: ['AI', 'Design', 'Startups'], extra: '+31' },
]

const SPOTIFY_BAR_HEIGHTS = [26, 52, 78, 40, 64, 34, 88, 46, 70, 30, 58, 42, 80, 36, 62, 28, 74, 48, 66, 32, 54, 38]

function GlobeIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="rgba(20,19,19,0.55)" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.94 9h-3.06a15.7 15.7 0 0 0-1.32-5.51A8.03 8.03 0 0 1 19.94 11zM12 4.04c.83 1.2 1.66 3.16 1.9 4.96h-3.8c.24-1.8 1.07-3.76 1.9-4.96zM4.06 13h3.06c.14 1.98.6 3.85 1.32 5.51A8.03 8.03 0 0 1 4.06 13zm0-2a8.03 8.03 0 0 1 4.38-5.51A15.7 15.7 0 0 0 7.12 11H4.06zM12 19.96c-.83-1.2-1.66-3.16-1.9-4.96h3.8c-.24 1.8-1.07 3.76-1.9 4.96zM10.1 13h3.8c-.1 1.53-.5 3.06-1.9 5.51A15.7 15.7 0 0 1 10.1 13zm.1-2c.1-1.53.5-3.06 1.9-5.51 1.4 2.45 1.8 3.98 1.9 5.51h-3.8zm5.44 7.51c.72-1.66 1.18-3.53 1.32-5.51h3.06a8.03 8.03 0 0 1-4.38 5.51z" /></svg>
}

function DocIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><path fill="#141313" d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h12V4H6zm2 3h8v1.6H8V7zm0 4h8v1.6H8V11zm0 4h5v1.6H8V15z" /></svg>
}

function SpotifyIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path fill="#1DB954" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
}

function ResultIcon({ name }: { name: ResultIconName }) {
  const common = { width: 23, height: 23, viewBox: '0 0 24 24', fill: '#141313', 'aria-hidden': true } as const
  switch (name) {
    case 'projects':
      return <svg {...common}><path d="M9 3h6a1 1 0 0 1 1 1v2h4a2 2 0 0 1 2 2v2H2V8a2 2 0 0 1 2-2h4V4a1 1 0 0 1 1-1zm1 3h4V5h-4v1zM2 11h20v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7zm7 2v2h6v-2H9z" /></svg>
    case 'chat':
      return <svg {...common}><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4.4 3.3a.6.6 0 0 1-.96-.48V17H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2.5 6.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm5.5 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm5.5 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z" /></svg>
    case 'summary':
      return <svg {...common}><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3h13A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-15zM7 8h10v1.6H7V8zm0 4.2h10v1.6H7v-1.6zM7 16.4h6V18H7v-1.6z" /></svg>
    case 'tags':
      return <svg {...common}><path d="M12.6 3.4 20 10.8a2 2 0 0 1 0 2.83l-6.37 6.37a2 2 0 0 1-2.83 0L3.4 12.6a2 2 0 0 1-.6-1.42V5a1.6 1.6 0 0 1 1.6-1.6h6.18a2 2 0 0 1 1.42.6zM7.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
  }
}

function ResultRow({ icon, color, title, top, chips, extra, meta }: (typeof RESULTS)[number]) {
  return <div className="l4c-result-row" style={{ top }}>
    <div className="l4c-result-icon" style={{ background: color }}><ResultIcon name={icon} /></div>
    <div className="l4c-result-body">
      <span className="l4c-result-title">{title}</span>
      {chips && <div className="l4c-result-chips">
        {chips.map((chip) => <span key={chip} className="l4c-chip">{chip}</span>)}
        {extra && <span className="l4c-chip-extra">{extra}</span>}
      </div>}
      {meta && <span className="l4c-result-meta">{meta}</span>}
    </div>
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="l4c-result-caret"><path fill="rgba(20,19,19,0.34)" d="M9 6l6 6-6 6V6z" /></svg>
  </div>
}

/**
 * Internal-only preview of the "4c" landing hero design candidate.
 * Not linked from navigation and excluded from the sitemap — see docs/content-tunnel-portal-preview.md siblings.
 */
export function Landing4CPreview() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  const modalInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.title = '4c preview — Sted'
  }, [])

  useEffect(() => {
    if (!isWaitlistOpen) return
    modalInputRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsWaitlistOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = '' }
  }, [isWaitlistOpen])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) {
      setStatus('Please enter a valid email address.')
      return
    }
    if (!supabase) {
      setStatus('The waitlist is temporarily unavailable. Please try again shortly.')
      return
    }

    setIsSubmitting(true)
    const source = new URLSearchParams(window.location.search).get('ref')?.slice(0, 120) || null
    const normalizedEmail = email.trim().toLowerCase()
    const { error } = await supabase.from('waitlist').insert({ email: normalizedEmail, source })
    setIsSubmitting(false)

    if (error && error.code !== '23505') {
      setStatus('Something went wrong. Please try again.')
      return
    }

    setEmail('')
    setStatus("You're on the list.")
    setIsWaitlistOpen(false)
  }

  function openWaitlist() { setStatus(''); setIsWaitlistOpen(true) }

  return <div className="l4c-page">
    <div className="l4c-scene-outer">
      <div className="l4c-scene">
        <header className="l4c-header">
          <img className="l4c-logo" src="/brand/sted-primary-horizontal.svg" alt="Sted" />
          <nav className="l4c-nav" aria-label="4c preview navigation">
            <a href="/about#how-it-works">How it works</a>
          </nav>
          <button type="button" className="l4c-button l4c-button-dark l4c-header-cta" onClick={openWaitlist}>Join the waitlist</button>
        </header>

        <div className="l4c-copy">
          <h1>Everything<br />you save.<br /><span className="l4c-yellow">Finally useful.</span></h1>
          <p className="l4c-subcopy">Save links, notes and ideas. Sted understands them, connects them to your projects, and brings them back when they matter.</p>
          <div className="l4c-cta-row">
            <button type="button" className="l4c-button l4c-button-dark" onClick={openWaitlist}>Join the waitlist</button>
            <a href="/about#how-it-works" className="l4c-secondary-cta">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.4" fill="none" stroke="#141313" strokeWidth="1.6" /><path fill="#141313" d="M9.6 7.8v8.4l6.4-4.2z" /></svg>
              See how it works
            </a>
          </div>
        </div>

        <div className="l4c-illustration">
          <div className="l4c-illustration-fixed">
            <svg className="l4c-connectors" viewBox="0 0 1040 620" fill="none" aria-hidden="true">
              <g stroke="rgba(20,19,19,0.18)" strokeWidth="1.2" strokeLinecap="round">
                <path d="M196 72C300 92 412 244 448 296" />
                <path d="M372 150C404 186 434 258 448 302" />
                <path d="M190 230C290 250 400 286 448 308" />
                <path d="M364 374C392 360 422 336 448 316" />
                <path d="M208 395C290 392 400 350 448 312" />
                <path d="M234 525C320 500 412 400 448 320" />
              </g>
              <g stroke="rgba(20,19,19,0.28)" strokeWidth="2" strokeLinecap="round">
                <path d="M588 304C602 304 604 210 620 175" />
                <path d="M588 308C602 308 604 280 620 265" />
                <path d="M588 312C602 312 604 340 620 355" />
                <path d="M588 316C602 316 604 410 620 445" />
              </g>
            </svg>

            <div className="l4c-card l4c-card-revenuecat">
              <div className="l4c-card-pad">
                <div className="l4c-pill"><GlobeIcon /><span>Web page</span></div>
                <span className="l4c-card-title">RevenueCat Shipaton 2026</span>
                <div className="l4c-domain-row">
                  <img src="/content/landing-4c/shipaton-favicon.png" alt="" className="l4c-favicon" />
                  <span className="l4c-domain">shipaton.com</span>
                </div>
              </div>
            </div>

            <div className="l4c-card l4c-card-xpost">
              <img src="/content/landing-4c/x-post-falling-into-hole.jpg" alt="How to fix your entire life in 1 day" className="l4c-card-image l4c-card-image-short" />
              <div className="l4c-card-pad">
                <span className="l4c-card-title">How to fix your entire life in 1 day</span>
                <div className="l4c-domain-row"><SourceIcon type="x" /><span className="l4c-domain">x.com</span></div>
              </div>
            </div>

            <div className="l4c-card l4c-card-youtube">
              <img src="/content/landing-4c/pour-over-method.jpg" alt="V60 pour over" className="l4c-card-image l4c-card-image-tall" />
              <div className="l4c-card-pad">
                <span className="l4c-card-title">The pour over method, start to finish</span>
                <div className="l4c-domain-row"><SourceIcon type="youtube" /><span className="l4c-domain">youtube.com</span></div>
              </div>
            </div>

            <div className="l4c-card l4c-card-instagram">
              <img src="/content/landing-4c/fushimi-inari-kyoto.jpg" alt="Fushimi-Inari, Kyoto" className="l4c-card-image l4c-card-image-portrait" />
              <div className="l4c-card-pad l4c-card-pad-tight">
                <span className="l4c-card-title">Fushimi-Inari, Kyoto, Japan</span>
                <div className="l4c-domain-row"><SourceIcon type="instagram" /><span className="l4c-domain">instagram.com</span></div>
              </div>
            </div>

            <div className="l4c-card l4c-card-notes">
              <div className="l4c-card-pad">
                <div className="l4c-notes-head">
                  <div className="l4c-notes-icon"><DocIcon /></div>
                  <span className="l4c-card-title l4c-notes-title">Notes &amp; Docs</span>
                </div>
                <span className="l4c-domain">Sted launch notes</span>
              </div>
            </div>

            <div className="l4c-card l4c-card-starter-story">
              <div className="l4c-card-pad">
                <div className="l4c-story-head">
                  <img src="/content/landing-4c/starter-story-podcast-cover.png" alt="Starter Story" className="l4c-story-cover" />
                  <div className="l4c-story-text">
                    <span className="l4c-card-title">Starter Story</span>
                    <span className="l4c-domain">This app replaced my 9-5 ($155K/year)</span>
                  </div>
                </div>
                <div className="l4c-story-player">
                  <SpotifyIcon />
                  <div className="l4c-story-bars">
                    {SPOTIFY_BAR_HEIGHTS.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
                  </div>
                </div>
              </div>
            </div>

            <div className="l4c-mascot-badge">
              <img src="/sted-mascot.svg" alt="Sted" />
            </div>

            {RESULTS.map((result) => <ResultRow key={result.title} {...result} />)}

            <div className="l4c-tagline">
              <span className="l4c-tagline-bar" />
              <span>Your knowledge.<br />Organized. Connected. Useful.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SiteFooter />

    {isWaitlistOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsWaitlistOpen(false) }}>
      <section className="waitlist-modal" role="dialog" aria-modal="true" aria-labelledby="l4c-modal-title">
        <button className="modal-close" type="button" onClick={() => setIsWaitlistOpen(false)} aria-label="Close waitlist dialog">×</button>
        <p className="section-label">EARLY ACCESS</p>
        <h2 id="l4c-modal-title">Keep me posted.</h2>
        <p>Leave your email and we’ll let you know when Sted is ready for its next step.</p>
        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <label className="sr-only" htmlFor="l4c-modal-email">Your email address</label>
          <input ref={modalInputRef} id="l4c-modal-email" name="email" type="email" required value={email} onChange={(event) => { setEmail(event.target.value); setStatus('') }} placeholder="your@email.com" />
          <button className="button button-amber" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Joining…' : 'Join the waitlist'} <span aria-hidden="true">↗</span></button>
        </form>
        <p className="modal-status" role="status">{status}</p>
      </section>
    </div>}
  </div>
}
