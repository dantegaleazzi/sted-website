import { useState, type ReactNode } from 'react'
import instagramImage from '../source-cards/assets/temporary-instagram-image.svg'
import placePhoto from '../source-cards/assets/temporary-place-photo.svg'
import tiktokFrame from '../source-cards/assets/temporary-tiktok-frame.svg'
import './InternalSourceCardQA.css'

type CardKind = 'x' | 'youtube' | 'github' | 'article' | 'instagram' | 'document' | 'podcast' | 'discussion' | 'web'
type CardState = 'normal' | 'hover' | 'saved' | 'loading'

type QACard = {
  kind: CardKind
  source: string
  typeLabel: string
  title: string
  body: string
  metadata: string
  status: 'Definitive' | 'Exploratory'
}

const cards: QACard[] = [
  { kind: 'x', source: 'X', typeLabel: 'Post', title: 'The best systems make the next decision smaller.', body: 'A useful idea is only useful if you can find it when the work begins.', metadata: '@samplemaker · 2h', status: 'Definitive' },
  { kind: 'youtube', source: 'YouTube', typeLabel: 'Video', title: 'Building a calmer creative workflow', body: 'A fictional walkthrough of a small studio system.', metadata: 'Sample Studio · 12:48', status: 'Exploratory' },
  { kind: 'github', source: 'GitHub', typeLabel: 'Repository', title: 'sample-labs / quiet-tools', body: 'Small, readable utilities for focused work.', metadata: 'TypeScript · updated today', status: 'Exploratory' },
  { kind: 'article', source: 'Article', typeLabel: 'Article & blog', title: 'The craft of paying attention', body: 'What changes when useful things have a clear place to return to.', metadata: 'Common Ground · 8 min read', status: 'Definitive' },
  { kind: 'instagram', source: 'Instagram', typeLabel: 'Photo & reel', title: 'A desk, good light, and nowhere else to be.', body: 'A fictional moment saved for a future workspace project.', metadata: '@sample.weekends · today', status: 'Exploratory' },
  { kind: 'document', source: 'Notes', typeLabel: 'Note & document', title: 'Ideas for the next product review', body: 'Questions, decisions and loose ends collected in one place.', metadata: 'Private note · edited 4m ago', status: 'Definitive' },
  { kind: 'podcast', source: 'Podcast', typeLabel: 'Audio', title: 'Doing good work at a human pace', body: 'A fictional conversation about attention and creative routines.', metadata: 'Small Hours · 38 min', status: 'Exploratory' },
  { kind: 'discussion', source: 'Discussion', typeLabel: 'Conversation', title: 'What did you remove that made the product better?', body: '“We stopped adding settings and made the default genuinely useful.”', metadata: 'Sample community · 42 replies', status: 'Definitive' },
  { kind: 'web', source: 'Web', typeLabel: 'Web page', title: 'Objects for a slower day', body: 'A compact preview of a fictional independent studio website.', metadata: 'sample.studio · saved today', status: 'Definitive' },
]

function SourceMark({ kind }: { kind: CardKind }) {
  const paths: Partial<Record<CardKind, ReactNode>> = {
    x: <path d="M5 4l14 16M19 4 5 20" />,
    youtube: <><rect x="3" y="6" width="18" height="12" rx="4" /><path d="m10 9 5 3-5 3Z" className="fill" /></>,
    github: <path d="M12 2a10 10 0 0 0-3.2 19.5v-2.2c-2.6.6-3.2-1.1-3.2-1.1-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.8.8.1-.6.4-1.1.7-1.4-2.1-.2-4.3-1.1-4.3-4.8 0-1.1.4-1.9 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.7.7 1 1.5 1 2.6 0 3.7-2.2 4.6-4.3 4.8.4.3.7.9.7 1.8v2.9A10 10 0 0 0 12 2Z" className="fill" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" className="fill" /></>,
  }
  if (paths[kind]) return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[kind]}</svg>
  return <span aria-hidden="true">{kind === 'article' ? 'Aa' : kind === 'document' ? '▤' : kind === 'podcast' ? '◖' : kind === 'discussion' ? '◌' : '◎'}</span>
}

