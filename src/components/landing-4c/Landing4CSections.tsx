import { useEffect, useReducer, useRef, useState } from 'react'
import { ROTATE_MS, isRotating, rotationReducer } from './showcase-rotation'
import { APP_STORE_URL, SIGN_IN_URL } from './app-links'
import { CheckoutLink } from './CheckoutLink'
import { LandingPricing } from './LandingPricing'
import { isSoldOut, useFoundingSpots } from './useFoundingSpots'
import { foundingTerms, isFoundingLive } from '../growth-funnel/founding-offer'
import { LandingRoadmap } from './LandingRoadmap'
import { LandingFaq } from './LandingFaq'
import { SUMMARY_SCREEN, TopicsApp } from './OutputDemo'
import './landing-4c-tokens.css'
import './Landing4CSections.css'

/**
 * Everything below the 4c hero, plus the header/CTA pieces the hero shares (badge, sign in).
 *
 * Feature showcase rotation rules live in showcase-rotation.ts.
 */

export type FeatureKey = 'save' | 'summary' | 'chat' | 'topics' | 'feed'

/** Rotation order: how you save first (the number-one question), then what Sted makes of it. */
export const FEATURE_KEYS: FeatureKey[] = ['save', 'summary', 'chat', 'feed']
/** Built but not on the landing yet: shown on /internal/landing-4c/states only. */
export const PARKED_FEATURE_KEYS: FeatureKey[] = ['topics']

const ICONS = '/content/landing-4c/icons'
// Everything below the hero is off-screen on load; let the browser defer it.
const LAZY = { loading: 'lazy', decoding: 'async' } as const

const FEATURES: { key: FeatureKey; icon: string; title: string; body: string }[] = [
  { key: 'save', icon: 'web-page', title: 'Save from anywhere', body: 'Share it from Instagram, YouTube, X, Safari or Spotify. Sted takes it from there.' },
  { key: 'summary', icon: 'summary-note', title: 'Summary & Key Ideas', body: 'Sted reads every link and writes the summary and key ideas for you.' },
  { key: 'topics', icon: 'topics', title: 'Organized into topics, automatically', body: 'Sted sorts every save into topics like AI, Travel or Coffee. Your library organizes itself.' },
  { key: 'chat', icon: 'chat', title: 'Ask Sted', body: 'Chat with everything you saved: ask anything, summarize today or recap your week. Answers come with the saves they’re based on.' },
  { key: 'feed', icon: 'media', title: 'The Recap, every morning', body: 'Every day Sted recaps what you saved: Sted’s Picks, the topics you saved around and your latest saves.' },
]

// "Meanwhile, Sted is working": each tile shows real app output for its line. Three are CSS crops of
// the app screenshots (no new assets); the topics tile is drawn in the app's Recap style so its chips
// can say exactly what the line says. Crop boxes are in source pixels: [x, y, width, height].
type AppCrop = { src: string; alt: string; size: [number, number]; box: [number, number, number, number]; fade?: boolean }
type StedAtWork = { key: string; tint: string; action: string; crop?: AppCrop }

const SUMMARY_SHOT = { src: '/content/landing-4c/app/summary.webp', size: [715, 1426] as [number, number] }
const RECAP_SHOT = { src: '/content/landing-4c/app/recap.webp', size: [920, 2000] as [number, number] }

const STEDS_AT_WORK: StedAtWork[] = [
  {
    key: 'summary', tint: 'var(--sted-supportive-purple)', action: 'read that long post you saved, so you don’t have to.',
    crop: { ...SUMMARY_SHOT, alt: 'Sted’s summary and key ideas for a saved post', box: [62, 768, 590, 492] },
  },
  {
    key: 'recap', tint: 'var(--sted-supportive-blue)', action: 'put this morning’s Recap together before you woke up.',
    crop: { ...RECAP_SHOT, alt: 'The Recap in Sted: today’s edition opening on Sted’s Picks', box: [30, 150, 860, 452], fade: true },
  },
  { key: 'topics', tint: 'var(--sted-supportive-pink)', action: 'sorted this week’s saves into Travel, Coffee and AI.' },
  {
    key: 'picks', tint: 'var(--sted-supportive-green)', action: 'picked three saves worth your next five minutes.',
    crop: { ...RECAP_SHOT, alt: 'Sted’s Picks in The Recap: “If you have 5 minutes, start with these.”', box: [30, 458, 860, 548] },
  },
]

const RECAP_TOPICS = ['Travel', 'Coffee', 'AI']
const RECAP_SAVES = [
  { thumb: '/content/landing-4c/fushimi-inari-kyoto.webp', title: 'Kyoto, Japan', meta: 'Instagram · Travel' },
  { thumb: '/content/landing-4c/pour-over-method.webp', title: 'The pour over method, start to finish', meta: 'YouTube · Coffee' },
  { thumb: '/content/landing-4c/x-post-falling-into-hole.webp', title: 'How to fix your entire life in 1 day', meta: 'X · AI' },
]

