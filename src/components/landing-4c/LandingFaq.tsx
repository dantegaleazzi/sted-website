import { FAQ, faqSchema } from './faq'
import './LandingFaq.css'

/**
 * FAQ, in the roadmap's language: hairlines and type, no cards. Native details/summary, so every answer
 * is in the HTML (prerendered for crawlers) and each question opens with a click or the keyboard.
 */
export function LandingFaq() {
  return <section className="l4f-section l4s-section" id="faq" aria-labelledby="l4f-title">
    <header className="l4f-heading">
      <p className="l4s-section-eyebrow">FAQ</p>
      <h2 className="l4s-h2" id="l4f-title">Questions, answered.</h2>
    </header>
    <div className="l4f-list">
      {FAQ.map(item => <details key={item.question} className="l4f-item">
        <summary><h3>{item.question}</h3><span className="l4f-toggle" aria-hidden="true" /></summary>
        <p>{item.answer}</p>
      </details>)}
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }} />
  </section>
}
