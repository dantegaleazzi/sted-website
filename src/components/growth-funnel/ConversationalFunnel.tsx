import { useEffect, useRef, useState } from 'react'
import { Landing4CPreview } from '../landing-4c/Landing4CPreview'
import { APP_STORE_URL } from '../landing-4c/app-links'
import { FunnelPlanCTA, FunnelPlanResult } from './FunnelPlanResult'
import { getPeriod, previewCheckoutIntent, recommendPlan, type Habit, type Period, type Volume } from './funnel-pricing'
import './ConversationalFunnel.css'

const sources = [
  { name: 'Instagram', icon: 'instagram' },
  { name: 'YouTube', icon: 'youtube' },
  { name: 'X', icon: 'x' },
  { name: 'Safari', icon: 'web' },
  { name: 'Notes', letter: 'N' },
  { name: 'Messages', letter: '…' },
]
const habits: { id: Habit; label: string }[] = [
  { id: 'forget', label: 'I save it. Then forget about it.' },
  { id: 'find', label: 'I can’t find it when I need it.' },
  { id: 'organized', label: 'I’m actually pretty organized.' },
  { id: 'new', label: 'I’m just getting started.' },
]
const volumes: { id: Volume; label: string; hint: string }[] = [
  { id: 'light', label: 'A few things a week', hint: 'Up to 50 a month' },
  { id: 'daily', label: 'Something every day', hint: 'About 51–100 a month' },
  { id: 'heavy', label: 'More than I can keep up with', hint: 'Over 100 a month' },
]
const solutions: Record<Habit, { title: string; copy: string }> = {
  forget: { title: 'Give “later” a little help.', copy: 'I’ll read the links you share and keep the key ideas together, ready to come back to.' },
  find: { title: 'Less searching. More finding.', copy: 'I’ll summarize the links you share and add tags, so you can find them in one library.' },
  organized: { title: 'Keep your system. Skip the reading.', copy: 'You’ve got the organizing covered. Let me read the links you share and pull out the key ideas.' },
  new: { title: 'Make your first saves useful.', copy: 'Share a link with me. I’ll summarize it and add tags, so it’s easy to come back to.' },
}

function Selection({ selected }: { selected: boolean }) {
  return <span className={`cf-selection${selected ? ' is-selected' : ''}`} aria-hidden="true">{selected ? '✓' : ''}</span>
}

