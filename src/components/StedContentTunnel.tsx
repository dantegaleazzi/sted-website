import { useEffect, useMemo, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import mascotMark from '../assets/sted-mascot-mark.svg'
import './StedContentTunnel.css'

export type StedContentCardType = 'link' | 'screenshot' | 'note' | 'image'

export type StedContentCardData = {
  id: string
  type: StedContentCardType
  image?: string
  sourceIcon?: string
  title: string
  metadata?: string
}

const TYPE_ICON: Record<StedContentCardType, ReactNode> = {
  link: <path d="M9.5 14.5 14.5 9.5M8 12l-2.5 2.5a2.83 2.83 0 0 0 4 4L12 16M12 8l2.5-2.5a2.83 2.83 0 0 1 4 4L16 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  screenshot: <><rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M4 15l4-4 3 3 5-5 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></>,
  note: <><path d="M6 4h12v16l-3-2-3 2-3-2-3 2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 9h6M9 12h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>,
  image: <><rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="9" cy="10" r="1.4" fill="currentColor" /><path d="M5 17l4.5-4.5L12 15l3-3 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></>,
}

const PLACEHOLDER_CARDS: StedContentCardData[] = [
  { id: 'p1', type: 'link', title: 'The best coffee shops in Lisbon', metadata: 'saved from Safari' },
  { id: 'p2', type: 'screenshot', title: 'Apartment listing — Alfama', metadata: 'saved 2 days ago' },
  { id: 'p3', type: 'note', title: 'Ideas for the offsite talk', metadata: '3 lines' },
  { id: 'p4', type: 'image', title: 'Moodboard — new brand palette', metadata: 'saved from Instagram' },
  { id: 'p5', type: 'link', title: 'React Server Components, explained', metadata: 'saved from Chrome' },
  { id: 'p6', type: 'note', title: 'Grocery list', metadata: '6 items' },
  { id: 'p7', type: 'screenshot', title: 'Flight confirmation — LIS → NYC', metadata: 'saved from Gmail' },
  { id: 'p8', type: 'image', title: 'Reference shots for the shoot', metadata: 'saved from Pinterest' },
  { id: 'p9', type: 'link', title: 'Weekend hiking trail map', metadata: 'saved from Safari' },
  { id: 'p10', type: 'note', title: 'Quick thought before it disappears', metadata: '1 line' },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function useResponsiveCardCount() {
  const [count, setCount] = useState(5)
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 640px)')
    const tablet = window.matchMedia('(max-width: 1024px)')
    const update = () => setCount(mobile.matches ? 2 : tablet.matches ? 3 : 5)
    update()
    mobile.addEventListener('change', update)
    tablet.addEventListener('change', update)
    return () => {
      mobile.removeEventListener('change', update)
      tablet.removeEventListener('change', update)
    }
  }, [])
  return count
}

function usePointerTilt(maxDeg = 3) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springConfig = { stiffness: 55, damping: 16, mass: 0.6 }
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [maxDeg, -maxDeg]), springConfig)
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-maxDeg, maxDeg]), springConfig)

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    rawX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1)
    rawY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
  }
  const onPointerLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return { rotateX, rotateY, onPointerMove, onPointerLeave }
}

type TunnelCardProps = {
  card: StedContentCardData
  side: -1 | 1
  index: number
  count: number
}

function TunnelCard({ card, side, index, count }: TunnelCardProps) {
  const t = count <= 1 ? 0 : index / (count - 1)
  const scale = lerp(1, 0.5, t)
  const translateZ = lerp(0, -68, t)
  const translateX = side * lerp(40, 6, t)
  const translateY = lerp(0, 3, t)
  const rotateY = side * -1 * lerp(34, 8, t)
  const opacity = lerp(1, 0.4, t)
  const zIndex = Math.round(lerp(50, 5, t))

  const transform = `translate3d(calc(-50% + ${translateX}vw), calc(-50% + ${translateY}vmin), ${translateZ}vmin) rotateY(${rotateY}deg) scale(${scale})`

  const style = {
    '--tunnel-transform': transform,
    opacity,
    zIndex,
  } as CSSProperties

  const floatStyle = {
    '--float-duration': `${5 + index * 0.7}s`,
    '--float-delay': `${index * 0.18}s`,
  } as CSSProperties

  return (
    <div className="tunnel-card-position" style={style}>
      <div className="tunnel-card-float" style={floatStyle}>
        <motion.div
          className="tunnel-card-surface"
          whileHover={{ scale: 1.07, z: 90 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
        >
          <div className="tunnel-card-media">
            <span className="tunnel-card-source" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24">{TYPE_ICON[card.type]}</svg>
            </span>
            <svg className="tunnel-card-media-icon" width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">{TYPE_ICON[card.type]}</svg>
          </div>
          <div className="tunnel-card-body">
            <p className="tunnel-card-title">{card.title}</p>
            {card.metadata && <p className="tunnel-card-meta">{card.metadata}</p>}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export type StedContentTunnelProps = {
  cards?: StedContentCardData[]
  className?: string
}

export function StedContentTunnel({ cards = PLACEHOLDER_CARDS, className }: StedContentTunnelProps) {
  const cardCount = useResponsiveCardCount()
  const { rotateX, rotateY, onPointerMove, onPointerLeave } = usePointerTilt()

  const { left, right } = useMemo(() => {
    const perSide = Math.min(cardCount, Math.floor(cards.length / 2))
    return {
      left: cards.slice(0, perSide),
      right: cards.slice(perSide, perSide * 2),
    }
  }, [cards, cardCount])

  return (
    <div
      className={`tunnel-viewport${className ? ` ${className}` : ''}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-hidden="true"
    >
      <motion.div className="tunnel-stage" style={{ rotateX, rotateY }}>
        <div className="tunnel-mascot-halo" />
        <img className="tunnel-mascot" src={mascotMark} alt="" />
        {left.map((card, index) => <TunnelCard key={card.id} card={card} side={-1} index={index} count={left.length} />)}
        {right.map((card, index) => <TunnelCard key={card.id} card={card} side={1} index={index} count={right.length} />)}
      </motion.div>
    </div>
  )
}

export default StedContentTunnel
