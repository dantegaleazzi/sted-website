import { useState, type ReactNode } from 'react'
import { SourceIcon } from './source-icons'
import type { SourceCardItem, SourceType } from './types'
import './SourceCard.css'

function SourceHeader({ item }: { item: SourceCardItem }) {
  return <header className="source-card__header">
    <SourceIcon type={item.type} />
    <div className="source-card__source">
      <strong>{item.source || sourceLabels[item.type]}</strong>
      {item.handle && <span>{item.handle}</span>}
    </div>
    <span className="source-card__saved">saved</span>
  </header>
}

function Media({ item, children }: { item: SourceCardItem; children?: ReactNode }) {
  const [failed, setFailed] = useState(false)
  if (item.image && !failed) return <img className="source-card__media-image" src={item.image} alt={item.imageAlt || ''} onError={() => setFailed(true)} />
  return <div className={`source-card__media source-card__media--${item.type}`} aria-hidden="true">{children}</div>
}

function Body({ item, children }: { item: SourceCardItem; children?: ReactNode }) {
  return <div className="source-card__body">
    {item.eyebrow && <p className="source-card__eyebrow">{item.eyebrow}</p>}
    <h3>{item.title}</h3>
    {item.body && <p className="source-card__body-copy">{item.body}</p>}
    {children}
    <p className="source-card__meta">{item.metadata || item.stats || 'Saved to Sted'}</p>
  </div>
}

function SocialTextCard({ item }: { item: SourceCardItem }) {
  return <article className={`source-card source-card--social source-card--${item.type}`}>
    <SourceHeader item={item} />
    <Body item={item}>
      <div className="source-card__social-row"><span className="source-card__avatar">{(item.author || 'S').slice(0, 2)}</span><span>{item.author || 'Saved thought'}</span></div>
      <div className="source-card__social-actions">♡ 248 <span>↗</span> <span>↻ 32</span></div>
    </Body>
  </article>
}

function VideoCard({ item }: { item: SourceCardItem }) {
  return <article className={`source-card source-card--video source-card--${item.type}`}>
    <SourceHeader item={item} />
    <Media item={item}><span className="source-card__play">▶</span><span className="source-card__media-caption">{item.eyebrow || 'A saved moment'}</span></Media>
    <Body item={item} />
  </article>
}

function ImageCard({ item }: { item: SourceCardItem }) {
  return <article className={`source-card source-card--image source-card--${item.type}`}>
    <SourceHeader item={item} />
    <Media item={item}><span className="source-card__image-art">{item.eyebrow || 'saved image'}</span></Media>
    <Body item={item} />
  </article>
}

function RepoCard({ item }: { item: SourceCardItem }) {
  return <article className="source-card source-card--repo">
    <SourceHeader item={item} />
    <Body item={item}><pre className="source-card__code">{`const product = await build();\nship(product);`}</pre><div className="source-card__repo-stats">⌘ TypeScript <span>★ 2.4k</span></div></Body>
  </article>
}

function ArticleCard({ item }: { item: SourceCardItem }) {
  return <article className={`source-card source-card--article source-card--${item.type}`}>
    <SourceHeader item={item} />
    <Media item={item}><span className="source-card__article-art">{item.eyebrow || 'FIELD NOTES'}</span></Media>
    <Body item={item} />
  </article>
}

function DocumentCard({ item }: { item: SourceCardItem }) {
  return <article className={`source-card source-card--document source-card--${item.type}`}>
    <SourceHeader item={item} />
    <Media item={item}><span className="source-card__document-title">{item.eyebrow || 'A useful document'}</span></Media>
    <Body item={item}><div className="source-card__document-lines"><span /><span /><span /></div></Body>
  </article>
}

function AudioCard({ item }: { item: SourceCardItem }) {
  return <article className="source-card source-card--audio">
    <SourceHeader item={item} />
    <Media item={item}><span className="source-card__album">{item.eyebrow || 'SOUND / 01'}</span></Media>
    <Body item={item}><div className="source-card__wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></Body>
  </article>
}

function PlaceCard({ item }: { item: SourceCardItem }) {
  return <article className="source-card source-card--place">
    <SourceHeader item={item} />
    <Media item={item}><div className="source-card__map"><span>+</span><span>−</span><b>●</b></div></Media>
    <Body item={item}><div className="source-card__place-line">⌖ {item.metadata || 'Saved place'}</div></Body>
  </article>
}

function ProductCard({ item }: { item: SourceCardItem }) {
  return <article className="source-card source-card--product">
    <SourceHeader item={item} />
    <Media item={item}><div className="source-card__product-window"><span>JOIN THE WAITLIST</span><strong>{item.eyebrow || 'A calmer way to collect.'}</strong></div></Media>
    <Body item={item}><div className="source-card__product-tag">{item.stats || 'Product Hunt · 1,248 points'}</div></Body>
  </article>
}

const sourceLabels: Record<SourceType, string> = {
  x: 'X', youtube: 'YouTube', instagram: 'Instagram', tiktok: 'TikTok', github: 'GitHub', article: 'Article', medium: 'Medium', substack: 'Substack', notion: 'Notion', pdf: 'PDF', reddit: 'Reddit', pinterest: 'Pinterest', spotify: 'Spotify', place: 'Google Maps', product: 'Product Hunt', website: 'Website', threads: 'Threads', bluesky: 'Bluesky',
}

export function SourceCard({ item }: { item: SourceCardItem }) {
  switch (item.type) {
    case 'x': case 'reddit': case 'threads': case 'bluesky': return <SocialTextCard item={item} />
    case 'youtube': case 'tiktok': return <VideoCard item={item} />
    case 'instagram': case 'pinterest': return <ImageCard item={item} />
    case 'github': return <RepoCard item={item} />
    case 'article': case 'medium': case 'substack': case 'website': return <ArticleCard item={item} />
    case 'notion': case 'pdf': return <DocumentCard item={item} />
    case 'spotify': return <AudioCard item={item} />
    case 'place': return <PlaceCard item={item} />
    case 'product': return <ProductCard item={item} />
  }
}

