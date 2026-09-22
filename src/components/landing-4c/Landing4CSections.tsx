import { useEffect, useReducer, useRef, useState } from 'react'
import { ROTATE_MS, isRotating, rotationReducer } from './showcase-rotation'
import { APP_STORE_URL, SIGN_IN_URL } from './app-links'
import './landing-4c-tokens.css'
import './Landing4CSections.css'

/**
 * Everything below the 4c hero, plus the header/CTA pieces the hero shares (badge, sign in).
 *
 * Feature showcase rotation rules live in showcase-rotation.ts.
 */

export type FeatureKey = 'chat' | 'summary' | 'feed'

export const FEATURE_KEYS: FeatureKey[] = ['chat', 'summary', 'feed']

const ICONS = '/content/landing-4c/icons'
// Everything below the hero is off-screen on load; let the browser defer it.
const LAZY = { loading: 'lazy', decoding: 'async' } as const

const FEATURES: { key: FeatureKey; icon: string; title: string; body: string }[] = [
  { key: 'chat', icon: 'chat', title: 'Chat with your saved items', body: 'Ask questions across everything you’ve saved and get answers grounded in your own content.' },
  { key: 'summary', icon: 'summary-note', title: 'Summary and key points', body: 'Sted reads everything you save and pulls out the summary and what’s worth knowing.' },
  { key: 'feed', icon: 'media', title: 'A feed made from your saves', body: 'A daily recap of what you saved, with picks worth coming back to.' },
]

// Placeholder art: the base mascot plus an existing pastel prop icon. Swap for the
// dedicated Sted variant SVGs (glasses, headphones, magnifier…) once they exist.
const STEDS_IN_ACTION: { prop: string; tint: string; tilt: number; action: string }[] = [
  { prop: 'summary-card', tint: 'var(--sted-supportive-purple)', tilt: -4, action: 'read the 40-minute video you saved, so you don’t have to.' },
  { prop: 'chat', tint: 'var(--sted-supportive-blue)', tilt: 3, action: 'found the three things you saved about AI agents.' },
  { prop: 'topics', tint: 'var(--sted-supportive-pink)', tilt: -3, action: 'sorted this week’s saves into Travel, Coffee and AI.' },
  { prop: 'media', tint: 'var(--sted-supportive-green)', tilt: 4, action: 'picked three saves worth your next five minutes.' },
]

/** Official Apple badge (tools.applemediaservices.com). Keep it unmodified and at least 40px tall.
 *  Until APP_STORE_URL exists it renders as a non-interactive element rather than a dead "#" link,
 *  so keyboard and screen-reader users don't land on a control that does nothing. */
export function AppStoreBadge({ height = 56, className = '' }: { height?: number; className?: string }) {
  const badge = <img src="/brand/app-store-badge.svg" alt="Download on the App Store" style={{ height }} />
  if (!APP_STORE_URL) return <span className={`l4s-appstore is-pending ${className}`} title="App Store link goes live at launch">{badge}</span>
  return <a className={`l4s-appstore ${className}`} href={APP_STORE_URL}>{badge}</a>
}

export function SignInLink() {
  if (!SIGN_IN_URL) return <span className="l4s-signin is-pending" title="Sign in goes live with the web app" aria-disabled="true">Sign in</span>
  return <a className="l4s-signin" href={SIGN_IN_URL}>Sign in</a>
}

function Mascot({ size }: { size: number }) {
  return <img src="/sted-mascot.svg" alt="" aria-hidden="true" style={{ height: size, width: 'auto', display: 'block' }} {...LAZY} />
}

// Provisional app screenshots (device frame baked in, background cut to transparent).
// Final shots will replace the files in public/content/landing-4c/app/.
const SHOTS: Record<FeatureKey, { src: string; alt: string; tint: string }> = {
  chat: { src: '/content/landing-4c/app/chat.webp', alt: 'Ask Sted: chat with everything you’ve saved', tint: 'var(--sted-supportive-blue)' },
  summary: { src: '/content/landing-4c/app/summary.webp', alt: 'A saved X post in Sted with its summary, key ideas and topics', tint: 'var(--sted-yellow)' },
  feed: { src: '/content/landing-4c/app/feed.webp', alt: 'Sted Magazine with Sted’s picks, the recap and your saved Steds', tint: 'var(--sted-supportive-green)' },
}

function PhoneShot({ feature, isActive }: { feature: (typeof FEATURES)[number]; isActive: boolean }) {
  const shot = SHOTS[feature.key]
  return <div className={isActive ? 'l4s-shot is-active' : 'l4s-shot'} style={{ '--l4s-tint': shot.tint } as React.CSSProperties} aria-hidden={!isActive}>
    <img src={shot.src} alt={shot.alt} className="l4s-phone" width={715} height={1427} {...LAZY} />
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
              <img src={`${ICONS}/${feature.icon}.webp`} alt="" className="l4s-feature-icon" width={192} height={192} {...LAZY} />
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
      {/* Floating Steds (placeholder art until the variant SVGs land). */}
      <img src="/sted-mascot.svg" alt="" aria-hidden="true" className="l4s-floater l4s-floater-mascot" {...LAZY} />
      <img src={`${ICONS}/chat.webp`} alt="" aria-hidden="true" className="l4s-floater l4s-floater-a" {...LAZY} />
      <img src={`${ICONS}/topics.webp`} alt="" aria-hidden="true" className="l4s-floater l4s-floater-b" {...LAZY} />
      <img src={`${ICONS}/summary-note.webp`} alt="" aria-hidden="true" className="l4s-floater l4s-floater-c" {...LAZY} />
    </div>
  </section>
}

export function Landing4CSections({ initial, autoplay }: { initial: FeatureKey; autoplay: boolean }) {
  return <>
    <FeatureShowcase initial={initial} autoplay={autoplay} id="how-it-works" />

    <section className="l4s-section l4s-steds" id="why-sted" aria-labelledby="l4s-steds-title">
      <h2 id="l4s-steds-title" className="l4s-h2">Everything you save.<br />Finally useful.</h2>
      <div className="l4s-steds-grid">
        {STEDS_IN_ACTION.map((sted) => <div key={sted.prop} className="l4s-sted-card">
          <div className="l4s-sted-portrait" style={{ '--l4s-tint': sted.tint } as React.CSSProperties}>
            <div className="l4s-sted-figure" style={{ transform: `rotate(${sted.tilt}deg)` }}>
              <img src="/sted-mascot.svg" alt="" className="l4s-sted-mascot" {...LAZY} />
              <img src={`${ICONS}/${sted.prop}.webp`} alt="" className="l4s-sted-prop" width={192} height={192} {...LAZY} />
            </div>
          </div>
          <p className="l4s-sted-action"><strong>Sted</strong> {sted.action}</p>
        </div>)}
      </div>
    </section>

    <section className="l4s-section l4s-final" id="download" aria-labelledby="l4s-final-title">
      <div className="l4s-final-badge"><Mascot size={112} /></div>
      <h2 id="l4s-final-title" className="l4s-h2 l4s-final-title">You saved it for a reason.<br /><span className="l4s-yellow">Make it useful.</span></h2>
      <AppStoreBadge height={60} />
      <p className="l4s-reassurance">Free to start · No account required</p>
    </section>
  </>
}
