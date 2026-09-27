import { useEffect, useState } from 'react'
import { APP_STORE_URL } from './app-links'
import { CheckoutLink } from './CheckoutLink'
import { foundingTerms, isFoundingLive } from '../growth-funnel/founding-offer'
import { PLAN_CAPACITY, annualComparison, getPeriod } from '../growth-funnel/funnel-pricing'
import { loadFunnelSession } from '../growth-funnel/funnel-session'
import './LandingPricing.css'

const n = (value: number) => value.toLocaleString('en-US')
type Billing = 'annual' | 'monthly'

export const REDEEM_NOTE = 'After checkout, open the confirmation email on your iPhone, download Sted and tap Redeem to unlock Pro.'

const free = PLAN_CAPACITY.free
const pro = PLAN_CAPACITY.pro

/** Free vs Pro, row by row. "Soon" marks a feature that isn't live yet. */
export const COMPARISON: { feature: string; detail?: string; soon?: boolean; free: string; pro: string }[] = [
  { feature: 'Saves', free: n(free.saves), pro: 'Unlimited' },
  { feature: 'Saves Sted reads for you', detail: 'Summary, key ideas and topics', free: `${n(free.aiSavesPerMonth)} a month`, pro: `${n(pro.aiSavesPerMonth)} a month` },
  { feature: 'Search your whole library', free: '✓', pro: '✓' },
  { feature: 'Chat with your saved items', soon: true, free: `${n(free.chatMessagesPerMonth)} messages a month`, pro: `${n(pro.chatMessagesPerMonth)} messages a month` },
]

export function ComparisonTable({ className = '' }: { className?: string }) {
  return <table className={`l4p-compare ${className}`}>
    <thead><tr><th scope="col"><span className="l4p-sr">Feature</span></th><th scope="col">Free</th><th scope="col">Pro</th></tr></thead>
    <tbody>
      {COMPARISON.map(row => <tr key={row.feature}>
        <th scope="row">{row.feature}{row.soon && <span className="l4p-soon">Soon</span>}{row.detail && <small>{row.detail}</small>}</th>
        <td>{row.free}</td>
        <td>{row.pro}</td>
      </tr>)}
    </tbody>
  </table>
}

/** Sted Pro as the full Sted: the founding offer while it runs, Free vs Pro, and Free once at the end. */
export function LandingPricing({ founding = isFoundingLive() }: { founding?: boolean }) {
  const [billing, setBilling] = useState<Billing>('annual')
  // Keep the landing's UTMs in this tab's funnel session, so the checkout still gets them.
  useEffect(() => { loadFunnelSession() }, [])
  const annual = annualComparison()
  const price = getPeriod(billing)
  const offer = foundingTerms()

  return <section className="l4p-section l4s-section" id="pricing" aria-labelledby="l4p-title">
    <header className="l4p-heading">
      <p className="l4s-section-eyebrow">Pricing</p>
      <h2 className="l4s-h2" id="l4p-title">Get more from<br />what you save.</h2>
    </header>

    <article className="l4p-pro" aria-labelledby="l4p-pro-title">
      <div className="l4p-pro-intro">
        {founding && <p className="l4p-offer-tag">Founding offer · First {offer.spots} members</p>}
        <h3 id="l4p-pro-title">Sted <span>Pro</span></h3>
        <p className="l4p-pro-pitch">For people who save a lot and want all of it working for them.</p>

        {founding
          ? <p className="l4p-price">
            <s aria-label={`Regular price ${offer.regular} a year`}>{offer.regular}</s>
            <strong>{offer.price}</strong> for your first year
            <span>{offer.renewal}</span>
          </p>
          : <>
            <div className="l4p-billing" role="group" aria-label="Billing period">
              <button type="button" aria-pressed={billing === 'monthly'} onClick={() => setBilling('monthly')}>Monthly</button>
              <button type="button" aria-pressed={billing === 'annual'} onClick={() => setBilling('annual')}>
                Yearly <span className="l4p-save">Save {Math.round(annual.savingsPercent)}%</span>
              </button>
            </div>
            <p className="l4p-price" aria-live="polite">
              <strong>{price.price}</strong> / {billing === 'annual' ? 'year' : 'month'}
              <span>{billing === 'annual' ? `${annual.monthlyEquivalent} a month · Cancel anytime.` : 'Billed every month · Cancel anytime.'}</span>
            </p>
          </>}

        <div className="l4p-cta-row">
          <CheckoutLink plan={founding ? 'founding' : billing} source="pricing" className="l4p-cta" noticeClassName="l4p-notice">
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
          {' '}Chat on iOS, browser extensions and Android are on the way. <a href="#roadmap">Check the roadmap →</a>
        </p>
      </div>
    </article>

    <footer className="l4p-free">
      <p><strong>Sted is free, forever.</strong> Not ready for Pro? You still get a lot.</p>
      <a className="l4p-free-link" href={APP_STORE_URL ?? '#'}>Get Sted free <span aria-hidden="true">→</span></a>
    </footer>
  </section>
}
