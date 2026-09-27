import { describe, expect, it } from 'vitest'
import { FOUNDING_FUNNEL_URL, REVENUECAT_FUNNEL_URL } from '../landing-4c/app-links'
import { PRO_MULTIPLIER, comparison } from '../landing-4c/LandingPricing'
import { ROADMAP } from '../landing-4c/roadmap'
import { checkoutUrl, foundingTerms, isFoundingLive, planFunnelUrl } from './founding-offer'

const session = { id: '00000000-0000-4000-8000-000000000003', utm: { utm_source: 'x', utm_campaign: 'pro-launch' } }

describe('founding offer', () => {
  it('is $19.99 a year, locked in, against the regular $79.99', () => {
    expect(foundingTerms()).toEqual({ price: '$19.99', regular: '$79.99', monthly: '$1.67', spots: 100, renewal: 'Founding price, yours for as long as you stay subscribed. Cancel anytime.' })
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
  it('marks chat as not live yet in Free vs Pro', () => {
    expect(comparison('monthly').find(row => row.feature === 'Chat with your saved items')?.soon).toBe(true)
  })

  it('shows Free vs Pro per month, or per year with the monthly figure under it', () => {
    const pick = (rows: ReturnType<typeof comparison>, feature: string) => rows.find(row => row.feature === feature)!
    const monthly = comparison('monthly')
    expect(pick(monthly, 'Saves Sted reads for you')).toMatchObject({ free: '30 a month', pro: '1,000 a month' })
    expect(pick(monthly, 'Chat with your saved items')).toMatchObject({ free: '25 credits a month', pro: '500 credits a month' })
    const yearly = comparison('annual')
    expect(pick(yearly, 'Saves Sted reads for you')).toMatchObject({ free: '360 a year', freeNote: '30 a month', pro: '12,000 a year', proNote: '1,000 a month' })
    expect(pick(yearly, 'Chat with your saved items')).toMatchObject({ free: '300 credits a year', pro: '6,000 credits a year' })
    expect(pick(yearly, 'Saves')).toMatchObject({ free: 'Up to 1,000', pro: 'Unlimited' })
  })

  it('claims Pro usage from the tightest limit (chat 500 vs 25 = 20×)', () => {
    expect(PRO_MULTIPLIER).toBe(20)
  })

  it('lists the roadmap Dante approved', () => {
    expect(ROADMAP.map(item => item.name)).toEqual(['Chat on iOS', 'Chrome and Safari extensions', 'Sted for Android'])
  })
})
