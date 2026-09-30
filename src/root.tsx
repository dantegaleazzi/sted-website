import { Suspense, lazy, type ReactElement } from 'react'
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
const ContentPage = lazy(() => import('./components/content-pages/ContentPages').then((m) => ({ default: m.ContentPage })))
const JudgesPage = lazy(() => import('./components/judges/JudgesPage').then((m) => ({ default: m.JudgesPage })))
const FunnelPage = lazy(() => import('./components/growth-funnel/ConversationalFunnel').then((m) => ({ default: m.FunnelPage })))

export const PAGES: Record<Route, (pathname: string) => ReactElement> = {
  start: () => <FunnelPage />,
  'funnel-review': () => <ConversationalFunnel />,
  'funnel-prototype': () => <FunnelPrototype />,
  landing: () => <Landing4CPreview />,
  'product-design-system': () => <RealContentQA />,
  'source-card-qa': () => <InternalSourceCardQA />,
  'landing-states': () => <Landing4CShowcaseStates />,
  tunnel: () => <StedContentTunnel />,
  site: pathname => <SiteApp pathname={pathname} />,
  content: pathname => <ContentPage pathname={pathname} />,
  judges: () => <JudgesPage />,
}

/** The app for one pathname. The browser passes window.location.pathname; the build-time prerender passes the page it writes. */
export function Root({ pathname }: { pathname: string }) {
  const route = resolveRoute(pathname, { dev: import.meta.env.DEV, funnelPreview: import.meta.env.MODE === 'funnel-preview' })
  return <Suspense fallback={null}>{PAGES[route](pathname)}</Suspense>
}
