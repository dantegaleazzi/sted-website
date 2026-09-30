/** What's shipping next, in the order it lands. None of it is part of a plan until it's live. */
export const ROADMAP = [
  { name: 'Chrome and Safari extensions', status: 'Launching soon', body: 'Save from your computer in one click.' },
  { name: 'Web dashboard', status: 'Launching soon', body: 'Your whole library, on any computer.' },
  { name: 'Sted for Android', status: 'Submitted · in review', body: 'The full app, with chat built in.' },
  { name: 'Screenshots, PDFs, notes and docs', status: 'Up next', body: 'Save more than links, and get the same summary, key ideas and topics.' },
] as const

export const FEATURE_REQUEST_URL = 'mailto:hello@sted.ai?subject=Feature%20idea%20for%20Sted'
