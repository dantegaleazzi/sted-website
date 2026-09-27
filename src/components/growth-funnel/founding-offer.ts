import { FOUNDING_FUNNEL_URL, REVENUECAT_FUNNEL_URL } from '../landing-4c/app-links'
import { formatPrice, getPeriod, type Period } from './funnel-pricing'
import { buildPlanUrl, type FunnelAnswers, type FunnelSession } from './funnel-session'

/**
 * Launch offer for Sted Pro: its own Stripe price, $19.99 a year (product `sted_pro_annual_launch`
 * in the `Sted (Stripe)` config, entitlement `Sted Pro`). No coupon and no intro offer, so it renews
 * at $19.99: the founding price stays while the subscription does. The 100-member cap is closed by
 * hand in RevenueCat (there's no live counter), so the site says "first 100 members", never a count.
 */
export const FOUNDING = { cents: 1999, spots: 100 } as const

export function foundingTerms() {
  const regular = getPeriod('annual').price
  const price = formatPrice(FOUNDING.cents)
  return { price, regular, spots: FOUNDING.spots, renewal: 'Founding price, yours for as long as you stay subscribed. Cancel anytime.' }
}

type OfferEnv = { funnelUrl: string | null; review: boolean }

const reviewBuild = () => import.meta.env.DEV || import.meta.env.MODE === 'funnel-preview'

/** Live once its funnel is published; always visible in DEV and the preview build, for review. */
export function isFoundingLive({ funnelUrl, review }: OfferEnv = { funnelUrl: FOUNDING_FUNNEL_URL, review: reviewBuild() }) {
  return funnelUrl !== null || review
}

/** Where "See my plan" (/start) hands off: the founding funnel while it exists, else the regular one. */
export function planFunnelUrl() {
  return FOUNDING_FUNNEL_URL ?? REVENUECAT_FUNNEL_URL
}

export type Plan = 'founding' | Exclude<Period, 'weekly'>

const NO_ANSWERS: FunnelAnswers = { persona: null, sources: [], storage: [], purposes: [], need: null, example: null }

/**
 * Checkout for the landing CTAs (bar, How it works, Pricing): straight to the RevenueCat funnel
 * with the session, UTMs and which CTA sent them. null when that funnel isn't set (review builds).
 */
export function checkoutUrl(plan: Plan, session: FunnelSession, source: string): string | null {
  const base = plan === 'founding' ? FOUNDING_FUNNEL_URL : REVENUECAT_FUNNEL_URL
  if (!base) return null
  const url = new URL(buildPlanUrl(base, session, NO_ANSWERS, plan === 'founding' ? 'annual' : plan))
  url.searchParams.set('source_page', source)
  return url.toString()
}
