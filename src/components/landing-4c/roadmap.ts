/** What's shipping next, in the order it lands. None of it is part of a plan until it's live. */
export const ROADMAP = [
  { name: 'Chat on iOS', status: 'Ready · submitting soon', body: 'Ask anything about what you saved, right in the app.' },
  { name: 'Chrome and Safari extensions', status: 'Pending approval', body: 'Save from your computer in one click.' },
  { name: 'Sted for Android', status: 'Submitted · pending approval', body: 'The full app, with chat built in.' },
  { name: 'More cool features', status: 'On the way', body: 'Tell us what you’d like Sted to do next.' },
] as const

export const FEATURE_REQUEST_URL = 'mailto:hello@sted.ai?subject=Feature%20idea%20for%20Sted'
