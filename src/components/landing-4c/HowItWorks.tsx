import { useEffect, useRef, useState, type ReactNode } from 'react'
import { APP_STORE_URL } from './app-links'
import { CheckoutLink } from './CheckoutLink'
import { ComparisonTable, REDEEM_NOTE } from './LandingPricing'
import { FEATURE_REQUEST_URL, ROADMAP } from './roadmap'
import { foundingTerms, isFoundingLive } from '../growth-funnel/founding-offer'
import { AppScreen } from '../growth-funnel/AppScreen'
import { INTRO_SAVES, findExample } from '../growth-funnel/funnel-content'
import { getPeriod } from '../growth-funnel/funnel-pricing'
import '../growth-funnel/ConversationalFunnel.css'
import './HowItWorks.css'

export const HOW_STEPS = ['lost', 'save', 'see', 'find', 'next', 'plan'] as const
type Step = (typeof HOW_STEPS)[number]
const LAST = HOW_STEPS.length - 1

const TITLES: Record<Step, string> = {
  lost: 'You save it. Then you never find it again.',
  save: 'Save it to Sted from any app.',
  see: 'Here’s how you’ll see it.',
  find: 'Find it in seconds.',
  next: 'And there’s a lot more coming.',
  plan: 'Free or Pro?',
}

const DESCRIPTIONS: Partial<Record<Step, string>> = {
  lost: 'Links in your notes, screenshots, open tabs, messages to yourself. When you need one, it’s gone.',
  save: 'Share it from Instagram, YouTube, X, Safari or Spotify. Sted takes it from there.',
  see: 'Every save comes back with a summary, the key ideas and its topics.',
  find: 'Everything lives in one library. Search it and it’s right there.',
}

/** The Dan Koe save, drawn in the app's item layout (its screenshot's scraped title is the raw t.co link). */
const SEE_EXAMPLE = { ...findExample('creator', 'dan-koe')!, screen: undefined }

/** Illustrative search results: real saves from the funnel examples. */
const SEARCH_RESULTS = [
  { thumb: '/content/real/spotify-lennys-podcast-ian-silber.jpg', title: 'Chatbots are not the final interface', source: 'Spotify · Lenny’s Podcast' },
  { thumb: '/content/real/openai.webp', title: 'Codex as a platform: build on the open agent harness', source: 'OpenAI Developers' },
  { thumb: '/content/real/x1.jpg', title: 'I just open sourced a minimal chatbot template.', source: 'X · @shadcn' },
]

function Phone({ children, label }: { children: ReactNode; label: string }) {
  return <div className="cf-phone hw-phone" role="img" aria-label={label}>{children}</div>
}

function ShareVideo() {
  const [still] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  return <Phone label="Sharing a link to Sted from the iOS share sheet">
    {still
      ? <img className="cf-phone-shot" src="/content/landing-4c/app/share-poster.webp" alt="" />
      : <video className="cf-phone-shot" src="/content/landing-4c/app/share.mp4" poster="/content/landing-4c/app/share-poster.webp" autoPlay muted loop playsInline />}
  </Phone>
}

function SearchScreen() {
  return <Phone label="Searching “AI” in the Sted library finds three saves">
    <div className="cf-app hw-search" aria-hidden="true">
      <div className="cf-app-status"><span>9:41</span><i /></div>
      <p className="hw-search-title">Search</p>
      <p className="hw-search-field"><span className="hw-search-icon" />AI<span className="hw-caret" /></p>
      <p className="hw-search-count">3 saves</p>
      <ul className="hw-search-results">
        {SEARCH_RESULTS.map(result => <li key={result.title}>
          <img src={result.thumb} alt="" />
          <span><strong>{result.title}</strong><small>{result.source}</small></span>
        </li>)}
      </ul>
      <div className="cf-app-tabs"><span>Magazine</span><span>Sted</span><span className="is-active">Library</span></div>
    </div>
  </Phone>
}

/**
 * "See how it works": a short story in six screens (lost → save → see → find → what's next → Free
 * or Pro), ending at checkout. Same conversational look as the funnel: Sted talks in a bubble.
 */
