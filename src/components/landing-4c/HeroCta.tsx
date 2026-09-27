import { APP_STORE_URL } from './app-links'
import { CheckoutLink } from './CheckoutLink'
import { AppStoreBadge } from './Landing4CSections'
import { foundingSpotsLabel, isSoldOut, useFoundingSpots } from './useFoundingSpots'
import { foundingTerms, isFoundingLive } from '../growth-funnel/founding-offer'

/**
 * Hero CTAs: while the founding offer runs (and spots are left), the price is the primary button
 * and one quiet line under it says how many founding spots there are, with free one tap away.
 * Otherwise, the App Store badge. Either way the one action sits alone in the row.
 *
 * `onHowItWorks` is accepted but unused: the "See how it works" link left the hero. The dialog it opened
 * (HowItWorks.tsx) is still wired in Landing4CPreview, so bringing an entry point back is one line.
 */
export function HeroCta({ founding = isFoundingLive() }: { onHowItWorks?: () => void; founding?: boolean }) {
  const spots = useFoundingSpots()
  if (!founding || isSoldOut(spots)) return <div className="l4c-cta">
    <div className="l4c-cta-row"><AppStoreBadge height={42} /></div>
  </div>

  const offer = foundingTerms()
  return <div className="l4c-cta">
    <div className="l4c-cta-row">
      <CheckoutLink plan="founding" source="hero" className="l4c-primary-cta" noticeClassName="l4c-cta-notice">
        <span className="l4c-cta-label">Sted Pro · {offer.price}/year</span>
        <span className="l4c-cta-arrow" aria-hidden="true">→</span>
      </CheckoutLink>
    </div>
    <p className="l4c-offer-line">
      <span className="l4c-offer-dot" aria-hidden="true" />
      <strong>{foundingSpotsLabel(spots)}</strong>
      <span className="l4c-offer-sep" aria-hidden="true">·</span>
      <a href={APP_STORE_URL ?? '#'}>or get Sted free</a>
    </p>
  </div>
}
