import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { StedContentTunnel } from './StedContentTunnel'
import { portalFixtures } from './portal-fixtures'
import { SourceCard } from '../source-cards/SourceCard'

describe('internal portal tunnel', () => {
  it('renders sixteen real visual cards SourceCards without synthetic media', () => {
    const html = renderToStaticMarkup(createElement(StedContentTunnel, { items: portalFixtures, variant: 'portal' }))
    expect((html.match(/<article class="source-card /g) || []).length).toBe(16)
    expect(html).toContain('sct-portal-surface')
    const ids = [...html.matchAll(/data-content-id="([^"]+)"/g)].map(match => match[1])
    expect(new Set(ids).size).toBe(16)
    expect((html.match(/data-side="left"/g) || []).length).toBe(8)
    expect((html.match(/data-side="right"/g) || []).length).toBe(8)
    expect(html).toContain('visual-card__image')
    expect(html).not.toContain('temporary-')
    expect(portalFixtures).toHaveLength(16)
    expect(portalFixtures.every(item => item.verifiedContent && item.url && (item.id === 'instagram-dji' || item.image?.startsWith('/content/real/')))).toBe(true)
    expect(html).not.toContain('★ 2.4k')
    expect(html).not.toContain('♡ 248')
    expect(html).not.toContain('source-card__wave')
    expect(portalFixtures.filter(item => item.image)).toHaveLength(16)
    expect(portalFixtures.some(item => item.type === 'notion')).toBe(false)
  })
  it('preserves the original fallback and default tunnel behavior', () => {
    const item = { ...portalFixtures.find(item => item.type === 'youtube')!, verifiedContent: false, image: undefined, imageAlt: undefined }
    const original = renderToStaticMarkup(createElement(SourceCard, { item }))
    const content = renderToStaticMarkup(createElement(SourceCard, { item, contentOnly: true }))
    expect(original).toContain('source-card__media--youtube')
    expect(content).not.toContain('source-card__media')
    expect(content).toContain(item.title)
    const tunnel = renderToStaticMarkup(createElement(StedContentTunnel, { items: [item] }))
    expect(tunnel).not.toContain('sct-portal-surface')
    expect((tunnel.match(/<article class="source-card /g) || []).length).toBe(2)
  })
})
