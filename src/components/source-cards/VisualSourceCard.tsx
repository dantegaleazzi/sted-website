import { useState } from 'react'
import { SourceIcon } from './source-icons'
import type { SourceCardItem } from './types'
import './VisualSourceCard.css'

export function VisualSourceCard({ item }: { item: SourceCardItem }) {
  const [failed, setFailed] = useState(false)
  const photo = ['instagram', 'pinterest', 'place'].includes(item.type) || ['recipe', 'travel'].includes(item.id)
  const kind = photo ? 'photo' : item.type === 'github' ? 'repo' : item.type === 'x' ? 'post' : item.type === 'spotify' ? 'audio' : item.type === 'youtube' ? 'video' : 'editorial'
  const image = item.image && !failed
  const domain = item.url ? new URL(item.url).hostname.replace(/^www\./, '') : item.source
  return <article className={`source-card visual-card visual-card--${kind}${image ? '' : ' visual-card--text'}`}>
    {image && <img className="visual-card__image" src={item.image} alt={item.imageAlt || ''} onError={() => setFailed(true)} />}
    <header className="visual-card__header"><SourceIcon type={item.type} /><div><strong>{item.source}</strong>{item.handle && <span>{item.handle}</span>}</div><span className="visual-card__bookmark" aria-label="Saved">↗</span></header>
    {kind === 'video' && image && <span className="visual-card__play" aria-hidden="true">▶</span>}
    {kind === 'repo' && <span className="visual-card__identity" aria-hidden="true">&#123; / &#125;</span>}
    <div className="visual-card__content">
      {kind === 'post' && <span className="visual-card__quote" aria-hidden="true">“</span>}
      <h3>{item.title}</h3>
      {item.body && !photo && <p>{item.body}</p>}
      <footer><span>{item.metadata || item.postType || domain}</span><span>Saved link ↗</span></footer>
    </div>
  </article>
}
