import { lazy, Suspense, useEffect } from 'react'
import { SourceIcon } from '../source-cards/source-icons'
import { SiteFooter } from '../footer/SiteFooter'
import { AppStoreBadge, FEATURE_KEYS, FeatureShowcase, Landing4CSections, PARKED_FEATURE_KEYS, StedsAtWork, type FeatureKey } from './Landing4CSections'
import { HeroCta } from './HeroCta'
import { RotatingWord } from './RotatingWord'
import { OutputDemo } from './OutputDemo'
import './Landing4CPreview.css'

/** DEV only: ?arrange=1 lets you drag the hero cards and copy their CSS. Not in the production bundle. */
const HeroArrange = import.meta.env.DEV ? lazy(() => import('./HeroArrange')) : null

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
    document.title = 'Sted — Everything you save. Finally useful.'
    const anchor = window.location.hash.slice(1)
    if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView())
  }, [])

  const featureParam = new URLSearchParams(window.location.search).get('feature')
  const pinnedFeature: FeatureKey | undefined = FEATURE_KEYS.find((key) => key === featureParam)
  const isPublicHome = window.location.pathname === '/'
  const initialFeature = pinnedFeature ?? (isPublicHome ? 'summary' : 'save')
  const arranging = HeroArrange && new URLSearchParams(window.location.search).get('arrange') === '1'

  return <div className="l4c-page">
    <div className="l4c-scene-outer">
      <div className="l4c-scene">
        <header className="l4c-header">
          <img className="l4c-logo" src="/brand/sted-primary-horizontal.svg" alt="Sted" />
          {/* Sign in is hidden while the web dashboard isn’t live; SignInLink brings it back. */}
          <div className="l4c-header-actions"><AppStoreBadge height={40} /></div>
        </header>

        <div className="l4c-copy">
          <h1>Everything you <mark className="l4c-hl">save</mark>{' '}<br />Finally <mark className="l4c-hl">useful</mark></h1>
          <p className="l4c-subcopy">Sted reads every <RotatingWord /> you save and tells you what matters.</p>
          <HeroCta />
        </div>

        {/* Illustration: messy input (left) flows into Sted (centre) and comes out as clear output (right).
            Composition 16 of the Social North Star, rebuilt with the landing tokens. One mascot only. */}
        <div className="l4c-illustration">
          <svg className="l4c-flows" viewBox="0 0 1600 820" fill="none" aria-hidden="true" preserveAspectRatio="none">
            {/* Three ribbons, same family of curves, threading the gaps between cards and meeting at Sted. */}
            <path className="l4c-ribbon" d="M-40 292C150 262 250 330 340 420S560 460 738 548" strokeWidth="18" />
            <path className="l4c-ribbon" d="M-40 486C120 470 200 566 330 582S600 578 738 574" strokeWidth="15" />
            <path className="l4c-ribbon" d="M-40 740C150 760 300 756 470 740S660 670 744 604" strokeWidth="12" />
          </svg>

          <div className="l4c-saves">
            <a className="l4c-card l4c-card-podcast" href="https://open.spotify.com/episode/29zRQB9zJcmmcIEXlsnRdH" target="_blank" rel="noopener noreferrer">
              <div className="l4c-card-pad">
                <div className="l4c-story-head">
                  <img src="/content/landing-4c/starter-story-podcast-cover.webp" alt="Starter Story" className="l4c-story-cover" width={184} height={184} />
                  <div className="l4c-story-text">
                    <span className="l4c-card-title">Starter Story</span>
                    <span className="l4c-domain l4c-story-line">This app replaced<br />my 9-5 ($155K/year)</span>
                  </div>
                </div>
                <div className="l4c-story-player">
                  <SpotifyIcon />
                  <div className="l4c-story-bars">
                    {SPOTIFY_BAR_HEIGHTS.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
                  </div>
                </div>
              </div>
            </a>

            <a className="l4c-card l4c-card-post" href="https://x.com/thedankoe/article/2010751592346030461" target="_blank" rel="noopener noreferrer">
              <img src="/content/landing-4c/x-post-falling-into-hole.webp" alt="How to fix your entire life in 1 day" className="l4c-card-image l4c-card-image-wide" width={480} height={192} />
              <div className="l4c-card-pad">
                <span className="l4c-card-title">How to fix your entire life in 1 day</span>
                <div className="l4c-domain-row"><SourceIcon type="x" /><span className="l4c-domain">x.com/thedankoe/</span></div>
              </div>
            </a>

            <a className="l4c-card l4c-card-kyoto" href="https://www.instagram.com/p/DcgDDydsiqL/" target="_blank" rel="noopener noreferrer">
              <img src="/content/landing-4c/fushimi-inari-kyoto.webp" alt="Torii gates at Fushimi Inari Shrine, Kyoto" className="l4c-card-image l4c-card-image-kyoto" width={320} height={418} fetchPriority="high" />
              <div className="l4c-card-pad">
                <span className="l4c-card-title">Kyoto, Japan</span>
                <div className="l4c-domain-row"><SourceIcon type="instagram" /><span className="l4c-domain">Instagram</span></div>
              </div>
            </a>

            {/* A website and a repo: the same dense row (tile, title, one line of metadata). On desktop the
                wrapper is display: contents; in the tablet strip it stacks the two rows in one slot. */}
            <div className="l4c-rows">
              <a className="l4c-card l4c-card-row l4c-card-web" href="https://www.shipaton.com" target="_blank" rel="noopener noreferrer">
                <img src="/content/landing-4c/shipaton-favicon.webp" alt="" className="l4c-row-tile" width={128} height={128} />
                <div className="l4c-row-text">
                  <span className="l4c-card-title">www.shipaton.com</span>
                  <span className="l4c-domain">RevenueCat hackathon</span>
                </div>
              </a>

              <a className="l4c-card l4c-card-row l4c-card-repo" href="https://github.com/mattpocock/skills" target="_blank" rel="noopener noreferrer">
                <SourceIcon type="github" />
                <div className="l4c-row-text">
                  <span className="l4c-card-title">skills</span>
                  <span className="l4c-domain">mattpocock · Sep 14</span>
                </div>
              </a>
            </div>
          </div>

          <div className="l4c-mascot-badge">
            <img src="/sted-mascot.svg" alt="Sted" />
          </div>

          <OutputDemo />

          <p className="l4c-note l4c-note-sted"><span>Sted understands it.</span></p>
        </div>
      </div>
    </div>

    <Landing4CSections initial={initialFeature} autoplay={!pinnedFeature && !isPublicHome} />

    <SiteFooter />
    {arranging && <Suspense fallback={null}><HeroArrange /></Suspense>}
  </div>
}

/** Internal review page: the showcase states stacked, then what's built but parked (not on the landing). */
export function Landing4CShowcaseStates() {
  useEffect(() => {
    document.title = '4c showcase states — Sted'
  }, [])

  return <div className="l4c-page l4c-states-page">
    {FEATURE_KEYS.map((key, index) => <div key={key} className="l4c-state-block">
      <p className="l4c-state-label">State {index + 1} of 3 · {key}</p>
      <FeatureShowcase initial={key} autoplay={false} />
    </div>)}
    {PARKED_FEATURE_KEYS.map(key => <div key={key} className="l4c-state-block">
      <p className="l4c-state-label">Parked · not on the landing · How it works: {key}</p>
      <FeatureShowcase initial={key} autoplay={false} keys={[...FEATURE_KEYS.slice(0, 2), key, ...FEATURE_KEYS.slice(2)]} />
    </div>)}
    <div className="l4c-state-block">
      <p className="l4c-state-label">Parked · not on the landing · Meanwhile, Sted is working</p>
      <StedsAtWork />
    </div>
  </div>
}
