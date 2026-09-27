import { useState, type ReactNode } from 'react'
import { checkoutUrl, type Plan } from '../growth-funnel/founding-offer'
import { loadFunnelSession } from '../growth-funnel/funnel-session'

/**
 * A link straight to the RevenueCat funnel. The URL (session, UTMs, period, source_page) is built on
 * click, so the markup stays static. If the funnel for this plan isn't set (founding offer before its
 * RevenueCat link exists, review builds only) it says so instead of sending people to the wrong price.
 */
export function CheckoutLink({ plan, source, className, noticeClassName, children }: {
  plan: Plan; source: string; className: string; noticeClassName?: string; children: ReactNode
}) {
  const [notice, setNotice] = useState<string | null>(null)
  // Also on pointerdown/focus, so middle-click and "open in new tab" get the real URL too.
  const prepare = (anchor: HTMLAnchorElement) => {
    const url = checkoutUrl(plan, loadFunnelSession(), source)
    if (url) anchor.href = url
    return url
  }
  return <>
    <a className={className} href="#pricing" onPointerDown={event => prepare(event.currentTarget)} onFocus={event => prepare(event.currentTarget)} onClick={event => {
      if (prepare(event.currentTarget)) return
      event.preventDefault()
      console.error(`[sted checkout] No RevenueCat funnel URL for the "${plan}" plan.`)
      setNotice(import.meta.env.DEV
        ? 'FOUNDING_FUNNEL_URL isn’t set yet (app-links.ts). The founding checkout opens once RevenueCat has the funnel.'
        : 'Checkout isn’t available right now. Please try again later.')
    }}>{children}</a>
    {notice && <p className={noticeClassName} role="status">{notice}</p>}
  </>
}