export function ConversationalFunnel() {
  // Review links exist only on this DEV-only surface; normal entry runs the full quiz.
  const params = new URLSearchParams(window.location.search)
  const review = params.get('review')
  const reviewingPlan = review === 'pro' || review === 'free'
  const [open, setOpen] = useState(params.get('open') === '1' || reviewingPlan)
  const [step, setStep] = useState(reviewingPlan ? 4 : 0)
  const [selectedSources, setSources] = useState<string[]>([])
  const [habit, setHabit] = useState<Habit | null>(reviewingPlan ? 'find' : null)
  const [volume, setVolume] = useState<Volume | null>(reviewingPlan ? review === 'pro' ? 'heavy' : 'light' : null)
  const [period, setPeriod] = useState<Period>('annual')
  const [checkoutIntent, setCheckoutIntent] = useState<ReturnType<typeof previewCheckoutIntent> | null>(null)
  const [activationNotice, setActivationNotice] = useState(false)
  const [desktop, setDesktop] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const selectedPeriod = getPeriod(period)
  const recommended = recommendPlan(volume)
  const solution = solutions[habit ?? 'new']
  const canContinue = step === 0 ? selectedSources.length > 0 : step === 1 ? habit !== null : step === 3 ? volume !== null : true
  const titles = [
    'Where do you save links?',
    'And what happens after you save?',
    solution.title,
    'How much do you usually save?',
    'Get more from what you save.',
    'Here’s what happens next.',
    'Bring Pro to your iPhone.',
  ]
  const sourceReply = selectedSources.includes('Everywhere') || selectedSources.length > 2
    ? 'A little here, a little there. Sound familiar?'
    : selectedSources.length ? `${selectedSources.join(' and ')}. Lots of things worth keeping.`
    : 'A link today. Another tomorrow.'

  useEffect(() => {
    const node = dialog.current
    if (!open || !node) return
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
  }, [open])

  useEffect(() => {
    if (open) {
      scroller.current?.scrollTo({ top: 0 })
      heading.current?.focus({ preventScroll: true })
    }
  }, [step, open])

  function toggleSource(name: string) {
    setSources(current => name === 'Everywhere'
      ? current.includes(name) ? [] : [name]
      : current.includes(name) ? current.filter(item => item !== name) : [...current.filter(item => item !== 'Everywhere'), name])
  }

  function next() {
    setStep(current => current + 1)
  }

  function reset() {
    setStep(0); setSources([]); setHabit(null); setVolume(null)
    setPeriod('annual'); setCheckoutIntent(null); setDesktop(false); setActivationNotice(false)
  }

  function startProPreview() {
    setCheckoutIntent(previewCheckoutIntent(period))
    next()
  }

  return <div className="cf-preview l4c-page">
    <div className="cf-review-bar">
      <span>Sted · conversation preview</span>
      <button type="button" onClick={() => setOpen(true)}>Open flow ↗</button>
    </div>
    <Landing4CPreview onHowItWorks={() => setOpen(true)} />
    {open && <dialog
      ref={dialog}
      className={`cf-dialog cf-step-${step}`}
      aria-labelledby="cf-heading"
      onCancel={event => { event.preventDefault(); setOpen(false) }}
      onClick={event => {
        if (event.target !== event.currentTarget) return
        const box = event.currentTarget.getBoundingClientRect()
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setOpen(false)
      }}
    >
      <header className="cf-top">
        <button type="button" aria-label={step === 0 ? 'Back to Sted' : 'Previous question'} onClick={() => step === 0 ? setOpen(false) : setStep(current => current - 1)}>←</button>
        <div className="cf-progress" role="progressbar" aria-label="Your Sted introduction" aria-valuenow={Math.min(step + 1, 5)} aria-valuemin={0} aria-valuemax={5}>
          {[0, 1, 2, 3, 4].map(index => <span key={index} className={index <= step ? 'is-complete' : ''} />)}
        </div>
        <button type="button" aria-label="Close onboarding" onClick={() => setOpen(false)}>×</button>
      </header>

      <div className="cf-scroll" ref={scroller}>
        <div className="cf-content" key={step}>
          {step !== 4 && <><div className="cf-greeting">
            <img src="/sted-mascot.svg" alt="Sted" />
            <p>{step === 0 ? <><strong>Hi, I’m Sted.</strong><span>A few questions. I’ll show you how I can help.</span></>
              : step === 1 ? sourceReply
              : step === 2 ? habit === 'organized' ? 'Sounds like you’ve got a good system.' : habit === 'new' ? 'You’re in the right place.' : 'That’s where I come in.'
              : step === 3 ? 'You save it. I’ll do the reading.'
              : 'Preview only. No payment or activation.'}</p>
          </div>

          <h2 id="cf-heading" ref={heading} tabIndex={-1}>{titles[step]}</h2></>}

          {step === 0 && <>
            <p className="cf-description">Pick all the places that sound familiar.</p>
            <div className="cf-sources" role="group" aria-label="Places you save links">
              {sources.map(source => <button type="button" key={source.name} aria-pressed={selectedSources.includes(source.name)} onClick={() => toggleSource(source.name)}>
                {source.icon ? <img src={`/brand/source-icons/${source.icon}-tile.svg`} alt="" /> : <span className={`cf-letter cf-letter-${source.name.toLowerCase()}`}>{source.letter}</span>}
                <span>{source.name}</span><Selection selected={selectedSources.includes(source.name)} />
              </button>)}
            </div>
            <div className="cf-source-shortcuts">
              <button type="button" className="cf-text-button" aria-pressed={selectedSources.includes('Everywhere')} onClick={() => toggleSource('Everywhere')}>{selectedSources.includes('Everywhere') ? '✓ ' : ''}A bit of everywhere</button>
              <button type="button" className="cf-text-button" onClick={() => { setSources([]); next() }}>I’m just exploring</button>
            </div>
          </>}

          {step === 1 && <>
            <p className="cf-description">Be honest. We’ve all been there.</p>
            <div className="cf-choices" role="group" aria-label="Your saving habit">
              {habits.map(item => <button type="button" key={item.id} aria-pressed={habit === item.id} onClick={() => setHabit(item.id)}><span>{item.label}</span><Selection selected={habit === item.id} /></button>)}
            </div>
          </>}

          {step === 2 && <>
            <p className="cf-description cf-solution-copy">{solution.copy}</p>
            <div className="cf-example">
              <div className="cf-example-source"><img src="/brand/source-icons/youtube-tile.svg" alt="" /><span>A coffee tutorial you saved</span><small>Example</small></div>
              <div className="cf-example-result">
                <span className="cf-example-label">THE USEFUL PARTS</span>
                <p>Wet the grounds first. Then pour slowly and evenly for a better morning brew.</p>
                <div className="cf-tags"><span>Coffee</span><span>How-to</span></div>
              </div>
            </div>
            <p className="cf-caption">One link → a summary, tags, and a place in your library.</p>
            <details className="cf-chat"><summary>Can I ask questions about my saves?</summary><p>Yes, on the Sted web dashboard. Chat isn’t in the iPhone app yet.</p></details>
          </>}

          {step === 3 && <>
            <p className="cf-description">A rough guess is all I need.</p>
            <div className="cf-choices" role="group" aria-label="How much you save">
              {volumes.map(item => <button type="button" key={item.id} aria-pressed={volume === item.id} onClick={() => setVolume(item.id)}><span>{item.label}<small>{item.hint}</small></span><Selection selected={volume === item.id} /></button>)}
            </div>
            <button type="button" className="cf-text-button" aria-pressed={volume === 'unsure'} onClick={() => setVolume('unsure')}>{volume === 'unsure' ? '✓ ' : ''}I’m not sure yet</button>
          </>}

          {step === 4 && <FunnelPlanResult headingRef={heading} habit={habit} sources={selectedSources} recommended={recommended} period={period} onPeriod={setPeriod} />}

          {step === 5 && <>
            <p className="cf-description" data-package-expected={checkoutIntent?.packageExpected} data-checkout-mode={checkoutIntent?.mode}>Sted Pro · {selectedPeriod.label} · {selectedPeriod.price} / {selectedPeriod.unit}</p>
            <ol className="cf-next-steps">
              <li><span>1</span><div><strong>Complete your purchase.</strong><p>Your total is shown before you pay.</p></div></li>
              <li><span>2</span><div><strong>Get your activation link.</strong><p>On the confirmation page and in your email.</p></div></li>
              <li><span>3</span><div><strong>Open Sted. Activate Pro.</strong><p>Install the app first if you need to.</p></div></li>
            </ol>
            <p className="cf-caption">This preview collects no payment details.</p>
          </>}

          {step === 6 && <>
            <div className="cf-device" role="group" aria-label="Activation device">
              <button type="button" aria-pressed={!desktop} onClick={() => setDesktop(false)}>On iPhone</button>
              <button type="button" aria-pressed={desktop} onClick={() => setDesktop(true)}>On desktop</button>
            </div>
            <p className="cf-description">{desktop ? 'Open your activation email on your iPhone. Install Sted, then return to the link to activate Pro.' : 'Already installed? Open Sted using your activation link to connect your purchase.'}</p>
            {!desktop && <button type="button" className="cf-primary" onClick={() => setActivationNotice(true)}>Open Sted and activate Pro</button>}
            <a className="cf-download" href={APP_STORE_URL!}><img src="/brand/app-store-badge.svg" alt="Download Sted on the App Store" /></a>
            <p className="cf-caption">After installing, come back to your activation link.</p>
            <p className="cf-caption" role="status">{activationNotice ? 'Preview only. The live button will use a RevenueCat redemption link.' : 'No purchase was made or activation email sent.'}</p>
          </>}
        </div>
      </div>

      <footer className="cf-bottom">
        {step === 4 ? <FunnelPlanCTA period={period} onStartPro={startProPreview} /> : <>
          <button type="button" className="cf-primary" disabled={!canContinue} onClick={step === 6 ? reset : next}>
            {step === 2 ? 'That sounds useful' : step === 3 ? 'Find my fit' : step === 5 ? 'Preview activation' : step === 6 ? 'Start again' : 'Continue'}<span aria-hidden="true">→</span>
          </button>
        {step === 5 ? <>
          <p className="cf-renewal">{selectedPeriod.renewal} Auto-renews. Cancel before renewal. USD; taxes may apply.</p>
          <nav className="cf-legal" aria-label="Subscription information"><a href="/terms" target="_blank" rel="noreferrer">Terms</a><a href="/privacy" target="_blank" rel="noreferrer">Privacy</a><a href="/support" target="_blank" rel="noreferrer">Support</a></nav>
        </> : step < 4 ? <a className="cf-free-link" href={APP_STORE_URL!}>Or get Sted free</a> : <a className="cf-free-link" href="/support">Need help?</a>}
        </>}
      </footer>
    </dialog>}
  </div>
}
