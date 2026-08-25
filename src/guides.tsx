import { useEffect, useState, type ReactNode } from 'react'

type Guide = { slug: string; title: string; subtitle: string; seoTitle?: string; seoDescription?: string }

export const guides: Guide[] = [
  {
    slug: 'build-an-app-in-24-hours',
    title: 'How to Build an App in 24 Hours with AI',
    subtitle: 'The exact workflow and prompts I’m using to turn a paper sketch into a working iPhone app.',
    seoTitle: 'How to Build an App in 24 Hours with AI | Sted',
    seoDescription: 'The exact prompts and AI workflow used to turn a paper sketch into a working iPhone app using ChatGPT and Claude Code.',
  },
  {
    slug: 'how-to-choose-a-name',
    title: 'How to choose a name',
    subtitle: 'A simple naming framework + the prompts I used to find Sted.',
  },
]

// No analytics backend exists yet and the Privacy Policy states no behavioral
// tracking is used on the site. This stub keeps the call sites wired without
// sending or storing anything, so a real destination can be plugged in later.
function track(event: string, props?: Record<string, unknown>) {
  if (import.meta.env.DEV) console.debug('[track]', event, props)
}

const DOMAIN_RULE = 'Do not reject a strong name only because the exact .com is unavailable. Consider clean alternatives such as get[name], use[name], hey[name], or an appropriate TLD. Never claim a domain is available unless availability was actually checked.'
const TRADEMARK_RULE = 'Never claim a name is legally safe or trademark-clear without an actual trademark search. Treat similarity checks as preliminary screening only.'

const findNamesPrompt = `I'm naming a new project.

What I'm building:
[DESCRIBE THE PROJECT]

Who it's for:
[TARGET USER]

What I want the brand to feel like:
[3–5 ATTRIBUTES]

Languages the name should work in:
[LANGUAGES]

Prioritize names that are:
- short
- easy to pronounce
- easy to spell after hearing them once
- memorable
- distinctive enough to become a brand
- natural to say in the languages above

Avoid:
- generic category names
- complicated spelling
- forced misspellings
- names that sound too similar to major existing brands
- names whose pronunciation is ambiguous

Generate 30 names.
Then shortlist the strongest 10.
Finally recommend the best 5 in a compact table with:
Name / Pronunciation / Why it works / Main risk / Score.

${DOMAIN_RULE}

${TRADEMARK_RULE}`

const stedMethodPrompt = `Help me name my project using the constraints I used when choosing Sted.

I want a name that:

- is preferably 4–7 letters
- is short and visually clean
- is easy to say
- is easy to spell after hearing it
- is easy to remember
- works naturally in both English and Spanish
- does not need to literally describe the product
- feels like a brand rather than a feature

Project:
[DESCRIBE PROJECT]

Audience:
[DESCRIBE AUDIENCE]

Brand personality:
[DESCRIBE PERSONALITY]

Generate 30 names.

Group them into:
- invented words
- real words used in an unexpected way
- shortened/modified words
- metaphorical names

Then choose the strongest 10 and explain why.

Finally rank the top 5 using:
Pronounceability
Spellability
Memorability
Distinctiveness
Brand potential

${DOMAIN_RULE}

${TRADEMARK_RULE}`

const testNamesPrompt = `Act as a critical naming strategist.

I am considering these names:

[PASTE NAMES]

Before scoring, identify any obvious:
- existing major brands/products with confusingly similar names
- negative meanings
- unintended slang
- cross-language pronunciation issues

Do not claim exhaustive trademark clearance.

Then evaluate each name using these tests:

1. Can someone pronounce it correctly after reading it?
2. Can someone spell it correctly after hearing it?
3. Is it likely to be remembered the next day?
4. Is it distinctive enough to build a brand around?
5. Does it create unwanted meanings or pronunciation problems in English or Spanish?
6. What domain strategies could reasonably work if the exact .com is unavailable?

Score each category from 1–10.

Be critical.

Eliminate weak names rather than trying to justify all of them.

Return:
- ranking
- strengths
- weaknesses
- pronunciation risks
- spelling risks
- best 3
- final recommendation

${DOMAIN_RULE}

${TRADEMARK_RULE}`

const prompts = [
  { number: '01', title: 'Generate name ideas', subtitle: 'Generate a strong first shortlist.', prompt: findNamesPrompt },
  { number: '02', title: 'Try the Sted method', subtitle: 'Use the constraints I used when naming Sted.', prompt: stedMethodPrompt },
  { number: '03', title: 'Test your shortlist', subtitle: 'Critically evaluate your final candidates.', prompt: testNamesPrompt },
]

