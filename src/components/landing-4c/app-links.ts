/** Sted iOS app listing. */
export const APP_STORE_URL: string | null = 'https://apps.apple.com/es/app/sted-ai/id6805940694'

/** Sted web dashboard sign-in. */
export const SIGN_IN_URL: string | null = 'https://dashboard.sted.ai/'

/**
 * Production RevenueCat Web-to-App Funnel (paywall → Stripe checkout → redemption link that opens
 * the app). RevenueCat owns prices and periods; the /start funnel only hands off here from its
 * final "See my plan" button, via buildPlanUrl(). The only place this URL lives.
 */
export const REVENUECAT_FUNNEL_URL: string | null = 'https://signup.cat/ZfSBmYBUIHRKvlzo/'
