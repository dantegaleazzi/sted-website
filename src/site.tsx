import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { LegalPage, type LegalDocument } from './legal'
import { StedMenu } from './components/header/StedMenu'
import { RoutePage } from './pages'
import { SHOW_BUILD_IN_PUBLIC } from './flags'
import { guides } from './guides'
import { SiteFooter } from './components/footer/SiteFooter'
import { APP_STORE_URL } from './components/landing-4c/app-links'
import './components/content-tunnel/portal-preview.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const supabase = supabaseUrl && supabasePublishableKey ? createClient(supabaseUrl, supabasePublishableKey) : null

/** The current marketing site (home, legal, support, build log). Loaded as its own chunk from main.tsx. */
export function SiteApp() {
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
  const tunnelPreview = pathname === '/' || pathname === '/internal/content-tunnel-preview' || pathname === '/internal/hero-projects-map'
  const legalDocument: LegalDocument | null = pathname === '/privacy' ? 'privacy' : pathname === '/terms' ? 'terms' : pathname === '/delete-account' ? 'delete-account' : null
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
  const isBrandInfoPage = route === 'support' || route === 'about' || route === 'contact'

  useEffect(() => {
    // Legacy #privacy / #terms links used to render legal content inline.
    // Redirect them to the permanent routes instead of showing stale text.
    if (hash === '#privacy') window.location.replace('/privacy')
    else if (hash === '#terms') window.location.replace('/terms')
  }, [hash])

  useEffect(() => {
    const activeGuide = route === 'guide' ? guides.find((guide) => guide.slug === guideSlug) : null
    const metadata = route === 'about' ? ['About Sted | Save and organize what matters', 'Learn how Sted helps you understand, organize and find the links, screenshots, notes and ideas you save.']
      : route === 'contact' ? ['Contact Sted | Get in touch', 'Questions, ideas or feedback about Sted? Contact the team at hello@sted.ai.']
      : route === 'support' ? ['Sted Support | Get help with your account', 'Get help with your Sted account, report a bug or send another support request.']
      : null
    document.title = legalDocument === 'delete-account' ? 'Delete your Sted account' : legalDocument === 'privacy' ? 'Privacy Policy | Sted' : legalDocument === 'terms' ? 'Terms of Use | Sted' : route === 'post' ? 'Build Log — STED' : metadata?.[0] ?? (activeGuide ? activeGuide.seoTitle ?? `${activeGuide.title} — STED` : route === 'guide' || route === 'guides' ? 'Guides — STED' : 'Sted — Save links, posts and more. Then chat with them.')
    if (metadata) {
      let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!description) { description = document.createElement('meta'); description.name = 'description'; document.head.append(description) }
      description.content = metadata[1]
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
      canonical.href = `https://www.sted.ai${pathname}`
    }
  }, [pathname, legalDocument, route, guideSlug])

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
    <div id="top" className={`min-h-screen site-surface${tunnelPreview ? ' portal-preview' : ''}${isBrandInfoPage ? ' site-surface--brand' : ''}`}>
      <header className="site-header shell">
        <StedMenu />
        <div className="site-header-actions">
          {!isBrandInfoPage && <button className="button button-amber header-cta" type="button" onClick={() => { setStatus(''); setIsWaitlistOpen(true) }}>Join the waitlist</button>}
          {isBrandInfoPage && APP_STORE_URL && <a className="header-app-store" href={APP_STORE_URL} aria-label="Download Sted on the App Store"><img src="/brand/app-store-badge.svg" alt="Download on the App Store" width="120" height="40" /></a>}
        </div>
      </header>

      <RoutePage tunnelPreview={tunnelPreview} route={route} postSlug={postSlug} guideSlug={guideSlug} onOpenWaitlist={() => { setStatus(''); setIsWaitlistOpen(true) }} email={email} status={status} isSubmitting={isSubmitting} onEmailChange={(value) => { setEmail(value); setStatus('') }} onSubmit={handleSubmit} />

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

      <SiteFooter />
    </div>
  )
}