function CopyPromptButton({ text, onCopy }: { text: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return <button className="button button-amber" type="button" onClick={handleCopy}>{copied ? 'Copied' : 'Copy prompt'}</button>
}

function PromptCard({ number, title, prompt, guide, featured }: { number: string; title: string; prompt: string; guide: string; featured?: boolean }) {
  return <div className={`prompt-card${featured ? ' prompt-card-featured' : ''}`} id={`prompt-${number}`}>
    <p className="prompt-card-label">PROMPT {number}</p>
    <h3>{title}</h3>
    <pre>{prompt}</pre>
    <CopyPromptButton text={prompt} onCopy={() => track('prompt_copy', { guide, prompt: title })} />
  </div>
}

function GuideStep({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <section className="guide-step">
    <div className="guide-step-number">{number}</div>
    <div className="guide-step-content">
      <h2>{title}</h2>
      {children}
    </div>
  </section>
}

function PromptAccordion({ number, title, subtitle, prompt, isOpen, onToggle }: { number: string; title: string; subtitle: string; prompt: string; isOpen: boolean; onToggle: () => void }) {
  return <div className={`prompt-accordion${isOpen ? ' is-open' : ''}`}>
    <button className="prompt-accordion-trigger" type="button" onClick={onToggle} aria-expanded={isOpen}>
      <span className="prompt-accordion-number">{number}</span>
      <span className="prompt-accordion-heading">
        <span className="prompt-accordion-title">{title}</span>
        <span className="prompt-accordion-subtitle">{subtitle}</span>
      </span>
      <span className="prompt-accordion-toggle">{isOpen ? 'Close prompt ↑' : 'Open prompt ↓'}</span>
    </button>
    <div className="prompt-accordion-collapse">
      <div className="prompt-accordion-panel">
        <div className="prompt-accordion-panel-inner">
          <pre>{prompt}</pre>
          <CopyPromptButton text={prompt} onCopy={() => track('prompt_copy', { guide: 'how-to-choose-a-name', prompt: title })} />
        </div>
      </div>
    </div>
  </div>
}

function PromptAccordionGroup() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return <div className="prompt-accordion-group">
    {prompts.map((item, index) => <PromptAccordion
      key={item.number}
      number={item.number}
      title={item.title}
      subtitle={item.subtitle}
      prompt={item.prompt}
      isOpen={openIndex === index}
      onToggle={() => {
        const nextOpen = openIndex === index ? null : index
        setOpenIndex(nextOpen)
        if (nextOpen !== null) track('prompt_open', { guide: 'how-to-choose-a-name', prompt: item.title })
      }}
    />)}
  </div>
}

function GuideSources() {
  const [isOpen, setIsOpen] = useState(false)
  return <div className={`guide-sources${isOpen ? ' is-open' : ''}`}>
    <button className="sources-trigger" type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
      SOURCES {isOpen ? '↑' : '↓'}
    </button>
    <div className="sources-collapse">
      <div className="sources-panel">
        <ol>
          <li><a href="https://news.ycombinator.com/item?id=91005" target="_blank" rel="noopener noreferrer">news.ycombinator.com/item?id=91005</a></li>
          <li><a href="https://news.ycombinator.com/item?id=483069" target="_blank" rel="noopener noreferrer">news.ycombinator.com/item?id=483069</a></li>
          <li><a href="https://news.ycombinator.com/item?id=29433647" target="_blank" rel="noopener noreferrer">news.ycombinator.com/item?id=29433647</a></li>
        </ol>
      </div>
    </div>
  </div>
}

function BuildingSomethingCta({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  return <div className="guide-cta-block">
    <h2>Building something?</h2>
    <p className="simple-lede">I’m building Sted in public and sharing the frameworks, prompts, and lessons I learn along the way.</p>
    <div className="guide-cta">
      <a className="button button-outline" href="/build" onClick={() => track('follow_build_click', { guide: 'how-to-choose-a-name' })}>Follow the build</a>
      <button className="button button-amber" type="button" onClick={() => { track('join_sted_click', { guide: 'how-to-choose-a-name' }); onOpenWaitlist() }}>Join Sted <span aria-hidden="true">↗</span></button>
    </div>
  </div>
}

function HowToChooseANamePage({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  useEffect(() => { track('guide_view', { guide: 'how-to-choose-a-name' }) }, [])

  return <main className="simple-page guide-page shell" aria-labelledby="guide-title">
    <a className="post-back" href="/guides">← Back to guides</a>
    <p className="section-label">GUIDES</p>
    <h1 id="guide-title">How to choose a name</h1>
    <p className="simple-lede">A simple naming framework + the prompts I used to find Sted.</p>
    <div className="post-body">
      <p>I went through a lot of names before choosing Sted.</p>
      <p>I wanted something that was:</p>
      <ul>
        <li>short</li>
        <li>easy to say</li>
        <li>easy to spell</li>
        <li>easy to remember</li>
        <li>easy to pronounce in both English and Spanish</li>
        <li>capable of becoming a brand, rather than simply describing the product</li>
      </ul>
      <p>Eventually I landed on Sted.</p>
      <p>The exact .com wasn’t available — sted.com was registered years ago — but sted.ai was.</p>
      <p>That was enough.</p>
      <p>A good name doesn’t need a perfect .com. Depending on the product, variations like get[name], use[name], hey[name], or an appropriate TLD can work.</p>

      <h2>The 4 tests</h2>
      <p>Before committing to a name, ask:</p>
      <ol>
        <li><strong>Can people say it?</strong> If you have to explain how to pronounce it, that’s friction every single time someone talks about you.</li>
        <li><strong>Can they spell it without asking?</strong> A name someone can’t type into a search bar from memory loses them.</li>
        <li><strong>Will they remember it tomorrow?</strong> Most names get heard once, in passing. If it doesn’t stick, it doesn’t matter how clever it is.</li>
        <li><strong>Can you get a good domain?</strong> Not necessarily the exact .com — but something clean enough that it doesn’t undercut the name itself.</li>
      </ol>
      <p className="post-note">These are practical filters, not universal laws. Similar principles — especially pronounceability, spelling and memorability — repeatedly appear in founder discussions and startup naming advice.</p>
    </div>

    <PromptAccordionGroup />

    <GuideSources />

    <BuildingSomethingCta onOpenWaitlist={onOpenWaitlist} />
  </main>
}

export function GuidesIndexPage() {
  return <main className="simple-page shell" aria-labelledby="guides-title">
    <p className="section-label">GUIDES</p>
    <h1 id="guides-title">Free resources from<br />building Sted.</h1>
    <p className="simple-lede">Practical things I learn along the way, turned into guides you can actually use.</p>
    <div className="guide-list">
      {guides.map((guide) => <a key={guide.slug} className="guide-card" href={`/guides/${guide.slug}`}>
        <h2>{guide.title}</h2>
        <p className="timeline-summary">{guide.subtitle}</p>
        <span className="post-link">Read the guide <span aria-hidden="true">→</span></span>
      </a>)}
    </div>
  </main>
}

const analyzeSketchPrompt = `Analyze this sketch of my app.

First, tell me what you understand about the product, the screens, navigation, and user flow.

Do not redesign it yet.

Identify:
- each screen
- its purpose
- main UI elements
- navigation between screens
- anything ambiguous or missing

Then propose the minimum set of screens needed for an MVP.`

const sketchToMockupPrompt = `Now turn this sketch into a polished mobile app mockup.

Preserve the product structure and user flow we just defined.

Use a clean, modern, minimal iOS-native visual language.

Prioritize hierarchy, whitespace, typography, and usability.

If I provide visual references, screenshots, a brand guide, colors, typography, or existing product screens, treat them as the visual source of truth. Do not invent a different design language.

Show the screens together so I can evaluate the complete product experience.`

const iteratePrompt = `Keep the same product and information architecture.

Do not redesign it from scratch.

Improve:
- visual hierarchy
- spacing
- typography
- navigation
- consistency between screens
- native iOS feel

Generate the updated screens together so I can compare the full experience.

Before generating the next version, briefly tell me what you are changing and why. Keep everything I did not ask you to change intact.`

const buildPlanPrompt = `Now act as the CTO and principal software architect for this product. Turn the approved product into an implementation-ready specification that I can hand directly to a coding agent.

I want to build it as a native iOS app.

Based on the approved screens and user flows, define:

- MVP scope
- screen architecture
- navigation
- components
- data models
- state management
- backend requirements
- API contracts
- authentication
- persistence
- edge cases
- loading / empty / error states
- implementation order

Separate:
1. Must ship for MVP
2. Can wait until later

Do not add features that aren't required by the product we've designed.

The goal is the smallest production-ready version that preserves the core experience.

Finish with:
- recommended implementation phases/batches
- dependencies between batches
- acceptance criteria for each batch
- what should be mocked initially
- what must be real before TestFlight
- known blockers requiring credentials or external setup`

const claudeCodePrompt = `Act as the senior iOS engineer responsible for shipping this MVP.

Do not start coding immediately.

First:
1. inspect the entire repository;
2. understand the existing architecture and current implementation state;
3. compare it against the approved build plan;
4. identify what already exists, what is missing, what is mocked, and what is blocked;
5. propose an implementation plan in small batches.

Then execute the plan batch by batch.

Use the approved mockups and build plan above as the source of truth for what to build.

Build this as a native iOS app.

Preserve the approved visual language exactly — don't reinterpret the design.

Rules:
- Avoid unnecessary abstractions. Don't build for hypothetical future requirements.
- Don't add features beyond what the build plan specifies.
- Build incrementally, one screen or flow at a time.
- Compile frequently. Don't let changes pile up unverified.
- Test each flow as you build it, not just at the end.
- Clearly distinguish real functionality from mocked/placeholder functionality in the code and when you report progress.
- Never present mocked functionality as if it were production-ready.
- If you hit a blocker (missing credentials, unclear requirement, unavailable service), report it clearly instead of working around it silently.
- Make logical, incremental local commits as you go.
- Do not push anything without explicit permission.

After every meaningful batch:
- build and test;
- report exactly what is real, mocked, blocked, and remaining.

Debug mocks must never silently ship in Release. Production builds must fail clearly when required configuration is missing rather than pretending functionality succeeded.`

const testChecklist = [
  'Build succeeds',
  'Core flow works',
  'Empty states work',
  'Loading states work',
  'Errors don’t break the app',
  'No fake production data',
  'Authentication works',
  'Backend calls work',
  'App works on a real device',
  'Main flow can be completed from start to finish',
]

function BuildAppIn24HoursPage() {
  const guide = 'build-an-app-in-24-hours'

  useEffect(() => {
    track('guide_view', { guide })
    const guideMeta = guides.find((entry) => entry.slug === guide)
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content') ?? null
    if (guideMeta?.seoDescription) description?.setAttribute('content', guideMeta.seoDescription)
    return () => { if (previousDescription) description?.setAttribute('content', previousDescription) }
  }, [])

  useEffect(() => {
    const scrollToHash = () => {
      if (!window.location.hash) return
      setTimeout(() => {
        document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' })
      }, 50)
    }
    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])

  return <main className="simple-page guide-page shell" aria-labelledby="guide-title">
    <a className="post-back" href="/guides">← Back to guides</a>
    <p className="section-label">FREE GUIDE</p>
    <h1 id="guide-title">How to Build an App in 24 Hours with AI</h1>
    <p className="simple-lede">Go from a paper sketch to a working iPhone app using ChatGPT + Claude Code.<br />The exact 7-step workflow and prompts I’m using to build Sted.</p>
    <p className="guide-stats-line">5 prompts · 7 steps · Free · Copy everything</p>
    <p className="guide-context">I’m building Sted in public for RevenueCat Shipaton 2026. On Day 7, I gave myself 24 hours to turn my paper sketches into a working MVP.</p>
    <div className="guide-hero-ctas">
      <a className="button button-amber" href="#prompt-01" onClick={() => track('start_building_click', { guide })}>Start with Prompt #1 <span aria-hidden="true">↓</span></a>
      <a className="button button-outline" href="/">See Sted</a>
    </div>

    <div className="guide-pipeline" aria-hidden="true">
      <span>Sketch</span><span>→</span><span>Mockup</span><span>→</span><span>Iterate</span><span>→</span><span>Build plan</span><span>→</span><span>Claude Code</span><span>→</span><span>Test</span><span>→</span><span>TestFlight</span>
    </div>

    <div className="post-body">
      <p>You don’t need to start by opening Xcode or writing a line of code. Start by defining the product visually — on paper is fine — and let AI carry it through mockups, a build plan, and implementation from there.</p>
    </div>

    <GuideStep number="01" title="Draw your app">
      <p>Draw your app’s main screens on paper. Don’t worry about making them beautiful — worry about making them clear.</p>
      <p>Focus on:</p>
      <ul>
        <li>what screens exist</li>
        <li>what information appears on each one</li>
        <li>what happens when someone taps something</li>
        <li>how the user moves through the product</li>
      </ul>
    </GuideStep>

    <GuideStep number="02" title="Turn the sketch into a mockup">
      <p>Take a clear photo of the sketch and upload it to ChatGPT.</p>
      <PromptCard number="01" title="Analyze the sketch" prompt={analyzeSketchPrompt} guide={guide} />
      <p>Once ChatGPT understands the sketch, ask it to turn that understanding into an actual mockup.</p>
      <PromptCard number="02" title="Turn it into a mockup" prompt={sketchToMockupPrompt} guide={guide} />
      <p className="post-note">Don’t accept the first design blindly. Iterate.</p>
    </GuideStep>

    <GuideStep number="03" title="Iterate the design">
      <p>This is where the real work happens — we went through several rounds on Sted instead of coding the first mockup we saw.</p>
      <PromptCard number="03" title="Iterate the design" prompt={iteratePrompt} guide={guide} />
      <p className="post-note">Give ChatGPT screenshots or references of styles you like, rather than trying to describe everything in words.</p>
    </GuideStep>

    <GuideStep number="04" title="Create the build plan">
      <p>Before Claude Code writes anything, have ChatGPT turn the approved product into an implementation specification.</p>
      <PromptCard number="04" title="Create the build plan" prompt={buildPlanPrompt} guide={guide} />
    </GuideStep>

    <GuideStep number="05" title="Give it to Claude Code">
      <p>This is the most important prompt in the whole workflow — it’s what actually turns the plan into working software. It’s written to be reusable for whatever you’re building, not specific to Sted.</p>
      <PromptCard number="05" title="Build the app" prompt={claudeCodePrompt} guide={guide} featured />
      <div className="guide-stack-callout">
        <p className="prompt-card-label">HOW I ACTUALLY SPLIT THE WORK</p>
        <ul>
          <li><strong>ChatGPT</strong> — product decisions, mockups, architecture and planning</li>
          <li><strong>Claude Code</strong> — iOS implementation and UI</li>
          <li><strong>Codex</strong> — backend, infrastructure, verification and second-opinion engineering</li>
        </ul>
      </div>
    </GuideStep>

    <GuideStep number="06" title="Test before you call it done">
      <p>Don’t just test individual screens. Test the entire user journey from beginning to end.</p>
      <ul className="guide-checklist">
        {testChecklist.map((item) => <li key={item}><span aria-hidden="true">☐</span> {item}</li>)}
      </ul>
    </GuideStep>

    <GuideStep number="07" title="Get it into TestFlight">
      <p>Once the MVP actually works end to end:</p>
      <ul>
        <li>configure the Apple Developer project</li>
        <li>set the bundle identifier and capabilities</li>
        <li>create the app in App Store Connect</li>
        <li>archive the Release build</li>
        <li>upload it to TestFlight</li>
        <li>test the production configuration, not just the dev build</li>
      </ul>
      <p className="post-note">This doesn’t guarantee App Store approval — it just gets a real build in front of real testers.</p>
      <div className="guide-warning">
        <p><strong>AI can write the app. It can’t create your accounts for you.</strong></p>
        <p>Depending on your app, you’ll still need to configure things like Apple Developer, App Store Connect, authentication, databases, API keys, backend hosting and production secrets.</p>
      </div>
    </GuideStep>

    <div className="guide-cta-block">
      <h2>I’m testing this workflow right now.</h2>
      <p className="simple-lede">Day 7: paper sketch. Next target: TestFlight.</p>
      <p>If it works, you’ll see it happen in public. If it breaks, I’ll show that too.</p>
      <div className="guide-cta">
        <a className="button button-amber" href="/build" onClick={() => track('follow_build_click', { guide })}>Follow the build <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </main>
}

export function GuidePage({ slug, onOpenWaitlist }: { slug: string; onOpenWaitlist: () => void }) {
  if (slug === 'how-to-choose-a-name') return <HowToChooseANamePage onOpenWaitlist={onOpenWaitlist} />
  if (slug === 'build-an-app-in-24-hours') return <BuildAppIn24HoursPage />
  return <main className="simple-page shell" aria-labelledby="guide-title">
    <a className="post-back" href="/guides">← Back to guides</a>
    <h1 id="guide-title">Guide not found.</h1>
  </main>
}
