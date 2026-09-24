import type { SupabaseClient } from '@supabase/supabase-js'
import type { FunnelAnswers, FunnelSession } from './funnel-session'

export const FUNNEL_EVENTS = [
  'funnel_started', 'step_viewed', 'persona_selected', 'sources_selected', 'storage_selected', 'purpose_selected',
  'need_selected', 'example_selected', 'result_viewed', 'plan_clicked', 'funnel_closed',
] as const
export type FunnelEventName = (typeof FUNNEL_EVENTS)[number]

/** One row per event. Column names match docs/funnel-events.sql. No personal data. */
export type FunnelEventRow = {
  session_id: string
  event: FunnelEventName
  step: number
  persona: string | null
  sources: string[]
  storage: string[]
  purposes: string[]
  need: string | null
  example: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  path: string
}

export function toEventRow(event: FunnelEventName, step: number, session: FunnelSession, answers: FunnelAnswers, path: string): FunnelEventRow {
  return {
    session_id: session.id,
    event,
    step,
    persona: answers.persona,
    sources: answers.sources.map(source => source.toLowerCase()),
    storage: answers.storage,
    purposes: answers.purposes,
    need: answers.need,
    example: answers.example,
    utm_source: session.utm.utm_source ?? null,
    utm_medium: session.utm.utm_medium ?? null,
    utm_campaign: session.utm.utm_campaign ?? null,
    utm_content: session.utm.utm_content ?? null,
    utm_term: session.utm.utm_term ?? null,
    path: path.slice(0, 200),
  }
}

const BUFFER_KEY = 'sted_funnel_events'
const BUFFER_MAX = 60

// Off until the backend owner applies docs/funnel-events.sql and sets VITE_FUNNEL_EVENTS_TABLE.
const table = import.meta.env.VITE_FUNNEL_EVENTS_TABLE as string | undefined
let client: Promise<SupabaseClient | null> | null = null

function supabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!table || !url || !key) return null
  client ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(url, key)).catch(() => null)
  return client
}

/**
 * Fire-and-forget. Every event is kept in this tab's sessionStorage and broadcast as a
 * `sted:funnel` DOM event (so any analytics tool can listen); it's also appended to Supabase
 * once the table is enabled. Tracking never blocks or breaks the funnel.
 */
export function trackFunnelEvent(row: FunnelEventRow) {
  try {
    const raw = window.sessionStorage.getItem(BUFFER_KEY)
    const buffer: FunnelEventRow[] = raw ? JSON.parse(raw) : []
    buffer.push(row)
    window.sessionStorage.setItem(BUFFER_KEY, JSON.stringify(buffer.slice(-BUFFER_MAX)))
  } catch { /* storage blocked */ }
  window.dispatchEvent(new CustomEvent('sted:funnel', { detail: row }))
  if (import.meta.env.DEV) console.debug('[sted funnel]', row.event, row)
  void supabaseClient()?.then(db => db?.from(table!).insert(row)).catch(() => undefined)
}
