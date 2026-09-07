import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SourceCard } from './SourceCard'
import { sourceCardFixtures } from './source-card-fixtures'
import './source-cards-preview.css'

function SourceCardsPreview() {
  return <main className="source-board">
    <header className="source-board__intro">
      <div>
        <p className="source-board__kicker">STED / SOURCE CARD QA</p>
        <h1>Things I actually saved.</h1>
        <p className="source-board__lede">A visual test board for recognisable internet content. The source should be clear before the small label is read.</p>
      </div>
      <div className="source-board__audit"><span>15 fixtures</span><span>15 source types</span><span>temporary imagery marked in code</span></div>
    </header>
    <section className="source-board__grid" aria-label="Source card fixtures">
      {sourceCardFixtures.map(item => <div className="source-board__cell" key={item.id}><SourceCard item={item} /><p className="source-board__caption">{item.type}</p></div>)}
    </section>
  </main>
}

createRoot(document.getElementById('root')!).render(<StrictMode><SourceCardsPreview /></StrictMode>)
