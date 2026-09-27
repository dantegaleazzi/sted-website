import { APP_STORE_URL } from './app-links'
import { CheckoutLink } from './CheckoutLink'
import { AppStoreBadge } from './Landing4CSections'
import { foundingTerms, isFoundingLive } from '../growth-funnel/founding-offer'

function HowItWorksLink({ onClick }: { onClick: () => void }) {
  return <a href="#how-it-works" className="l4c-secondary-cta" onClick={event => { event.preventDefault(); onClick() }}>
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.4" fill="none" stroke="currentColor" strokeWidth="1.6" /><path fill="currentColor" d="M9.6 7.8v8.4l6.4-4.2z" /></svg>
    See how it works
  </a>
}

/**
 * Hero CTAs, Vitals-style: while the founding offer runs, the price is the primary button and the
 * offer is one quiet line under it (free stays one tap away). Otherwise, the App Store badge.
 */
export function HeroCta({ onHowItWorks, founding = isFoundingLive() }: { onHowItWorks: () => void; founding?: boolean }) {
  if (!founding) return <div className="l4c-cta">
    <div className="l4c-cta-row"><AppStoreBadge height={42} /><HowItWorksLink onClick={onHowItWorks} /></div>
  </div>

  const offer = foundingTerms()
  return <div className="l4c-cta">
    <div className="l4c-cta-row">
      <CheckoutLink plan="founding" source="hero" className="l4c-primary-cta" noticeClassName="l4c-cta-notice">
        Get Sted Pro · {offer.price}<span aria-hidden="true">→</span>
      </CheckoutLink>
      <HowItWorksLink onClick={onHowItWorks} />
    </div>
    <p className="l4c-offer-line">
      <span className="l4c-offer-dot" aria-hidden="true" />
      Founding offer: <s aria-label={`Regular price ${offer.regular} a year`}>{offer.regular}</s> <strong>{offer.price}/year</strong> for the first {offer.spots} members
      <span className="l4c-offer-sep" aria-hidden="true">·</span>
      <a href={APP_STORE_URL ?? '#'}>or get Sted free</a>
    </p>
  </div>
}
