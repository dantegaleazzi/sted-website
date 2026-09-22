import { useEffect, useReducer, useRef, useState } from 'react'
import { SourceIcon } from '../source-cards/source-icons'
import type { SourceType } from '../source-cards/types'
import { ROTATE_MS, isRotating, rotationReducer } from './showcase-rotation'
import './Landing4CSections.css'

/**
 * Everything below the approved 4c hero. Desktop-first (1600px canvas);
 * mobile composition still deferred.
 *
 * Feature showcase rotation rules live in showcase-rotation.ts.
 */

export type FeatureKey = 'chat' | 'summary' | 'feed'

export const FEATURE_KEYS: FeatureKey[] = ['chat', 'summary', 'feed']

const ICONS = '/content/landing-4c/icons'

const FEATURES: { key: FeatureKey; icon: string; title: string; body: string }[] = [
  { key: 'chat', icon: 'chat', title: 'Chat with your saved items', body: 'Ask questions across everything you’ve saved and get answers grounded in your own content.' },
  { key: 'summary', icon: 'summary-note', title: 'Summary and key points', body: 'Sted reads everything you save and pulls out the summary and what’s worth knowing.' },
  { key: 'feed', icon: 'media', title: 'A feed made from your saves', body: 'A daily recap of what you saved, with picks worth coming back to.' },
]

const BENEFITS: { icon: string; title: string; body: string }[] = [
  { icon: 'summary-card', title: 'Understand without rereading', body: 'Every save comes with a summary and key points.' },
  { icon: 'chat', title: 'Find what you already found', body: 'Ask Sted instead of digging through bookmarks.' },
  { icon: 'projects', title: 'Keep context together', body: 'Group related saves into Projects and chat with them.' },
  { icon: 'topics', title: 'Organized automatically', body: 'Topics make sense of what you collect. No manual tagging.' },
]

const SOURCES: { label: string; tile?: SourceType; icon?: string }[] = [
  { label: 'Web pages', icon: 'web-page' },
  { label: 'X posts', tile: 'x' },
  { label: 'YouTube videos', tile: 'youtube' },
  { label: 'Instagram reels & posts', tile: 'instagram' },
  { label: 'Articles & newsletters', icon: 'article' },
  { label: 'Podcasts', icon: 'podcast' },
  { label: 'Notes & docs', icon: 'notes' },
]

function Mascot({ size }: { size: number }) {
  return <img src="/sted-mascot.svg" alt="" aria-hidden="true" style={{ height: size, width: 'auto', display: 'block' }} />
}

// Provisional app screenshots (device frame baked in, background cut to transparent).
// Final shots will replace the files in public/content/landing-4c/app/.
const SHOTS: Record<FeatureKey, { src: string; alt: string; tint: string }> = {
  chat: { src: '/content/landing-4c/app/chat.webp', alt: 'Ask Sted: chat with everything you’ve saved', tint: '#83B0FC' },
  summary: { src: '/content/landing-4c/app/summary.webp', alt: 'A saved X post in Sted with its summary, key ideas and topics', tint: '#FFD400' },
  feed: { src: '/content/landing-4c/app/feed.webp', alt: 'Sted Magazine with Sted’s picks, the recap and your saved Steds', tint: '#B2D78F' },
}

