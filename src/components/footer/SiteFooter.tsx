import { Logo } from '../../logo'
import { SHOW_BUILD_IN_PUBLIC } from '../../flags'
import { APP_STORE_URL } from '../landing-4c/app-links'
import './SiteFooter.css'

const socialIconPaths: Record<string, string> = {
  Instagram: 'M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 3.5A6.5 6.5 0 1 0 12 18.5 6.5 6.5 0 0 0 12 5.5Zm0 2A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm6.75-3.9a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z',
  TikTok: 'M14.5 2h2.6c.2 1.35.86 2.5 1.9 3.35 1.02.83 2.25 1.24 3.5 1.2v2.63c-1.4.02-2.75-.36-3.94-1.06v6.5c0 3.24-2.62 5.88-5.85 5.88a5.86 5.86 0 0 1-5.85-5.88 5.86 5.86 0 0 1 5.85-5.88c.3 0 .6.02.9.07v2.7a3.13 3.13 0 0 0-.9-.13 3.24 3.24 0 0 0-3.23 3.24 3.24 3.24 0 0 0 3.23 3.24 3.24 3.24 0 0 0 3.23-3.24V2Z',
  YouTube: 'M22 12s0-3.03-.39-4.49a3.02 3.02 0 0 0-2.12-2.14C17.99 5 12 5 12 5s-5.99 0-7.49.37A3.02 3.02 0 0 0 2.4 7.51C2 8.97 2 12 2 12s0 3.03.39 4.49c.24 1.03 1.06 1.87 2.12 2.14C5.99 19 12 19 12 19s5.99 0 7.49-.37a3.02 3.02 0 0 0 2.12-2.14C22 15.03 22 12 22 12ZM10 15.5v-7l6 3.5-6 3.5Z',
  LinkedIn: 'M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 8.75h3.4V21H3.4V8.75Zm6.3 0h3.26v1.68h.05c.45-.86 1.56-1.77 3.22-1.77 3.44 0 4.07 2.27 4.07 5.22V21h-3.4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9.7V8.75Z',
  X: 'M18.24 2.75h3.29l-7.19 8.22 8.46 10.28h-6.62l-5.18-6.79-5.93 6.79H1.77l7.69-8.8L1.36 2.75h6.79l4.68 6.2 5.41-6.2Zm-1.15 16.6h1.82L7.02 4.6H5.06l12.03 14.75Z',
}

/** "Ask AI about Sted": opens each assistant with the question already typed, so people hear about Sted in its own words. */
const ASK_PROMPT = 'What is Sted (sted.ai)? Explain what it does, how it works, its pricing and who it is for.'

type FooterLink = { name: string; href: string | null; external?: boolean }

/** The big links on the left: the landing's sections. Absolute, so they work from every page. */
const PRIMARY: FooterLink[] = [
  { name: 'How it works', href: '/#how-it-works' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Roadmap', href: '/#roadmap' },
  { name: 'FAQ', href: '/#faq' },
]

/**
 * Footer columns. An app with no href yet shows "Soon": give it its link the day it ships (the web
 * app will be the dashboard, dashboard.sted.ai).
 */
const COLUMNS: { title: string; links: FooterLink[] }[] = [
  { title: 'Our apps', links: [
    { name: 'iOS app', href: APP_STORE_URL },
    { name: 'Web app', href: null },
    { name: 'Android app', href: null },
    { name: 'Browser extension', href: null },
  ] },
  { title: 'Resources', links: [
    { name: 'How to use Sted', href: '/how-to-use' },
    { name: 'Pocket alternative', href: '/pocket-alternative' },
    { name: 'About Sted', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Support', href: '/support' },
  ] },
  { title: 'Ask AI about Sted', links: [
    { name: 'ChatGPT', href: `https://chatgpt.com/?q=${encodeURIComponent(ASK_PROMPT)}`, external: true },
    { name: 'Perplexity', href: `https://www.perplexity.ai/search?q=${encodeURIComponent(ASK_PROMPT)}`, external: true },
    { name: 'Claude', href: `https://claude.ai/new?q=${encodeURIComponent(ASK_PROMPT)}`, external: true },
  ] },
]

function SocialIcon({ href, label }: { href: string; label: string }) {
  return <a className="footer-social-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={socialIconPaths[label]} /></svg>
  </a>
}

function FooterItem({ link, className = 'sf-item' }: { link: FooterLink; className?: string }) {
  if (!link.href) return <span className={`${className} is-soon`}>{link.name}<span className="sf-soon">Soon</span></span>
  return <a className={className} href={link.href} {...link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}>{link.name}</a>
}

/**
 * The site's footer, a white card on the page: brand and a "see how it works" tile (the guide), the landing's
 * sections in large type, three link columns, then © / social / legal. Shared by the landing and the site pages.
 */
export function SiteFooter() {
  return <footer className="site-footer sf shell">
    <div className="sf-card">
      <div className="sf-head">
        <div className="sf-brand">
          <Logo />
          <p className="sf-name">Sted</p>
          <p className="sf-tagline"><span aria-hidden="true">·</span> Everything you save. <mark>Finally useful.</mark></p>
        </div>
        <a className="sf-feature" href="/how-to-use">
          <span className="sf-feature-title">See how it works</span>
          <span className="sf-feature-sub">The Sted guide, step by step</span>
        </a>
      </div>

      <div className="sf-body">
        <nav className="sf-primary" aria-label="Sted">
          <ul>{PRIMARY.map(link => <li key={link.name}><FooterItem link={link} className="sf-primary-link" /></li>)}</ul>
        </nav>
        <div className="sf-cols">
          {COLUMNS.map(column => <nav key={column.title} className="sf-col" aria-label={column.title}>
            <p className="sf-heading">{column.title}</p>
            <ul>{column.links.map(link => <li key={link.name}><FooterItem link={link} /></li>)}</ul>
          </nav>)}
        </div>
      </div>

      <div className="sf-bottom">
        <span className="sf-copy">© 2026 Finiks Labs LLC</span>
        <nav className="footer-social" aria-label="Sted social links">
          <SocialIcon href="https://instagram.com/stedapp" label="Instagram" />
          <SocialIcon href="https://tiktok.com/@stedapp" label="TikTok" />
          <SocialIcon href="https://youtube.com/@stedapp" label="YouTube" />
          <SocialIcon href="https://linkedin.com/company/stedapp" label="LinkedIn" />
          <SocialIcon href="https://x.com/stedapp" label="X" />
        </nav>
        {SHOW_BUILD_IN_PUBLIC && <nav className="footer-social" aria-label="Dante — building in public">
          <SocialIcon href="https://youtube.com/@dante.galeazzi" label="YouTube" />
          <SocialIcon href="https://x.com/dantegaleazzi" label="X" />
          <SocialIcon href="https://tiktok.com/@dante.galeazzi" label="TikTok" />
          <SocialIcon href="https://instagram.com/dantegaleazzi22" label="Instagram" />
          <SocialIcon href="https://linkedin.com/in/dantegaleazzi" label="LinkedIn" />
        </nav>}
        <nav className="sf-legal" aria-label="Legal"><a href="/privacy">Privacy</a><span aria-hidden="true">·</span><a href="/terms">Terms</a><span aria-hidden="true">·</span><a href="/delete-account">Delete account</a></nav>
      </div>
    </div>
  </footer>
}
