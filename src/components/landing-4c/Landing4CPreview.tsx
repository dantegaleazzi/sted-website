import { useEffect } from 'react'
import { SourceIcon } from '../source-cards/source-icons'
import { SiteFooter } from '../footer/SiteFooter'
import { AppStoreBadge, FEATURE_KEYS, FeatureShowcase, Landing4CSections, SignInLink, type FeatureKey } from './Landing4CSections'
import './Landing4CPreview.css'

/** What Sted makes out of the saves: the automatic outcomes the iOS app ships today.
 *  Chat stays out until it ships in iOS; Projects stays out because it isn't automatic. */
type OutputIcon = 'article' | 'list-checks' | 'tag' | 'newspaper'
type Output = { icon: OutputIcon; tint: string; title: string; pills?: string[]; summary?: true }

const OUTPUTS: Output[] = [
  { icon: 'article', tint: 'var(--sted-supportive-blue)', title: 'Summary & Key Points', summary: true },
  { icon: 'tag', tint: 'var(--sted-supportive-pink)', title: 'Topics & Tags', pills: ['AI', 'Design', 'Coffee', 'Japan'] },
  { icon: 'newspaper', tint: 'var(--sted-supportive-purple)', title: 'Your Daily Recap', pills: ['The Recap', 'Sted’s Picks', 'Your Saves'] },
]

/** Phosphor Icons (regular), MIT. Ink on a supportive tile, per design-system.md §6. */
const PHOSPHOR: Record<OutputIcon, string> = {
  article: 'M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z',
  'list-checks': 'M224,128a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128ZM128,72h88a8,8,0,0,0,0-16H128a8,8,0,0,0,0,16Zm88,112H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16ZM82.34,42.34,56,68.69,45.66,58.34A8,8,0,0,0,34.34,69.66l16,16a8,8,0,0,0,11.32,0l32-32A8,8,0,0,0,82.34,42.34Zm0,64L56,132.69,45.66,122.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Zm0,64L56,196.69,45.66,186.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z',
  tag: 'M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z',
  newspaper: 'M88,112a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm8,40h80a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16ZM232,64V184a24,24,0,0,1-24,24H32A24,24,0,0,1,8,184.11V88a8,8,0,0,1,16,0v96a8,8,0,0,0,16,0V64A16,16,0,0,1,56,48H216A16,16,0,0,1,232,64Zm-16,0H56V184a23.84,23.84,0,0,1-1.37,8H208a8,8,0,0,0,8-8Z',
}

function Phosphor({ name }: { name: OutputIcon }) {
  return <svg width="22" height="22" viewBox="0 0 256 256" aria-hidden="true"><path fill="var(--sted-ink)" d={PHOSPHOR[name]} /></svg>
}

function OutputCard({ icon, tint, title, pills, summary }: Output) {
  return <div className="l4c-output">
    <span className="l4c-output-icon" style={{ background: tint }}><Phosphor name={icon} /></span>
    <span className="l4c-output-title">{title}</span>
    {summary && <>
      {/* Like the app's detail view: a summary paragraph, then key ideas as bullets. */}
      <span className="l4c-lines"><i /><i /><i /></span>
      <span className="l4c-bullets"><i /><i /><i /></span>
    </>}
    {pills && <span className="l4c-output-pills">{pills.map((pill) => <span key={pill} className="l4c-pill">{pill}</span>)}</span>}
  </div>
}

/** Hand-drawn-style curved arrow for the margin notes (2.5px ink, round caps, like the North Star canvas).
 *  Starts beside the note, swings out and comes down onto the thing it points at. `flip` mirrors it. */
