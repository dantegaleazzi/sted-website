import { useEffect, useState } from 'react'
import { FOUNDING } from '../growth-funnel/founding-offer'

export type FoundingSpots = { claimed: number; total: number }

let request: Promise<FoundingSpots | null> | null = null

/** One request per page: the Worker counts founding subscriptions in Stripe (see worker.ts). */
function fetchSpots() {
  request ??= fetch('/api/founding-spots')
    .then(response => response.ok ? response.json() : null)
    .then((body: { ok?: boolean; claimed?: number; total?: number } | null) =>
      body?.ok && typeof body.claimed === 'number' && typeof body.total === 'number' ? { claimed: body.claimed, total: body.total } : null)
    .catch(() => null)
  return request
}

/**
 * Real founding spots, or null while unknown (then the site says "first 100 members" and shows no
 * count). The dev server has no Worker, so DEV previews the layout with nothing claimed yet.
 */
export function useFoundingSpots(): FoundingSpots | null {
  const [spots, setSpots] = useState<FoundingSpots | null>(import.meta.env.DEV ? { claimed: 0, total: FOUNDING.spots } : null)
  useEffect(() => {
    let live = true
    void fetchSpots().then(result => { if (live && result) setSpots(result) })
    return () => { live = false }
  }, [])
  return spots
}

export const isSoldOut = (spots: FoundingSpots | null) => spots !== null && spots.claimed >= spots.total

export function spotsLeft(spots: FoundingSpots | null) {
  return spots ? `${spots.total - spots.claimed} of ${spots.total} left` : `First ${FOUNDING.spots} members`
}

/** The hero's short form: "100 founding spots" until the count is known, then "63 founding spots left". */
export function foundingSpotsLabel(spots: FoundingSpots | null) {
  return spots ? `${spots.total - spots.claimed} founding spots left` : `${FOUNDING.spots} founding spots`
}
