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
          expect([...body.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])).toEqual(['https://www.sted.ai/', 'https://www.sted.ai/privacy', 'https://www.sted.ai/terms', 'https://www.sted.ai/support'])
        } else expect(body).toContain('Sitemap: https://sted.ai/sitemap.xml')
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
