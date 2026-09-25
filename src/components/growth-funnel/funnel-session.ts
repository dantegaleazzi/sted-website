import type { Need, Persona, Purpose, Storage } from './funnel-content'
import type { Period } from './funnel-pricing'

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
export type UtmKey = (typeof UTM_KEYS)[number]
export type Utm = Partial<Record<UtmKey, string>>

export type FunnelAnswers = {
  persona: Persona | null
  sources: string[]
  storage: Storage[]
  purposes: Purpose[]
  need: Need | null
  example: string | null
}

export type FunnelSession = { id: string; utm: Utm }

const MAX_PARAM = 120

export function readUtm(search: string): Utm {
  const params = new URLSearchParams(search)
  const utm: Utm = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim().slice(0, MAX_PARAM)
    if (value) utm[key] = value
  }
  return utm
}

const PERIODS: readonly Period[] = ['weekly', 'monthly', 'annual']

/** The billing period picked in the landing Pricing, carried to /start as ?period=. */
export function readPeriod(search: string): Period | null {
  const value = new URLSearchParams(search).get('period')
  return PERIODS.find(period => period === value) ?? null
}

/**
 * The only place the RevenueCat Funnel URL gets its query string. UTMs are read by RevenueCat
 * automatically; the sted_* answers are custom URL parameters, which RevenueCat only uses once
 * they're registered in the funnel settings. No app_user_id is sent, so RevenueCat creates an
 * anonymous user.
 */
export function buildPlanUrl(base: string, session: FunnelSession, answers: FunnelAnswers, period: Period | null = null): string {
  const url = new URL(base)
  for (const key of UTM_KEYS) {
    const value = session.utm[key]
    if (value && !url.searchParams.has(key)) url.searchParams.set(key, value)
  }
  url.searchParams.set('sted_session_id', session.id)
  if (answers.persona) url.searchParams.set('persona', answers.persona)
  if (answers.sources.length) url.searchParams.set('sources', answers.sources.join(',').toLowerCase())
  if (answers.storage.length) url.searchParams.set('storage', answers.storage.join(','))
  if (answers.purposes.length) url.searchParams.set('purpose', answers.purposes.join(','))
  if (answers.need) url.searchParams.set('need', answers.need)
  if (answers.example) url.searchParams.set('example', answers.example)
  if (period) url.searchParams.set('period', period)
  return url.toString()
}

const SESSION_KEY = 'sted_funnel_session'

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`
}

/**
 * One session per browser tab. UTMs from the current URL win; otherwise the ones captured when
 * the visitor first landed (e.g. on the landing page before opening the funnel) are kept.
 */
export function loadFunnelSession(search = window.location.search): FunnelSession {
  const fresh = readUtm(search)
  let stored: FunnelSession | null = null
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    if (raw) stored = JSON.parse(raw) as FunnelSession
  } catch { /* storage blocked: fall back to an in-memory session */ }
  const session: FunnelSession = {
    id: stored?.id ?? newId(),
    utm: Object.keys(fresh).length ? fresh : stored?.utm ?? {},
  }
  try { window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)) } catch { /* ignore */ }
  return session
}
