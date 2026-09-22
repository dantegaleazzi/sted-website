import { describe, expect, it } from 'vitest'
import { isRotating, rotationReducer, type RotationState } from './showcase-rotation'

const KEYS = ['chat', 'summary', 'feed'] as const
type Key = (typeof KEYS)[number]
const start: RotationState<Key> = { active: 'chat', hovering: false, pinned: false }
const env = { autoplay: true, inView: true, reducedMotion: false }

describe('showcase rotation', () => {
  it('advances in order and wraps around', () => {
    let state = start
    state = rotationReducer(state, { type: 'advance', keys: KEYS })
    expect(state.active).toBe('summary')
    state = rotationReducer(state, { type: 'advance', keys: KEYS })
    state = rotationReducer(state, { type: 'advance', keys: KEYS })
    expect(state.active).toBe('chat')
  })

  it('hover activates the item and pauses until leave', () => {
    let state = rotationReducer(start, { type: 'hover', key: 'feed' })
    expect(state.active).toBe('feed')
    expect(isRotating(state, env)).toBe(false)
    expect(rotationReducer(state, { type: 'advance', keys: KEYS }).active).toBe('feed')
    state = rotationReducer(state, { type: 'leave' })
    expect(isRotating(state, env)).toBe(true)
    expect(rotationReducer(state, { type: 'advance', keys: KEYS }).active).toBe('chat')
  })

  it('click pins the item and stops rotation even after leave', () => {
    let state = rotationReducer(start, { type: 'pin', key: 'summary' })
    state = rotationReducer(state, { type: 'leave' })
    expect(state.active).toBe('summary')
    expect(isRotating(state, env)).toBe(false)
    expect(rotationReducer(state, { type: 'advance', keys: KEYS }).active).toBe('summary')
  })

  it('does not rotate off screen, with reduced motion, or without autoplay', () => {
    expect(isRotating(start, { ...env, inView: false })).toBe(false)
    expect(isRotating(start, { ...env, reducedMotion: true })).toBe(false)
    expect(isRotating(start, { ...env, autoplay: false })).toBe(false)
  })
})
