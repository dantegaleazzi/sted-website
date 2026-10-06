import { useEffect, type ReactNode } from 'react'
import { APP, ClosingCta, ContentShell, JsonLd, Phone } from '../content-pages/ContentPages'
import { CHECKED, UPDATED, bestFor, competitor, type BestFor, type Competitor, type Faq, type Row } from './compare-data'
import { COMPARE_PAGES, comparePage, type ComparePage } from './compare-paths'
import './ComparePages.css'

/**
 * Comparison pages, in the layout of the content pages: /compare (hub), /vs/<app>, /alternatives/<app>
 * and /best/<guide>. Content lives in compare-data.ts; this file only lays it out. Prerendered.
 */

const SUMMARY_SHOT = { kind: 'image' as const, src: `${APP}/summary-dan-koe.webp`, alt: 'A saved X post in Sted with its summary and key ideas' }
const SITE = 'https://www.sted.ai'

function usePageTitle(page: ComparePage) {
  useEffect(() => { document.title = page.title }, [page.title])
}

function Breadcrumb({ current }: { current: string }) {
  return <nav className="cmp-crumbs" aria-label="Breadcrumb"><a href="/compare">Compare</a><span aria-hidden="true">›</span><span>{current}</span></nav>
}

function Updated() {
  return <p className="cp-updated">By Dante Galeazzi, maker of Sted · Updated {UPDATED}</p>
}

function Tldr({ children }: { children: ReactNode }) {
  return <aside className="cmp-tldr" aria-label="TL;DR"><p className="cmp-tldr-label">TL;DR</p>{children}</aside>
}

function CompareTable({ caption, them, rows }: { caption: string; them: string; rows: Row[] }) {
  return <div className="cp-table-wrap">
    <table className="cp-table cmp-vs-table">
      <caption className="cmp-caption">{caption}</caption>
      <thead><tr><th scope="col"><span className="cp-sr">Feature</span></th><th scope="col">{them}</th><th scope="col">Sted</th></tr></thead>
      <tbody>{rows.map(row => <tr key={row.feature}><th scope="row">{row.feature}</th><td data-label={them}>{row.them}</td><td data-label="Sted">{row.sted}</td></tr>)}</tbody>
    </table>
  </div>
}

function Bullets({ items }: { items: string[] }) {
  return <ul className="cmp-bullets">{items.map(item => <li key={item}>{item}</li>)}</ul>
}

function FaqList({ items }: { items: Faq[] }) {
  return <section className="cp-section" aria-labelledby="cmp-faq">
    <h2 className="cp-h2" id="cmp-faq">Questions</h2>
    <div className="cp-faq">{items.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</div>
  </section>
}

function Sources({ urls }: { urls: string[] }) {
  return <p className="cmp-sources">
    I checked prices and features on each app’s own site in {CHECKED}. Prices change, so check before you buy.
    {urls.length > 0 && <> Sources: {urls.map((url, index) => <span key={url}>{index > 0 && ', '}<a href={url} rel="nofollow noopener" target="_blank">{new URL(url).hostname.replace(/^www\./, '')}</a></span>)}.</>}
  </p>
}

/** A few other comparison pages, so each one links into the rest. */
function Related({ exclude }: { exclude: string }) {
  const links = COMPARE_PAGES.filter(page => page.kind !== 'hub' && page.path !== exclude)
  const pick = [...links.filter(page => page.kind === 'vs'), ...links.filter(page => page.kind === 'best')].slice(0, 8)
  return <nav className="cmp-related" aria-label="More comparisons">
    <h2 className="cmp-related-title">More comparisons and guides</h2>
    <ul>{pick.map(page => <li key={page.path}><a href={page.path}>{page.title.replace(/ \(\d{4}\)$/, '').replace(/: honest comparison$/, '')}</a></li>)}
      <li><a href="/pocket-alternative">Pocket alternative</a></li>
      <li><a href="/compare">All comparisons <span aria-hidden="true">→</span></a></li>
    </ul>
  </nav>
}

function schema(page: ComparePage, faq: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: page.title, description: page.description, dateModified: '2026-10-03', author: { '@type': 'Person', name: 'Dante Galeazzi', url: 'https://dantegaleazzi.com' }, publisher: { '@id': `${SITE}/#organization` }, mainEntityOfPage: `${SITE}${page.path}` },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Compare', item: `${SITE}/compare` }, { '@type': 'ListItem', position: 2, name: page.title, item: `${SITE}${page.path}` }] },
      ...faq.length ? [{ '@type': 'FAQPage', mainEntity: faq.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }] : [],
    ],
  }
}