/** A window onto one region of an app screenshot. The image is scaled so the box fills the window width. */
function AppCropWindow({ crop }: { crop: AppCrop }) {
  const [imgW, imgH] = crop.size
  const [x, y, w, h] = crop.box
  const vars = { '--img-w': imgW, '--img-h': imgH, '--crop-x': x, '--crop-y': y, '--crop-w': w, '--crop-h': h } as React.CSSProperties
  return <div className={crop.fade ? 'l4s-app-window is-fading' : 'l4s-app-window'} style={vars}>
    <img src={crop.src} alt={crop.alt} className="l4s-app-crop" width={imgW} height={imgH} />
  </div>
}

/** The Recap's topics block, drawn in the app's style with this line's three topics. */
function RecapWindow() {
  return <div className="l4s-app-window l4s-recap" role="img" aria-label="The Recap: this week’s saves sorted into Travel, Coffee and AI">
    <div className="l4s-recap-inner">
      <p className="l4s-recap-label">The Recap</p>
      <p className="l4s-recap-sub">You saved 14 items around these topics:</p>
      <p className="l4s-recap-chips">{RECAP_TOPICS.map(topic => <span key={topic}>{topic}</span>)}</p>
      <ul className="l4s-recap-rows">
        {RECAP_SAVES.map(save => <li key={save.title}><img src={save.thumb} alt="" /><span><strong>{save.title}</strong><small>{save.meta}</small></span></li>)}
      </ul>
    </div>
  </div>
}

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

/** Closing CTA: free on iPhone first, Pro one quiet link away (the founding price while it runs). */
function ClosingCta() {
  const spots = useFoundingSpots()
  const founding = isFoundingLive() && !isSoldOut(spots)
  return <div className="l4s-final-cta">
    <a className="l4s-final-free" href={APP_STORE_URL ?? '#'}>Get Sted free on iPhone <span aria-hidden="true">→</span></a>
    <CheckoutLink plan={founding ? 'founding' : 'annual'} source="closing" className="l4s-final-pro" noticeClassName="l4s-final-notice">
      {founding ? `or go Pro for ${foundingTerms().price}/yr` : 'or go Pro'}
    </CheckoutLink>
  </div>
}

function Mascot({ size }: { size: number }) {
  return <img src="/sted-mascot.svg" alt="" aria-hidden="true" style={{ height: size, width: 'auto', display: 'block' }} {...LAZY} />
}

// How it works screens, all in the hero's frame (white rim, island only, no status bar): the share
// sheet recording, real screenshots of the Dan Koe save and The Recap, and Topics drawn.
const SHOTS: Record<FeatureKey, { alt: string; tint: string; kind: 'video' | 'topics' | 'shot'; src?: string; poster?: string; ownIsland?: boolean }> = {
  save: { kind: 'video', src: '/content/landing-4c/app/share.mp4', poster: '/content/landing-4c/app/share-poster.webp', alt: 'Sharing an X post to Sted from the iOS share sheet', tint: 'var(--sted-supportive-blue)' },
  summary: { kind: 'shot', src: SUMMARY_SCREEN.src, alt: SUMMARY_SCREEN.alt, tint: 'var(--sted-yellow)' },
  chat: { kind: 'video', src: '/content/landing-4c/app/chat.mp4', poster: '/content/landing-4c/app/chat-poster.webp', ownIsland: true, alt: 'Ask Sted: “Summarize what I saved this week.” Sted answers with two big ideas and the saves they came from.', tint: 'var(--sted-supportive-purple)' },
  topics: { kind: 'topics', alt: 'The Sted library sorted into topics: AI, Design, Productivity, Coffee, Travel and Podcasts', tint: 'var(--sted-supportive-pink)' },
  feed: { kind: 'shot', src: '/content/landing-4c/app/recap.webp', alt: 'The Recap in Sted with Sted’s Picks, the topics you saved around and your saved Steds', tint: 'var(--sted-supportive-green)' },
}

/** Screen recording: plays only while its state is active and motion is allowed; otherwise it sits on its poster. */
function ShareVideo({ src, poster, alt, isActive, reducedMotion, ownIsland = false }: { src: string; poster: string; alt: string; isActive: boolean; reducedMotion: boolean; ownIsland?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (isActive && !reducedMotion) { node.play().catch(() => {}) } else { node.pause(); if (!isActive) node.currentTime = 0 }
  }, [isActive, reducedMotion])
  return <>
    <video ref={ref} className="cf-phone-shot" muted loop playsInline preload="metadata" poster={poster} aria-label={alt}>
      <source src={src} type="video/mp4" />
    </video>
    {/* The chat recording keeps its own island; the share-sheet one starts below the status bar. */}
    {!ownIsland && <span className="l4s-frame-island" aria-hidden="true" />}
  </>
}