function Preview({ kind }: { kind: CardKind }) {
  if (kind === 'x') return <blockquote className="qa-quote">“Keep the idea close enough to use, not just close enough to remember.”</blockquote>
  if (kind === 'youtube') return <div className="qa-media qa-media--video"><div className="qa-landscape"><span /><span /></div><b className="qa-play">▶</b><small>FICTIONAL VIDEO PREVIEW</small></div>
  if (kind === 'github') return <pre className="qa-code"><code><span>export</span> function save(idea) {'{'}{`\n  return library.add(idea)\n`}{'}'}</code></pre>
  if (kind === 'article') return <div className="qa-media qa-media--article"><span>FIELD NOTES</span><strong>Attention is a design material.</strong></div>
  if (kind === 'instagram') return <div className="qa-media qa-media--photo"><span className="qa-photo-sun" /><span className="qa-photo-desk" /><small>SAMPLE IMAGE</small></div>
  if (kind === 'document') return <div className="qa-document"><strong>PRODUCT REVIEW / SAMPLE</strong><span /><span /><span /><span /></div>
  if (kind === 'podcast') return <div className="qa-wave" aria-label="Sample waveform">{[12, 24, 17, 34, 22, 40, 28, 16, 31, 20, 37, 14].map((height, index) => <i key={index} style={{ height }} />)}</div>
  if (kind === 'discussion') return <div className="qa-thread"><p><b>Sample member</b><span>What made the difference?</span></p><p><b>Sample reply</b><span>A clearer default and fewer choices.</span></p></div>
  return <div className="qa-web-preview"><div className="qa-browser-bar"><i /><i /><i /><span>sample.studio</span></div><div className="qa-web-body"><strong>Made with care.<br />Kept for years.</strong><span /></div></div>
}

function SourceQACard({ card, showPreview, state }: { card: QACard; showPreview: boolean; state: CardState }) {
  const loading = state === 'loading'
  return <article className={`qa-card qa-card--${card.kind} qa-card--state-${state}`}>
    <header className="qa-card__header">
      <span className="qa-card__mark"><SourceMark kind={card.kind} /></span>
      <span className="qa-card__source"><strong>{card.source}</strong><small>{card.typeLabel}</small></span>
      <span className="qa-card__saved">{state === 'saved' ? '✓ saved' : 'saved'}</span>
    </header>
    {loading ? <div className="qa-skeleton" aria-label="Loading card"><i /><i /><i /><i /></div> : <>
      {showPreview && <Preview kind={card.kind} />}
      <div className="qa-card__body">
        <h3 contentEditable suppressContentEditableWarning>{card.title}</h3>
        <p contentEditable suppressContentEditableWarning>{card.body}</p>
      </div>
      <footer className="qa-card__footer"><span contentEditable suppressContentEditableWarning>{card.metadata}</span><span>•••</span></footer>
    </>}
  </article>
}

type MediaTreatment = {
  kind: 'image' | 'story' | 'feature'
  source: 'instagram' | 'youtube' | 'web'
  image: string
  alt: string
  title?: string
  metadata?: string
}

const mediaTreatments: MediaTreatment[] = [
  { kind: 'image', source: 'instagram', image: instagramImage, alt: 'Fictional illustrated studio scene used as sample content' },
  { kind: 'story', source: 'youtube', image: tiktokFrame, alt: 'Fictional vertical creator video used as sample content', metadata: '00:42' },
  { kind: 'feature', source: 'web', image: placePhoto, alt: 'Fictional landscape used as a sample website image', title: 'A new way to see familiar places', metadata: 'sample.world' },
]

function MediaOnlyCard({ treatment, state }: { treatment: MediaTreatment; state: CardState }) {
  if (state === 'loading') return <article className="qa-media-card qa-media-card--loading" aria-label="Loading media-only card"><div className="qa-media-card__skeleton" /></article>
  return <article className={`qa-media-card qa-media-card--${treatment.kind} qa-media-card--state-${state}`}>
    <img src={treatment.image} alt={treatment.alt} />
    <span className={`qa-media-card__source qa-media-card__source--${treatment.source}`} aria-label={treatment.source}>{treatment.source === 'instagram' ? '◎' : treatment.source === 'youtube' ? '▶' : '↗'}</span>
    {treatment.kind === 'story' && <span className="qa-media-card__duration">{treatment.metadata}</span>}
    {treatment.kind === 'feature' && <div className="qa-media-card__caption"><h3 contentEditable suppressContentEditableWarning>{treatment.title}</h3><p contentEditable suppressContentEditableWarning>{treatment.metadata}</p></div>}
    {state === 'saved' && <span className="qa-media-card__saved">✓ saved</span>}
  </article>
}

