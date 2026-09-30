import { JUDGES_PATH } from './worker-policy'

export type Route =
  | 'start' | 'funnel-review' | 'funnel-prototype' | 'landing'
  | 'product-design-system' | 'source-card-qa' | 'landing-states' | 'tunnel' | 'site' | 'content' | 'judges'

export type Build = { dev: boolean; funnelPreview: boolean }

const SITE_PAGES = ['/support', '/about', '/contact', '/privacy', '/terms', '/delete-account']
/** The guide and the comparison page (src/components/content-pages). */
export const CONTENT_PAGES = ['/how-to-use', '/pocket-alternative']

/** Which surface a pathname renders. Unknown paths fall back to the landing. */
export function resolveRoute(rawPathname: string, { dev, funnelPreview }: Build): Route {
  const pathname = rawPathname.replace(/\/$/, '') || '/'
  // Review surfaces for the funnel stay out of production.
  const funnelReview = dev || funnelPreview
  if (pathname === '/start') return 'start'
  // Shipaton judges' steps: live everywhere, at a random path linked from nowhere, noindex (worker.ts).
  if (pathname === JUDGES_PATH) return 'judges'
  if (funnelReview && (['/internal/funnel', '/internal/funnel/c'].includes(pathname) || (funnelPreview && pathname === '/'))) return 'funnel-review'
  if (dev && ['/internal/funnel/a', '/internal/funnel/b'].includes(pathname)) return 'funnel-prototype'
  if (pathname === '/' || pathname === '/internal/landing-4c') return 'landing'
  if (dev && pathname === '/internal/product-design-system') return 'product-design-system'
  if (dev && pathname === '/internal/source-card-qa') return 'source-card-qa'
  if (dev && pathname === '/internal/landing-4c/states') return 'landing-states'
  if (dev && pathname === '/tunnel') return 'tunnel'
  if (SITE_PAGES.includes(pathname)) return 'site'
  if (CONTENT_PAGES.includes(pathname)) return 'content'
  return 'landing'
}
