import { createClient } from '@supabase/supabase-js'

/** Set to the App Store listing URL once the iPhone app is live. */
export const APP_STORE_URL: string | null = null

/** Set once the web sign-in / dashboard exists. */
export const SIGN_IN_URL: string | null = null

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const supabase = supabaseUrl && supabasePublishableKey ? createClient(supabaseUrl, supabasePublishableKey) : null

export type WaitlistResult = 'joined' | 'unavailable' | 'error'

/** Same insert as the live site's waitlist; a duplicate email counts as joined. */
export async function joinWaitlist(email: string): Promise<WaitlistResult> {
  if (!supabase) return 'unavailable'
  const source = new URLSearchParams(window.location.search).get('ref')?.slice(0, 120) || null
  const { error } = await supabase.from('waitlist').insert({ email: email.trim().toLowerCase(), source })
  if (error && error.code !== '23505') return 'error'
  return 'joined'
}

export const WAITLIST_MESSAGES: Record<WaitlistResult, string> = {
  joined: 'You’re on the list. We’ll email you when Android is ready.',
  unavailable: 'Notifications are temporarily unavailable. Please try again shortly.',
  error: 'Something went wrong. Please try again.',
}
