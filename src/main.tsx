import { StrictMode, Suspense, lazy, type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { resolveRoute, type Route } from './routes'

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

const PAGES: Record<Route, () => ReactElement> = {
  start: () => <FunnelPage />,
  'funnel-review': () => <ConversationalFunnel />,
  'funnel-prototype': () => <FunnelPrototype />,
  landing: () => <Landing4CPreview />,
  'product-design-system': () => <RealContentQA />,
  'source-card-qa': () => <InternalSourceCardQA />,
  'landing-states': () => <Landing4CShowcaseStates />,
  tunnel: () => <StedContentTunnel />,
  site: () => <SiteApp />,
}

function Root() {
  const route = resolveRoute(window.location.pathname, { dev: import.meta.env.DEV, funnelPreview: import.meta.env.MODE === 'funnel-preview' })
  return <Suspense fallback={null}>{PAGES[route]()}</Suspense>
}

createRoot(document.getElementById('root')!).render(<StrictMode><Root /></StrictMode>)
