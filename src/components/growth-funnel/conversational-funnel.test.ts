import { describe, expect, it } from 'vitest'
import { EXAMPLES, PERSONAS, examplesFor, findExample, sourceReply, storageReply, togglePurpose, toggleSource, toggleStorage } from './funnel-content'
import { toEventRow } from './funnel-events'
import { buildPlanUrl, readUtm, type FunnelAnswers } from './funnel-session'

const session = { id: '00000000-0000-4000-8000-000000000001', utm: { utm_source: 'instagram', utm_campaign: 'launch' } }
const answers: FunnelAnswers = { persona: 'creator', sources: ['Instagram', 'X'], storage: ['messages', 'tabs'], purposes: ['content'], need: 'keypoints', example: 'dan-koe' }

describe('funnel content', () => {
  it('has two real examples with app content for every persona, including Other', () => {
    for (const { id } of PERSONAS) {
      expect(EXAMPLES[id]).toHaveLength(2)
      for (const example of EXAMPLES[id]) {
        expect(example.url).toMatch(/^https:\/\//)
        expect(example.thumb).toMatch(/^\/content\//)
        expect(example.summary.length).toBeGreaterThan(20)
        expect(example.keyIdeas.length).toBeGreaterThan(1)
        expect(example.topics.length).toBeGreaterThan(0)
      }
    }
    expect(findExample('creator', 'dan-koe')?.screen).toBe('/content/funnel/screens/x-dan-koe.webp')
    expect(findExample('developer', 'dan-koe')).toBeNull()
    expect(findExample(null, 'dan-koe')).toBeNull()
  })

  it('lists examples from the places you save first', () => {
    expect(examplesFor('creator', ['Instagram']).map(example => example.id)).toEqual(['dji-osmo', 'dan-koe'])
    expect(examplesFor('creator', ['X']).map(example => example.id)).toEqual(['dan-koe', 'dji-osmo'])
    expect(examplesFor('creator', ['Everywhere']).map(example => example.id)).toEqual(['dan-koe', 'dji-osmo'])
    expect(examplesFor('developer', []).map(example => example.id)).toEqual(['karakeep', 'shadcn-chatbot'])
    expect(examplesFor('designer', ['Spotify']).map(example => example.id)).toEqual(['lenny-ian-silber', 'pinterest-exterior'])
    expect(examplesFor('founder', ['Websites']).map(example => example.id)).toEqual(['revenuecat-storekit', 'firecrawl'])
  })

  it('keeps the catch-all answers exclusive', () => {
    expect(togglePurpose(['work', 'learning'], 'everything')).toEqual(['everything'])
    expect(togglePurpose(['everything'], 'content')).toEqual(['content'])
    expect(toggleSource(['Instagram'], 'Everywhere')).toEqual(['Everywhere'])
    expect(toggleSource(['Everywhere'], 'X')).toEqual(['X'])
    expect(toggleSource(['Instagram', 'X'], 'X')).toEqual(['Instagram'])
    expect(toggleStorage(['notes', 'tabs'], 'nowhere')).toEqual(['nowhere'])
    expect(toggleStorage(['nowhere'], 'notes')).toEqual(['notes'])
  })

  it('replies to the places you picked', () => {
    expect(sourceReply(['TikTok', 'Websites'])).toBe('TikTok and Websites. Lots of things worth keeping.')
    expect(storageReply(['nowhere'])).toBe('Honestly? That’s most people. That’s why I’m here.')
    expect(storageReply(['messages'])).toBe('Texting links to yourself. A classic.')
    expect(storageReply(['notes'])).toBe('Got it. Let’s put all of it in one place.')
    expect(sourceReply(['Everywhere'])).toBe('A little here, a little there. Sound familiar?')
    expect(sourceReply([])).toBe('A link today. Another tomorrow.')
  })
})

describe('RevenueCat handoff', () => {
  it('reads and trims UTM parameters only', () => {
    expect(readUtm('?utm_source=tiktok&utm_content=%20reel-1%20&ref=x&utm_medium=')).toEqual({ utm_source: 'tiktok', utm_content: 'reel-1' })
  })

  it('appends UTMs, session and answers to the funnel URL', () => {
    const url = new URL(buildPlanUrl('https://pay.rev.cat/funnel/sted?lang=en', session, answers))
    expect(url.origin + url.pathname).toBe('https://pay.rev.cat/funnel/sted')
    expect(url.searchParams.get('lang')).toBe('en')
    expect(url.searchParams.get('utm_source')).toBe('instagram')
    expect(url.searchParams.get('utm_campaign')).toBe('launch')
    expect(url.searchParams.get('sted_session_id')).toBe(session.id)
    expect(url.searchParams.get('persona')).toBe('creator')
    expect(url.searchParams.get('sources')).toBe('instagram,x')
    expect(url.searchParams.get('storage')).toBe('messages,tabs')
    expect(url.searchParams.get('purpose')).toBe('content')
    expect(url.searchParams.get('need')).toBe('keypoints')
    expect(url.searchParams.get('example')).toBe('dan-koe')
    expect(url.searchParams.has('app_user_id')).toBe(false)
  })

  it('keeps UTMs already set on the RevenueCat URL', () => {
    const url = new URL(buildPlanUrl('https://pay.rev.cat/funnel/sted?utm_source=web', session, answers))
    expect(url.searchParams.getAll('utm_source')).toEqual(['web'])
  })
})

describe('funnel events', () => {
  it('builds an anonymous row matching the SQL columns', () => {
    expect(toEventRow('plan_clicked', 7, session, answers, '/start')).toEqual({
      session_id: session.id, event: 'plan_clicked', step: 7,
      persona: 'creator', sources: ['instagram', 'x'], storage: ['messages', 'tabs'], purposes: ['content'], need: 'keypoints', example: 'dan-koe',
      utm_source: 'instagram', utm_medium: null, utm_campaign: 'launch', utm_content: null, utm_term: null,
      path: '/start',
    })
  })
})
