import { foundingTerms } from '../growth-funnel/founding-offer'
import './FoundingBar.css'

/** Launch announcement above the header. Links to Pricing, where the offer is explained in full. */
export function FoundingBar() {
  const offer = foundingTerms()
  return <a className="l4b-bar" href="#pricing">
    <span className="l4b-dot" aria-hidden="true" />
    <span className="l4b-lead"><strong>Sted Pro is here.</strong> Founding offer, first {offer.spots} members:</span>
    <span className="l4b-lead-short"><strong>Founding offer:</strong></span>
    <s aria-label={`Regular price ${offer.regular} a year`}>{offer.regular}</s>
    <strong>{offer.price}</strong>
    <span>a year</span>
    <span className="l4b-go">Claim yours <span aria-hidden="true">→</span></span>
  </a>
}
