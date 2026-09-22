/**
 * Feature showcase rotation rules:
 * - Auto-advances every ROTATE_MS while the section is on screen.
 * - Hovering/focusing an item activates it and pauses rotation until the pointer leaves.
 * - Clicking an item pins it: rotation stops for good.
 * - With prefers-reduced-motion there is no auto-advance at all.
 */
export const ROTATE_MS = 6000

export type RotationState<K extends string> = { active: K; hovering: boolean; pinned: boolean }

export type RotationAction<K extends string> =
  | { type: 'hover'; key: K }
  | { type: 'leave' }
  | { type: 'pin'; key: K }
  | { type: 'advance'; keys: readonly K[] }

export function rotationReducer<K extends string>(state: RotationState<K>, action: RotationAction<K>): RotationState<K> {
  switch (action.type) {
    case 'hover':
      return { ...state, active: action.key, hovering: true }
    case 'leave':
      return { ...state, hovering: false }
    case 'pin':
      return { ...state, active: action.key, pinned: true }
    case 'advance': {
      if (state.pinned || state.hovering) return state
      const index = action.keys.indexOf(state.active)
      return { ...state, active: action.keys[(index + 1) % action.keys.length] }
    }
  }
}

export function isRotating(state: RotationState<string>, env: { autoplay: boolean; inView: boolean; reducedMotion: boolean }) {
  return env.autoplay && !env.reducedMotion && !state.pinned && !state.hovering && env.inView
}
