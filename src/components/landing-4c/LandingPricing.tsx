import { useEffect, useState } from 'react'
import { APP_STORE_URL } from './app-links'
import { CheckoutLink } from './CheckoutLink'
import { isSoldOut, spotsLeft, useFoundingSpots } from './useFoundingSpots'
import { FOUNDING, foundingTerms, isFoundingLive } from '../growth-funnel/founding-offer'
import { PLAN_CAPACITY, annualComparison, getPeriod } from '../growth-funnel/funnel-pricing'
import { loadFunnelSession } from '../growth-funnel/funnel-session'
import './LandingPricing.css'

const n = (value: number) => value.toLocaleString('en-US')
export type Billing = 'annual' | 'monthly'

export const REDEEM_NOTE = 'After checkout, open the confirmation email on your iPhone, download Sted and tap Redeem to unlock Pro.'

const free = PLAN_CAPACITY.free
const pro = PLAN_CAPACITY.pro

/** How much more Pro gives than Free on its tightest limit, rounded down to a multiple of ten. */
export const PRO_MULTIPLIER = Math.floor(Math.min(pro.aiSavesPerMonth / free.aiSavesPerMonth, pro.chatCreditsPerMonth / free.chatCreditsPerMonth) / 10) * 10

type Row = { feature: string; detail?: string; soon?: boolean; free: string; pro: string; freeNote?: string; proNote?: string }

/** A monthly limit, shown per month or, for yearly, as the year's total with the monthly figure under it. */
function usage(perMonth: number, billing: Billing, unit = '') {
  const label = unit ? ` ${unit}` : ''
  return billing === 'monthly'
    ? { value: `${n(perMonth)}${label} a month` }
    : { value: `${n(perMonth * 12)}${label} a year`, note: `${n(perMonth)} a month` }
}

/** Free vs Pro, row by row, for the billing period picked above. "Soon" marks a feature that isn't live yet. */
export function comparison(billing: Billing): Row[] {
  const reads = [usage(free.aiSavesPerMonth, billing), usage(pro.aiSavesPerMonth, billing)]
  const chat = [usage(free.chatCreditsPerMonth, billing, 'credits'), usage(pro.chatCreditsPerMonth, billing, 'credits')]
  return [
    { feature: 'Saves', free: `Up to ${n(free.saves)}`, pro: 'Unlimited' },
    { feature: 'Saves Sted reads for you', detail: 'Summary, key ideas and topics', free: reads[0].value, freeNote: reads[0].note, pro: reads[1].value, proNote: reads[1].note },
    { feature: 'Search your whole library', free: '✓', pro: '✓' },
    { feature: 'Chat with your saved items', soon: true, free: chat[0].value, freeNote: chat[0].note, pro: chat[1].value, proNote: chat[1].note },
  ]
}

export function ComparisonTable({ billing, className = '' }: { billing: Billing; className?: string }) {
  const period = billing === 'monthly' ? 'monthly' : 'yearly'
  return <table className={`l4p-compare ${className}`}>
    <thead><tr>
      <th scope="col"><span className="l4p-sr">Feature</span></th>
      <th scope="col">Free <span className="l4p-period">({period})</span></th>
      <th scope="col">Pro <span className="l4p-period">({period})</span><span className="l4p-multiplier">{PRO_MULTIPLIER}× more usage</span></th>
    </tr></thead>
    <tbody>
      {comparison(billing).map(row => <tr key={row.feature}>
        <th scope="row">{row.feature}{row.soon && <span className="l4p-soon">Soon</span>}{row.detail && <small>{row.detail}</small>}</th>
        <td>{row.free}{row.freeNote && <small>{row.freeNote}</small>}</td>
        <td>{row.pro}{row.proNote && <small>{row.proNote}</small>}</td>
      </tr>)}
    </tbody>
  </table>
}

/** Sted Pro as the full Sted: the founding offer while it runs, Free vs Pro, and Free once at the end. */
export function LandingPricing({ founding: offered = isFoundingLive() }: { founding?: boolean }) {
  const [billing, setBilling] = useState<Billing>('annual')
  const spots = useFoundingSpots()
  const founding = offered && !isSoldOut(spots)
  // Keep the landing's UTMs in this tab's funnel session, so the checkout still gets them.
  useEffect(() => { loadFunnelSession() }, [])
  const annual = annualComparison()
  const offer = foundingTerms()
  // Monthly checks out at the regular monthly price; yearly is the founding price while it runs.
  const plan = billing === 'monthly' ? 'monthly' : founding ? 'founding' : 'annual'
  const twelveMonths = getPeriod('monthly').cents * 12
  const yearlySavings = founding ? Math.round((1 - FOUNDING.cents / twelveMonths) * 100) : Math.round(annual.savingsPercent)

  return <section className="l4p-section l4s-section" id="pricing" aria-labelledby="l4p-title">
    <header className="l4p-heading">
      <p className="l4s-section-eyebrow">Pricing</p>
      <h2 className="l4s-h2" id="l4p-title">Get more from<br />what you save.</h2>
    </header>

    <article className="l4p-pro" aria-labelledby="l4p-pro-title">
      <div className="l4p-pro-intro">
        <h3 id="l4p-pro-title">Sted <span>Pro</span></h3>
        <p className="l4p-pro-pitch">For people who save a lot and want all of it working for them.</p>

        <div className="l4p-billing-row">
          <div className="l4p-billing" role="group" aria-label="Billing period">
            <button type="button" aria-pressed={billing === 'monthly'} onClick={() => setBilling('monthly')}>Pay monthly</button>
            <button type="button" aria-pressed={billing === 'annual'} onClick={() => setBilling('annual')}>Pay yearly</button>
          </div>
          <button type="button" className="l4p-save" onClick={() => setBilling('annual')}>
            {founding ? `Save up to ${yearlySavings}% with yearly` : `Save ${yearlySavings}% with yearly`}
          </button>
        </div>

        <div className="l4p-price-block" aria-live="polite">
          {billing === 'monthly'
            ? <p className="l4p-price"><strong>{getPeriod('monthly').price}</strong> / month<span>Billed every month · Cancel anytime.</span></p>
            : founding
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
          <CheckoutLink plan={plan} source="pricing" className="l4p-cta" noticeClassName="l4p-notice">
            {plan === 'founding' ? `Get Sted Pro · ${offer.price}` : 'Get Sted Pro'} <span aria-hidden="true">→</span>
          </CheckoutLink>
          <img className="l4p-mascot" src="/sted-mascot.svg" alt="" width={64} height={79} />
        </div>
        <p className="l4p-fine">{REDEEM_NOTE}</p>
      </div>

      <div className="l4p-side">
        <ComparisonTable billing={billing} />
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
