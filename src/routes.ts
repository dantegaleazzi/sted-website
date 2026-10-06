import { ARCHIVE_PATHS } from './archive-paths'
import { COMPARE_PATHS } from './components/compare/compare-paths'

export type Route =
  | 'start' | 'funnel-review' | 'funnel-prototype' | 'landing'
  | 'product-design-system' | 'source-card-qa' | 'landing-states' | 'tunnel' | 'site' | 'content' | 'compare'

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
  if (funnelReview && (['/internal/funnel', '/internal/funnel/c'].includes(pathname) || (funnelPreview && pathname === '/'))) return 'funnel-review'
  if (dev && ['/internal/funnel/a', '/internal/funnel/b'].includes(pathname)) return 'funnel-prototype'
  if (pathname === '/' || pathname === '/internal/landing-4c') return 'landing'
  if (dev && pathname === '/internal/product-design-system') return 'product-design-system'
  if (dev && pathname === '/internal/source-card-qa') return 'source-card-qa'
  if (dev && pathname === '/internal/landing-4c/states') return 'landing-states'
  if (dev && pathname === '/tunnel') return 'tunnel'
  if (SITE_PAGES.includes(pathname) || ARCHIVE_PATHS.includes(pathname)) return 'site'
  if (CONTENT_PAGES.includes(pathname)) return 'content'
  if (COMPARE_PATHS.includes(pathname)) return 'compare'
  return 'landing'
}
