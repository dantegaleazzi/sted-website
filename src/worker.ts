const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.sted.ai/</loc></url>
  <url><loc>https://www.sted.ai/privacy</loc></url>
  <url><loc>https://www.sted.ai/terms</loc></url>
  <url><loc>https://www.sted.ai/about</loc></url>
  <url><loc>https://www.sted.ai/contact</loc></url>
  <url><loc>https://www.sted.ai/support</loc></url>
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

export const FOUNDING_SPOTS = 100
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

    return env.ASSETS.fetch(request)
  },
}
