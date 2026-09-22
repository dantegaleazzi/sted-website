import { useEffect } from 'react'
import { SourceIcon } from '../source-cards/source-icons'
import { SiteFooter } from '../footer/SiteFooter'
import { AppStoreBadge, FEATURE_KEYS, FeatureShowcase, Landing4CSections, SignInLink, type FeatureKey } from './Landing4CSections'
import './Landing4CPreview.css'

/** What Sted makes out of the saves: the automatic outcomes the iOS app ships today.
 *  Chat stays out until it ships in iOS; Projects stays out because it isn't automatic. */
type Output = { icon: string; tint: string; title: string; pills?: string[]; lines?: number }

const OUTPUTS: Output[] = [
  { icon: 'summary-note', tint: 'var(--sted-supportive-blue)', title: 'Clean summary', lines: 3 },
  { icon: 'summary-card', tint: 'var(--sted-supportive-green)', title: 'Key points', lines: 3 },
  { icon: 'topics', tint: 'var(--sted-supportive-pink)', title: 'Topics and tags', pills: ['AI', 'Design', 'Coffee', 'Japan'] },
  { icon: 'media', tint: 'var(--sted-supportive-purple)', title: 'Your daily magazine', pills: ['The Recap', 'Sted’s Picks', 'Your Saves'] },
]

function OutputCard({ icon, tint, title, pills, lines }: Output) {
  return <div className="l4c-output">
    <span className="l4c-output-icon" style={{ background: tint }}><img src={`/content/landing-4c/icons/${icon}.webp`} alt="" width={192} height={192} /></span>
    <span className="l4c-output-title">{title}</span>
    {lines && <span className="l4c-lines">{Array.from({ length: lines }, (_, index) => <i key={index} />)}</span>}
    {pills && <span className="l4c-output-pills">{pills.map((pill) => <span key={pill} className="l4c-pill">{pill}</span>)}</span>}
  </div>
}

/** Small hand-drawn-style arrow for the margin notes (2px ink, round caps, like the North Star canvas). */
function ArrowGlyph({ flip = false }: { flip?: boolean }) {
  return <svg width="44" height="36" viewBox="0 0 56 46" fill="none" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="M6 4C6 26 26 34 48 34" stroke="var(--sted-ink)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M40 26l9 8-10 7" stroke="var(--sted-ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
          <div className="l4c-header-actions"><SignInLink /><AppStoreBadge height={44} /></div>
        </header>

        <div className="l4c-copy">
          <h1>Everything you save.<br /><span className="l4c-yellow">Finally useful.</span></h1>
          <div className="l4c-copy-text">
            <p className="l4c-formats">Links. Posts. Videos. Podcasts. Notes.</p>
            <p className="l4c-subcopy">You save more than you’ll ever get back to. Sted reads it, organizes it, and brings it back when it matters.</p>
          </div>
          <div className="l4c-cta">
            <div className="l4c-cta-row">
              <AppStoreBadge height={50} />
              <a href="#how-it-works" className="l4c-secondary-cta">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.4" fill="none" stroke="var(--sted-ink)" strokeWidth="1.6" /><path fill="var(--sted-ink)" d="M9.6 7.8v8.4l6.4-4.2z" /></svg>
                See how it works
              </a>
            </div>
            <p className="l4c-reassurance">Free to start</p>
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

            {/* Type cards: the formats Sted takes, with the official source tiles. */}
            <div className="l4c-card l4c-type l4c-type-notes">
              <span className="l4c-type-icon"><img src="/content/landing-4c/icons/notes.webp" alt="" width={192} height={192} /></span>
              <span className="l4c-type-label">Notes<br />and docs</span>
              <span className="l4c-lines"><i /><i /></span>
            </div>
            <div className="l4c-card l4c-type l4c-type-web">
              <span className="l4c-type-icon"><SourceIcon type="website" /></span>
              <span className="l4c-type-label">Web pages</span>
              <span className="l4c-lines"><i /><i /><i /></span>
            </div>
            <div className="l4c-card l4c-type l4c-type-posts">
              <span className="l4c-type-icon"><SourceIcon type="x" /><SourceIcon type="instagram" /></span>
              <span className="l4c-type-label">Posts<br />and reels</span>
            </div>
          </div>

          <div className="l4c-mascot-badge">
            <img src="/sted-mascot.svg" alt="Sted" />
          </div>

          <div className="l4c-results">
            {OUTPUTS.map((output) => <OutputCard key={output.title} {...output} />)}
          </div>

          <p className="l4c-note l4c-note-left"><ArrowGlyph flip /><span>Messy input.<br />Real life.</span></p>
          <p className="l4c-note l4c-note-sted"><span>Sted understands it.</span></p>
          <p className="l4c-note l4c-note-right"><span>Clear output.<br />Real value.</span><ArrowGlyph /></p>
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
