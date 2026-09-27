import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { APP_STORE_URL, REVENUECAT_FUNNEL_URL } from '../landing-4c/app-links'
import { LandingPricing, REDEEM_NOTE } from '../landing-4c/LandingPricing'
import { annualComparison, getPeriod } from './funnel-pricing'
import { buildPlanUrl, readPeriod, type FunnelAnswers } from './funnel-session'

const session = { id: '00000000-0000-4000-8000-000000000002', utm: { utm_source: 'tiktok', utm_medium: 'social', utm_campaign: 'launch', utm_content: 'reel-1', utm_term: 'bookmarks' } }
const answers: FunnelAnswers = { persona: 'student', sources: ['YouTube', 'Websites'], storage: ['tabs'], purposes: ['learning', 'work'], need: 'find', example: 'starship' }
const ALLOWED = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'sted_session_id', 'persona', 'sources', 'storage', 'purpose', 'need', 'example', 'period', 'source_page']

describe('production RevenueCat funnel', () => {
  it('points at the production Web-to-App funnel', () => {
    expect(REVENUECAT_FUNNEL_URL).toBe('https://signup.cat/ZfSBmYBUIHRKvlzo/')
  })

  it('hands off the session, every answer, the UTMs and the period', () => {
    const url = new URL(buildPlanUrl(REVENUECAT_FUNNEL_URL!, session, answers, 'annual'))
    expect(url.origin + url.pathname).toBe('https://signup.cat/ZfSBmYBUIHRKvlzo/')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      utm_source: 'tiktok', utm_medium: 'social', utm_campaign: 'launch', utm_content: 'reel-1', utm_term: 'bookmarks',
      sted_session_id: session.id,
      persona: 'student', sources: 'youtube,websites', storage: 'tabs', purpose: 'learning,work', need: 'find', example: 'starship',
      period: 'annual',
    })
  })

  it('sends no app_user_id, email or anything outside the known parameters', () => {
    const url = new URL(buildPlanUrl(REVENUECAT_FUNNEL_URL!, session, answers, 'monthly'))
    for (const key of url.searchParams.keys()) expect(ALLOWED).toContain(key)
    expect(url.searchParams.has('app_user_id')).toBe(false)
    expect(url.toString()).not.toMatch(/@|email/i)
  })

  it('only carries a known billing period', () => {
    expect(readPeriod('?period=annual')).toBe('annual')
    expect(readPeriod('?period=monthly')).toBe('monthly')
    expect(readPeriod('?period=lifetime')).toBeNull()
    expect(readPeriod('')).toBeNull()
    expect(new URL(buildPlanUrl(REVENUECAT_FUNNEL_URL!, session, answers)).searchParams.has('period')).toBe(false)
  })
})

describe('final web prices', () => {
  it('matches RevenueCat: $9.99 / $12.99 / $79.99', () => {
    expect([getPeriod('weekly').cents, getPeriod('monthly').cents, getPeriod('annual').cents]).toEqual([999, 1299, 7999])
    expect([getPeriod('weekly').price, getPeriod('monthly').price, getPeriod('annual').price]).toEqual(['$9.99', '$12.99', '$79.99'])
    expect(annualComparison().monthlyEquivalent).toBe('$6.67')
  })
})

describe('landing pricing', () => {
  const regular = renderToStaticMarkup(createElement(LandingPricing, { founding: false }))
  const founding = renderToStaticMarkup(createElement(LandingPricing, { founding: true }))

  it('shows the regular annual price and never the old ones', () => {
    expect(regular).toContain('$79.99')
    expect(regular).toContain('$6.67 a month')
    expect(regular).toContain('Save 49%')
    for (const html of [regular, founding]) expect(html).not.toMatch(/\$10\b|\$79(?!\.99)|\$6\.58/)
  })

  it('shows the founding offer against the regular price, with its renewal', () => {
    expect(founding).toContain('Founding offer · First 100 members')
    expect(founding).toMatch(/<s[^>]*>\$79\.99<\/s><strong>\$19\.99<\/strong> for your first year/)
    expect(founding).toContain('Then $79.99/year. Cancel anytime.')
    expect(founding).toContain('Get Sted Pro · $19.99')
    expect(regular).not.toContain('$19.99')
  })

  it('compares Free and Pro, marks chat as not live yet and points to the roadmap', () => {
    for (const html of [regular, founding]) {
      expect(html).toContain('<th scope="col">Free</th><th scope="col">Pro</th>')
      expect(html).toContain('Chat with your saved items<span class="l4p-soon">Soon</span>')
      expect(html).toContain('href="#roadmap"')
      expect(html).toContain(REDEEM_NOTE)
    }
    expect(founding).toContain('As a founding member, you’re helping build Sted.')
  })

  it('keeps Get Sted free on the App Store', () => {
    expect(APP_STORE_URL).toBe('https://apps.apple.com/es/app/sted-ai/id6805940694')
    expect(founding).toContain(`href="${APP_STORE_URL}"`)
  })
})
