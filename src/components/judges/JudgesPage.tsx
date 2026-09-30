import { useEffect, useState } from 'react'
import { APP_STORE_URL } from '../landing-4c/app-links'
import { CheckoutLink } from '../landing-4c/CheckoutLink'
import { PAGE_META } from '../../page-meta'
import { JUDGES_PATH } from '../../worker-policy'
import '../landing-4c/landing-4c-tokens.css'
import './JudgesPage.css'

/** Last day the Stripe promotion code works (set on the code in Stripe; keep the two in sync). */
export const JUDGES_CODE_DEADLINE = 'October 20, 2026'

/**
 * The promotion code comes from the link in the private judges' notes (?code=…), never from the
 * source: a public page or bundle would leak a 100%-off code.
 */
export function readJudgeCode(search: string): string | null {
  const code = new URLSearchParams(search).get('code')?.trim().toUpperCase() ?? ''
  return /^[A-Z0-9-]{6,40}$/.test(code) ? code : null
}

/**
 * The judges' page (JUDGES_PATH, a random path): not linked from the site, not indexed (X-Robots-Tag in worker.ts, meta here). Steps to
 * unlock Pro through the real web-to-app flow: the founding checkout ($19.99/year), the code takes
 * the first year to $0, and the Redeem link unlocks Pro in the app.
 */
export function JudgesPage() {
  const [code] = useState(() => readJudgeCode(window.location.search))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = PAGE_META[JUDGES_PATH].title
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [])

  function copy() {
    if (!code) return
    void navigator.clipboard?.writeText(code).then(() => setCopied(true)).catch(() => undefined)
  }

  return <main className="jg-page funnel-tokens">
    <div className="jg-card">
      <img className="jg-logo" src="/brand/sted-primary-horizontal.svg" alt="Sted" />
      <h1>Sted Pro for Shipaton judges</h1>
      <p className="jg-lede">Free access to Pro through the same web-to-app flow our customers use: RevenueCat Funnels, Stripe checkout and a Redemption Link that opens the app. <strong>iPhone only.</strong></p>

      <div className="jg-code">
        {code
          ? <><span>Promotion code</span><code>{code}</code><button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button></>
          : <p>Use the promotion code from the judges’ notes on Devpost.</p>}
      </div>

      <ol className="jg-steps">
        <li>On your iPhone, install Sted from the <a href={APP_STORE_URL ?? '#'}>App Store</a>.</li>
        <li>On the same iPhone, open the checkout: <CheckoutLink plan="founding" source="judges" className="jg-open" noticeClassName="jg-notice">Open Sted Pro checkout →</CheckoutLink></li>
        <li>On the Sted Pro screen, tap <strong>Continue</strong>.</li>
        <li>In the Stripe checkout, tap <strong>Add promotion code</strong> and paste the code. The total becomes <strong>$0.00</strong>: your first year of Pro is free and nothing is charged today.</li>
        <li>Complete the checkout, open the confirmation email on your iPhone and tap <strong>Redeem Now</strong>. Sted opens with Pro unlocked.</li>
      </ol>
      <p className="jg-note">The code works until {JUDGES_CODE_DEADLINE}. Pro unlocks in the Sted app on the iPhone where you tap Redeem.</p>
    </div>
  </main>
}