// ---------------------------------------------------------------------------------------------------

function VsPage({ page, c }: { page: ComparePage; c: Competitor }) {
  usePageTitle(page)
  return <ContentShell>
    <article className="cp-article">
      <header className="cp-intro">
        <Breadcrumb current={`Sted vs ${c.name}`} />
        <h1 className="cp-h1">Sted vs {c.name}</h1>
        <p className="cp-lede">Full disclosure: I make Sted, so I’m biased. This is the honest version: what each app is for, where {c.name} is better, and where Sted is.</p>
        <Updated />
      </header>

      <Tldr>
        <p><strong>Choose {c.name} if</strong> {lower(c.chooseThem)}</p>
        <p><strong>Choose Sted if</strong> {lower(c.chooseSted)}</p>
      </Tldr>

      <section className="cp-section" aria-labelledby="cmp-what">
        <h2 className="cp-h2" id="cmp-what">Two different jobs</h2>
        <p>{c.is}</p>
        <p>Sted is an iPhone app for everything you save from other apps. Share a post, reel, video, podcast or article and Sted reads it for you: it writes the summary and key ideas, sorts it into topics, brings the best back in The Recap and lets you ask Sted about anything you saved.</p>
      </section>

      <section className="cp-section" aria-labelledby="cmp-table">
        <h2 className="cp-h2" id="cmp-table">{c.name} vs Sted, side by side</h2>
        <CompareTable caption={`${c.name} and Sted compared, checked ${CHECKED}`} them={c.name} rows={c.rows} />
      </section>

      <section className="cp-section" aria-labelledby="cmp-them">
        <h2 className="cp-h2" id="cmp-them">Where {c.name} is better</h2>
        <Bullets items={c.theyWin} />
      </section>

      <section className="cp-section cp-split" aria-labelledby="cmp-sted">
        <div>
          <h2 className="cp-h2" id="cmp-sted">Where Sted is better</h2>
          <Bullets items={c.stedWins} />
          <p><a className="cp-link" href="/how-to-use">See how Sted works <span aria-hidden="true">→</span></a></p>
        </div>
        <Phone media={SUMMARY_SHOT} />
      </section>

      <FaqList items={c.faq} />
      <p><a className="cp-link" href={`/alternatives/${c.slug}`}>Looking to switch? The best {c.name} alternatives <span aria-hidden="true">→</span></a></p>
      <Sources urls={c.sources} />
    </article>
    <ClosingCta title={<>Try Sted <mark className="cp-hl">for free.</mark></>} />
    <Related exclude={page.path} />
    <JsonLd data={schema(page, c.faq)} />
  </ContentShell>
}

