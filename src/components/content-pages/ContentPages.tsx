import { useEffect, useRef, type ReactNode } from 'react'
import { SiteFooter } from '../footer/SiteFooter'
import { AppStoreBadge } from '../landing-4c/Landing4CSections'
import { FOUNDING, foundingTerms } from '../growth-funnel/founding-offer'
import { PLAN_CAPACITY } from '../growth-funnel/funnel-pricing'
import { PAGE_META } from '../../page-meta'
import '../landing-4c/landing-4c-tokens.css'
import './ContentPages.css'

/**
 * Long-form pages for search and AI assistants, in the landing's look: /how-to-use (the guide) and
 * /pocket-alternative. Every claim here has to be true of the live app; prices and limits come from
 * the same modules as Pricing. Both are prerendered at build time (scripts/prerender.mjs).
 */

const APP = '/content/landing-4c/app'
const n = (value: number) => value.toLocaleString('en-US')
const free = PLAN_CAPACITY.free
const pro = PLAN_CAPACITY.pro
const offer = foundingTerms()
const UPDATED = 'September 30, 2026'

type Media = { kind: 'video'; src: string; poster: string; alt: string; island?: boolean } | { kind: 'image'; src: string; alt: string }

/** A screen recording that plays only while on screen, and never with reduced motion. */
function PhoneVideo({ src, poster, alt, island }: { src: string; poster: string; alt: string; island?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) node.play().catch(() => {}); else node.pause() }, { threshold: 0.4 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <>
    <video ref={ref} className="cp-phone-shot" muted loop playsInline preload="none" poster={poster} aria-label={alt}><source src={src} type="video/mp4" /></video>
    {island && <span className="cp-phone-island" aria-hidden="true" />}
  </>
}

function Phone({ media }: { media: Media }) {
  return <div className="cp-phone">
    {media.kind === 'video'
      ? <PhoneVideo src={media.src} poster={media.poster} alt={media.alt} island={media.island} />
      : <img className="cp-phone-shot" src={media.src} alt={media.alt} width={600} height={1304} loading="lazy" decoding="async" />}
  </div>
}

/** Header, one article column, the site footer. */
function ContentShell({ children }: { children: ReactNode }) {
  return <div className="cp-page">
    <header className="cp-header">
      <a href="/" aria-label="Sted home"><img className="cp-logo" src="/brand/sted-primary-horizontal.svg" alt="Sted" /></a>
      <AppStoreBadge height={40} />
    </header>
    <main className="cp-main">{children}</main>
    <SiteFooter />
  </div>
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

function ClosingCta({ title }: { title: ReactNode }) {
  return <section className="cp-cta">
    <h2 className="cp-h2">{title}</h2>
    <p className="cp-lede">Free on iPhone, with up to {n(free.saves)} saves and {n(free.aiSavesPerMonth)} AI summaries a month. No card needed.</p>
    <AppStoreBadge height={52} />
  </section>
}

// ---------------------------------------------------------------------------------------------------
// /how-to-use

type Step = { title: string; body: string[]; tip?: string; prompts?: string[]; media?: Media }

const STEPS: Step[] = [
  {
    title: 'Get Sted on your iPhone',
    body: [`Download Sted free from the App Store (iPhone, iOS 17 or later) and create your account. The free plan includes up to ${n(free.saves)} saves and ${n(free.aiSavesPerMonth)} AI summaries a month.`],
  },
  {
    title: 'Save from any app',
    body: [
      'Found something worth keeping? In Instagram, YouTube, X, Spotify, Safari or any other app, tap Share, then Sted. You’ll see “Saved” and stay right where you were: no folders to pick, no tags to type.',
      'You can also paste a link straight into Sted.',
    ],
    tip: 'Don’t see Sted in the share sheet? Scroll the row of apps to the end, tap More, and add Sted to your favorites so it’s always one tap away.',
    media: { kind: 'video', src: `${APP}/share.mp4`, poster: `${APP}/share-poster.webp`, island: true, alt: 'Sharing an X post to Sted from the iOS share sheet' },
  },
  {
    title: 'Read the summary and key ideas',
    body: ['Sted reads every save for you. Open one to see what it’s about in a few lines, the key ideas worth remembering and the topics it belongs to, without going back through the whole video, thread or episode.'],
    media: { kind: 'image', src: `${APP}/summary-dan-koe.webp`, alt: 'A saved X post in Sted with its summary and key ideas' },
  },
  {
    title: 'See what matters in The Recap',
    body: ['Every 10 saves, Sted puts together The Recap and brings your saves back to you: Sted’s Picks, the topics you’ve been saving around and your latest saves. It’s the easiest way to actually use what you saved instead of forgetting it.'],
    media: { kind: 'image', src: `${APP}/recap.webp`, alt: 'The Recap in Sted with Sted’s Picks, topics and recent saves' },
  },
  {
    title: 'Ask Sted anything',
    body: [
      'Ask Sted is a chat with everything you saved. Ask a question, summarize today’s saves or recap your week. Every answer comes with the saves it’s based on, so you can open the original in one tap, and your conversations stay in History.',
      'You can also save a link right from the chat.',
    ],
    prompts: ['Summarize what I saved this week.', 'What did I save about pricing?', 'Which podcasts did I save this month?', 'What are the big ideas in my AI saves?'],
    media: { kind: 'video', src: `${APP}/chat.mp4`, poster: `${APP}/chat-poster.webp`, alt: 'Asking Sted to summarize the week and getting an answer with the saves it came from' },
  },
  {
    title: 'Find anything later',
    body: ['Search your whole library when you need something again, and group saves into projects for the things you’re working on.'],
  },
  {
    title: 'Go Pro when you save a lot',
    body: [
      `Sted Pro gives you unlimited saves, ${n(pro.aiSavesPerMonth)} AI summaries a month and extended chat. The first ${FOUNDING.spots} members get it for ${offer.price} a year instead of ${offer.regular}.`,
      'Buy it on the web, then open the confirmation email on your iPhone and tap Redeem to unlock Pro in the app.',
    ],
  },
]

function howToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use Sted',
    description: PAGE_META['/how-to-use'].description,
    step: STEPS.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, name: step.title, text: step.body.join(' ') })),
  }
}

