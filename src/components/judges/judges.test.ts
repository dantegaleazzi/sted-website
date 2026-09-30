import { describe, expect, it } from 'vitest'
import { readJudgeCode } from './JudgesPage'

describe('judges promotion code', () => {
  it('comes only from the private link, normalised', () => {
    expect(readJudgeCode('?code=shipaton-judges-abc123')).toBe('SHIPATON-JUDGES-ABC123')
    expect(readJudgeCode('')).toBeNull()
    expect(readJudgeCode('?code=<script>')).toBeNull()
  })
})