function PhoneShot({ feature, isActive, reducedMotion }: { feature: (typeof FEATURES)[number]; isActive: boolean; reducedMotion: boolean }) {
  const shot = SHOTS[feature.key]
  return <div className={isActive ? 'l4s-shot is-active' : 'l4s-shot'} style={{ '--l4s-tint': shot.tint } as React.CSSProperties} aria-hidden={!isActive}>
    <div className="cf-phone l4o-screen l4s-frame" role={shot.kind === 'topics' ? 'img' : undefined} aria-label={shot.kind === 'topics' ? shot.alt : undefined}>
      {shot.kind === 'video' && <ShareVideo src={shot.src!} poster={shot.poster!} alt={shot.alt} isActive={isActive} reducedMotion={reducedMotion} ownIsland={shot.ownIsland} />}
      {shot.kind === 'topics' && <TopicsApp />}
      {/* The screen showing on load is the phone's largest paint: fetch it right away, the others when needed. */}
      {shot.kind === 'shot' && <img className="cf-phone-shot" src={shot.src} alt={shot.alt} width={600} height={1304} loading={isActive ? 'eager' : 'lazy'} decoding="async" />}
    </div>
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

export function FeatureShowcase({ initial = 'save', autoplay = true, id, keys = FEATURE_KEYS }: { initial?: FeatureKey; autoplay?: boolean; id?: string; keys?: FeatureKey[] }) {
  const features = FEATURES.filter(feature => keys.includes(feature.key))
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

  return <section ref={sectionRef} className="l4s-section l4s-showcase" aria-labelledby={id ? `${id}-title` : undefined}>
    <div className="l4s-showcase-copy">
      <p className="l4s-section-eyebrow">How it works</p>
      <h2 id={id ? `${id}-title` : undefined} className="l4s-h2">Save it.<br />Sted does the rest.</h2>
      <p className="l4s-lede">Send Sted whatever you find. It reads and understands every save, so you don’t have to go back and work through it all yourself.</p>
      <ol className="l4s-features" onMouseLeave={() => dispatch({ type: 'leave' })}>
        {features.map((feature) => {
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
                    onAnimationEnd={() => dispatch({ type: 'advance', keys })}
                  />
                </span>}
              </span>
            </button>
          </li>
        })}
      </ol>
    </div>
    <div className="l4s-stage" id={id}>
      {features.map((feature) => <PhoneShot key={feature.key} feature={feature} isActive={feature.key === state.active} reducedMotion={reducedMotion} />)}
      {/* Floating Steds (placeholder art until the variant SVGs land). */}
      <img src="/sted-mascot.svg" alt="" aria-hidden="true" className="l4s-floater l4s-floater-mascot" {...LAZY} />
      <img src={`${ICONS}/video.webp`} alt="" aria-hidden="true" className="l4s-floater l4s-floater-a" {...LAZY} />
      <img src={`${ICONS}/topics.webp`} alt="" aria-hidden="true" className="l4s-floater l4s-floater-b" {...LAZY} />
      <img src={`${ICONS}/summary-note.webp`} alt="" aria-hidden="true" className="l4s-floater l4s-floater-c" {...LAZY} />
    </div>
  </section>
}

/** "Meanwhile, Sted is working": parked, not on the landing. Shown on /internal/landing-4c/states. */
export function StedsAtWork() {
  return <>
    <section className="l4s-section l4s-steds" id="why-sted" aria-labelledby="l4s-steds-title">
      <h2 id="l4s-steds-title" className="l4s-h2">Meanwhile,<br />Sted is working.</h2>
      <div className="l4s-steds-grid">
        {STEDS_AT_WORK.map((sted) => <div key={sted.key} className="l4s-sted-card">
          <div className="l4s-sted-illustration" style={{ '--l4s-tint': sted.tint } as React.CSSProperties}>
            {sted.crop ? <AppCropWindow crop={sted.crop} /> : <RecapWindow />}
          </div>
          <p className="l4s-sted-action"><strong>Sted</strong> {sted.action}</p>
        </div>)}
      </div>
    </section>
  </>
}

export function Landing4CSections({ initial, autoplay }: { initial: FeatureKey; autoplay: boolean }) {
  return <>
    <FeatureShowcase initial={initial} autoplay={autoplay} id="how-it-works" />

    <LandingPricing />

    <LandingRoadmap />

    <LandingFaq />

    <section className="l4s-section l4s-final" id="download" aria-labelledby="l4s-final-title">
      <div className="l4s-final-badge"><Mascot size={112} /></div>
      <h2 id="l4s-final-title" className="l4s-h2 l4s-final-title">You saved it for a reason.<br /><mark className="l4c-hl">Make it useful.</mark></h2>
      <ClosingCta />
    </section>
  </>
}