function AlternativePage({ page, c }: { page: ComparePage; c: Competitor }) {
  usePageTitle(page)
  return <ContentShell>
    <article className="cp-article">
      <header className="cp-intro">
        <Breadcrumb current={`${c.name} alternative`} />
        <h1 className="cp-h1">The best {c.name} alternative <mark className="cp-hl">for iPhone</mark></h1>
        <p className="cp-lede">Full disclosure: I make Sted, so I’m biased. If {c.name} isn’t working for you, here’s what I’d look at, including when you should just stay.</p>
        <Updated />
      </header>

      <Tldr>
        <p><strong>Sted:</strong> {lower(c.chooseSted)}</p>
        {c.others.map(other => <p key={other.name}><strong>{other.name}:</strong> {other.why}.</p>)}
        <p><strong>Stay with {c.name}</strong> if {lower(c.chooseThem)}</p>
      </Tldr>

      <section className="cp-section" aria-labelledby="cmp-why">
        <h2 className="cp-h2" id="cmp-why">Why people look for a {c.name} alternative</h2>
        <p>{c.is} It’s a good app. These are the reasons people still look elsewhere:</p>
        <Bullets items={c.whySwitch} />
      </section>

      <section className="cp-section" aria-labelledby="cmp-picks">
        <h2 className="cp-h2" id="cmp-picks">The alternatives</h2>
        <ol className="cmp-picks">
          <li className="cmp-pick cp-split">
            <div>
              <h3>1. Sted <span className="cmp-mine">(mine)</span></h3>
              <p>{c.chooseSted}</p>
              <Bullets items={c.stedWins} />
            </div>
            <Phone media={SUMMARY_SHOT} />
          </li>
          {c.others.map((other, index) => <li key={other.name} className="cmp-pick">
            <h3>{index + 2}. {other.name}</h3>
            <p>Pick it {other.why}.{other.slug && <> <a className="cp-link" href={`/vs/${other.slug}`}>Sted vs {other.name} <span aria-hidden="true">→</span></a></>}</p>
          </li>)}
        </ol>
      </section>

      <section className="cp-section" aria-labelledby="cmp-table">
        <h2 className="cp-h2" id="cmp-table">{c.name} vs Sted at a glance</h2>
        <CompareTable caption={`${c.name} and Sted compared, checked ${CHECKED}`} them={c.name} rows={c.rows} />
        <p><a className="cp-link" href={`/vs/${c.slug}`}>The full Sted vs {c.name} comparison <span aria-hidden="true">→</span></a></p>
      </section>

      <section className="cp-section" aria-labelledby="cmp-stay">
        <h2 className="cp-h2" id="cmp-stay">When to stay with {c.name}</h2>
        <p>{c.stayIf}</p>
      </section>

      <FaqList items={c.faq} />
      <Sources urls={c.sources} />
    </article>
    <ClosingCta title={<>Try Sted <mark className="cp-hl">for free.</mark></>} />
    <Related exclude={page.path} />
    <JsonLd data={schema(page, c.faq)} />
  </ContentShell>
}

