import { useEffect, useRef, useState, type MouseEvent, type ReactNode, type RefObject } from 'react'
import { Landing4CPreview } from '../landing-4c/Landing4CPreview'
import { REVENUECAT_FUNNEL_URL } from '../landing-4c/app-links'
import '../landing-4c/landing-4c-tokens.css'
import {
  EVERYWHERE, NEED_COPY, NEEDS, PERSONAS, PURPOSES, SOURCES, STORAGE, examplesFor, findExample, sourceReply, storageReply,
  togglePurpose, toggleSource, toggleStorage, type ExampleSave, type Need, type Persona, type Purpose, type Storage,
} from './funnel-content'
import { toEventRow, trackFunnelEvent, type FunnelEventName } from './funnel-events'
import { buildPlanUrl, loadFunnelSession, readPeriod, type FunnelAnswers } from './funnel-session'
import './ConversationalFunnel.css'

const STEPS = ['intro', 'persona', 'sources', 'storage', 'purpose', 'need', 'pick', 'result'] as const
type Step = (typeof STEPS)[number]
const LAST = STEPS.length - 1
const AUTO_ADVANCE_MS = 220

const TITLES: Record<Step, string> = {
  intro: 'You saved it for a reason.',
  persona: 'What best describes you?',
  sources: 'Where do you save links from?',
  storage: 'And where do they end up?',
  purpose: 'What do you save things for?',
  need: 'What would help most?',
  pick: 'Pick one to save.',
  result: 'Here it is in Sted.',
}

const DESCRIPTIONS: Partial<Record<Step, string>> = {
  intro: 'Links, posts, videos and notes. I read them, organize them and help you find them again.',
  persona: 'So my examples look like the things you save.',
  sources: 'Pick all the places that sound familiar.',
  storage: 'Be honest. We’ve all been there.',
  purpose: 'Pick all that apply.',
  need: 'Pick the one that sounds most like you.',
  pick: 'Real links. This is what they look like in Sted.',
}

/** Real saves fanned out under the opening statement. */
const INTRO_SAVES = [
  '/content/landing-4c/pour-over-method.webp',
  '/content/landing-4c/x-post-falling-into-hole.webp',
  '/content/landing-4c/fushimi-inari-kyoto.webp',
  '/content/real/spotify-lennys-podcast-ian-silber.jpg',
  '/content/real/karakeep.png',
]

function Selection({ selected }: { selected: boolean }) {
  return <span className={`cf-selection${selected ? ' is-selected' : ''}`} aria-hidden="true">{selected ? '✓' : ''}</span>
}

function SourceTile({ source }: { source: ExampleSave['source'] }) {
  const icon = source === 'web' ? 'web' : source
  return <img className="cf-tile" src={`/brand/source-icons/${icon}-tile.svg`} alt="" width={20} height={20} />
}

/**
 * The app's item screen. Uses the real iPhone screenshot when there is one; until then it draws
 * the same layout (thumbnail, title, link, Summary, Key ideas, Topics) from the example data.
 */
function AppScreen({ example }: { example: ExampleSave }) {
  return <div className="cf-phone" role="img" aria-label={`“${example.title}” saved in the Sted app, with its summary and key ideas`}>
    {example.screen
      ? <img className="cf-phone-shot" src={example.screen} alt="" />
      : <div className="cf-app" aria-hidden="true">
        <div className="cf-app-status"><span>9:41</span><i /></div>
        <span className="cf-app-back">‹</span>
        <img className="cf-app-thumb" src={example.thumb} alt="" />
        <p className="cf-app-title">{example.title}</p>
        <p className="cf-app-link"><SourceTile source={example.source} /><span>{example.displayUrl}</span></p>
        <p className="cf-app-meta">Today · <span>+ Topic</span> · <span>+ Project</span></p>
        <p className="cf-app-heading">Summary</p>
        <p className="cf-app-summary">{example.summary}</p>
        <p className="cf-app-heading">Key ideas</p>
        <ul className="cf-app-ideas">{example.keyIdeas.map(idea => <li key={idea}>{idea}</li>)}</ul>
        <p className="cf-app-heading">Topics</p>
        <p className="cf-app-topics">{example.topics.map(topic => <span key={topic}>{topic}</span>)}</p>
        <div className="cf-app-tabs"><span>Magazine</span><span>Sted</span><span className="is-active">Library</span></div>
      </div>}
  </div>
}

