import type { RefObject } from 'react'
import { APP_STORE_URL } from '../landing-4c/app-links'
import {
  PLAN_CAPACITY, PERIODS, PRICING_CONFIG_STATUS, annualComparison, formatPrice, getPeriod,
  resultFraming, type Habit, type Period, type Plan,
} from './funnel-pricing'
import './FunnelPlanResult.css'

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>
  habit: Habit | null
  sources: string[]
  recommended: Plan
  period: Period
  onPeriod: (period: Period) => void
}

export function PlanCapacity({ plan }: { plan: Plan }) {
  const capacity = PLAN_CAPACITY[plan]
  return <dl className="fp-capacity">
    <div><dd>{capacity.saves === null ? 'Unlimited' : capacity.saves.toLocaleString('en-US')}</dd><dt>Saves</dt></div>
    <div><dd>{capacity.aiSavesPerMonth.toLocaleString('en-US')}</dd><dt>AI Saves<span>/ month</span></dt></div>
    <div><dd>{capacity.chatMessagesPerMonth.toLocaleString('en-US')}</dd><dt>Chat messages<span>/ month</span></dt></div>
  </dl>
}

export function FunnelPlanResult({ headingRef, habit, sources, recommended, period, onPeriod }: Props) {
  const annual = annualComparison()
  return <section className={`fp-result fp-recommend-${recommended}`} data-pricing-status={PRICING_CONFIG_STATUS} aria-labelledby="cf-heading">
    <header className="fp-intro">
      <div className="fp-recommendation">
        <span>{recommended === 'pro' ? 'A GOOD FIT FOR YOU' : 'A GOOD PLACE TO START'}</span>
        <p>{resultFraming(habit, sources)}</p>
      </div>
      <img className="fp-paywall-mascot" src="/sted-mascot.svg" alt="Sted" />
      <h2 id="cf-heading" ref={headingRef} tabIndex={-1}>Get more from what you save.</h2>
      <p className="fp-subcopy">Save more. Understand more. Ask more.</p>
    </header>

    <div className="fp-offer">
      <article className="fp-paywall-card" aria-label="Sted Pro plan">
        <header className="fp-paywall-card-head">
          <span className="fp-plan-name">STED PRO</span>
          <span className="fp-launch">LAUNCH OFFER</span>
        </header>
        <PlanCapacity plan="pro" />
        <div className="fp-paywall-chat"><strong>Chat with your saves</strong><span>Web available now · iOS coming soon</span></div>
      </article>
      <div className="fp-billing">
        <div className="fp-periods" role="group" aria-label="Choose a Sted Pro billing period">
          {PERIODS.map(item => <button key={item.id} type="button" aria-pressed={period === item.id} onClick={() => onPeriod(item.id)}>
            <span className="fp-period-label">{item.label}</span>
            {item.id === 'annual' && annual.isBestValue && <span className="fp-best-value">BEST VALUE</span>}
            <strong>{formatPrice(item.cents)}</strong>
            <span className="fp-frequency">/{item.unit}</span>
            {item.id === 'annual' && <span className="fp-annual-detail">{annual.monthlyEquivalent}/mo · Save {Math.round(annual.savingsPercent)}%</span>}
          </button>)}
        </div>
      </div>
    </div>
  </section>
}

export function FunnelPlanCTA({ period, onStartPro }: { period: Period; onStartPro: () => void }) {
  const selectedPeriod = getPeriod(period)
  return <>
    <div className="fp-actions">
      <button type="button" className="cf-primary" onClick={onStartPro}>Start with Pro <span aria-hidden="true">→</span></button>
      <a className="fp-free-action" href={APP_STORE_URL!}>Continue with Free</a>
    </div>
    <div className="fp-trust"><strong>Cancel anytime.</strong><span>Secure checkout</span></div>
    <p className="fp-renewal">{selectedPeriod.renewal} Auto-renews. USD; taxes may apply.</p>
    <nav className="fp-legal" aria-label="Subscription information"><a href="/terms" target="_blank" rel="noreferrer">Terms</a><span>·</span><a href="/privacy" target="_blank" rel="noreferrer">Privacy</a><span>·</span><a href="/support" target="_blank" rel="noreferrer">Support</a></nav>
  </>
}