function BestPage({ page, b }: { page: ComparePage; b: BestFor }) {
  usePageTitle(page)
  return <ContentShell>
    <article className="cp-article">
      <header className="cp-intro">
        <Breadcrumb current={b.h1.replace(/^The best /, 'Best ')} />
        <h1 className="cp-h1">{b.h1} <span className="cmp-year">(2026)</span></h1>
        <p className="cp-lede">{b.intro}</p>
        <Updated />
      </header>

      <Tldr>
        <p>{b.tldr}</p>
        <ul className="cmp-tldr-picks">{b.picks.map(pick => <li key={pick.name}><strong>{pick.bestFor}:</strong> {pick.name}{pick.mine && ' (mine)'}</li>)}</ul>
      </Tldr>

      <section className="cp-section" aria-labelledby="cmp-glance">
        <h2 className="cp-h2" id="cmp-glance">The picks at a glance</h2>
        <div className="cp-table-wrap">
          <table className="cp-table cmp-picks-table">
            <caption className="cmp-caption">Checked {CHECKED}</caption>
            <thead><tr><th scope="col">App</th><th scope="col">Best for</th><th scope="col">Price</th><th scope="col">Works on</th></tr></thead>
            <tbody>{b.picks.map(pick => <tr key={pick.name}><th scope="row">{pick.name}{pick.mine && ' (mine)'}</th><td data-label="Best for">{pick.bestFor}</td><td data-label="Price">{pick.price}</td><td data-label="Works on">{pick.worksOn}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="cp-section" aria-labelledby="cmp-decides">
        <h2 className="cp-h2" id="cmp-decides">{b.decides.title}</h2>
        {b.decides.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>

      <section className="cp-section" aria-labelledby="cmp-picks">
        <h2 className="cp-h2" id="cmp-picks">The picks</h2>
        <ol className="cmp-picks">
          {b.picks.map((pick, index) => <li key={pick.name} className={pick.mine ? 'cmp-pick cp-split' : 'cmp-pick'}>
            <div>
              <h3>{index + 1}. {pick.name}{pick.mine && <span className="cmp-mine"> (mine)</span>}</h3>
              <dl className="cmp-meta">
                <div><dt>Best for</dt><dd>{pick.bestFor}</dd></div>
                <div><dt>Price</dt><dd>{pick.price}</dd></div>
                <div><dt>Works on</dt><dd>{pick.worksOn}</dd></div>
              </dl>
              {pick.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {pick.vs && <p><a className="cp-link" href={`/vs/${pick.vs}`}>Sted vs {pick.name} <span aria-hidden="true">→</span></a></p>}
            </div>
            {pick.mine && <Phone media={SUMMARY_SHOT} />}
          </li>)}
        </ol>
      </section>

      <section className="cp-section" aria-labelledby="cmp-mypick">
        <h2 className="cp-h2" id="cmp-mypick">My pick</h2>
        {b.myPick.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>

      <FaqList items={b.faq} />
      <Sources urls={b.sources} />
    </article>
    <ClosingCta title={<>Try Sted <mark className="cp-hl">for free.</mark></>} />
    <Related exclude={page.path} />
    <JsonLd data={schema(page, b.faq)} />
  </ContentShell>
}

function HubPage({ page }: { page: ComparePage }) {
  usePageTitle(page)
  const group = (kind: ComparePage['kind']) => COMPARE_PAGES.filter(p => p.kind === kind)
  return <ContentShell>
    <article className="cp-article">
      <header className="cp-intro">
        <p className="l4s-section-eyebrow">Compare</p>
        <h1 className="cp-h1">Sted vs <mark className="cp-hl">other apps</mark></h1>
        <p className="cp-lede">Honest comparisons, written by the person who makes Sted. Each one says where the other app is better, and every price was checked on the app’s own site in {CHECKED}.</p>
      </header>
      <section className="cp-section" aria-labelledby="hub-vs">
        <h2 className="cp-h2" id="hub-vs">Sted vs…</h2>
        <ul className="cmp-hub">{group('vs').map(p => <li key={p.path}><a href={p.path}>Sted vs {competitor(p.slug)?.name}</a><span>{competitor(p.slug)?.is}</span></li>)}</ul>
      </section>
      <section className="cp-section" aria-labelledby="hub-alt">
        <h2 className="cp-h2" id="hub-alt">Alternatives</h2>
        <ul className="cmp-hub">
          {group('alternative').map(p => <li key={p.path}><a href={p.path}>{competitor(p.slug)?.name} alternative</a></li>)}
          <li><a href="/pocket-alternative">Pocket alternative</a></li>
        </ul>
      </section>
      <section className="cp-section" aria-labelledby="hub-best">
        <h2 className="cp-h2" id="hub-best">Guides</h2>
        <ul className="cmp-hub">{group('best').map(p => <li key={p.path}><a href={p.path}>{bestFor(p.slug)?.h1}</a><span>{bestFor(p.slug)?.tldr}</span></li>)}</ul>
      </section>
    </article>
    <ClosingCta title={<>Try Sted <mark className="cp-hl">for free.</mark></>} />
  </ContentShell>
}

const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

/** The page for a comparison route. */
export function ComparePageRoute({ pathname }: { pathname: string }) {
  const page = comparePage(pathname) ?? COMPARE_PAGES[0]
  if (page.kind === 'vs' || page.kind === 'alternative') {
    const c = competitor(page.slug)
    if (c) return page.kind === 'vs' ? <VsPage page={page} c={c} /> : <AlternativePage page={page} c={c} />
  }
  if (page.kind === 'best') {
    const b = bestFor(page.slug)
    if (b) return <BestPage page={page} b={b} />
  }
  return <HubPage page={COMPARE_PAGES[0]} />
}

