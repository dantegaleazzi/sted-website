import { useEffect, useState } from 'react'

/** What people save, one word at a time in the hero subtitle. */
export const SAVE_KINDS = ['link', 'post', 'video', 'podcast', 'note'] as const

/**
 * Cycles through the kinds of saves inside the subtitle sentence. The active word remounts (key)
 * so the CSS enter animation plays; with reduced motion the first word stays put.
 */
export function RotatingWord({ words = SAVE_KINDS, every = 2200 }: { words?: readonly string[]; every?: number }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndex(current => (current + 1) % words.length), every)
    return () => window.clearInterval(id)
  }, [words, every])
  return <span className="l4c-rotate" aria-label={words.join(', ')}>
    <span key={words[index]} className="l4c-rotate-word" aria-hidden="true">{words[index]}</span>
  </span>
}
