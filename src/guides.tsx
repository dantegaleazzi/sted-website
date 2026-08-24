import { useEffect, useState } from 'react'

type Guide = { slug: string; title: string; subtitle: string }

export const guides: Guide[] = [
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

export function GuidePage({ slug, onOpenWaitlist }: { slug: string; onOpenWaitlist: () => void }) {
  if (slug === 'how-to-choose-a-name') return <HowToChooseANamePage onOpenWaitlist={onOpenWaitlist} />
  return <main className="simple-page shell" aria-labelledby="guide-title">
    <a className="post-back" href="/guides">← Back to guides</a>
    <h1 id="guide-title">Guide not found.</h1>
  </main>
}
