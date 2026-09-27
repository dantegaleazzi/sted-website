import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { OutputDemo } from './OutputDemo'

describe('hero output demo', () => {
  const html = renderToStaticMarkup(createElement(OutputDemo))

  it('offers Summary, Topics and Daily Recap as pills, Summary first', () => {
    expect([...html.matchAll(/<button type="button" aria-pressed="(true|false)">([^<]+)<\/button>/g)].map(match => [match[2], match[1]]))
      .toEqual([['Summary', 'true'], ['Topics', 'false'], ['Daily Recap', 'false']])
  })

  it('shows the save with its clean title, not the scraped t.co link', () => {
    expect(html).toContain('How to fix your entire life in 1 day')
    expect(html).not.toContain('t.co')
  })
})