export function HowToUsePage() {
  useEffect(() => { document.title = PAGE_META['/how-to-use'].title }, [])
  return <ContentShell>
    <article className="cp-article">
      <header className="cp-intro">
        <p className="l4s-section-eyebrow">Guide</p>
        <h1 className="cp-h1">How to use <mark className="cp-hl">Sted</mark></h1>
        <p className="cp-lede">Sted reads everything you save and tells you what matters. Here’s how to get the most out of it, in {STEPS.length} short steps.</p>
        <p className="cp-updated">Updated {UPDATED}</p>
      </header>

      <ol className="cp-steps">
        {STEPS.map((step, index) => <li key={step.title} className={step.media ? 'cp-step has-media' : 'cp-step'}>
          <div className="cp-step-copy">
            <span className="cp-step-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <h2 className="cp-h3">{step.title}</h2>
            {step.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {step.prompts && <div className="cp-prompts"><p className="cp-prompts-label">Try asking</p><ul>{step.prompts.map(prompt => <li key={prompt}>“{prompt}”</li>)}</ul></div>}
            {step.tip && <p className="cp-tip"><strong>Tip:</strong> {step.tip}</p>}
            {index === STEPS.length - 1 && <p><a className="cp-link" href="/#pricing">See Sted Pro <span aria-hidden="true">→</span></a></p>}
          </div>
          {step.media && <Phone media={step.media} />}
        </li>)}
      </ol>

      <p className="cp-more">More questions? Read the <a className="cp-link" href="/#faq">FAQ</a> or <a className="cp-link" href="/support">contact support</a>.</p>
    </article>
    <ClosingCta title={<>Start saving. <mark className="cp-hl">Sted does the rest.</mark></>} />
    <JsonLd data={howToSchema()} />
  </ContentShell>
}

// ---------------------------------------------------------------------------------------------------
// /pocket-alternative

const COMPARISON: { feature: string; pocket: string; sted: string }[] = [
  { feature: 'Status', pocket: 'Shut down in 2025', sted: 'Active, on iPhone' },
  { feature: 'Save from the iOS share sheet', pocket: 'Yes', sted: 'Yes' },
  { feature: 'What you can save', pocket: 'Links, best with articles', sted: 'Posts, videos, reels, podcasts, articles and repos' },
  { feature: 'Summary and key ideas for every save', pocket: 'No', sted: 'Yes' },
  { feature: 'Organizing', pocket: 'Tags', sted: 'Topics sorted for you, plus projects' },
  { feature: 'A recap of what you saved', pocket: 'No', sted: 'The Recap, every 10 saves' },
  { feature: 'Chat with what you saved', pocket: 'No', sted: 'Ask Sted' },
  { feature: 'Price', pocket: 'No longer available', sted: `Free, or Pro for ${offer.price}/year (founding price)` },
]

const POCKET_FAQ: { question: string; answer: string }[] = [
  { question: 'Is Sted a good Pocket alternative?', answer: 'If you used Pocket to save things for later, yes: Sted keeps the same habit (share a link, it’s saved) and adds what Pocket never did. It reads every save and gives you the summary and key ideas, brings the best of them back in The Recap every 10 saves, and lets you ask questions about everything you saved.' },
  { question: 'Can I import my Pocket list into Sted?', answer: 'Not yet. For now, keep your Pocket export and re-save the links you still care about by pasting them into Sted.' },
  { question: 'Is Sted free?', answer: `Yes. The free plan includes up to ${n(free.saves)} saves and ${n(free.aiSavesPerMonth)} AI summaries a month. Sted Pro adds unlimited saves, ${n(pro.aiSavesPerMonth)} AI summaries a month and extended chat.` },
  { question: 'Does Sted work on my computer or on Android?', answer: 'Sted is on iPhone today. Chrome and Safari extensions, a web app and Sted for Android are on the way.' },
]

function pocketSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: POCKET_FAQ.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  }
}

