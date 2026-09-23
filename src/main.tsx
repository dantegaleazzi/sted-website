import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Entry-level code splitting. Each surface is its own chunk, so the 4c landing loads
// React + its own code only (not framer-motion, the content tunnel or the QA fixtures),
// and the current site doesn't ship the previews.
const SiteApp = lazy(() => import('./site').then((m) => ({ default: m.SiteApp })))
const StedContentTunnel = lazy(() => import('./components/content-tunnel/StedContentTunnel').then((m) => ({ default: m.StedContentTunnel })))
const InternalSourceCardQA = lazy(() => import('./components/source-card-qa/InternalSourceCardQA').then((m) => ({ default: m.InternalSourceCardQA })))
const RealContentQA = lazy(() => import('./components/source-card-qa/RealContentQA').then((m) => ({ default: m.RealContentQA })))
const Landing4CPreview = lazy(() => import('./components/landing-4c/Landing4CPreview').then((m) => ({ default: m.Landing4CPreview })))
const Landing4CShowcaseStates = lazy(() => import('./components/landing-4c/Landing4CPreview').then((m) => ({ default: m.Landing4CShowcaseStates })))

function Root() {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/'
  const page = pathname === '/' || pathname === '/internal/landing-4c' ? <Landing4CPreview />
    : import.meta.env.DEV && pathname === '/internal/product-design-system' ? <RealContentQA />
    : import.meta.env.DEV && pathname === '/internal/source-card-qa' ? <InternalSourceCardQA />
    : import.meta.env.DEV && pathname === '/internal/landing-4c/states' ? <Landing4CShowcaseStates />
    : import.meta.env.DEV && pathname === '/tunnel' ? <StedContentTunnel />
    : ['/support', '/privacy', '/terms', '/delete-account'].includes(pathname) ? <SiteApp />
    : <Landing4CPreview />
  return <Suspense fallback={null}>{page}</Suspense>
}

createRoot(document.getElementById('root')!).render(<StrictMode><Root /></StrictMode>)
