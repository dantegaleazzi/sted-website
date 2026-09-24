import { APP_STORE_URL } from './app-links'
import { PlanCapacity } from '../growth-funnel/FunnelPlanResult'
import { PLAN_CAPACITY, annualComparison } from '../growth-funnel/funnel-pricing'
import './LandingPricing.css'

/** A value-led Pro introduction, with plan details kept in the shared pricing model. */
export function LandingPricing() {
  const annual = annualComparison()
  const free = PLAN_CAPACITY.free

  return <section className="l4p-section l4s-section" id="pricing" aria-labelledby="l4p-title">
    <header className="l4p-heading">
      <p className="l4s-section-eyebrow">STED PRO</p>
      <h2 className="l4s-h2" id="l4p-title">Get more from what you save.</h2>
      <p className="l4s-lede">Save more. Understand more. Ask more.</p>
    </header>

    <article className="l4p-pro-card" aria-labelledby="l4p-pro-title">
      <div className="l4p-mascot-wrap"><img src="/sted-mascot.svg" alt="Sted" className="l4p-mascot" /></div>
      <div className="l4p-pro-content">
        <header className="l4p-pro-head">
          <h3 id="l4p-pro-title">Sted Pro</h3>
          <span className="l4p-launch">LAUNCH OFFER</span>
        </header>
        <PlanCapacity plan="pro" />
        <div className="l4p-chat">
          <strong>Chat with your saves</strong>
          <span>Web available now · iOS coming soon</span>
        </div>
        <p className="l4p-price-teaser">From <strong>{annual.monthlyEquivalent}/mo</strong> billed annually</p>
        <a className="l4p-cta l4p-cta-primary" href="/internal/funnel/c?open=1">Find my plan <span aria-hidden="true">→</span></a>
      </div>
    </article>

    <div className="l4p-free-start">
      <p>Prefer to start free?</p>
      <span>{free.saves.toLocaleString('en-US')} Saves · {free.aiSavesPerMonth.toLocaleString('en-US')} AI Saves · {free.chatMessagesPerMonth.toLocaleString('en-US')} Chat messages/month</span>
      <a className="l4p-free-link" href={APP_STORE_URL!}>Get Sted Free</a>
    </div>
  </section>
}