function CurvedArrow({ flip = false }: { flip?: boolean }) {
  return <svg width="96" height="84" viewBox="0 0 96 84" fill="none" aria-hidden="true" className={flip ? 'l4c-arrow is-flipped' : 'l4c-arrow'}>
    <path d="M4 10C40 2 82 12 74 72" stroke="var(--sted-ink)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M62 60l12 14 13-12" stroke="var(--sted-ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

const SPOTIFY_BAR_HEIGHTS = [26, 52, 78, 40, 64, 34, 88, 46, 70, 30, 58, 42, 80, 36, 62, 28, 74, 48, 66, 32, 54, 38]

function SpotifyIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path fill="#1DB954" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
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
          <div className="l4c-header-actions"><SignInLink /><AppStoreBadge height={40} /></div>
        </header>

        <div className="l4c-copy">
          <h1>Everything you save.<br /><span className="l4c-yellow">Finally useful.</span></h1>
          <div className="l4c-copy-text">
            <p className="l4c-formats">Links. Posts. Videos. Podcasts. Notes.</p>
            <p className="l4c-subcopy">Your bookmark graveyard, finally organized. Send everything to Sted: he reads it, organizes it and summarizes it for you. Free to start.</p>
          </div>
          <div className="l4c-cta">
            <div className="l4c-cta-row">
              <AppStoreBadge height={42} />
              <a href="#how-it-works" className="l4c-secondary-cta">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.4" fill="none" stroke="var(--sted-ink)" strokeWidth="1.6" /><path fill="var(--sted-ink)" d="M9.6 7.8v8.4l6.4-4.2z" /></svg>
                See how it works
              </a>
            </div>
          </div>
        </div>

        {/* Illustration: messy input (left) flows into Sted (centre) and comes out as clear output (right).
            Composition 16 of the Social North Star, rebuilt with the landing tokens. One mascot only. */}
        <div className="l4c-illustration">
          <svg className="l4c-flows" viewBox="0 0 1600 820" fill="none" aria-hidden="true" preserveAspectRatio="none">
            {/* yellow ribbons: everything you find flows toward Sted */}
            <path className="l4c-ribbon" d="M-40 380C200 340 320 500 520 500 640 500 700 560 762 596" strokeWidth="26" />
            <path className="l4c-ribbon" d="M-40 580C180 630 340 540 520 560 640 572 700 590 762 604" strokeWidth="22" />
            <path className="l4c-ribbon" d="M-40 780C220 820 380 690 560 690 660 690 720 640 766 614" strokeWidth="18" />
            {/* Sted → outputs */}
            <path className="l4c-inkline" d="M862 602H930" />
            <path className="l4c-inkline" d="M862 596C890 596 890 548 930 548" />
            <path className="l4c-inkline" d="M862 608C890 608 890 656 930 656" />
          </svg>

          <div className="l4c-saves">
            <div className="l4c-card l4c-card-coffee">
              <img src="/content/landing-4c/pour-over-method.webp" alt="V60 pour over" className="l4c-card-image l4c-card-image-video" width={400} height={224} />
              <div className="l4c-card-pad">
                <span className="l4c-card-title">The pour over method, start to finish</span>
                <div className="l4c-domain-row"><SourceIcon type="youtube" /><span className="l4c-domain">YouTube</span></div>
              </div>
            </div>

            <div className="l4c-card l4c-card-post">
              <img src="/content/landing-4c/x-post-falling-into-hole.webp" alt="How to fix your entire life in 1 day" className="l4c-card-image l4c-card-image-wide" width={480} height={192} />
              <div className="l4c-card-pad">
                <span className="l4c-card-title">How to fix your entire life in 1 day</span>
                <div className="l4c-domain-row"><SourceIcon type="x" /><span className="l4c-domain">X</span></div>
              </div>
            </div>

            <div className="l4c-card l4c-card-kyoto">
              <img src="/content/landing-4c/fushimi-inari-kyoto.webp" alt="Fushimi-Inari, Kyoto" className="l4c-card-image l4c-card-image-kyoto" width={320} height={400} fetchPriority="high" />
              <div className="l4c-card-pad">
                <span className="l4c-card-title">Kyoto, Japan</span>
                <div className="l4c-domain-row"><SourceIcon type="instagram" /><span className="l4c-domain">Instagram</span></div>
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

            {/* A website (Shipaton 2026 logo from the RevenueCat marketing kit) and a GitHub repo. */}
            <div className="l4c-card l4c-card-web">
              <div className="l4c-web-thumb"><img src="/content/landing-4c/shipaton-2026-logo.svg" alt="Shipaton 2026" width={407} height={481} /></div>
              <div className="l4c-card-pad">
                <div className="l4c-web-head"><SourceIcon type="website" /><span className="l4c-card-title">Websites</span></div>
                <span className="l4c-domain">www.shipaton.com</span>
              </div>
            </div>

            <div className="l4c-card l4c-card-repo">
              <SourceIcon type="github" />
              <div className="l4c-repo-text">
                <span className="l4c-card-title">last30days-skill</span>
                <span className="l4c-domain">mvanhorn · Sep 14, 2026</span>
              </div>
            </div>
          </div>

          <div className="l4c-mascot-badge">
            <img src="/sted-mascot.svg" alt="Sted" />
          </div>

          <div className="l4c-results">
            {OUTPUTS.map((output) => <OutputCard key={output.title} {...output} />)}
          </div>

          <p className="l4c-note l4c-note-left"><span>Messy input.<br />Real life.</span><CurvedArrow /></p>
          <p className="l4c-note l4c-note-sted"><span>Sted understands it.</span></p>
          <p className="l4c-note l4c-note-right"><CurvedArrow flip /><span>Clear output.<br />Real value.</span></p>
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
