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
const FunnelPrototype = lazy(() => import('./components/growth-funnel/FunnelPrototype').then((m) => ({ default: m.FunnelPrototype })))
const ConversationalFunnel = lazy(() => import('./components/growth-funnel/ConversationalFunnel').then((m) => ({ default: m.ConversationalFunnel })))
const FunnelPage = lazy(() => import('./components/growth-funnel/ConversationalFunnel').then((m) => ({ default: m.FunnelPage })))

function Root() {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/'
  const funnelPreviewBuild = import.meta.env.MODE === 'funnel-preview'
  // /start stays out of production until REVENUECAT_FUNNEL_URL is set and the route is approved.
  const funnelSurfaces = import.meta.env.DEV || funnelPreviewBuild
  const page = funnelSurfaces && pathname === '/start' ? <FunnelPage />
    : funnelSurfaces && (['/internal/funnel', '/internal/funnel/c'].includes(pathname) || (funnelPreviewBuild && pathname === '/')) ? <ConversationalFunnel />
    : import.meta.env.DEV && ['/internal/funnel/a', '/internal/funnel/b'].includes(pathname) ? <FunnelPrototype />
    : pathname === '/' || pathname === '/internal/landing-4c' ? <Landing4CPreview />
    : import.meta.env.DEV && pathname === '/internal/product-design-system' ? <RealContentQA />
    : import.meta.env.DEV && pathname === '/internal/source-card-qa' ? <InternalSourceCardQA />
    : import.meta.env.DEV && pathname === '/internal/landing-4c/states' ? <Landing4CShowcaseStates />
    : import.meta.env.DEV && pathname === '/tunnel' ? <StedContentTunnel />
    : ['/support', '/about', '/contact', '/privacy', '/terms', '/delete-account'].includes(pathname) ? <SiteApp />
    : <Landing4CPreview />
  return <Suspense fallback={null}>{page}</Suspense>
}

createRoot(document.getElementById('root')!).render(<StrictMode><Root /></StrictMode>)
