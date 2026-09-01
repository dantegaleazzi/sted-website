import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { LegalPage, type LegalDocument } from './legal'
import { Logo } from './logo'
import { RoutePage, SHOW_BUILD_IN_PUBLIC } from './pages'
import { guides } from './guides'
import './index.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const supabase = supabaseUrl && supabasePublishableKey ? createClient(supabaseUrl, supabasePublishableKey) : null

const socialIconPaths: Record<string, string> = {
  Instagram: 'M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 3.5A6.5 6.5 0 1 0 12 18.5 6.5 6.5 0 0 0 12 5.5Zm0 2A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm6.75-3.9a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z',
  TikTok: 'M14.5 2h2.6c.2 1.35.86 2.5 1.9 3.35 1.02.83 2.25 1.24 3.5 1.2v2.63c-1.4.02-2.75-.36-3.94-1.06v6.5c0 3.24-2.62 5.88-5.85 5.88a5.86 5.86 0 0 1-5.85-5.88 5.86 5.86 0 0 1 5.85-5.88c.3 0 .6.02.9.07v2.7a3.13 3.13 0 0 0-.9-.13 3.24 3.24 0 0 0-3.23 3.24 3.24 3.24 0 0 0 3.23 3.24 3.24 3.24 0 0 0 3.23-3.24V2Z',
  YouTube: 'M22 12s0-3.03-.39-4.49a3.02 3.02 0 0 0-2.12-2.14C17.99 5 12 5 12 5s-5.99 0-7.49.37A3.02 3.02 0 0 0 2.4 7.51C2 8.97 2 12 2 12s0 3.03.39 4.49c.24 1.03 1.06 1.87 2.12 2.14C5.99 19 12 19 12 19s5.99 0 7.49-.37a3.02 3.02 0 0 0 2.12-2.14C22 15.03 22 12 22 12ZM10 15.5v-7l6 3.5-6 3.5Z',
  LinkedIn: 'M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 8.75h3.4V21H3.4V8.75Zm6.3 0h3.26v1.68h.05c.45-.86 1.56-1.77 3.22-1.77 3.44 0 4.07 2.27 4.07 5.22V21h-3.4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9.7V8.75Z',
  X: 'M18.24 2.75h3.29l-7.19 8.22 8.46 10.28h-6.62l-5.18-6.79-5.93 6.79H1.77l7.69-8.8L1.36 2.75h6.79l4.68 6.2 5.41-6.2Zm-1.15 16.6h1.82L7.02 4.6H5.06l12.03 14.75Z',
}

function SocialIcon({ href, label }: { href: string; label: string }) {
  return <a className="footer-social-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={socialIconPaths[label]} /></svg>
  </a>
}

