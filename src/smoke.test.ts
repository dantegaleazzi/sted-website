import { describe, expect, it } from 'vitest'

describe('Sted landing page', () => {
  it('keeps the Day 1 build message intact', () => {
    expect('Everything you save. Finally useful.').toContain('Finally useful.')
  })
})
