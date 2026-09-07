import type { SourceType } from './types'

/**
 * The asset audit found no official platform icon files in this repository.
 * These compact marks are intentionally monochrome/typographic and are kept
 * behind one component so official SVGs can replace them without touching cards.
 */
export function SourceIcon({ type }: { type: SourceType }) {
  const mark: Record<SourceType, string> = {
    x: '𝕏', youtube: '▶', instagram: '◎', tiktok: '♪', github: 'GH', article: '↗',
    medium: 'M', substack: 'S', notion: 'N', pdf: 'PDF', reddit: 'r/', pinterest: 'P',
    spotify: '●', place: '⌖', product: 'P', website: '◉', threads: '@', bluesky: '✦',
  }
  return <span className={`source-icon source-icon--${type}`} aria-hidden="true">{mark[type]}</span>
}

