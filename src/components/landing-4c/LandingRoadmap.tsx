import { FEATURE_REQUEST_URL, ROADMAP } from './roadmap'
import './LandingRoadmap.css'

/** A short roadmap: what's in review or about to ship, and a way to ask for the next thing. */
export function LandingRoadmap() {
  return <section className="l4r-section l4s-section" id="roadmap" aria-labelledby="l4r-title">
    <header className="l4r-heading">
      <p className="l4s-section-eyebrow">Roadmap</p>
      <h2 className="l4s-h2" id="l4r-title">What’s coming<br />next.</h2>
      <p className="l4r-lede">Sted is just getting started, and you’re helping build it.</p>
    </header>
    <ol className="l4r-list">
      {ROADMAP.map(item => <li key={item.name}>
        <span className="l4r-status">{item.status}</span>
        <h3>{item.name}</h3>
        <p>{item.body}</p>
      </li>)}
    </ol>
    <a className="l4r-suggest" href={FEATURE_REQUEST_URL}>What should Sted do next? Suggest a feature <span aria-hidden="true">→</span></a>
  </section>
}
