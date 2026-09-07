import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { SourceCard } from '../source-cards/SourceCard'
import { sourceCardFixtures } from '../source-cards/source-card-fixtures'
import type { SourceCardItem } from '../source-cards/types'
import mascot from '../../assets/sted-mascot.svg'
import './StedContentTunnel.css'

export type StedContentItem = SourceCardItem

/** An isolated visual corridor. Items are decorative; no fake clickable cards. */
export function StedContentTunnel({ items = sourceCardFixtures, className = '' }: { items?: StedContentItem[]; className?: string }) {
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
            <div className="sct-hover"><SourceCard item={item} /></div>
          </div>
        }))}
      </motion.div>
      <div className="sct-center" aria-label="Sted saves what you find">
        <img src={mascot} alt="Sted" />
        <strong>Sted</strong>
        <span>saved here</span>
      </div>
    </div>
    {!reducedMotion && items.length > 0 && <button type="button" className="sct-pause" aria-label={paused ? 'Play tunnel motion' : 'Pause tunnel motion'} aria-pressed={paused} onClick={() => { reset(); setPaused(!paused) }}>{paused ? '▶' : 'Ⅱ'}<span>{paused ? 'Play motion' : 'Pause motion'}</span></button>}
  </section>
}
