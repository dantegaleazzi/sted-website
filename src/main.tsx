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
        <div className="footer-column"><h4>STED</h4><a href="https://instagram.com/stedapp">Instagram <span>instagram.com/stedapp</span></a><a href="https://tiktok.com/@stedapp">TikTok <span>tiktok.com/@stedapp</span></a><a href="https://youtube.com/@stedapp">YouTube <span>youtube.com/@stedapp</span></a><a href="https://linkedin.com/company/stedapp">LinkedIn <span>linkedin.com/company/stedapp</span></a><a href="https://x.com/stedapp">X <span>x.com/stedapp</span></a></div>
        <div className="footer-column"><h4>DANTE <small>— BUILDING IN PUBLIC</small></h4><a href="https://youtube.com/@dante.galeazzi">YouTube <span>youtube.com/@dante.galeazzi</span></a><a href="https://x.com/dantegaleazzi">X <span>x.com/dantegaleazzi</span></a><a href="https://tiktok.com/@dante.galeazzi">TikTok <span>tiktok.com/@dante.galeazzi</span></a><a href="https://instagram.com/dantegaleazzi22">Instagram <span>instagram.com/dantegaleazzi22</span></a><a href="https://linkedin.com/in/dantegaleazzi">LinkedIn <span>linkedin.com/in/dantegaleazzi</span></a></div>
        <div className="footer-brand"><Logo /><p>A better way to save,<br />understand and use<br />everything that matters.</p><p className="copyright">© 2026 Finiks Labs LLC</p><div className="legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/support">Support</a></div></div>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
