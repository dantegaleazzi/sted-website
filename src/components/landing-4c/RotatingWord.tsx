import { useEffect, useState } from 'react'

/** What people save, one word at a time in the hero subtitle. */
export const SAVE_KINDS = ['link', 'post', 'video', 'podcast', 'article'] as const

/**
 * Cycles through the kinds of saves inside the subtitle sentence. The active word remounts (key)
 * so the CSS enter animation plays; with reduced motion the first word stays put. The page text
 * (screen readers, crawlers, AI assistants) gets the whole list once as one phrase, "link, post, … or
 * article"; the visible word is drawn by CSS from data-word, so it isn't read a second time.
 */
export function RotatingWord({ words = SAVE_KINDS, every = 2200 }: { words?: readonly string[]; every?: number }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndex(current => (current + 1) % words.length), every)
    return () => window.clearInterval(id)
  }, [words, every])
  return <span className="l4c-rotate">
    <span className="l4c-sr">{`${words.slice(0, -1).join(', ')} or ${words[words.length - 1]}`}</span>
    <span key={words[index]} className="l4c-rotate-word" data-word={words[index]} aria-hidden="true" />
  </span>
}