function App() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  const [, setLocationKey] = useState(window.location.href)
  const [hash, setHash] = useState(window.location.hash)
  const modalInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const updateLocation = () => { setHash(window.location.hash); setLocationKey(window.location.href) }
    window.addEventListener('popstate', updateLocation)
    window.addEventListener('hashchange', updateLocation)
    return () => { window.removeEventListener('popstate', updateLocation); window.removeEventListener('hashchange', updateLocation) }
  }, [])

  const pathname = window.location.pathname.replace(/\/$/, '') || '/'
  const legalDocument: LegalDocument | null = pathname === '/privacy' ? 'privacy' : pathname === '/terms' ? 'terms' : null
  const postSlug = pathname.startsWith('/build/') ? pathname.slice('/build/'.length) : null
  const guideSlug = pathname.startsWith('/guides/') ? pathname.slice('/guides/'.length) : null
  const route = pathname === '/about' || hash === '#about' ? 'about'
    : SHOW_BUILD_IN_PUBLIC && postSlug ? 'post'
    : SHOW_BUILD_IN_PUBLIC && (pathname === '/build' || hash === '#build-log') ? 'build'
    : SHOW_BUILD_IN_PUBLIC && guideSlug ? 'guide'
    : SHOW_BUILD_IN_PUBLIC && pathname === '/guides' ? 'guides'
    : pathname === '/support' ? 'support'
    : pathname === '/contact' || hash === '#contact' ? 'contact'
    : 'landing'

  useEffect(() => {
    // Legacy #privacy / #terms links used to render legal content inline.
    // Redirect them to the permanent routes instead of showing stale text.
    if (hash === '#privacy') window.location.replace('/privacy')
    else if (hash === '#terms') window.location.replace('/terms')
  }, [hash])

  useEffect(() => {
    const activeGuide = route === 'guide' ? guides.find((guide) => guide.slug === guideSlug) : null
    document.title = legalDocument === 'privacy' ? 'Privacy Policy | Sted' : legalDocument === 'terms' ? 'Terms of Use | Sted' : route === 'post' ? 'Build Log — STED' : route === 'support' ? 'Support | Sted' : activeGuide ? activeGuide.seoTitle ?? `${activeGuide.title} — STED` : route === 'guide' || route === 'guides' ? 'Guides — STED' : 'STED — Everything you save. Finally useful.'
  }, [legalDocument, route, guideSlug])

  useEffect(() => {
    if (!isWaitlistOpen) return
    modalInputRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsWaitlistOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = '' }
  }, [isWaitlistOpen])

  if (legalDocument) return <LegalPage document={legalDocument} />

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

  return (
    <div id="top" className="min-h-screen">
      <header className="site-header shell">
        <Logo />
        <nav className="header-nav" aria-label="Primary navigation"><a href="/about">About</a>{SHOW_BUILD_IN_PUBLIC && <><a href="/build">Build In Public</a><a href="/guides">Guides</a></>}<a href="/contact">Contact</a></nav>
        <button className="button button-amber header-cta" type="button" onClick={() => { setStatus(''); setIsWaitlistOpen(true) }}>Join the waitlist</button>
      </header>

      <RoutePage route={route} postSlug={postSlug} guideSlug={guideSlug} onOpenWaitlist={() => { setStatus(''); setIsWaitlistOpen(true) }} email={email} status={status} isSubmitting={isSubmitting} onEmailChange={(value) => { setEmail(value); setStatus('') }} onSubmit={handleSubmit} />

      {isWaitlistOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsWaitlistOpen(false) }}>
        <section className="waitlist-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button className="modal-close" type="button" onClick={() => setIsWaitlistOpen(false)} aria-label="Close waitlist dialog">×</button>
          <p className="section-label">EARLY ACCESS</p>
          <h2 id="modal-title">Keep me posted.</h2>
          <p>Leave your email and we’ll let you know when Sted is ready for its next step.</p>
          <form className="modal-form" onSubmit={handleSubmit} noValidate>
            <label className="sr-only" htmlFor="modal-email">Your email address</label>
            <input ref={modalInputRef} id="modal-email" name="email" type="email" required value={email} onChange={(event) => { setEmail(event.target.value); setStatus('') }} placeholder="your@email.com" />
            <button className="button button-amber" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Joining…' : 'Join the waitlist'} <span aria-hidden="true">↗</span></button>
          </form>
          <p className="modal-status" role="status">{status}</p>
        </section>
      </div>}

      <footer className="site-footer shell">
        <div className="footer-identity">
          <Logo />
          <div><p className="footer-brand-name">Sted</p><p className="footer-tagline">Everything you save. Finally useful.</p></div>
        </div>
        {SHOW_BUILD_IN_PUBLIC && <nav className="footer-social" aria-label="Dante — building in public">
          <SocialIcon href="https://youtube.com/@dante.galeazzi" label="YouTube" />
          <SocialIcon href="https://x.com/dantegaleazzi" label="X" />
          <SocialIcon href="https://tiktok.com/@dante.galeazzi" label="TikTok" />
          <SocialIcon href="https://instagram.com/dantegaleazzi22" label="Instagram" />
          <SocialIcon href="https://linkedin.com/in/dantegaleazzi" label="LinkedIn" />
        </nav>}
        <nav className="footer-social" aria-label="Sted social links">
          <SocialIcon href="https://instagram.com/stedapp" label="Instagram" />
          <SocialIcon href="https://tiktok.com/@stedapp" label="TikTok" />
          <SocialIcon href="https://youtube.com/@stedapp" label="YouTube" />
          <SocialIcon href="https://linkedin.com/company/stedapp" label="LinkedIn" />
          <SocialIcon href="https://x.com/stedapp" label="X" />
        </nav>
        <div className="footer-meta"><span className="copyright">© 2026 Finiks Labs LLC</span><div className="legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/support">Support</a></div></div>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
