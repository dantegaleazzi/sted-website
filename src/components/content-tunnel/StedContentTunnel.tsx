import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import mascot from './assets/sted-mascot.svg'
import './StedContentTunnel.css'

export type StedContentItem = {
  id: string
  type: 'x' | 'youtube' | 'instagram' | 'article' | 'github' | 'pdf' | 'website' | 'document' | 'reddit' | 'linkedin' | 'newsletter' | 'podcast' | 'photo' | 'place' | 'recipe' | 'design'
  title?: string
  image?: string
  sourceIcon?: string
  metadata?: string
  body?: string
}

const sources: Record<StedContentItem['type'], [string, string]> = {
  x: ['𝕏', 'X'], youtube: ['▶', 'YouTube'], instagram: ['◎', 'Instagram'],
  article: ['↗', 'Article'], github: ['⌘', 'GitHub'], pdf: ['↓', 'PDF'],
  website: ['⊕', 'Website'], document: ['N', 'Notion'],
  reddit: ['r', 'Reddit'], linkedin: ['in', 'LinkedIn'], newsletter: ['✉', 'Newsletter'],
  podcast: ['◉', 'Podcast'], photo: ['▧', 'Photo'], place: ['⌖', 'Place'],
  recipe: ['♧', 'Recipe'], design: ['◈', 'Design reference'],
}

function ContentCard({ item }: { item: StedContentItem }) {
  const [imageFailed, setImageFailed] = useState(false)
  const [iconFailed, setIconFailed] = useState(false)
  const [icon, label] = sources[item.type]
  return <article className={`sct-card sct-card--${item.type}`}>
    <div className="sct-source">
      <span className="sct-source-icon">{item.sourceIcon && !iconFailed ? <img src={item.sourceIcon} alt="" onError={() => setIconFailed(true)} /> : icon}</span>
      <span>{label}</span><span className="sct-saved">↳ saved</span>
    </div>
    {item.image && !imageFailed ? <img className="sct-image" src={item.image} alt="" onError={() => setImageFailed(true)} /> :
      ['youtube', 'instagram'].includes(item.type) ? <div className="sct-landscape" aria-hidden="true"><span className="sct-sun" /><span className="sct-mountain" /><span className="sct-cabin" /><span className="sct-play">▶</span><span className="sct-film-label">OFFLINE FOR A WHILE</span></div> :
      item.type === 'website' ? <div className="sct-still-life" aria-hidden="true"><span className="sct-vase" /><span className="sct-orbit" /><span>MORNING STUDIO</span></div> :
      item.type === 'article' ? <div className="sct-editorial" aria-hidden="true"><span>FIELD<br />NOTES.</span><span>Issue 008 — A little less, a little better.</span></div> :
      item.type === 'pdf' ? <div className="sct-cover" aria-hidden="true"><span>THE<br />CREATIVE<br />FIELD GUIDE</span><span>VOL. 01 ↗</span></div> : null}
    <div className="sct-copy">
      {item.type === 'x' && <div className="sct-author"><span>ep</span><strong>{item.body || 'Saved thought'}<small>Design & everyday things</small></strong></div>}
      <h3>{item.title || `Saved ${label}`}</h3>
      {item.body && item.type !== 'x' && <p>{item.body}</p>}
      {item.type === 'github' && <div className="sct-code">const day = await begin();<br /><span>makeSomething(day);</span></div>}
      {item.type === 'document' && <ul className="sct-notes"><li>Notice the small things</li><li>Follow a little curiosity</li><li>Make space to think</li></ul>}
      {item.type === 'x' && <div className="sct-reactions">♡ 248 <span>↻ 32</span><span>↗</span></div>}
      <div className="sct-meta">{item.metadata || 'Saved to Sted'}</div>
    </div>
  </article>
}

/** An isolated visual corridor. Items are decorative; no fake clickable cards. */
export function StedContentTunnel({ items, className = '' }: { items: StedContentItem[]; className?: string }) {
  const reducedMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(true)
  const root = useRef<HTMLElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 45, damping: 22 })
  const y = useSpring(rawY, { stiffness: 45, damping: 22 })
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    if (root.current) observer.observe(root.current)
    return () => observer.disconnect()
  }, [])
  function move(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || paused || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    rawX.set(((event.clientX - bounds.left) / bounds.width - .5) * 3)
    rawY.set(((event.clientY - bounds.top) / bounds.height - .5) * 2)
  }
  function reset() { rawX.set(0); rawY.set(0) }
  const count = Math.min(12, Math.max(1, Math.ceil(items.length / 2)))
  return <section ref={root} className={`sct ${className}`} style={{ '--slots': count } as CSSProperties} aria-label="Your saved internet, together in Sted" data-paused={paused || !inView} onPointerMove={move} onPointerLeave={reset}>
    <div className="sct-window">
      <motion.div className="sct-camera" aria-hidden="true" style={{ x: reducedMotion || paused ? 0 : x, y: reducedMotion || paused ? 0 : y }}>
        {items.length > 0 && ([-1, 1] as const).flatMap((side, sideIndex) => Array.from({ length: count }, (_, depth) => {
          const item = items[(depth + sideIndex * Math.ceil(items.length / 2)) % items.length]
          return <div key={`${side}-${depth}-${item.id}`} className="sct-position" data-depth={depth} data-tablet-hidden={depth >= 8} data-mobile-hidden={depth >= 3} style={{ '--side': side, '--depth': depth, '--side-phase': sideIndex * .47, '--rest-z': `${240 - depth / Math.max(1, count - 1) * 3180}px`, '--rest-scale': 1 - depth / Math.max(1, count - 1) * .27, '--rest-opacity': 1 - depth / Math.max(1, count - 1) * .66 } as CSSProperties}>
            <div className="sct-hover"><ContentCard item={item} /></div>
          </div>
        }))}
      </motion.div>
      <div className="sct-center"><img src={mascot} alt="Sted" /><span>A little place for it all.</span></div>
    </div>
    {!reducedMotion && items.length > 0 && <button type="button" className="sct-pause" aria-label={paused ? 'Play tunnel motion' : 'Pause tunnel motion'} aria-pressed={paused} onClick={() => { reset(); setPaused(!paused) }}>{paused ? '▶' : 'Ⅱ'}<span>{paused ? 'Play motion' : 'Pause motion'}</span></button>}
  </section>
}
