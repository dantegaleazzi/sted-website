/* Kept out of worker.ts: the Worker's main module may only export its handler. */

/** Paths the SPA renders in production. Anything else that falls back to index.html answers 404, so
 *  crawlers don't see endless copies of the home page (/llms.txt, /.env, typos). Keep in sync with routes.ts. */
export const PUBLIC_PAGES = new Set(['/', '/start', '/privacy', '/terms', '/delete-account', '/support', '/about', '/contact', '/internal/landing-4c', '/index.html'])

/** Baseline browser protections on every response. The CSP allows only what the site loads: its own
 *  files, Supabase (waitlist, funnel events) and Cloudflare Web Analytics. Checkout links are plain navigations. */
export const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "media-src 'self'",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://cloudflareinsights.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; '),
}