function PhoneShot({ feature, isActive }: { feature: (typeof FEATURES)[number]; isActive: boolean }) {
  const shot = SHOTS[feature.key]
  return <div className={isActive ? 'l4s-shot is-active' : 'l4s-shot'} style={{ '--l4s-tint': shot.tint } as React.CSSProperties} aria-hidden={!isActive}>
    <img src={shot.src} alt={shot.alt} className="l4s-phone" width={715} height={1427} />
  </div>
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

export function FeatureShowcase({ initial = 'chat', autoplay = true, id }: { initial?: FeatureKey; autoplay?: boolean; id?: string }) {
  const [state, dispatch] = useReducer(rotationReducer<FeatureKey>, { active: initial, hovering: false, pinned: !autoplay })
  const [inView, setInView] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const rotating = isRotating(state, { autoplay, inView, reducedMotion })
  // The progress bar animation is the timer: it pauses with the rotation and advances on end.
  const showTimer = autoplay && !reducedMotion && !state.pinned

  useEffect(() => {
    const node = sectionRef.current
    if (!node || typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <section ref={sectionRef} className="l4s-section l4s-showcase" id={id} aria-labelledby={id ? `${id}-title` : undefined}>
    <div className="l4s-showcase-copy">
      <h2 id={id ? `${id}-title` : undefined} className="l4s-h2">Save it.<br />Sted does the rest.</h2>
      <p className="l4s-lede">Send Sted whatever you find. It reads and understands every save, so you don’t have to go back and work through it all yourself.</p>
      <ol className="l4s-features" onMouseLeave={() => dispatch({ type: 'leave' })}>
        {FEATURES.map((feature) => {
          const isActive = feature.key === state.active
          return <li key={feature.key}>
            <button
              type="button"
              className={isActive ? 'l4s-feature is-active' : 'l4s-feature'}
              aria-pressed={isActive}
              onMouseEnter={() => dispatch({ type: 'hover', key: feature.key })}
              onFocus={() => dispatch({ type: 'hover', key: feature.key })}
              onBlur={() => dispatch({ type: 'leave' })}
              onClick={() => dispatch({ type: 'pin', key: feature.key })}
            >
              <img src={`${ICONS}/${feature.icon}.png`} alt="" className="l4s-feature-icon" />
              <span className="l4s-feature-text">
                <span className="l4s-feature-title">{feature.title}</span>
                {isActive && <span className="l4s-feature-body">{feature.body}</span>}
                {isActive && showTimer && <span className="l4s-progress" aria-hidden="true">
                  <span
                    key={state.active}
                    style={{ animationDuration: `${ROTATE_MS}ms`, animationPlayState: rotating ? 'running' : 'paused' }}
                    onAnimationEnd={() => dispatch({ type: 'advance', keys: FEATURE_KEYS })}
                  />
                </span>}
              </span>
            </button>
          </li>
        })}
      </ol>
    </div>
    <div className="l4s-stage">
      {FEATURES.map((feature) => <PhoneShot key={feature.key} feature={feature} isActive={feature.key === state.active} />)}
    </div>
  </section>
}

export function Landing4CSections({ initial, autoplay, onJoin }: { initial: FeatureKey; autoplay: boolean; onJoin: () => void }) {
  return <>
    <FeatureShowcase initial={initial} autoplay={autoplay} id="how-it-works" />

    <section className="l4s-section l4s-benefits" aria-labelledby="l4s-benefits-title">
      <h2 id="l4s-benefits-title" className="l4s-h2">Everything you save.<br />Finally useful.</h2>
      <div className="l4s-benefit-grid">
        {BENEFITS.map((benefit) => <div key={benefit.title} className="l4s-benefit">
          <img src={`${ICONS}/${benefit.icon}.png`} alt="" className="l4s-benefit-icon" />
          <h3>{benefit.title}</h3>
          <p>{benefit.body}</p>
        </div>)}
      </div>
    </section>

    <section className="l4s-section l4s-sources-section" aria-labelledby="l4s-sources-title">
      <div className="l4s-sources-head">
        <h2 id="l4s-sources-title" className="l4s-h2">One place for everything<br />worth keeping.</h2>
        <p className="l4s-lede">Save from the places where you already find useful things.</p>
      </div>
      <div className="l4s-source-row">
        {SOURCES.map((source) => <div key={source.label} className="l4s-source-card">
          {source.tile ? <SourceIcon type={source.tile} /> : <img src={`${ICONS}/${source.icon}.png`} alt="" className="l4s-source-illo" />}
          <span>{source.label}</span>
        </div>)}
      </div>
    </section>

    <section className="l4s-section l4s-final" aria-labelledby="l4s-final-title">
      <div className="l4s-final-badge"><Mascot size={112} /></div>
      <h2 id="l4s-final-title" className="l4s-h2 l4s-final-title">You saved it for a reason.<br /><span className="l4s-yellow">Make it useful.</span></h2>
      <button type="button" className="l4c-button l4c-button-dark l4s-final-cta" onClick={onJoin}>Join the waitlist</button>
    </section>
  </>
}
