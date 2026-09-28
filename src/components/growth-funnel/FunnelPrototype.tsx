import { useEffect, useRef, useState } from 'react'
import { Landing4CPreview } from '../landing-4c/Landing4CPreview'
import { APP_STORE_URL } from '../landing-4c/app-links'
import { annualComparison, getPeriod } from './funnel-pricing'
import './FunnelPrototype.css'

type Variant = 'a' | 'b'
type Period = 'weekly' | 'monthly' | 'annual'
type Sample = 'coffee' | 'travel'
const STORE = APP_STORE_URL!
const sources = [
  { name: 'Instagram', icon: 'instagram' }, { name: 'X', icon: 'x' },
  { name: 'Safari', icon: 'web' }, { name: 'YouTube', icon: 'youtube' },
  { name: 'Notes', letter: 'N' }, { name: 'Messages', letter: '…' },
]
const volumes = [
  { value: 'light', title: 'A few each week', hint: 'Up to about 50 a month' },
  { value: 'regular', title: 'A few every day', hint: 'About 51–100 a month' },
  { value: 'heavy', title: 'More than I can keep up with', hint: 'Over 100 a month' },
]
const pains = [
  { value: 'forget', title: 'I save it. Then forget it.', icon: 'media' },
  { value: 'find', title: 'I can never find it again.', icon: 'web-page' },
  { value: 'scattered', title: 'It’s all over the place.', icon: 'projects' },
  { value: 'use', title: 'I rarely get around to using it.', icon: 'summary-note' },
]
const annual = annualComparison()
const periods = ([
  { id: 'weekly', label: 'Weekly', unit: '/ week', detail: 'Billed every week' },
  { id: 'monthly', label: 'Monthly', unit: '/ month', detail: 'Billed every month' },
  { id: 'annual', label: 'Annual', unit: '/ year', detail: `${annual.monthlyEquivalent} / month, billed yearly` },
] as const).map(item => ({ ...item, price: getPeriod(item.id).price, renewal: getPeriod(item.id).renewal }))

function Arrow() { return <span aria-hidden="true">↗</span> }
function Check() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> }
function Icon({ name }: { name: string }) { return <img className="gf-icon" src={`/content/landing-4c/icons/${name}.webp`} alt="" /> }

function SaveStory({ compact = false }: { compact?: boolean }) {
  return <div className={`gf-story${compact ? ' gf-story--compact' : ''}`} aria-label="A saved link becomes a summary, organized ideas and a recap">
    <div className="gf-story-link"><span className="gf-link-icon">↗</span><div><small>A LINK WORTH KEEPING</small><strong>That thing you’ll need later.</strong></div><span className="gf-mini-check"><Check /></span></div>
    <div className="gf-story-thread" aria-hidden="true"><span /><span /><span /></div>
    <div className="gf-mascot-home"><img src="/sted-mascot.svg" alt="Sted" /><span className="gf-ai-tag">A little AI. A lot less effort.</span></div>
    <div className="gf-story-outputs">
      <div><Icon name="summary-note" /><strong>Understood.</strong><span>Summary & key ideas</span></div>
      <div><Icon name="projects" /><strong>Organized.</strong><span>Library & projects</span></div>
    </div>
    <div className="gf-chat-note"><Icon name="chat" /><span>Ask your saves a question.<small>Chat is available on the web dashboard.</small></span></div>
  </div>
}

