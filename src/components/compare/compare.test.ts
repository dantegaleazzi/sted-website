import { describe, expect, it } from 'vitest'
import { BEST_FOR, COMPETITORS } from './compare-data'
import { ALL_COMPARE_PAGES, COMPARE_PATHS } from './compare-paths'
import { resolveRoute } from '../../routes'
import { PUBLIC_PAGES } from '../../worker-policy'

describe('comparison pages', () => {
  it('have their content: every vs/alternative page has a competitor, every guide its data', () => {
    for (const page of ALL_COMPARE_PAGES) {
      if (page.kind === 'vs' || page.kind === 'alternative') expect(COMPETITORS.some(c => c.slug === page.slug), page.path).toBe(true)
      if (page.kind === 'best') expect(BEST_FOR.some(b => b.slug === page.slug), page.path).toBe(true)
    }
    expect(new Set(ALL_COMPARE_PAGES.map(page => page.path)).size).toBe(ALL_COMPARE_PAGES.length)
  })

  it('cite where every fact about another app comes from', () => {
    for (const c of COMPETITORS) expect(c.sources.length, c.slug).toBeGreaterThan(0)
  })

  it('are routed and served in production when they are on', () => {
    for (const path of COMPARE_PATHS) {
      expect(resolveRoute(path, { dev: false, funnelPreview: false })).toBe('compare')
      expect(PUBLIC_PAGES.has(path)).toBe(true)
    }
  })
})
