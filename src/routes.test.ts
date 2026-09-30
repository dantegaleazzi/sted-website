import { describe, expect, it } from 'vitest'
import { JUDGES_PATH } from './worker-policy'
import { resolveRoute } from './routes'

const production = { dev: false, funnelPreview: false }
const dev = { dev: true, funnelPreview: false }

describe('routes', () => {
  it('serves the /start funnel in the production build', () => {
    expect(resolveRoute('/start', production)).toBe('start')
    expect(resolveRoute('/start/', production)).toBe('start')
    expect(resolveRoute('/start', dev)).toBe('start')
  })

  it('serves the unlinked judges page in production', () => {
    expect(resolveRoute(JUDGES_PATH, production)).toBe('judges')
    expect(resolveRoute('/judges', production)).toBe('landing')
  })

  it('keeps the landing at / and the site pages in production', () => {
    expect(resolveRoute('/', production)).toBe('landing')
    expect(resolveRoute('/privacy', production)).toBe('site')
    expect(resolveRoute('/nope', production)).toBe('landing')
  })

  it('keeps the funnel review surfaces out of production', () => {
    for (const path of ['/internal/funnel', '/internal/funnel/c', '/internal/funnel/a', '/tunnel']) {
      expect(resolveRoute(path, production)).toBe('landing')
    }
    expect(resolveRoute('/internal/funnel/c', dev)).toBe('funnel-review')
    expect(resolveRoute('/', { dev: false, funnelPreview: true })).toBe('funnel-review')
  })
})