type Review = { persona: Persona; need: Need; example: string; step: number }
/** DEV/preview shortcut: ?review=result jumps to the result screen with sample answers. */
function reviewState(): Review | null {
  return new URLSearchParams(window.location.search).get('review') === 'result'
    ? { persona: 'creator', need: 'keypoints', example: 'dan-koe', step: LAST }
    : null
}

/** The conversational funnel itself: header, one question per screen, footer. Shell-agnostic. */
export function FunnelFlow({ onClose, heading }: { onClose?: () => void; heading: RefObject<HTMLHeadingElement | null> }) {
  const [review] = useState(reviewState)
  const [session] = useState(loadFunnelSession)
  const [period] = useState(() => readPeriod(window.location.search))
  const [step, setStep] = useState(review?.step ?? 0)
  const [persona, setPersona] = useState<Persona | null>(review?.persona ?? null)
  const [sources, setSources] = useState<string[]>([])
  const [storage, setStorage] = useState<Storage[]>([])
  const [purposes, setPurposes] = useState<Purpose[]>([])
  const [need, setNeed] = useState<Need | null>(review?.need ?? null)
  const [exampleId, setExampleId] = useState<string | null>(review?.example ?? null)
  const [planNotice, setPlanNotice] = useState<string | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const advanceTimer = useRef<number | undefined>(undefined)

  const answers: FunnelAnswers = { persona, sources, storage, purposes, need, example: exampleId }
  // Latest step/answers for tracking from handlers and the unmount cleanup.
  const latest = useRef({ step, answers })
  useEffect(() => { latest.current = { step, answers } })

  const id = STEPS[step]
  const example = findExample(persona, exampleId)
  const needCopy = NEED_COPY[need ?? 'keypoints']
  const planUrl = REVENUECAT_FUNNEL_URL ? buildPlanUrl(REVENUECAT_FUNNEL_URL, session, answers, period) : null

  function track(event: FunnelEventName, override: Partial<FunnelAnswers> = {}) {
    const { step: atStep, answers: current } = latest.current
    trackFunnelEvent(toEventRow(event, atStep, session, { ...current, ...override }, window.location.pathname))
  }

  // Mount/unmount only: the latest state is read through `latest`.
  useEffect(() => {
    track('funnel_started')
    return () => {
      window.clearTimeout(advanceTimer.current)
      if (latest.current.step < LAST) track('funnel_closed')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
    heading.current?.focus({ preventScroll: true })
    track(STEPS[step] === 'result' ? 'result_viewed' : 'step_viewed')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  function goTo(next: number) {
    window.clearTimeout(advanceTimer.current)
    setPlanNotice(null)
    setStep(Math.max(0, Math.min(LAST, next)))
  }

  /** Single-choice answers advance on their own, after a beat so the selection is visible. */
  function advanceSoon() {
    window.clearTimeout(advanceTimer.current)
    advanceTimer.current = window.setTimeout(() => setStep(current => Math.min(LAST, current + 1)), AUTO_ADVANCE_MS)
  }

  function choosePersona(value: Persona) {
    if (value !== persona) setExampleId(null)
    setPersona(value)
    track('persona_selected', { persona: value })
    advanceSoon()
  }

  function chooseNeed(value: Need) {
    setNeed(value)
    track('need_selected', { need: value })
    advanceSoon()
  }

  function chooseExample(value: string) {
    setExampleId(value)
    track('example_selected', { example: value })
    advanceSoon()
  }

  function onPlanClick(event: MouseEvent) {
    track('plan_clicked')
    if (planUrl) return
    // Misconfiguration only (REVENUECAT_FUNNEL_URL missing): never build a checkout URL by hand.
    event.preventDefault()
    console.error('[sted funnel] REVENUECAT_FUNNEL_URL is not set; "See my plan" has nowhere to go.')
    setPlanNotice('Plans aren’t available right now. Please try again later.')
  }

  const greeting: ReactNode = id === 'intro' ? <><strong>Hi, I’m Sted.</strong><span>I turn what you save into something useful.</span></>
    : id === 'persona' ? 'A few quick questions, so I can show you something useful.'
    : id === 'sources' ? PERSONAS.find(item => item.id === persona)?.reply
    : id === 'storage' ? sourceReply(sources)
    : id === 'purpose' ? storageReply(storage)
    : id === 'need' ? purposes.includes('everything') ? 'A bit of everything. Same here.' : 'Got it. I’ll keep those together for you.'
    : id === 'pick' ? needCopy.pick
    : needCopy.result

  return <>
    <header className="cf-top">
      <button type="button" aria-label={step === 0 ? 'Close' : 'Previous question'} onClick={() => step === 0 ? onClose?.() : goTo(step - 1)} disabled={step === 0 && !onClose}>←</button>
      <div className="cf-progress" role="progressbar" aria-label="Your progress" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
        {STEPS.map((item, index) => <span key={item} className={index <= step ? 'is-complete' : ''} />)}
      </div>
      {onClose
        ? <button type="button" aria-label="Close" onClick={onClose}>×</button>
        : <a className="cf-close-link" href="/" aria-label="Back to sted.ai">×</a>}
    </header>

    <div className="cf-scroll" ref={scroller}>
      <div className={`cf-content cf-content-${id}`} key={step}>
        <div className="cf-greeting">
          <img src="/sted-mascot.svg" alt="Sted" />
          <p>{greeting}</p>
        </div>

        <h2 id="cf-heading" ref={heading} tabIndex={-1}>{TITLES[id]}</h2>
        {DESCRIPTIONS[id] && <p className="cf-description">{DESCRIPTIONS[id]}</p>}

        {id === 'intro' && <div className="cf-intro-stack" aria-hidden="true">
          {INTRO_SAVES.map(save => <img key={save} src={save} alt="" />)}
        </div>}

        {id === 'persona' && <div className="cf-choices cf-choices-grid" role="group" aria-labelledby="cf-heading">
          {PERSONAS.map(item => <button type="button" key={item.id} aria-pressed={persona === item.id} onClick={() => choosePersona(item.id)}>
            <span>{item.label}</span><Selection selected={persona === item.id} />
          </button>)}
        </div>}

        {id === 'sources' && <>
          <div className="cf-sources" role="group" aria-label="Places you save links">
            {SOURCES.map(source => <button type="button" key={source.name} aria-pressed={sources.includes(source.name)} onClick={() => setSources(current => toggleSource(current, source.name))}>
              <img src={`/brand/source-icons/${source.icon}-tile.svg`} alt="" />
              <span>{source.name}</span><Selection selected={sources.includes(source.name)} />
            </button>)}
          </div>
          <div className="cf-source-shortcuts">
            <button type="button" className="cf-text-button" aria-pressed={sources.includes(EVERYWHERE)} onClick={() => setSources(current => toggleSource(current, EVERYWHERE))}>{sources.includes(EVERYWHERE) ? '✓ ' : ''}A bit of everywhere</button>
            <button type="button" className="cf-text-button" onClick={() => { setSources([]); track('sources_selected', { sources: [] }); goTo(step + 1) }}>I’m just exploring</button>
          </div>
        </>}

        {id === 'storage' && <div className="cf-choices cf-choices-grid" role="group" aria-labelledby="cf-heading">
          {STORAGE.map(item => <button type="button" key={item.id} aria-pressed={storage.includes(item.id)} onClick={() => setStorage(current => toggleStorage(current, item.id))}>
            <span>{item.label}</span><Selection selected={storage.includes(item.id)} />
          </button>)}
        </div>}

        {id === 'purpose' && <div className="cf-choices" role="group" aria-labelledby="cf-heading">
          {PURPOSES.map(item => <button type="button" key={item.id} aria-pressed={purposes.includes(item.id)} onClick={() => setPurposes(current => togglePurpose(current, item.id))}>
            <span>{item.label}</span><Selection selected={purposes.includes(item.id)} />
          </button>)}
        </div>}

        {id === 'need' && <div className="cf-choices" role="group" aria-labelledby="cf-heading">
          {NEEDS.map(item => <button type="button" key={item.id} aria-pressed={need === item.id} onClick={() => chooseNeed(item.id)}>
            <span>{item.label}</span><Selection selected={need === item.id} />
          </button>)}
        </div>}

        {id === 'pick' && persona && <div className="cf-saves" role="group" aria-labelledby="cf-heading">
          {examplesFor(persona, sources).map(item => <button type="button" key={item.id} className="cf-save" aria-pressed={exampleId === item.id} onClick={() => chooseExample(item.id)}>
            <img className="cf-save-thumb" src={item.thumb} alt="" />
            <span className="cf-save-text">
              <strong>{item.title}</strong>
              <span><SourceTile source={item.source} />{item.sourceLabel}</span>
            </span>
            <span className="cf-save-pill" aria-hidden="true">{exampleId === item.id ? 'Saved' : 'Save'}</span>
          </button>)}
        </div>}

        {id === 'result' && example && <AppScreen example={example} />}
      </div>
    </div>

    <footer className="cf-bottom">
      {id === 'intro' && <button type="button" className="cf-primary" onClick={() => goTo(1)}>Show me how<span aria-hidden="true">→</span></button>}
      {id === 'sources' && <button type="button" className="cf-primary" disabled={!sources.length} onClick={() => { track('sources_selected'); goTo(step + 1) }}>Continue<span aria-hidden="true">→</span></button>}
      {id === 'storage' && <button type="button" className="cf-primary" disabled={!storage.length} onClick={() => { track('storage_selected'); goTo(step + 1) }}>Continue<span aria-hidden="true">→</span></button>}
      {id === 'purpose' && <button type="button" className="cf-primary" disabled={!purposes.length} onClick={() => { track('purpose_selected'); goTo(step + 1) }}>Continue<span aria-hidden="true">→</span></button>}
      {id === 'result' && <a className="cf-primary" href={planUrl ?? '#'} onClick={onPlanClick}>See my plan<span aria-hidden="true">→</span></a>}
      {planNotice && <p className="cf-notice" role="status">{planNotice}</p>}
    </footer>
  </>
}

/** The funnel as a modal over whatever page is behind it. */
export function FunnelDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    node.showModal()
    heading.current?.focus({ preventScroll: true })
    return () => {
      node.close()
      document.body.style.overflow = overflow
      trigger?.focus({ preventScroll: true })
    }
  }, [])

  return <dialog
    ref={dialog}
    className="cf-dialog funnel-tokens"
    aria-labelledby="cf-heading"
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => {
      if (event.target !== event.currentTarget) return
      const box = event.currentTarget.getBoundingClientRect()
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose()
    }}
  >
    <FunnelFlow onClose={onClose} heading={heading} />
  </dialog>
}

/** /start: the same funnel as a standalone page, for social links and ads. */
export function FunnelPage() {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { document.title = 'Sted — Get started' }, [])
  return <main className="cf-page funnel-tokens">
    <div className="cf-card"><FunnelFlow heading={heading} /></div>
  </main>
}

/** Review surface: the landing, with "See how it works" opening the funnel. ?open=1 opens it on load. */
export function ConversationalFunnel() {
  const params = new URLSearchParams(window.location.search)
  const [open, setOpen] = useState(params.get('open') === '1' || params.get('review') === 'result')
  return <div className="cf-preview funnel-tokens">
    <div className="cf-review-bar">
      <span>Sted · conversation preview</span>
      <button type="button" onClick={() => setOpen(true)}>Open flow ↗</button>
    </div>
    <Landing4CPreview onHowItWorks={() => setOpen(true)} />
    {open && <FunnelDialog onClose={() => setOpen(false)} />}
  </div>
}
