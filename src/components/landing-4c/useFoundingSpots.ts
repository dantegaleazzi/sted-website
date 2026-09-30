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
 * Founding spots: the hand-kept count (FOUNDING.claimed, also what the prerendered page says), replaced
 * by the Worker's live Stripe count once that's configured.
 */
export function useFoundingSpots(): FoundingSpots | null {
  const [spots, setSpots] = useState<FoundingSpots | null>({ claimed: FOUNDING.claimed, total: FOUNDING.spots })
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
