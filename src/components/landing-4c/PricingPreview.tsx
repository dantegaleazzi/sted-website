import { useEffect } from 'react'
import { APP_STORE_URL } from './app-links'
import { CheckoutLink } from './CheckoutLink'
import { LandingPricing, PRO_MULTIPLIER, REDEEM_NOTE, comparison } from './LandingPricing'
import { isSoldOut, spotsLeft, useFoundingSpots } from './useFoundingSpots'
import { foundingTerms, isFoundingLive } from '../growth-funnel/founding-offer'
import { annualComparison, getPeriod } from '../growth-funnel/funnel-pricing'
import { loadFunnelSession } from '../growth-funnel/funnel-session'
import './landing-4c-tokens.css'
import './Landing4CSections.css'
import './LandingPricing.css'
import './PricingPreview.css'

const PLATFORM_NOTE = 'Sted Pro for iPhone · pay here, unlock in the app'

/**
 * Proposal under review: Pricing with one price (yearly only; the founding price while it runs,
 * the regular yearly price after), one button, and Free vs Pro as one number per month.
 */
export function LandingPricingSingle({ founding: offered = isFoundingLive() }: { founding?: boolean }) {
  const spots = useFoundingSpots()
  const founding = offered && !isSoldOut(spots)
  useEffect(() => { loadFunnelSession() }, [])
  const annual = annualComparison()
  const offer = foundingTerms()

  return <section className="l4p-section l4s-section" id="pricing-new" aria-labelledby="l4pn-title">
    <header className="l4p-heading">
      <p className="l4s-section-eyebrow">Pricing</p>
      <h2 className="l4s-h2" id="l4pn-title">Get more from<br />what you save.</h2>
    </header>

    <article className="l4p-pro" aria-labelledby="l4pn-pro-title">
      <div className="l4p-pro-intro">
        <h3 id="l4pn-pro-title">Sted <span>Pro</span></h3>
        <p className="l4p-pro-pitch">For people who save a lot and want all of it working for them.</p>

        <div className="l4p-price-block">
          {founding
            ? <>
              <p className="l4p-offer-label">Founding offer · {spotsLeft(spots)}</p>
              <p className="l4p-price">
                <s aria-label={`Regular price ${offer.regular} a year`}>{offer.regular}</s>
                <strong>{offer.price}</strong> / year
                <span>{offer.monthly} a month. {offer.renewal}</span>
              </p>
            </>
            : <p className="l4p-price"><strong>{getPeriod('annual').price}</strong> / year<span>{annual.monthlyEquivalent} a month · Cancel anytime.</span></p>}
        </div>

        <p className="l4pn-platform">{PLATFORM_NOTE}</p>
        <div className="l4p-cta-row">
          <CheckoutLink plan={founding ? 'founding' : 'annual'} source="pricing" className="l4p-cta" noticeClassName="l4p-notice">
            {founding ? `Get Sted Pro · ${offer.price}` : 'Get Sted Pro'} <span aria-hidden="true">→</span>
          </CheckoutLink>
          <img className="l4p-mascot" src="/sted-mascot.svg" alt="" width={64} height={79} />
        </div>
        <p className="l4p-fine">{REDEEM_NOTE}</p>
      </div>

      <div className="l4p-side">
        <table className="l4p-compare">
          <thead><tr>
            <th scope="col"><span className="l4p-sr">Feature</span></th>
            <th scope="col">Free</th>
            <th scope="col">Pro<span className="l4p-multiplier">{PRO_MULTIPLIER}× more usage</span></th>
          </tr></thead>
          <tbody>
            {comparison('monthly').map(row => <tr key={row.feature}>
              <th scope="row">{row.feature}{row.soon && <span className="l4p-soon">Soon</span>}{row.detail && <small>{row.detail}</small>}</th>
              <td>{row.free}</td>
              <td>{row.pro}</td>
            </tr>)}
          </tbody>
        </table>
        <p className="l4p-build">
          <strong>{founding ? 'As a founding member, you’re helping build Sted.' : 'Every plan helps build what’s next.'}</strong>
          {' '}Chat on iOS, browser extensions and Android are on the way. <a href="/#roadmap">Check the roadmap →</a>
        </p>
      </div>
    </article>

    <footer className="l4p-free">
      <p><strong>Sted is free, forever.</strong> Not ready for Pro? You still get a lot.</p>
      <a className="l4p-free-link" href={APP_STORE_URL ?? '#'}>Get Sted free <span aria-hidden="true">→</span></a>
    </footer>
  </section>
}

/** /internal/pricing-new: the one-price proposal on top, today's Pricing under it, to compare. DEV and preview only. */
export function PricingPreviewPage() {
  useEffect(() => { document.title = 'Pricing, one price (review) — Sted' }, [])
  return <div className="l4c-page l4pn-page">
    <p className="l4pn-label">Proposal · one price, yearly only</p>
    <LandingPricingSingle />
    <p className="l4pn-label">Today’s Pricing (for comparison)</p>
    <LandingPricing />
  </div>
}
