import { useEffect, useState } from 'react'
import '../growth-funnel/ConversationalFunnel.css'
import './OutputDemo.css'

export const OUTPUT_TABS = [
  { id: 'summary', label: 'Summary & Topics', description: 'A save in Sted with its summary, key ideas and topics' },
  { id: 'recap', label: 'The Recap', description: 'The Recap in Sted: Sted’s Picks, the topics you saved around and your saved Steds' },
  { id: 'chat', label: 'Ask Sted', description: 'Ask Sted: “Summarize what I saved this week.” Sted answers with two big ideas and the three saves they came from.' },
] as const
type TabId = (typeof OUTPUT_TABS)[number]['id']

const ROTATE_MS = 4500

/** The Dan Koe save as the app shows it: a real screenshot, with the post's title in place of the scraped t.co link. */
export const SUMMARY_SCREEN = { src: '/content/landing-4c/app/summary-dan-koe.webp', alt: '“How to fix your entire life in 1 day” saved in Sted, with its summary and key ideas' }

const TOPICS = ['AI', 'Design', 'Productivity', 'Coffee', 'Travel', 'Podcasts']
const AI_SAVES = [
  { thumb: '/content/real/spotify-lennys-podcast-ian-silber.jpg', title: 'Chatbots are not the final interface', source: 'Spotify · Lenny’s Podcast' },
  { thumb: '/content/real/openai.webp', title: 'Codex as a platform: build on the open agent harness', source: 'OpenAI Developers' },
  { thumb: '/content/real/x1.jpg', title: 'I just open sourced a minimal chatbot template.', source: 'X · @shadcn' },
  { thumb: '/content/real/firecrawl.png', title: 'Firecrawl: turn websites into LLM-ready data', source: 'firecrawl.dev' },
]

function StatusBar() {
  return <div className="cf-app-status"><i /></div>
}

function Tabs({ active }: { active: 'Library' }) {
  return <div className="cf-app-tabs">{(['The Recap', 'Sted', 'Library'] as const).map(tab => <span key={tab} className={tab === active ? 'is-active' : ''}>{tab}</span>)}</div>
}

/** The Library's Topics view, drawn in the app's style: the "Topics" item of How it works shows it in a device frame. */
export function TopicsApp() {
  return <div className="cf-app l4o-app">
    <StatusBar />
    <p className="l4o-title">Topics</p>
    <p className="l4o-date">Sted sorts every save for you</p>
    <p className="l4o-chips">{TOPICS.map((topic, index) => <span key={topic} className={index === 0 ? 'is-active' : ''}>{topic}</span>)}</p>
    <p className="l4o-label">AI · 4 saves</p>
    <ul className="l4o-rows">
      {AI_SAVES.map(save => <li key={save.title}><img src={save.thumb} alt="" /><span><strong>{save.title}</strong><small>{save.source}</small></span></li>)}
    </ul>
    <Tabs active="Library" />
  </div>
}

/** The Recap: a real screenshot of the app (status bar and tab bar included). */
function RecapScreen() {
  return <div className="cf-phone l4o-screen">
    <img className="cf-phone-shot" src="/content/landing-4c/app/recap.webp" alt={OUTPUT_TABS[1].description} width={600} height={1304} />
  </div>
}

/** Ask Sted: a real answer from the app (a frame of the chat recording): the question, the answer and its sources. */
function ChatScreen() {
  return <div className="cf-phone l4o-screen">
    <img className="cf-phone-shot" src="/content/landing-4c/app/chat-answer.webp" alt={OUTPUT_TABS[2].description} width={600} height={1304} />
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
      <path className={`l4o-ribbon${active === 'recap' ? ' is-active' : ''}`} d="M870 574C920 574 918 578 968 578" strokeWidth="13" />
      <path className={`l4o-ribbon${active === 'chat' ? ' is-active' : ''}`} d="M870 588C920 588 918 656 968 656" strokeWidth="10" />
    </svg>

    <div className="l4o-pills" role="group" aria-label="What Sted makes from your saves">
      {OUTPUT_TABS.map(tab => <button key={tab.id} type="button" aria-pressed={active === tab.id} onClick={() => { setActive(tab.id); setPinned(true); setSwitched(true) }}>
        {tab.label}
      </button>)}
    </div>

    <div className={switched ? 'l4o-stage is-switching' : 'l4o-stage'} key={active} aria-live="polite">
      {active === 'summary' && <div className="cf-phone l4o-screen"><img className="cf-phone-shot" src={SUMMARY_SCREEN.src} alt={SUMMARY_SCREEN.alt} width={600} height={1304} fetchPriority="high" /></div>}
      {active === 'recap' && <RecapScreen />}
      {active === 'chat' && <ChatScreen />}
    </div>
  </div>
}
