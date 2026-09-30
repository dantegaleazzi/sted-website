import { useEffect } from 'react'
import { APP_STORE_URL } from './app-links'
import { CheckoutLink } from './CheckoutLink'
import { isSoldOut, spotsLeft, useFoundingSpots } from './useFoundingSpots'
import { foundingTerms, isFoundingLive } from '../growth-funnel/founding-offer'
import { PLAN_CAPACITY, annualComparison, getPeriod } from '../growth-funnel/funnel-pricing'
import { loadFunnelSession } from '../growth-funnel/funnel-session'
import './LandingPricing.css'

const n = (value: number) => value.toLocaleString('en-US')

export const REDEEM_NOTE = 'Pay here, unlock on your iPhone: open the email we send you and tap Redeem.'

const free = PLAN_CAPACITY.free
const pro = PLAN_CAPACITY.pro

/** How much more Pro gives than Free on its tightest limit, rounded down to a multiple of ten. */
export const PRO_MULTIPLIER = Math.floor(Math.min(pro.aiSavesPerMonth / free.aiSavesPerMonth, pro.chatCreditsPerMonth / free.chatCreditsPerMonth) / 10) * 10

type Row = { feature: string; detail?: string; soon?: boolean; free: string; pro: string }

/** Free vs Pro, row by row, one number per month. "Soon" marks a feature that isn't live yet. */
export function comparison(): Row[] {
  return [
    { feature: 'Saves', free: `Up to ${n(free.saves)}`, pro: 'Unlimited' },
    { feature: 'Saves Sted reads for you', detail: 'Summary, key ideas and topics', free: `${n(free.aiSavesPerMonth)} a month`, pro: `${n(pro.aiSavesPerMonth)} a month` },
    { feature: 'Search your whole library', free: '✓', pro: '✓' },
    { feature: 'Chat with your saved items', free: 'Limited', pro: 'Extended' },
  ]
}

export function ComparisonTable({ className = '' }: { className?: string }) {
  return <table className={`l4p-compare ${className}`}>
    <thead><tr>
      <th scope="col"><span className="l4p-sr">Feature</span></th>
      <th scope="col">Free</th>
      <th scope="col">Pro<span className="l4p-multiplier">{PRO_MULTIPLIER}× more usage</span></th>
    </tr></thead>
    <tbody>
      {comparison().map(row => <tr key={row.feature}>
        <th scope="row">{row.feature}{row.soon && <span className="l4p-soon">Soon</span>}{row.detail && <small>{row.detail}</small>}</th>
        <td>{row.free}</td>
        <td>{row.pro}</td>
      </tr>)}
    </tbody>
  </table>
}

/**
 * Sted Pro, yearly only (soft launch): the founding price while it runs, the regular yearly price
 * after. Free vs Pro per month, and Free once at the end.
 */
export function LandingPricing({ founding: offered = isFoundingLive() }: { founding?: boolean }) {
  const spots = useFoundingSpots()
  const founding = offered && !isSoldOut(spots)
  // Keep the landing's UTMs in this tab's funnel session, so the checkout still gets them.
  useEffect(() => { loadFunnelSession() }, [])
  const annual = annualComparison()
  const offer = foundingTerms()

  return <section className="l4p-section l4s-section" id="pricing" aria-labelledby="l4p-title">
    <header className="l4p-heading">
      <p className="l4s-section-eyebrow">Pricing</p>
      <h2 className="l4s-h2" id="l4p-title">Make every save count.</h2>
    </header>

    <article className="l4p-pro" aria-labelledby="l4p-pro-title">
      <div className="l4p-pro-intro">
        <h3 id="l4p-pro-title">Sted <span>Pro</span></h3>
        <p className="l4p-pro-pitch">For people who save every day and want all of it read, sorted and searchable.</p>

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

        <div className="l4p-cta-row">
          <CheckoutLink plan={founding ? 'founding' : 'annual'} source="pricing" className="l4p-cta" noticeClassName="l4p-notice">
            {founding ? `Get Sted Pro · ${offer.price}` : 'Get Sted Pro'} <span aria-hidden="true">→</span>
          </CheckoutLink>
          <img className="l4p-mascot" src="/sted-mascot.svg" alt="" width={64} height={79} />
        </div>
        <p className="l4p-fine">{REDEEM_NOTE}</p>
      </div>

      <div className="l4p-side">
        <ComparisonTable />
        <p className="l4p-build">
          <strong>{founding ? 'As a founding member, you’re helping build Sted.' : 'Every plan helps build what’s next.'}</strong>
          {' '}Browser extensions, a web dashboard and Android are on the way. <a href="#roadmap">Check the roadmap →</a>
        </p>
      </div>
    </article>

    <footer className="l4p-free">
      <p><strong>Start free:</strong> up to {n(free.saves)} saves and {n(free.aiSavesPerMonth)} AI summaries a month. No card needed.</p>
      <a className="l4p-free-link" href={APP_STORE_URL ?? '#'}>Get Sted free <span aria-hidden="true">→</span></a>
    </footer>
  </section>
}