function SampleSave({ sample, onChoose }: { sample: Sample | null; onChoose: (sample: Sample) => void }) {
  return <div className="gf-sample">
    <div className="gf-sample-choices" aria-label="Choose an example save">
      <button type="button" aria-pressed={sample === 'coffee'} onClick={() => onChoose('coffee')}><img src="/content/landing-4c/pour-over-method.webp" alt="Pour-over coffee" /><span>A coffee tutorial<small>YouTube</small></span><span className="gf-sample-plus">{sample === 'coffee' ? '✓' : '+'}</span></button>
      <button type="button" aria-pressed={sample === 'travel'} onClick={() => onChoose('travel')}><img src="/content/landing-4c/fushimi-inari-kyoto.webp" alt="Kyoto torii gates" /><span>A place for later<small>Instagram</small></span><span className="gf-sample-plus">{sample === 'travel' ? '✓' : '+'}</span></button>
    </div>
    <div className={`gf-sample-result${sample ? ' is-ready' : ''}`} aria-live="polite">
      <img src="/sted-mascot.svg" alt="" className="gf-sample-mascot" />
      {sample ? <div key={sample}><div className="gf-result-kicker"><Check /> SAVED TO YOUR LIBRARY</div><h3>{sample === 'coffee' ? 'A better morning brew.' : 'Your next Kyoto stop.'}</h3><p>{sample === 'coffee' ? 'A pour-over tutorial, kept with your coffee ideas. The main points are easier to come back to.' : 'Fushimi Inari’s torii gates, kept with your Japan ideas. A place worth finding again.'}</p><div className="gf-tags"><span>{sample === 'coffee' ? 'Coffee' : 'Japan'}</span><span>{sample === 'coffee' ? 'How-to' : 'Travel'}</span><span>Ready for later</span></div></div> : <div><h3>Send a little inspiration my way.</h3><p>Pick one of the saves above to see the idea.</p></div>}
    </div>
    <p className="gf-example-note">Example preview · no link is sent or processed.</p>
  </div>
}

