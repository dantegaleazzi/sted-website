/** What's shipping next, in the order it lands. None of it is part of a plan until it's live. */
export const ROADMAP = [
  { name: 'Chat on iOS', status: 'Ready · submitting soon', body: 'Ask anything about what you saved, right in the app.' },
  { name: 'Chrome and Safari extensions', status: 'Pending approval', body: 'Save from your computer in one click.' },
  { name: 'Sted for Android', status: 'Submitted · in review', body: 'The full app, with chat built in.' },
] as const

/** The landing leads with chat, shown with the real "Ask Sted" screen from the iOS build. */
export const ROADMAP_FEATURE = {
  headline: 'Talk to everything you’ve saved.',
  body: 'Chat is coming to Sted on iPhone. Ask what you saved about AI agents, what you read this week, or anything in between.',
  image: '/content/landing-4c/app/chat.webp',
} as const

export const FEATURE_REQUEST_URL = 'mailto:hello@sted.ai?subject=Feature%20idea%20for%20Sted'
