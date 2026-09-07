import type { SourceType } from './types'

const assets: Record<SourceType, string> = {
  x: 'x', youtube: 'youtube', instagram: 'instagram', tiktok: 'tiktok', github: 'github', article: 'web',
  medium: 'medium', substack: 'substack', notion: 'notion', pdf: 'unknown', reddit: 'reddit', pinterest: 'pinterest',
  spotify: 'spotify', place: 'unknown', product: 'product-hunt', website: 'web', threads: 'threads', bluesky: 'bluesky',
}

/** Source tiles supplied from the Sted design asset library. */
export function SourceIcon({ type }: { type: SourceType }) {
  return <img className={`source-icon source-icon--${type}`} src={`/brand/source-icons/${assets[type]}-tile.svg`} alt="" aria-hidden="true" />
}
