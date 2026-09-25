import { useEffect, useState } from 'react'
import { APP_STORE_URL } from './app-links'
import { PLAN_CAPACITY, annualComparison, getPeriod } from '../growth-funnel/funnel-pricing'
import { loadFunnelSession } from '../growth-funnel/funnel-session'
import './LandingPricing.css'

const ICONS = '/content/landing-4c/icons'
const n = (value: number) => value.toLocaleString('en-US')
type Billing = 'annual' | 'monthly'

/**
 * Pro goes through our funnel first (/start: questions → demo → "See my plan"), which hands off to
 * the RevenueCat web-to-app funnel with the chosen period. UTMs stay in the tab's funnel session.
 */
export function proStartUrl(billing: Billing) {
  return `/start?period=${billing}`
}

/** Sted Pro as the full Sted; Free is mentioned once, at the end, as the safety net. */
export function LandingPricing() {
  const [billing, setBilling] = useState<Billing>('annual')
  // Keep the landing's UTMs in this tab's funnel session, so /start (and RevenueCat) still get them.
  useEffect(() => { loadFunnelSession() }, [])
  const pro = PLAN_CAPACITY.pro
  const free = PLAN_CAPACITY.free
  const annual = annualComparison()
  const price = getPeriod(billing)

  const benefits = [
    { icon: 'summary-card', value: n(pro.aiSavesPerMonth), label: 'saves Sted reads for you a month', body: 'Each one comes back with a summary, key points and topics.' },
    { icon: 'projects', value: 'Unlimited', label: 'saves', body: 'Keep everything you find. No cap, no cleanup.' },
    { icon: 'chat', value: n(pro.chatMessagesPerMonth), label: 'chat messages a month', body: 'Ask your saves anything and get answers from what you kept.' },
  ]

  return <section className="l4p-section l4s-section" id="pricing" aria-labelledby="l4p-title">
    <header className="l4p-heading">
      <p className="l4s-section-eyebrow">Pricing</p>
      <h2 className="l4s-h2" id="l4p-title">Get more from<br />what you save.</h2>
    </header>

    <article className="l4p-pro" aria-labelledby="l4p-pro-title">
      <div className="l4p-pro-intro">
        <h3 id="l4p-pro-title">Sted <span>Pro</span></h3>
        <p className="l4p-pro-pitch">For people who save a lot and want all of it working for them.</p>

        <div className="l4p-billing" role="group" aria-label="Billing period">
          <button type="button" aria-pressed={billing === 'monthly'} onClick={() => setBilling('monthly')}>Monthly</button>
          <button type="button" aria-pressed={billing === 'annual'} onClick={() => setBilling('annual')}>
            Yearly <span className="l4p-save">Save {Math.round(annual.savingsPercent)}%</span>
          </button>
        </div>

        <p className="l4p-price" aria-live="polite">
          <strong>{price.price}</strong> / {billing === 'annual' ? 'year' : 'month'}
          <span>{billing === 'annual' ? `${annual.monthlyEquivalent} a month` : 'Billed every month'}</span>
        </p>

        <div className="l4p-cta-row">
          <div>
            <a className="l4p-cta" href={proStartUrl(billing)}>Get Sted Pro <span aria-hidden="true">→</span></a>
            <p className="l4p-fine">Cancel anytime.</p>
          </div>
          <img className="l4p-mascot" src="/sted-mascot.svg" alt="" width={64} height={79} />
        </div>
      </div>

      <div className="l4p-benefits">
        <ul>
          {benefits.map(item => <li key={item.icon}>
            <img src={`${ICONS}/${item.icon}.webp`} alt="" width={52} height={52} />
            <p className="l4p-value"><strong>{item.value}</strong>{item.label}</p>
            <p className="l4p-body">{item.body}</p>
          </li>)}
        </ul>
        <p className="l4p-plus">Plus everything in Free.</p>
      </div>
    </article>

    <footer className="l4p-free">
      <p><strong>Sted is free, forever.</strong> Not ready for Pro? You still get a lot.</p>
      <p className="l4p-free-limits">Free includes {n(free.saves)} saves, {n(free.aiSavesPerMonth)} saves Sted reads for you and {n(free.chatMessagesPerMonth)} chat messages a month.</p>
      <a className="l4p-free-link" href={APP_STORE_URL ?? '#'}>Get Sted free <span aria-hidden="true">→</span></a>
      <p className="l4p-note">Chat is available in the Sted web app and launching soon on iOS.</p>
    </footer>
  </section>
}
