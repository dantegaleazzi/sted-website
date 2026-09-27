import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { APP_STORE_URL } from './app-links'
import { HeroCta } from './HeroCta'

const render = (founding: boolean) => renderToStaticMarkup(createElement(HeroCta, { founding, onHowItWorks: () => undefined }))

describe('hero CTAs', () => {
  it('leads with the founding price while the offer runs, with free one tap away', () => {
    const html = render(true)
    expect(html).toContain('class="l4c-primary-cta"')
    expect(html).toContain('Get Sted Pro · $19.99')
    expect(html).toMatch(/Founding offer: <s[^>]*>\$79\.99<\/s> <strong>\$19\.99\/year<\/strong> for the first 100 members/)
    expect(html).toContain(`href="${APP_STORE_URL}">or get Sted free</a>`)
    expect(html).toContain('See how it works')
  })

  it('falls back to the App Store badge when the offer is off', () => {
    const html = render(false)
    expect(html).toContain('app-store-badge.svg')
    expect(html).not.toContain('$19.99')
    expect(html).toContain('See how it works')
  })
})
