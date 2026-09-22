import { useEffect } from 'react'
import { SourceIcon } from '../source-cards/source-icons'
import { SiteFooter } from '../footer/SiteFooter'
import { AppStoreBadge, FEATURE_KEYS, FeatureShowcase, Landing4CSections, SignInLink, type FeatureKey } from './Landing4CSections'
import './Landing4CPreview.css'

/** What Sted makes out of the saves. Three automatic outcomes tell the story; chat stays out of the
 *  hero until it ships in the public iOS app, and Projects stays out because it isn't automatic. */

type OutcomeIconName = 'feed' | 'summary' | 'tags'

/** Title, one marketing line, and pills with the real names/examples from the app. */
const OUTCOMES: { icon: OutcomeIconName; color: string; title: string; meta: string; pills: string[]; top: number }[] = [
  { icon: 'feed', color: 'var(--sted-supportive-green)', title: 'Your feed, made from your saves.', meta: 'A daily magazine from your saves', pills: ['The Recap', 'Sted’s Picks', 'Your Saves'], top: 128 },
  { icon: 'summary', color: 'var(--sted-supportive-blue)', title: 'Summary and key points.', meta: 'Sted reads every link and writes the summary for you.', pills: ['Summary', 'Key points'], top: 252 },
  { icon: 'tags', color: 'var(--sted-supportive-pink)', title: 'Topics and tags.', meta: 'Sted tags and files every save by topic, automatically.', pills: ['AI', 'Design', 'Coffee', 'Japan'], top: 376 },
]

const SPOTIFY_BAR_HEIGHTS = [26, 52, 78, 40, 64, 34, 88, 46, 70, 30, 58, 42, 80, 36, 62, 28, 74, 48, 66, 32, 54, 38]

function SpotifyIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path fill="#1DB954" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
}

function OutcomeIcon({ name }: { name: OutcomeIconName }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'var(--sted-ink)', 'aria-hidden': true } as const
  switch (name) {
    case 'feed':
      return <svg {...common}><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm2 2h5v5H7V7zm7 0h3v1.6h-3V7zm0 3.4h3V12h-3v-1.6zM7 14h10v1.6H7V14zm0 3h7v1.6H7V17z" /></svg>
    case 'summary':
      return <svg {...common}><path fillRule="evenodd" d="M4 4.5A1.5 1.5 0 0 1 5.5 3h13A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-15zM7 8h10v1.6H7V8zm0 4.2h10v1.6H7v-1.6zM7 16.4h6V18H7v-1.6z" /></svg>
    case 'tags':
      return <svg {...common}><path d="M12.6 3.4 20 10.8a2 2 0 0 1 0 2.83l-6.37 6.37a2 2 0 0 1-2.83 0L3.4 12.6a2 2 0 0 1-.6-1.42V5a1.6 1.6 0 0 1 1.6-1.6h6.18a2 2 0 0 1 1.42.6zM7.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
  }
}

function OutcomeRow({ icon, color, title, meta, pills, top }: (typeof OUTCOMES)[number]) {
  return <div className="l4c-outcome" style={{ top }}>
    <div className="l4c-outcome-icon" style={{ background: color }}><OutcomeIcon name={icon} /></div>
    <div className="l4c-outcome-body">
      <span className="l4c-outcome-title">{title}</span>
      <span className="l4c-outcome-meta">{meta}</span>
      <span className="l4c-outcome-pills">{pills.map((pill) => <span key={pill} className="l4c-pill">{pill}</span>)}</span>
    </div>
  </div>
}

/**
 * The "4c" landing: header + hero + sections + footer.
 * Hero story: real saves → Sted → three outcomes. ?feature=save|summary|feed pins the showcase below.
 */