export function FunnelPrototype() {
  const initialVariant: Variant = window.location.pathname.endsWith('/b') ? 'b' : 'a'
  const [variant, setVariant] = useState<Variant>(initialVariant)
  const [open, setOpen] = useState(new URLSearchParams(window.location.search).get('open') === '1')
  const [step, setStep] = useState(0)
  const [selectedSources, setSources] = useState<string[]>([])
  const [volume, setVolume] = useState<string | null>(null)
  const [pain, setPain] = useState<string | null>(null)
  const [sample, setSample] = useState<Sample | null>(null)
  const [period, setPeriod] = useState<Period>('monthly')
  const [device, setDevice] = useState<'iphone' | 'desktop'>('iphone')
  const [activationNotice, setActivationNotice] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const planStep = variant === 'a' ? 4 : 3
  const stage = step > planStep + 1 ? 'success' : step > planStep ? 'checkout' : step === planStep ? 'plans' : step === 0 ? 'intro' : variant === 'a' && step === 1 ? 'sources' : step === planStep - 2 ? 'volume' : 'pain'
  const selectedPeriod = periods.find(item => item.id === period)!
  const recommendation = volume === 'light' || volume === 'unknown' ? 'Free is a good place to start.' : 'A little more room could go a long way.'

  useEffect(() => {
    const node = dialog.current
    if (!open || !node) return
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    node.showModal()
    heading.current?.focus()
    return () => {
      node.close()
      document.body.style.overflow = oldOverflow
      returnFocus.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (open) {
      scroller.current?.scrollTo({ top: 0 })
      heading.current?.focus()
    }
  }, [step, open])

  function switchVariant(next: Variant) {
    setVariant(next); setStep(0); setSources([]); setVolume(null); setPain(null); setSample(null); setPeriod('monthly'); setDevice('iphone'); setActivationNotice(false)
    window.history.replaceState(null, '', `/internal/funnel/${next}`)
  }
  function toggleSource(name: string) {
    setSources(current => name === 'Everywhere' ? current.includes(name) ? [] : [name] : current.includes(name) ? current.filter(s => s !== name) : [...current.filter(s => s !== 'Everywhere'), name])
  }
  function start() { setOpen(true) }
  function next() { setStep(current => current + 1) }
  const title = stage === 'intro' ? variant === 'a' ? 'You save it.\nSted makes it useful.' : 'Give Sted a link.\nSee what comes back.'
    : stage === 'sources' ? 'Where do your\nsaves end up?'
    : stage === 'volume' ? 'A little saving,\nor a lot?'
    : stage === 'pain' ? 'And then…\nwhat happens?'
    : stage === 'plans' ? 'Make room for\nwhat matters.'
    : stage === 'checkout' ? 'Your next step,\nall spelled out.' : 'One last step.\nMake Pro yours.'

  return <div className="gf-review l4c-page">
    <aside className="gf-review-bar" aria-label="Prototype review controls">
      <div><span className="gf-review-dot" /> STED / FUNNEL STUDY <small>Local prototype · no live payments</small></div>
      <div className="gf-variant-switch" aria-label="Compare prototypes"><button type="button" aria-pressed={variant === 'a'} onClick={() => switchVariant('a')}>A <span>Show me</span></button><button type="button" aria-pressed={variant === 'b'} onClick={() => switchVariant('b')}>B <span>Try a save</span></button></div>
      <button type="button" className="gf-review-open" onClick={start}>Open flow <Arrow /></button>
    </aside>
    <Landing4CPreview />
    {open && <dialog ref={dialog} className={`gf-dialog gf-dialog--${variant} gf-stage--${stage}`} aria-labelledby="gf-title" onCancel={(event) => { event.preventDefault(); setOpen(false) }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setOpen(false) } }}>
      <div className="gf-layout">
        <aside className="gf-aside">
          <img className="gf-wordmark" src="/brand/sted-primary-horizontal.svg" alt="Sted" />
          {stage === 'intro' ? variant === 'a' ? <><p className="gf-aside-caption">From “saved somewhere”<br />to <em>right here.</em></p><SaveStory /></> : <><p className="gf-aside-caption">A small save.<br /><em>A useful start.</em></p><div className="gf-demo-mascot"><span className="gf-sticker">Send it my way.</span><img src="/sted-mascot.svg" alt="Sted" /><span className="gf-demo-orbit orbit-one"><Icon name="summary-note" /></span><span className="gf-demo-orbit orbit-two"><Icon name="projects" /></span><span className="gf-demo-orbit orbit-three"><Icon name="chat" /></span></div><p className="gf-aside-bottom">Your links, understood and organized.<br />Your ideas, ready to come back to.</p></>
            : <><p className="gf-aside-caption">Less collecting.<br /><em>More connecting.</em></p><SaveStory compact /><div className="gf-aside-bottom"><span className="gf-label">YOUR STED, YOUR PACE</span><p>{volume === 'heavy' ? 'A home for your daily discoveries.' : pain === 'forget' ? 'Good ideas deserve a second look.' : pain === 'find' ? 'Less searching. More finding.' : 'Keep the things worth coming back to.'}</p></div></>}
          <div className="gf-aside-foot">Everything you save. Finally useful.</div>
        </aside>
        <div className="gf-main">
          <header className="gf-top"><button type="button" className="gf-back" onClick={() => step === 0 ? setOpen(false) : setStep(step - 1)}>← <span>{step === 0 ? 'Back to Sted' : 'Back'}</span></button><span className="gf-step-label">{step <= planStep ? `${step + 1} / ${planStep + 1}` : 'PREVIEW ONLY'}</span><button type="button" className="gf-close" aria-label="Close onboarding" onClick={() => setOpen(false)}>×</button></header>
          <div className="gf-progress" aria-label={`Step ${Math.min(step + 1, planStep + 1)} of ${planStep + 1}`}><span style={{ width: `${Math.min((step + 1) / (planStep + 1), 1) * 100}%` }} /></div>
          <div className="gf-scroll" ref={scroller}>
            <div className="gf-step-content" key={`${variant}-${stage}`}>
              <p className="gf-eyebrow">{stage === 'intro' ? 'A LITTLE INTRODUCTION' : stage === 'sources' ? 'SOUNDS FAMILIAR?' : stage === 'volume' ? 'NO NEED TO COUNT' : stage === 'pain' ? 'YOU’RE NOT THE ONLY ONE' : stage === 'plans' ? 'FREE OR PRO. ALWAYS YOUR CHOICE.' : stage === 'checkout' ? 'CHECKOUT PREVIEW · NO CHARGE' : 'ACTIVATION PREVIEW · NO PURCHASE MADE'}</p>
              <h2 id="gf-title" ref={heading} tabIndex={-1}>{title.split('\n').map((line, index) => <span key={line} className={index === 1 ? 'gf-title-last' : ''}>{line}</span>)}</h2>

              {stage === 'intro' && (variant === 'a' ? <>
                <p className="gf-lede">Send Sted a link. AI helps you understand it, organize it, and come back to what matters.</p>
                <ol className="gf-explainer">
                  <li><span>01</span><div><strong>Share a link.</strong><p>From the apps you already use.</p></div><Icon name="web-page" /></li>
                  <li><span>02</span><div><strong>Get the useful parts.</strong><p>Summaries, key ideas, and a place in your library.</p></div><Icon name="summary-note" /></li>
                  <li><span>03</span><div><strong>Come back. Go deeper.</strong><p>Revisit saves in the app. Chat with them on the <b>web dashboard.</b></p></div><Icon name="chat" /></li>
                </ol>
                <div className="gf-next-note"><span>THEN, MAKE IT YOURS</span><p>Three quick questions to find your fit.</p></div>
              </> : <><p className="gf-lede">Try an example. No account, no typing.<br />Just a little “oh, that’s useful.”</p><SampleSave sample={sample} onChoose={setSample} /><div className="gf-demo-chat"><Icon name="chat" /><p>Want to ask a follow-up?<br /><strong>Chat with your saves on the web dashboard.</strong><small>Chat isn’t in the iPhone app yet.</small></p></div></>)}

              {stage === 'sources' && <><p className="gf-lede">Bookmarks, tabs, messages to yourself…<br />Pick all the places that sound familiar.</p><div className="gf-sources">{sources.map(source => <button type="button" key={source.name} aria-pressed={selectedSources.includes(source.name)} onClick={() => toggleSource(source.name)}>{source.icon ? <img src={`/brand/source-icons/${source.icon}-tile.svg`} alt="" /> : <span className={`gf-source-letter gf-source-${source.name.toLowerCase()}`}>{source.letter}</span>}<span>{source.name}</span><span className="gf-selection-mark">{selectedSources.includes(source.name) && <Check />}</span></button>)}</div><button type="button" className="gf-everywhere" aria-pressed={selectedSources.includes('Everywhere')} onClick={() => toggleSource('Everywhere')}>Honestly? Everywhere. <span>{selectedSources.includes('Everywhere') ? '✓' : '+'}</span></button><p className="gf-small-note">You choose what to share with Sted. No accounts are connected here.</p></>}

              {stage === 'volume' && <><p className="gf-lede">How much do you usually save?<br />A rough guess is more than enough.</p><div className="gf-options" role="group" aria-label="Saving frequency">{volumes.map(option => <button type="button" aria-pressed={volume === option.value} key={option.value} onClick={() => setVolume(option.value)}><span className={`gf-volume-art gf-volume-${option.value}`} aria-hidden="true"><i /><i /><i /></span><span><strong>{option.title}</strong><small>{option.hint}</small></span><span className="gf-radio">{volume === option.value && <span />}</span></button>)}</div><button type="button" className="gf-unsure" aria-pressed={volume === 'unknown'} onClick={() => setVolume('unknown')}>{volume === 'unknown' ? '✓ ' : ''}I’m not sure yet</button></>}

              {stage === 'pain' && <><p className="gf-lede">What’s the hardest part about the things you save?</p><div className="gf-options gf-pain-options" role="group" aria-label="What happens to your saves">{pains.map(option => <button type="button" key={option.value} aria-pressed={pain === option.value} onClick={() => setPain(option.value)}><Icon name={option.icon} /><strong>{option.title}</strong><span className="gf-radio">{pain === option.value && <span />}</span></button>)}</div><button type="button" className="gf-unsure" aria-pressed={pain === 'none'} onClick={() => setPain('none')}>{pain === 'none' ? '✓ ' : ''}None of these, I’m just curious</button></>}

              {stage === 'plans' && <>
                <p className="gf-lede gf-plan-lede">{recommendation}</p>
                <div className="gf-personal-result"><span className="gf-result-dot" /><p>{pain === 'forget' ? 'Your recap brings saved ideas back into view.' : pain === 'find' ? 'Your links belong in one searchable library.' : pain === 'use' ? 'Summaries give you a shorter way back in.' : 'Keep your discoveries together, ready for later.'}</p></div>
                <div className="gf-free-card"><div><strong>Sted Free <span>$0</span></strong><p>Start your library. Find your rhythm.</p></div><a href={STORE}>Get Free <Arrow /></a></div>
                <div className="gf-pro-heading"><div><span className="gf-pro-pill">STED PRO</span><h3>For a bigger saving habit.</h3></div><Icon name="projects" /></div>
                <p className="gf-pro-benefits"><Check /> More saves <span>·</span> More AI processing</p>
                <div className="gf-periods" role="group" aria-label="Pro billing period">{periods.map(option => <button type="button" key={option.id} aria-pressed={period === option.id} onClick={() => setPeriod(option.id)}><span className="gf-radio">{period === option.id && <span />}</span><span className="gf-period-name"><strong>{option.label}{option.id === 'annual' && <span className="gf-save-badge">Save {Math.round(annual.savingsPercent)}%</span>}</strong><small>{option.detail}</small></span><span className="gf-price">{option.price}<small>{option.unit}</small></span></button>)}</div>
                <p className="gf-pricing-note">USD. Annual savings compared with 12 monthly payments.<br />Preview offer: Free and Pro save limits still to be confirmed.</p>
              </>}

              {stage === 'checkout' && <>
                <p className="gf-lede">Here’s what happens when you choose Pro.</p><div className="gf-order"><span>Sted Pro · {selectedPeriod.label}</span><strong>{selectedPeriod.price}<small>{selectedPeriod.unit}</small></strong><p>{selectedPeriod.renewal}<br />Renews automatically. Cancel before your next renewal.</p></div>
                <ol className="gf-next-steps"><li><span>1</span><div><strong>Complete your purchase</strong><p>RevenueCat + Stripe checkout. Final total, including any applicable tax, shown before payment.</p></div></li><li><span>2</span><div><strong>Get your activation link</strong><p>On the confirmation page and in your email.</p></div></li><li><span>3</span><div><strong>Open Sted. Activate Pro.</strong><p>Install Sted first if you need to, then return to your activation link.</p></div></li></ol><p className="gf-preview-notice">This is a checkout preview. No payment details are collected and no subscription is created.</p>
              </>}

              {stage === 'success' && <>
                <p className="gf-lede">After payment, your next stop is Sted.</p>
                <div className="gf-device-switch" aria-label="Preview activation instructions"><button type="button" aria-pressed={device === 'iphone'} onClick={() => setDevice('iphone')}>On an iPhone</button><button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}>On desktop</button></div>
                <div className="gf-activation-card"><span className="gf-activation-icon"><Icon name="media" /></span><h3>{device === 'iphone' ? 'Already have Sted?' : 'Bring Pro to your iPhone.'}</h3><p>{device === 'iphone' ? 'Open the app with your activation link to connect your purchase.' : 'Open your activation email on your iPhone. Download Sted if you need to, then tap the activation link.'}</p>{device === 'iphone' && <button type="button" className="gf-primary" onClick={() => setActivationNotice(true)}>Open Sted and activate Pro <Arrow /></button>}<div className="gf-install"><span>{device === 'iphone' ? 'Need the app first?' : 'Sted is available for iPhone.'}</span><a href={STORE}><img src="/brand/app-store-badge.svg" alt="Download Sted on the App Store" /></a><small>After installing, come back to your activation link.</small></div></div>
                <p className="gf-preview-notice" role="status">{activationNotice ? 'No activation happens in this preview. The live flow will use the redemption link supplied by RevenueCat.' : 'Preview only. No purchase was made and no activation email was sent.'}</p>
              </>}
            </div>
          </div>
          <footer className="gf-bottom">
            {stage === 'plans' ? <><button type="button" className="gf-primary" onClick={next}>Continue with Pro <Arrow /></button><p className="gf-renewal">{selectedPeriod.renewal} Auto-renews.<br />Cancel before your next renewal. Taxes may apply.</p><div className="gf-legal"><a href="/terms" target="_blank" rel="noreferrer">Terms</a><span>·</span><a href="/privacy" target="_blank" rel="noreferrer">Privacy</a><span>·</span><a href="/support" target="_blank" rel="noreferrer">Support</a></div></>
            : stage === 'checkout' ? <><button type="button" className="gf-primary" onClick={next}>Preview activation <Arrow /></button><span className="gf-footnote">No charge. This is the next screen preview.</span></>
            : stage === 'success' ? <><button type="button" className="gf-primary" onClick={() => { setStep(0); setActivationNotice(false) }}>Back to the beginning ↺</button><a className="gf-free-link" href="/support">Need help? Contact support</a></>
            : <><button type="button" className="gf-primary" disabled={stage === 'sources' ? !selectedSources.length : stage === 'volume' ? !volume : stage === 'pain' ? !pain : variant === 'b' && !sample} onClick={next}>{stage === 'intro' ? variant === 'a' ? 'Find my fit' : 'Make it mine' : stage === 'pain' ? 'See my options' : 'Continue'} <Arrow /></button><a className="gf-free-link" href={STORE}>Just want the app? <strong>Get Sted free</strong></a></>}
          </footer>
        </div>
      </div>
    </dialog>}
  </div>
}