export function HowItWorksDialog({ onClose, founding = isFoundingLive() }: { onClose: () => void; founding?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const [step, setStep] = useState(0)
  const id = HOW_STEPS[step]
  const offer = foundingTerms()

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    node.showModal()
    return () => {
      node.close()
      document.body.style.overflow = overflow
      trigger?.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => { heading.current?.focus({ preventScroll: true }) }, [step])

  const bubble: ReactNode = id === 'lost' ? <><strong>Hi, I’m Sted.</strong><span>Sound familiar?</span></>
    : id === 'save' ? 'Tap Share, pick Sted. That’s it.'
    : id === 'see' ? 'I read it for you, so you don’t have to.'
    : id === 'find' ? 'No more digging through screenshots.'
    : id === 'next' ? 'I’m just getting started.'
    : founding ? `Founding members get Pro for ${offer.price} their first year.` : 'Start free. Go Pro when you save a lot.'

  return <dialog
    ref={dialog}
    className="cf-dialog funnel-tokens hw-dialog"
    aria-labelledby="hw-heading"
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => {
      if (event.target !== event.currentTarget) return
      const box = event.currentTarget.getBoundingClientRect()
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose()
    }}
  >
    <header className="cf-top">
      <button type="button" aria-label="Previous" onClick={() => setStep(current => Math.max(0, current - 1))} disabled={step === 0}>←</button>
      <div className="cf-progress" role="progressbar" aria-label="How it works" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={HOW_STEPS.length}>
        {HOW_STEPS.map((item, index) => <span key={item} className={index <= step ? 'is-complete' : ''} />)}
      </div>
      <button type="button" aria-label="Close" onClick={onClose}>×</button>
    </header>

    <div className="cf-scroll">
      <div className={`cf-content hw-content hw-content-${id}`} key={step}>
        <div className="cf-greeting">
          <img src="/sted-mascot.svg" alt="Sted" />
          <p>{bubble}</p>
        </div>

        <h2 id="hw-heading" ref={heading} tabIndex={-1}>{TITLES[id]}</h2>
        {DESCRIPTIONS[id] && <p className="cf-description">{DESCRIPTIONS[id]}</p>}

        {id === 'lost' && <div className="cf-intro-stack" aria-hidden="true">{INTRO_SAVES.map(save => <img key={save} src={save} alt="" />)}</div>}
        {id === 'save' && <ShareVideo />}
        {id === 'see' && <AppScreen example={SEE_EXAMPLE} className="hw-phone" />}
        {id === 'find' && <SearchScreen />}

        {id === 'next' && <>
          <ul className="hw-roadmap">
            {ROADMAP.map(item => <li key={item.name}>
              <span><strong>{item.name}</strong><small>{item.body}</small></span>
              <em>{item.status}</em>
            </li>)}
          </ul>
          <a className="hw-suggest" href={FEATURE_REQUEST_URL}>What should Sted do next? Suggest a feature →</a>
        </>}

        {id === 'plan' && <>
          <p className="hw-offer">
            {founding
              ? <><s aria-label={`Regular price ${offer.regular} a year`}>{offer.regular}</s> <strong>{offer.price}</strong> for your first year. {offer.renewal} First {offer.spots} members only, and you’re helping build what’s next.</>
              : <><strong>{getPeriod('annual').price}</strong> a year, or {getPeriod('monthly').price} a month. Cancel anytime.</>}
          </p>
          <ComparisonTable className="hw-compare" />
        </>}
      </div>
    </div>

    <footer className="cf-bottom">
      {step < LAST
        ? <button type="button" className="cf-primary" onClick={() => setStep(step + 1)}>{step === 0 ? 'Show me how' : 'Next'}<span aria-hidden="true">→</span></button>
        : <>
          <CheckoutLink plan={founding ? 'founding' : 'annual'} source="how_it_works" className="cf-primary" noticeClassName="cf-notice">
            {founding ? `Get Sted Pro · ${offer.price}` : 'Get Sted Pro'}<span aria-hidden="true">→</span>
          </CheckoutLink>
          <a className="hw-free" href={APP_STORE_URL ?? '#'}>Or start free on the App Store</a>
          <p className="cf-notice">{REDEEM_NOTE}</p>
        </>}
    </footer>
  </dialog>
}