function SegmentedControl<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return <fieldset className="qa-control"><legend>{label}</legend><div>{options.map(option => <button key={option} type="button" className={value === option ? 'is-active' : ''} onClick={() => onChange(option)}>{option}</button>)}</div></fieldset>
}

export function InternalSourceCardQA() {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [preview, setPreview] = useState<'with preview' | 'without preview'>('with preview')
  const [state, setState] = useState<CardState>('normal')
  return <main className="source-qa">
    <header className="source-qa__intro">
      <div><p className="source-qa__eyebrow">INTERNAL · SAMPLE CONTENT ONLY</p><h1>Source card system</h1><p>Nine kinds of save, reviewed as one coherent system. Click any title, description or metadata line to edit it in place.</p></div>
      <a href="/">← Back to website</a>
    </header>

    <section className="source-qa__controls" aria-label="Card preview controls">
      <SegmentedControl label="Viewport" value={viewport} options={['desktop', 'mobile'] as const} onChange={setViewport} />
      <SegmentedControl label="Content" value={preview} options={['with preview', 'without preview'] as const} onChange={setPreview} />
      <SegmentedControl label="State" value={state} options={['normal', 'hover', 'saved', 'loading'] as const} onChange={setState} />
    </section>

    <section className="source-qa__legend" aria-label="Component status">
      <p><span className="qa-status qa-status--final">Definitive</span> Base anatomy, hierarchy, spacing and tokens.</p>
      <p><span className="qa-status qa-status--explore">Exploratory</span> Source-specific preview treatment pending approval.</p>
    </section>

    <div className={`source-qa__stage source-qa__stage--${viewport}`}>
      <section className="source-qa__grid" aria-label="Nine source card variants">
        {cards.map(card => <div className="source-qa__item" key={card.kind}><div className="source-qa__item-label"><span>{card.typeLabel}</span><span className={`qa-status ${card.status === 'Definitive' ? 'qa-status--final' : 'qa-status--explore'}`}>{card.status}</span></div><SourceQACard card={card} showPreview={preview === 'with preview'} state={state} /></div>)}
      </section>
    </div>

    <section className="source-qa__media-section" aria-labelledby="qa-media-title">
      <header><div><p className="source-qa__eyebrow">MEDIA-FIRST · EXPLORATORY</p><h2 id="qa-media-title">Sometimes the image is the card.</h2></div><p>These treatments remove the standard white anatomy when the saved visual carries the meaning. Source identification stays small and secondary.</p></header>
      <div className={`source-qa__media-stage source-qa__media-stage--${viewport}`}>
        {mediaTreatments.map(treatment => <div className="source-qa__media-item" key={treatment.kind}><div className="source-qa__item-label"><span>{treatment.kind === 'image' ? 'Pure image' : treatment.kind === 'story' ? 'Vertical media' : 'Image + context'}</span><span className="qa-status qa-status--explore">Exploratory</span></div><MediaOnlyCard treatment={treatment} state={state} /></div>)}
      </div>
    </section>

    <section className="source-qa__specs" aria-labelledby="qa-specs-title">
      <div><p className="source-qa__eyebrow">SYSTEM NOTES</p><h2 id="qa-specs-title">One anatomy, nine content treatments.</h2></div>
      <dl>
        <div><dt>Card width</dt><dd>360px desktop · 100% mobile</dd></div>
        <div><dt>Padding</dt><dd>16px header · 18px body</dd></div>
        <div><dt>Radius</dt><dd>18px</dd></div>
        <div><dt>Spacing</dt><dd>4 · 8 · 12 · 16 · 24px</dd></div>
        <div><dt>Border</dt><dd>#E8E7E4 · 1px</dd></div>
        <div><dt>Shadow</dt><dd>0 12px 30px / 6% ink</dd></div>
      </dl>
      <div className="source-qa__tokens"><span><i className="token-ink" />Ink #141313</span><span><i className="token-yellow" />Yellow #FFD400</span><span><i className="token-white" />White #FFFFFF</span><span><i className="token-subtle" />Subtle #F7F7F5</span><span><i className="token-border" />Border #E8E7E4</span><span><i className="token-secondary" />Secondary #6F6D69</span></div>
    </section>
  </main>
}
