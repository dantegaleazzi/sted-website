import { describe, expect, it, vi } from 'vitest'
import worker from './worker'

const env = () => ({ ASSETS: { fetch: vi.fn(async () => new Response('<html>SPA</html>')) }, RESEND_API_KEY: '' })

describe('SEO routes before redirects and SPA fallback', () => {
  for (const host of ['sted.ai', 'www.sted.ai']) {
    for (const path of ['/sitemap.xml', '/robots.txt']) {
      it(`serves ${host}${path} directly`, async () => {
        const bindings = env()
        const response = await worker.fetch(new Request(`https://${host}${path}`), bindings)
        expect(response.status).toBe(200)
        expect(response.headers.get('Location')).toBeNull()
        expect(response.headers.get('Content-Type')).toContain(path === '/sitemap.xml' ? 'application/xml' : 'text/plain')
        const body = await response.text()
        expect(body).not.toContain('<html')
        expect(bindings.ASSETS.fetch).not.toHaveBeenCalled()
        if (path === '/sitemap.xml') {
          expect(body).toMatch(/^<\?xml/)
          expect([...body.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])).toEqual(['https://www.sted.ai/', 'https://www.sted.ai/privacy', 'https://www.sted.ai/terms', 'https://www.sted.ai/about', 'https://www.sted.ai/contact', 'https://www.sted.ai/support'])
        } else expect(body).toContain('Sitemap: https://www.sted.ai/sitemap.xml')
        const head = await worker.fetch(new Request(`https://${host}${path}`, { method: 'HEAD' }), bindings)
        expect(head.status).toBe(200)
        expect(await head.text()).toBe('')
      })
    }
  }
  it('preserves normal redirects and SPA routing', async () => {
    const bindings = env()
    const redirect = await worker.fetch(new Request('https://sted.ai/privacy'), bindings)
    expect(redirect.status).toBe(301)
    expect(redirect.headers.get('Location')).toBe('https://www.sted.ai/privacy')
    await worker.fetch(new Request('https://www.sted.ai/about'), bindings)
    expect(bindings.ASSETS.fetch).toHaveBeenCalledOnce()
  })
})

describe('founding spots', () => {
  it('is off (503) until the Stripe key and price are configured', async () => {
    const response = await worker.fetch(new Request('https://www.sted.ai/api/founding-spots'), env())
    expect(response.status).toBe(503)
  })

  it('counts founding subscriptions that went through, never above 100', async () => {
    const stripe = vi.fn(async () => new Response(JSON.stringify({ has_more: false, data: [{ status: 'active' }, { status: 'canceled' }, { status: 'incomplete' }, { status: 'incomplete_expired' }, { status: 'past_due' }] })))
    vi.stubGlobal('fetch', stripe)
    try {
      const response = await worker.fetch(new Request('https://www.sted.ai/api/founding-spots'), { ...env(), STRIPE_FOUNDING_KEY: 'rk_test', FOUNDING_PRICE_ID: 'price_founding' })
      expect(await response.json()).toEqual({ ok: true, total: 100, claimed: 3 })
      expect(stripe).toHaveBeenCalledWith('https://api.stripe.com/v1/subscriptions?price=price_founding&status=all&limit=100', { headers: { Authorization: 'Bearer rk_test' } })
      stripe.mockResolvedValueOnce(new Response(JSON.stringify({ has_more: true, data: [] })))
      const full = await worker.fetch(new Request('https://www.sted.ai/api/founding-spots'), { ...env(), STRIPE_FOUNDING_KEY: 'rk_test', FOUNDING_PRICE_ID: 'price_founding' })
      expect(await full.json()).toEqual({ ok: true, total: 100, claimed: 100 })
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
