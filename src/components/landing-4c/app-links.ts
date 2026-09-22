import { createClient } from '@supabase/supabase-js'

/** Set to the App Store listing URL once the iPhone app is live. */
export const APP_STORE_URL: string | null = null

/** Set once the web sign-in / dashboard exists. */
export const SIGN_IN_URL: string | null = null

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const supabase = supabaseUrl && supabasePublishableKey ? createClient(supabaseUrl, supabasePublishableKey) : null

export type WaitlistResult = 'joined' | 'unavailable' | 'error'

/** What the visitor signed up for. Stored in `waitlist.source` so the Android list can be
 *  told apart from the original waitlist ("android" or "android:<ref>" when a ?ref= is present). */
export type WaitlistList = 'android'

/** Same insert as the live site's waitlist; a duplicate email counts as joined.
 *  Note: this only records the email. No confirmation email is sent; the follow-up is manual. */
export async function joinWaitlist(email: string, list: WaitlistList): Promise<WaitlistResult> {
  if (!supabase) return 'unavailable'
  const ref = new URLSearchParams(window.location.search).get('ref')?.slice(0, 100)
  const source = ref ? `${list}:${ref}` : list
  const { error } = await supabase.from('waitlist').insert({ email: email.trim().toLowerCase(), source })
  if (error && error.code !== '23505') return 'error'
  return 'joined'
}

export const WAITLIST_MESSAGES: Record<WaitlistResult, string> = {
  joined: 'You’re on the list. We’ll let you know when Sted for Android is ready.',
  unavailable: 'Sign-ups are temporarily unavailable. Please try again shortly.',
  error: 'Something went wrong. Please try again.',
}