export function Landing4CPreview() {
  useEffect(() => {
    document.title = '4c preview — Sted'
  }, [])

  const featureParam = new URLSearchParams(window.location.search).get('feature')
  const pinnedFeature: FeatureKey | undefined = FEATURE_KEYS.find((key) => key === featureParam)

  return <div className="l4c-page">
    <div className="l4c-scene-outer">
      <div className="l4c-scene">
        <header className="l4c-header">
          <img className="l4c-logo" src="/brand/sted-primary-horizontal.svg" alt="Sted" />
          <nav className="l4c-nav" aria-label="Landing navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#why-sted">Why Sted</a>
            <a href="#download">Download</a>
          </nav>
          <div className="l4c-header-actions"><SignInLink /><AppStoreBadge height={44} /></div>
        </header>

        <div className="l4c-copy">
          <h1>Everything<br />you save.<br /><span className="l4c-yellow">Finally useful.</span></h1>
          <div className="l4c-copy-text">
            <p className="l4c-formats">Links. Posts. Videos. Podcasts. Notes.</p>
            <p className="l4c-subcopy">You save more than you’ll ever get back to. Sted reads it, organizes it, and brings it back when it matters.</p>
          </div>
          <div className="l4c-cta">
            <div className="l4c-cta-row">
              <AppStoreBadge height={58} />
              <a href="#how-it-works" className="l4c-secondary-cta">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.4" fill="none" stroke="var(--sted-ink)" strokeWidth="1.6" /><path fill="var(--sted-ink)" d="M9.6 7.8v8.4l6.4-4.2z" /></svg>
                See how it works
              </a>
            </div>
            <p className="l4c-reassurance">Free to start · No account required</p>
          </div>
        </div>

        <div className="l4c-illustration">
          <div className="l4c-illustration-fixed">
            <svg className="l4c-connectors" viewBox="0 0 1040 620" fill="none" aria-hidden="true">
              {/* saves → Sted */}
              <path className="l4c-bracket" d="M452 310H472" />
              {/* Sted → each outcome */}
              <path className="l4c-bracket" d="M612 310H626M626 194Q626 182 638 182H640M626 194V418Q626 430 638 430H640M626 306H640" />
            </svg>

            <div className="l4c-saves">
              <div className="l4c-card l4c-card-kyoto">
                <img src="/content/landing-4c/fushimi-inari-kyoto.webp" alt="Fushimi-Inari, Kyoto" className="l4c-card-image l4c-card-image-portrait" width={320} height={400} fetchPriority="high" />
                <div className="l4c-card-pad">
                  <span className="l4c-card-title">Fushimi-Inari, Kyoto, Japan</span>
                  <div className="l4c-domain-row"><SourceIcon type="instagram" /><span className="l4c-domain">instagram.com</span></div>
                </div>
              </div>

              <div className="l4c-card l4c-card-coffee">
                <img src="/content/landing-4c/pour-over-method.webp" alt="V60 pour over" className="l4c-card-image l4c-card-image-video" width={400} height={224} />
                <div className="l4c-card-pad">
                  <span className="l4c-card-title">The pour over method, start to finish</span>
                  <div className="l4c-domain-row"><SourceIcon type="youtube" /><span className="l4c-domain">youtube.com</span></div>
                </div>
              </div>

              <div className="l4c-card l4c-card-post">
                <img src="/content/landing-4c/x-post-falling-into-hole.webp" alt="How to fix your entire life in 1 day" className="l4c-card-image l4c-card-image-wide" width={480} height={192} />
                <div className="l4c-card-pad">
                  <span className="l4c-card-title">How to fix your entire life in 1 day</span>
                  <div className="l4c-domain-row"><SourceIcon type="x" /><span className="l4c-domain">x.com</span></div>
                </div>
              </div>

              <div className="l4c-card l4c-card-podcast">
                <div className="l4c-card-pad">
                  <div className="l4c-story-head">
                    <img src="/content/landing-4c/starter-story-podcast-cover.webp" alt="Starter Story" className="l4c-story-cover" width={184} height={184} />
                    <div className="l4c-story-text">
                      <span className="l4c-card-title">Starter Story</span>
                      <span className="l4c-domain">This app replaced my 9-5 ($155K/year)</span>
                    </div>
                  </div>
                  <div className="l4c-story-player">
                    <SpotifyIcon />
                    <div className="l4c-story-bars">
                      {SPOTIFY_BAR_HEIGHTS.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="l4c-mascot-badge">
              <img src="/sted-mascot.svg" alt="Sted" />
            </div>

            <div className="l4c-results">
              {OUTCOMES.map((outcome) => <OutcomeRow key={outcome.title} {...outcome} />)}
            </div>
          </div>
        </div>
      </div>
    </div>

    <Landing4CSections initial={pinnedFeature ?? 'save'} autoplay={!pinnedFeature} />

    <SiteFooter />
  </div>
}

/** Internal review page: the three showcase states stacked, at the same desktop width. */
export function Landing4CShowcaseStates() {
  useEffect(() => {
    document.title = '4c showcase states — Sted'
  }, [])

  return <div className="l4c-page l4c-states-page">
    {FEATURE_KEYS.map((key, index) => <div key={key} className="l4c-state-block">
      <p className="l4c-state-label">State {index + 1} of 3 · {key}</p>
      <FeatureShowcase initial={key} autoplay={false} />
    </div>)}
  </div>
}
