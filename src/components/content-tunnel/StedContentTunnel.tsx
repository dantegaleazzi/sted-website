import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { SourceCard } from '../source-cards/SourceCard'
import { sourceCardFixtures } from '../source-cards/source-card-fixtures'
import type { SourceCardItem } from '../source-cards/types'
import mascot from '../../assets/sted-mascot.svg'
import './StedContentTunnel.css'
import './portal-tunnel.css'

export type StedContentItem = SourceCardItem

/** An isolated visual corridor. Items are decorative; no fake clickable cards. */
export function StedContentTunnel({ items = sourceCardFixtures, className = '', variant = 'original' }: { items?: StedContentItem[]; className?: string; variant?: 'original' | 'portal' }) {
  const reducedMotion = useReducedMotion()
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
    if (variant === 'portal' || reducedMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    rawX.set(((event.clientX - bounds.left) / bounds.width - .5) * 3)
    rawY.set(((event.clientY - bounds.top) / bounds.height - .5) * 2)
  }
  function reset() { rawX.set(0); rawY.set(0) }
  const count = variant === 'portal' ? Math.ceil(items.length / 2) : Math.min(12, Math.max(1, Math.ceil(items.length / 2)))
  // Restart the whole sequence together when fixtures change. Keeping old slots
  // alive while mounting replacements gives cards different animation epochs.
  const sequenceKey = `${variant}:${items.map(item => item.id).join('|')}`
  return <section ref={root} className={`sct ${variant === 'portal' ? 'sct--portal' : ''} ${className}`} style={{ '--slots': count } as CSSProperties} aria-label="Your saved internet, together in Sted" data-paused={!inView} onPointerMove={move} onPointerLeave={reset}>
    <div className="sct-window">
      {variant === 'portal' && <div className="sct-portal-surface" aria-hidden="true" />}
      <motion.div key={sequenceKey} className="sct-camera" aria-hidden="true" style={{ x: reducedMotion ? 0 : x, y: reducedMotion ? 0 : y }}>
        {items.length > 0 && ([-1, 1] as const).flatMap((side, sideIndex) => Array.from({ length: variant === 'portal' ? items.filter((_, index) => index % 2 === sideIndex).length : count }, (_, depth) => {
          const sideCount = variant === 'portal' ? Math.floor((items.length + 1 - sideIndex) / 2) : count
          const item = variant === 'portal' ? items[depth * 2 + sideIndex] : items[(depth + sideIndex * Math.ceil(items.length / 2)) % items.length]
          const portalPhase = ((depth + (variant === 'portal' ? 0 : sideIndex * .47)) / sideCount + 1 / 16) % 1
          const portalScale = 1 - (1 - 110 / 420) * Math.min(portalPhase / .8, 1)
          return <div key={`${side}-${depth}-${item.id}`} className="sct-position" data-content-id={item.id} data-side={side === -1 ? 'left' : 'right'} data-depth={depth} data-tablet-hidden={depth >= 8} data-mobile-hidden={depth >= 3} style={{ '--side-slots': sideCount, '--side': side, '--portal-rest-x': Math.pow(1 - portalPhase, 1.4) / portalScale, '--portal-rest-z': `${1200 * (1 - 1 / portalScale)}px`, '--portal-rest-angle': `${28 * (1 - Math.min(Math.max((portalPhase - .4) / .4, 0), 1))}deg`, '--depth': depth, '--side-phase': variant === 'portal' ? 0 : sideIndex * .47, '--rest-z': `${240 - depth / Math.max(1, count - 1) * 3180}px`, '--rest-scale': 1 - depth / Math.max(1, count - 1) * .27, '--rest-opacity': 1 - depth / Math.max(1, count - 1) * .66 } as CSSProperties}>
            <div className="sct-hover"><SourceCard item={item} contentOnly={variant === 'portal'} /></div>
          </div>
        }))}
      </motion.div>
      <div className="sct-center" aria-label="Sted saves what you find">
        <img src={mascot} alt="Sted" />
        <strong>Sted</strong>
        <span>saved here</span>
      </div>
    </div>
  </section>
}
