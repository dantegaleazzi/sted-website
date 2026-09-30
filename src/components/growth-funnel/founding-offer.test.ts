import { describe, expect, it } from 'vitest'
import { FOUNDING_FUNNEL_URL, REVENUECAT_FUNNEL_URL } from '../landing-4c/app-links'
import { PRO_MULTIPLIER, comparison } from '../landing-4c/LandingPricing'
import { ROADMAP } from '../landing-4c/roadmap'
import { checkoutUrl, foundingTerms, isFoundingLive, planFunnelUrl } from './founding-offer'

const session = { id: '00000000-0000-4000-8000-000000000003', utm: { utm_source: 'x', utm_campaign: 'pro-launch' } }

describe('founding offer', () => {
  it('is $19.99 a year, locked in, against the regular $79.99', () => {
    expect(foundingTerms()).toEqual({ price: '$19.99', regular: '$79.99', monthly: '$1.66', spots: 100, renewal: 'Founding price, yours for as long as you stay subscribed. Cancel anytime.' })
  })

  it('only goes live in production once its RevenueCat funnel exists', () => {
    expect(isFoundingLive({ funnelUrl: null, review: false })).toBe(false)
    expect(isFoundingLive({ funnelUrl: null, review: true })).toBe(true)
    expect(isFoundingLive({ funnelUrl: 'https://signup.cat/founding/', review: false })).toBe(true)
  })

  it('never sends the founding CTA to the regular-price checkout', () => {
    const url = checkoutUrl('founding', session, 'bar')
    if (FOUNDING_FUNNEL_URL === null) expect(url).toBeNull()
    else expect(url!.startsWith(FOUNDING_FUNNEL_URL)).toBe(true)
  })

  it('/start hands off to the founding funnel while it exists, else the regular one', () => {
    expect(planFunnelUrl()).toBe(FOUNDING_FUNNEL_URL ?? REVENUECAT_FUNNEL_URL)
  })
})

describe('direct checkout from the landing', () => {
  it('opens the RevenueCat funnel with the period, the CTA, the session and the UTMs', () => {
    const url = new URL(checkoutUrl('monthly', session, 'how_it_works')!)
    expect(url.origin + url.pathname).toBe(REVENUECAT_FUNNEL_URL)
    expect(Object.fromEntries(url.searchParams)).toEqual({
      utm_source: 'x', utm_campaign: 'pro-launch', sted_session_id: session.id, period: 'monthly', source_page: 'how_it_works',
    })
  })
})

describe('what the landing promises', () => {
  it('shows chat as live in Free vs Pro (no Soon tag)', () => {
    expect(comparison().find(row => row.feature === 'Chat with your saved items')?.soon).toBeUndefined() // live since iOS 1.3
  })

  it('shows Free vs Pro as one number per month', () => {
    const pick = (feature: string) => comparison().find(row => row.feature === feature)!
    expect(pick('Saves Sted reads for you')).toMatchObject({ free: '50 a month', pro: '500 a month' })
    expect(pick('Chat with your saved items')).toMatchObject({ free: 'Limited', pro: 'Extended' })
    expect(pick('Saves')).toMatchObject({ free: 'Up to 1,000', pro: 'Unlimited' })
  })

  it('claims Pro usage from the tightest limit (summaries 500 vs 50 = 10×)', () => {
    expect(PRO_MULTIPLIER).toBe(10)
  })

  it('lists the roadmap Dante approved', () => {
    expect(ROADMAP.map(item => item.name)).toEqual(['Chrome and Safari extensions', 'Web dashboard', 'Sted for Android', 'Screenshots, PDFs, notes and docs'])
  })
})