export function PocketAlternativePage() {
  useEffect(() => { document.title = PAGE_META['/pocket-alternative'].title }, [])
  return <ContentShell>
    <article className="cp-article">
      <header className="cp-intro">
        <p className="l4s-section-eyebrow">Pocket alternative</p>
        <h1 className="cp-h1">Looking for a Pocket alternative? <mark className="cp-hl">Meet Sted.</mark></h1>
        <p className="cp-lede">Pocket shut down in 2025. If you used it to save things for later, Sted keeps that habit and does the part Pocket never did: it reads what you save and tells you what matters.</p>
        <div className="cp-intro-cta"><AppStoreBadge height={48} /><span>Free on iPhone</span></div>
      </header>

      <section className="cp-section" aria-labelledby="cp-what-happened">
        <h2 className="cp-h2" id="cp-what-happened">What happened to Pocket</h2>
        <p>Mozilla shut Pocket down in July 2025, after more than a decade of people using it to save articles to read later. If Pocket was where your “for later” list lived, you need a new home for it.</p>
      </section>

      <section className="cp-section" aria-labelledby="cp-compare">
        <h2 className="cp-h2" id="cp-compare">Pocket vs Sted</h2>
        <p>Pocket kept the link. Sted reads it.</p>
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead><tr><th scope="col"><span className="cp-sr">Feature</span></th><th scope="col">Pocket</th><th scope="col">Sted</th></tr></thead>
            <tbody>{COMPARISON.map(row => <tr key={row.feature}><th scope="row">{row.feature}</th><td data-label="Pocket">{row.pocket}</td><td data-label="Sted">{row.sted}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="cp-section cp-split" aria-labelledby="cp-more-than">
        <div>
          <h2 className="cp-h2" id="cp-more-than">More than a read-later list</h2>
          <p>Most read-later lists turn into a pile you never go back to. Sted turns each save into something you can use right away: the summary, the key ideas and its topics, then The Recap every 10 saves and Ask Sted whenever you want to find or connect what you saved.</p>
          <p>And it isn’t only for articles. Save the Instagram post, the YouTube video, the X thread or the Spotify episode, and Sted reads those too.</p>
          <p><a className="cp-link" href="/how-to-use">See how Sted works, step by step <span aria-hidden="true">→</span></a></p>
        </div>
        <Phone media={{ kind: 'image', src: `${APP}/summary-dan-koe.webp`, alt: 'A saved X post in Sted with its summary and key ideas' }} />
      </section>

      <section className="cp-section" aria-labelledby="cp-switch">
        <h2 className="cp-h2" id="cp-switch">Switch from Pocket in two minutes</h2>
        <ol className="cp-numbered">
          <li><strong>Download Sted</strong> free on your iPhone and create your account.</li>
          <li><strong>Add Sted to your share sheet:</strong> tap Share in any app, scroll to More and add Sted to your favorites.</li>
          <li><strong>Save the next thing you find</strong> by sharing it to Sted, the same way you used to send it to Pocket.</li>
          <li><strong>Bring back what still matters:</strong> paste the links from your Pocket export that you still care about.</li>
        </ol>
      </section>

      <section className="cp-section" aria-labelledby="cp-faq">
        <h2 className="cp-h2" id="cp-faq">Questions</h2>
        <div className="cp-faq">
          {POCKET_FAQ.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
        </div>
      </section>
    </article>
    <ClosingCta title={<>Your saves deserve better than <mark className="cp-hl">a pile.</mark></>} />
    <JsonLd data={pocketSchema()} />
  </ContentShell>
}

/** The page for a content route. */
export function ContentPage({ pathname }: { pathname: string }) {
  return pathname.replace(/\/$/, '') === '/pocket-alternative' ? <PocketAlternativePage /> : <HowToUsePage />
}
