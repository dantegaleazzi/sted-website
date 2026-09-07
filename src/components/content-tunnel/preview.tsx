import { StrictMode, useState, type FormEvent } from 'react'
import { createRoot } from 'react-dom/client'
import { StedContentTunnel, type StedContentItem } from './StedContentTunnel'
import { demoItems } from './demo-items'
import wordmark from './assets/sted-wordmark.svg'
import './preview.css'

function LandingPreview() {
  const [items, setItems] = useState(demoItems)
  const [link, setLink] = useState('')
  const [status, setStatus] = useState('')
  const [showDownload, setShowDownload] = useState(false)

  function saveLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const url = new URL(link)
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported URL')
      const item: StedContentItem = { id: `preview-${Date.now()}`, type: 'website', title: url.hostname.replace(/^www\./, ''), metadata: url.hostname, body: 'A new find, kept close.' }
      setItems(current => [item, ...current.slice(0, 23)])
      setLink('')
      setStatus('Added to this preview. Your next good find is welcome here.')
    } catch {
      setStatus('Paste a complete link starting with https://.')
    }
  }

  return <div className="stlp">
    <header className="stlp-header">
      <a href="#product" aria-label="Sted home"><img src={wordmark} alt="Sted" /></a>
      <nav aria-label="Main navigation">
        <a href="#product">Product</a><a href="#save-link">How it works</a><a href="/contact">Pricing</a><a href="/build">Blog</a>
      </nav>
      <button className="stlp-download" onClick={() => setShowDownload(true)}>Download for iOS</button>
    </header>
    <main id="product" className="stlp-hero">
      <div className="stlp-heading">
        <h1>Everything You Save<span>Finally Useful</span></h1>
        <p>Links, videos, posts, articles, repos and more.<br />All in one place, organized for you.</p>
      </div>
      <StedContentTunnel items={items} className="stlp-tunnel" />
      <div id="save-link" className="stlp-save">
        <form onSubmit={saveLink}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m10 13 4-4m-6 7-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 0)" /></svg>
          <label className="stlp-sr" htmlFor="preview-link">Link to save</label>
          <input id="preview-link" type="url" required placeholder="Paste any link..." value={link} onChange={event => setLink(event.target.value)} />
          <button type="submit" aria-label="Add link to preview">→</button>
        </form>
        <p>Try with a YouTube video, an article, a tweet or a GitHub repo.</p>
        <p className="stlp-status" role="status">{status}</p>
      </div>
    </main>
    {showDownload && <div className="stlp-backdrop" onClick={event => { if (event.target === event.currentTarget) setShowDownload(false) }}>
      <section role="dialog" aria-modal="true" aria-label="Sted for iOS" className="stlp-dialog" onKeyDown={event => { if (event.key === 'Escape') setShowDownload(false) }}>
        <button autoFocus onClick={() => setShowDownload(false)} aria-label="Close">×</button>
        <h2>Sted for iOS</h2><p>We're getting ready. Be first to hear when Sted is available.</p><a href="/contact">Get in touch →</a>
      </section>
    </div>}
  </div>
}

createRoot(document.getElementById('root')!).render(<StrictMode><LandingPreview /></StrictMode>)
