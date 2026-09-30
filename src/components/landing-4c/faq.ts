import { FOUNDING, foundingTerms } from '../growth-funnel/founding-offer'
import { PLAN_CAPACITY, getPeriod } from '../growth-funnel/funnel-pricing'

const n = (value: number) => value.toLocaleString('en-US')
const free = PLAN_CAPACITY.free
const pro = PLAN_CAPACITY.pro
const offer = foundingTerms()

/**
 * The landing's FAQ, also published as FAQPage structured data. Short, direct answers: these are the
 * lines search and AI assistants quote. Keep every answer true to what's live (prices come from the
 * same modules as Pricing).
 */
export const FAQ: { question: string; answer: string }[] = [
  {
    question: 'What is Sted?',
    answer: 'Sted is an app for everything you save online. Share a link from any app, like a video, a post, a podcast or an article, and Sted reads it for you: it writes a summary and the key ideas, sorts it into topics and projects, and every 10 saves puts together The Recap, with what’s worth your time.',
  },
  {
    question: 'Is Sted free?',
    answer: `Yes. Sted is free to download and use, with up to ${n(free.saves)} saves and ${n(free.aiSavesPerMonth)} AI summaries a month. Sted Pro adds unlimited saves, ${n(pro.aiSavesPerMonth)} AI summaries a month and extended chat. The first ${FOUNDING.spots} members get Pro for ${offer.price} a year instead of ${getPeriod('annual').price}, for as long as they stay subscribed.`,
  },
  {
    question: 'What can I save to Sted?',
    answer: 'Links from Instagram, YouTube, X, Spotify, GitHub, Safari and most websites: posts, videos, podcasts, articles, repositories and pages. Save them from the iOS share sheet without leaving the app you’re in, or paste a link into Sted. Screenshots, PDFs, notes and docs are coming next.',
  },
  {
    question: 'Can I chat with what I saved?',
    answer: 'Yes. Ask Sted, new on iPhone, lets you ask anything about what you saved, summarize today’s saves, recap your week and save links right from the chat. Answers come with the saves they’re based on, and your past conversations stay in History.',
  },
  {
    question: 'How is Sted different from bookmarks or saving to Notes?',
    answer: 'Bookmarks and notes keep the link. Sted reads it: every save comes back with a summary, the key ideas and its topics, so you can find it and use it without going back through it.',
  },
  {
    question: 'Which devices does Sted work on?',
    answer: 'Sted is on iPhone today (iOS 17 or later). Browser extensions for Chrome and Safari, a web dashboard and Sted for Android are coming soon.',
  },
  {
    question: 'How do I get Sted Pro?',
    answer: 'Tap Sted Pro on this page and pay securely on the web. Then open the confirmation email on your iPhone and tap Redeem to unlock Pro in the app. You can cancel anytime.',
  },
  {
    question: 'Is my data private?',
    answer: 'Sted doesn’t sell what you save or use it for ads, and it doesn’t use your conversations to train its own AI models. AI features are optional and can be turned off in Settings, and you can delete all your data from the app at any time. Details are in the Privacy Policy.',
  },
]

/** FAQPage structured data built from the same answers the page shows. */
export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  }
}
