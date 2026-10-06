import { COMPARE_PATHS } from './components/compare/compare-paths'
import { NOINDEX_PAGES, PUBLIC_PAGES, SECURITY_HEADERS } from './worker-policy'

const SITEMAP_PATHS = ['/', '/privacy', '/terms', '/about', '/contact', '/support', '/how-to-use', '/pocket-alternative', ...COMPARE_PATHS]
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_PATHS.map(path => `  <url><loc>https://www.sted.ai${path}</loc></url>`).join('\n')}
</urlset>
`

const ROBOTS = `User-agent: *
Allow: /

Sitemap: https://www.sted.ai/sitemap.xml
`

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
  RESEND_API_KEY: string
  /** Restricted Stripe key, Subscriptions: Read only. Secret. */
  STRIPE_FOUNDING_KEY?: string
  /** Stripe price ID of the founding offer ($19.99/year). */
  FOUNDING_PRICE_ID?: string
}

/** Cache: hashed build files forever, app images and videos for a day (their names don't change when they do). */
function cacheControl(pathname: string): string | null {
  if (pathname.startsWith('/assets/')) return 'public, max-age=31536000, immutable'
  if (pathname.startsWith('/fonts/')) return 'public, max-age=2592000'
  if (/^\/(content|brand)\//.test(pathname) || /\.(png|svg|ico|webp|jpg|mp4)$/.test(pathname)) return 'public, max-age=86400'
  return null
}

function withHeaders(response: Response, extra: Record<string, string> = {}, status = response.status): Response {
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries({ ...SECURITY_HEADERS, ...extra })) headers.set(name, value)
  return new Response(response.body, { status, statusText: status === 404 ? 'Not Found' : response.statusText, headers })
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MESSAGE_MIN = 10
const MESSAGE_MAX = 2000

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

async function handleSupportRequest(request: Request, env: Env): Promise<Response> {
  let payload: { name?: unknown; email?: unknown; message?: unknown; category?: unknown; website?: unknown }
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid request body' }, 400)
  }

  // Honeypot: real users never fill this field. Bots that do get a fake success.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return jsonResponse({ ok: true }, 200)
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  const message = typeof payload.message === 'string' ? payload.message.trim() : ''
  const category = typeof payload.category === 'string' ? payload.category.trim() : ''

  if (!name || name.length > 100) return jsonResponse({ ok: false, error: 'Invalid name' }, 400)
  if (!EMAIL_PATTERN.test(email) || email.length > 254) return jsonResponse({ ok: false, error: 'Invalid email' }, 400)
  if (!['Account', 'Report a bug', 'Other'].includes(category)) return jsonResponse({ ok: false, error: 'Invalid support category' }, 400)
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) return jsonResponse({ ok: false, error: 'Invalid message length' }, 400)

  if (!env.RESEND_API_KEY) return jsonResponse({ ok: false, error: 'Support email is not configured' }, 500)

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Sted Support <support@sted.ai>',
      to: 'hello@sted.ai',
      reply_to: email,
      subject: `Sted Support — ${category} — ${email}`,
      text: `Category: ${category}\nName: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  })

  if (!resendResponse.ok) return jsonResponse({ ok: false, error: 'Failed to send message' }, 502)

  return jsonResponse({ ok: true }, 200)
}

const FOUNDING_SPOTS = 100
const FOUNDING_CACHE_KEY = 'https://www.sted.ai/api/founding-spots'

/**
 * How many founding spots are taken: Stripe subscriptions on the founding price that went through
 * (everything except incomplete checkouts). Cached for 30s at the edge so launch traffic doesn't
 * hit Stripe on every page view. Without the key or price ID it answers 503 and the site hides the count.
 */
async function handleFoundingSpots(env: Env): Promise<Response> {
  if (!env.STRIPE_FOUNDING_KEY || !env.FOUNDING_PRICE_ID) return jsonResponse({ ok: false }, 503)
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default
  const cached = await cache?.match(FOUNDING_CACHE_KEY)
  if (cached) return cached

  const stripe = await fetch(`https://api.stripe.com/v1/subscriptions?price=${encodeURIComponent(env.FOUNDING_PRICE_ID)}&status=all&limit=100`, {
    headers: { Authorization: `Bearer ${env.STRIPE_FOUNDING_KEY}` },
  })
  if (!stripe.ok) return jsonResponse({ ok: false }, 502)
  const { data, has_more: hasMore } = await stripe.json() as { data: { status: string }[]; has_more: boolean }
  const taken = hasMore ? FOUNDING_SPOTS : data.filter(sub => sub.status !== 'incomplete' && sub.status !== 'incomplete_expired').length

  const response = new Response(JSON.stringify({ ok: true, total: FOUNDING_SPOTS, claimed: Math.min(taken, FOUNDING_SPOTS) }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=30' },
  })
  await cache?.put(FOUNDING_CACHE_KEY, response.clone())
  return response
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await route(request, env)
    return response.status === 301 || response.status === 302 ? response : withHeaders(response)
  },
}

async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)

  // Serve crawl metadata before both the apex redirect and SPA asset fallback.
  if (url.pathname === '/sitemap.xml' || url.pathname === '/robots.txt') {
    const sitemap = url.pathname === '/sitemap.xml'
    return new Response(request.method === 'HEAD' ? null : sitemap ? SITEMAP : ROBOTS, {
      status: 200,
      headers: {
        'Content-Type': sitemap ? 'application/xml; charset=utf-8' : 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    })
  }

  if (url.hostname === 'sted.ai') {
    url.hostname = 'www.sted.ai'
    return Response.redirect(url.toString(), 301)
  }

  if (url.pathname === '/api/founding-spots' && request.method === 'GET') {
    return handleFoundingSpots(env)
  }

  if (url.pathname === '/api/support' && request.method === 'POST') {
    return handleSupportRequest(request, env)
  }

  const asset = await env.ASSETS.fetch(request)
  const pathname = url.pathname.replace(/\/$/, '') || '/'
  const isPage = (asset.headers.get('Content-Type') ?? '').includes('text/html')
  // A missing file or unknown path comes back as the SPA shell: keep the page, say 404.
  if (isPage && !PUBLIC_PAGES.has(pathname)) return new Response(asset.body, { status: 404, headers: asset.headers })
  // The Shipaton archive is shared by link only: keep it out of search results.
  if (isPage && NOINDEX_PAGES.has(pathname)) {
    const response = new Response(asset.body, asset)
    response.headers.set('X-Robots-Tag', 'noindex')
    return response
  }
  const cache = cacheControl(url.pathname)
  if (!cache || !asset.ok) return asset
  const headers = new Headers(asset.headers)
  headers.set('Cache-Control', cache)
  return new Response(asset.body, { status: asset.status, headers })
}
