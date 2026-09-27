import { useEffect, useState } from 'react'
import { AppScreen } from '../growth-funnel/AppScreen'
import { findExample } from '../growth-funnel/funnel-content'
import '../growth-funnel/ConversationalFunnel.css'
import './OutputDemo.css'

export const OUTPUT_TABS = [
  { id: 'summary', label: 'Summary', description: 'A save in Sted with its summary, key ideas and topics' },
  { id: 'topics', label: 'Topics', description: 'Saves grouped by topic in the Sted library' },
  { id: 'recap', label: 'Daily Recap', description: 'The daily Magazine: Sted’s Picks, The Recap and Your Saves' },
] as const
type TabId = (typeof OUTPUT_TABS)[number]['id']

const ROTATE_MS = 4500

/** The Dan Koe save in the app's item layout (its real screenshot's scraped title is the raw t.co link). */
const SUMMARY_EXAMPLE = { ...findExample('creator', 'dan-koe')!, screen: undefined }

const TOPICS = ['AI', 'Design', 'Productivity', 'Coffee', 'Japan', 'Podcasts']
const AI_SAVES = [
  { thumb: '/content/real/spotify-lennys-podcast-ian-silber.jpg', title: 'Chatbots are not the final interface', source: 'Spotify · Lenny’s Podcast' },
  { thumb: '/content/real/openai.webp', title: 'Codex as a platform: build on the open agent harness', source: 'OpenAI Developers' },
  { thumb: '/content/real/x1.jpg', title: 'I just open sourced a minimal chatbot template.', source: 'X · @shadcn' },
  { thumb: '/content/real/firecrawl.png', title: 'Firecrawl: turn websites into LLM-ready data', source: 'firecrawl.dev' },
]

function StatusBar() {
  return <div className="cf-app-status"><span>9:41</span><i /></div>
}

function Tabs({ active }: { active: 'Magazine' | 'Library' }) {
  return <div className="cf-app-tabs">{(['Magazine', 'Sted', 'Library'] as const).map(tab => <span key={tab} className={tab === active ? 'is-active' : ''}>{tab}</span>)}</div>
}

function TopicsScreen() {
  return <div className="cf-phone l4o-screen" role="img" aria-label={OUTPUT_TABS[1].description}>
    <div className="cf-app l4o-app">
      <StatusBar />
      <p className="l4o-title">Topics</p>
      <p className="l4o-chips">{TOPICS.map((topic, index) => <span key={topic} className={index === 0 ? 'is-active' : ''}>{topic}</span>)}</p>
      <p className="l4o-label">AI</p>
      <ul className="l4o-rows">
        {AI_SAVES.map(save => <li key={save.title}><img src={save.thumb} alt="" /><span><strong>{save.title}</strong><small>{save.source}</small></span></li>)}
      </ul>
      <Tabs active="Library" />
    </div>
  </div>
}

function RecapScreen() {
  return <div className="cf-phone l4o-screen" role="img" aria-label={OUTPUT_TABS[2].description}>
    <div className="cf-app l4o-app">
      <StatusBar />
      <p className="l4o-title">Magazine</p>
      <p className="l4o-date">Your daily recap</p>
      <p className="l4o-label">Sted’s Picks</p>
      <div className="l4o-pick">
        <img src="/content/landing-4c/fushimi-inari-kyoto.webp" alt="" />
        <span><strong>Kyoto, Japan</strong><small>Instagram · Travel</small></span>
      </div>
      <p className="l4o-label">The Recap</p>
      <p className="l4o-recap">A pour-over guide, a Starship video and two reads on AI agents. Here’s what’s worth your next five minutes.</p>
      <p className="l4o-label">Your Saves</p>
      <p className="l4o-thumbs">
        {['/content/landing-4c/pour-over-method.webp', '/content/real/youtube2.jpg', '/content/real/openai.webp'].map(src => <img key={src} src={src} alt="" />)}
      </p>
      <Tabs active="Magazine" />
    </div>
  </div>
}

/**
 * Hero right side: Sted's output as the real app. Three yellow ribbons run from Sted to three pills;
 * the app (no device frame) shows the active one. Rotates on its own until someone picks a pill,
 * pauses on hover, and stays still under reduced motion. Positions are hero-canvas pixels.
 */
export function OutputDemo() {
  const [active, setActive] = useState<TabId>('summary')
  const [pinned, setPinned] = useState(false)
  const [hovered, setHovered] = useState(false)
  // The first screen is painted as-is; only later switches play the entrance motion.
  const [switched, setSwitched] = useState(false)
  const [still] = useState(() => typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false))

  useEffect(() => {
    if (pinned || hovered || still) return
    const timer = window.setInterval(() => {
      setSwitched(true)
      setActive(current => OUTPUT_TABS[(OUTPUT_TABS.findIndex(tab => tab.id === current) + 1) % OUTPUT_TABS.length].id)
    }, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [pinned, hovered, still])

  return <div className="l4o-demo" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    <svg className="l4o-ribbons" viewBox="0 0 1600 820" fill="none" aria-hidden="true" preserveAspectRatio="none">
      <path className={`l4o-ribbon${active === 'summary' ? ' is-active' : ''}`} d="M870 560C920 560 918 500 968 500" strokeWidth="16" />
      <path className={`l4o-ribbon${active === 'topics' ? ' is-active' : ''}`} d="M870 574C920 574 918 578 968 578" strokeWidth="13" />
      <path className={`l4o-ribbon${active === 'recap' ? ' is-active' : ''}`} d="M870 588C920 588 918 656 968 656" strokeWidth="10" />
    </svg>

    <div className="l4o-pills" role="group" aria-label="What Sted makes from your saves">
      {OUTPUT_TABS.map(tab => <button key={tab.id} type="button" aria-pressed={active === tab.id} onClick={() => { setActive(tab.id); setPinned(true); setSwitched(true) }}>
        {tab.label}
      </button>)}
    </div>

    <div className={switched ? 'l4o-stage is-switching' : 'l4o-stage'} key={active} aria-live="polite">
      {active === 'summary' && <AppScreen example={SUMMARY_EXAMPLE} className="l4o-screen" />}
      {active === 'topics' && <TopicsScreen />}
      {active === 'recap' && <RecapScreen />}
    </div>
  </div>
}
