import { FEATURE_REQUEST_URL, ROADMAP, ROADMAP_FEATURE } from './roadmap'
import './LandingRoadmap.css'

const pad = (index: number) => String(index + 1).padStart(2, '0')

/**
 * Roadmap, editorial: chat leads with the real "Ask Sted" screen; the rest is a numbered list on
 * hairlines (no cards, no pills), ending with an open row for ideas.
 */
export function LandingRoadmap() {
  const [feature, ...rest] = ROADMAP
  return <section className="l4r-section l4s-section" id="roadmap" aria-labelledby="l4r-title">
    <header className="l4r-heading">
      <div>
        <p className="l4s-section-eyebrow">Roadmap</p>
        <h2 className="l4s-h2" id="l4r-title">What’s coming <span className="l4r-mark">next</span>.</h2>
      </div>
      <p className="l4r-lede">Sted is just getting started. Here’s what ships next, and you get a say in what comes after.</p>
    </header>

    <article className="l4r-feature" aria-labelledby="l4r-feature-title">
      <div className="l4r-feature-copy">
        <p className="l4r-meta"><span className="l4r-num">{pad(0)}</span>{feature.name}</p>
        <div>
          <h3 id="l4r-feature-title">{ROADMAP_FEATURE.headline}</h3>
          <p className="l4r-feature-body">{ROADMAP_FEATURE.body}</p>
        </div>
        <p className="l4r-status">{feature.status}</p>
      </div>
      <div className="l4r-feature-visual">
        <div className="cf-phone l4o-screen l4r-phone">
          <img className="cf-phone-shot" src={ROADMAP_FEATURE.image} alt="The Ask Sted chat screen: “Turn everything you save into answers.”" width={920} height={2000} loading="lazy" decoding="async" />
        </div>
      </div>
    </article>

    <ol className="l4r-list">
      {rest.map((item, index) => <li key={item.name}>
        <span className="l4r-num">{pad(index + 1)}</span>
        <div><h3>{item.name}</h3><p>{item.body}</p></div>
        <p className="l4r-status">{item.status}</p>
      </li>)}
      <li className="l4r-idea">
        <span className="l4r-num">{pad(rest.length + 1)}</span>
        <div><h3>Your idea</h3><p>Tell us what Sted should do next.</p></div>
        <a className="l4r-suggest" href={FEATURE_REQUEST_URL}>Suggest a feature <span aria-hidden="true">→</span></a>
      </li>
    </ol>
  </section>
}
