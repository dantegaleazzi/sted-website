import { APP_STORE_URL } from './app-links'
import { CheckoutLink } from './CheckoutLink'
import { AppStoreBadge } from './Landing4CSections'
import { isSoldOut, useFoundingSpots } from './useFoundingSpots'
import { FOUNDING, foundingTerms, isFoundingLive } from '../growth-funnel/founding-offer'
import { getPeriod } from '../growth-funnel/funnel-pricing'

/**
 * Hero CTAs: while the founding offer runs (and spots are left), the price is the primary button
 * and one quiet line under it gives the discount off the regular yearly price, with free one tap away.
 * Otherwise, the App Store badge. Either way the one action sits alone in the row: straight to checkout.
 */
export function HeroCta({ founding = isFoundingLive() }: { founding?: boolean }) {
  const spots = useFoundingSpots()
  if (!founding || isSoldOut(spots)) return <div className="l4c-cta">
    <div className="l4c-cta-row"><AppStoreBadge height={42} /></div>
  </div>

  const offer = foundingTerms()
  const discount = Math.round((1 - FOUNDING.cents / getPeriod('annual').cents) * 100)
  return <div className="l4c-cta">
    <div className="l4c-cta-row">
      <CheckoutLink plan="founding" source="hero" className="l4c-primary-cta" noticeClassName="l4c-cta-notice">
        <span className="l4c-cta-label">Sted Pro · {offer.price}/year</span>
        <span className="l4c-cta-arrow" aria-hidden="true">→</span>
      </CheckoutLink>
    </div>
    <p className="l4c-offer-line">
      <span className="l4c-offer-dot" aria-hidden="true" />
      <span><s aria-label={`Regular price ${offer.regular} a year`}>{offer.regular}</s> <strong>{discount}% off</strong> for the first {offer.spots} members</span>
      <span className="l4c-offer-sep" aria-hidden="true">·</span>
      <a href={APP_STORE_URL ?? '#'}>or start free on iPhone</a>
    </p>
  </div>
}
