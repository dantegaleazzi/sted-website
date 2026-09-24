import { APP_STORE_URL } from './app-links'
import { PLAN_CAPACITY, annualComparison } from '../growth-funnel/funnel-pricing'
import './LandingPricing.css'

const ICONS = '/content/landing-4c/icons'
const n = (value: number) => value.toLocaleString('en-US')

/** Sted Pro as the hero of the section; Free as a quiet, permanent fallback underneath. */
export function LandingPricing() {
  const pro = PLAN_CAPACITY.pro
  const free = PLAN_CAPACITY.free
  const annual = annualComparison()

  const capabilities = [
    { icon: 'projects', value: 'Unlimited', label: 'saves', body: 'Keep everything you find. No cap, no cleanup.' },
    { icon: 'summary-card', value: n(pro.aiSavesPerMonth), label: 'AI saves a month', body: 'Sted reads them for you: summary, key ideas and topics.' },
    { icon: 'chat', value: n(pro.chatMessagesPerMonth), label: 'chat messages a month', body: 'Ask your saves anything. On the web now, iOS soon.' },
    { icon: 'topics', value: 'Everything', label: 'in Free', body: 'Library, Projects, search and your daily Magazine.' },
  ]

  return <section className="l4p-section l4s-section" id="pricing" aria-labelledby="l4p-title">
    <header className="l4p-heading">
      <p className="l4s-section-eyebrow">Pricing</p>
      <h2 className="l4s-h2" id="l4p-title">Get more from<br />what you save.</h2>
    </header>

    <article className="l4p-pro" aria-labelledby="l4p-pro-title">
      <div className="l4p-pro-intro">
        <span className="l4p-launch">Launch offer</span>
        <h3 id="l4p-pro-title">Sted <span>Pro</span></h3>
        <p className="l4p-pro-pitch">For people who save a lot and want all of it working for them.</p>
        <p className="l4p-price">From <strong>{annual.monthlyEquivalent}</strong>/month, billed yearly</p>
        <a className="l4p-cta" href="/start">Get Sted Pro <span aria-hidden="true">→</span></a>
        <p className="l4p-fine">Cancel anytime.</p>
        <span className="l4p-mascot" aria-hidden="true"><img src="/sted-mascot.svg" alt="" width={72} height={88} /></span>
      </div>

      <ul className="l4p-capabilities">
        {capabilities.map(item => <li key={item.icon}>
          <img src={`${ICONS}/${item.icon}.webp`} alt="" width={56} height={56} />
          <p className="l4p-value"><strong>{item.value}</strong> {item.label}</p>
          <p className="l4p-body">{item.body}</p>
        </li>)}
      </ul>
    </article>

    <aside className="l4p-free" aria-labelledby="l4p-free-title">
      <div className="l4p-free-copy">
        <h3 id="l4p-free-title">Sted is free, forever.</h3>
        <p>Not ready for Pro? You still get:</p>
      </div>
      <ul className="l4p-free-list">
        <li>{n(free.saves)} saves</li>
        <li>{n(free.aiSavesPerMonth)} AI saves a month</li>
        <li>{n(free.chatMessagesPerMonth)} chat messages a month</li>
        <li>Library, Projects and search</li>
      </ul>
      <a className="l4p-free-link" href={APP_STORE_URL ?? '#'}>Get Sted free <span aria-hidden="true">→</span></a>
    </aside>
  </section>
}
