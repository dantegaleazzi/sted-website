import { useEffect, useId, useRef, useState } from 'react'
import './StedMenu.css'

export function StedMenu() {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [open])
  return <div ref={root} className="sted-menu" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <div className="sted-menu__control" data-open={open}>
      <a className="sted-menu__brand" href="/#top" aria-label="Sted home" onClick={() => setOpen(false)}>
        <img src="/brand/sted-primary-horizontal.svg" alt="Sted" width="65.6" height="22.96" />
      </a>
    <button ref={trigger} type="button" className="sted-menu__trigger" aria-label="Sted navigation" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(value => !value)}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    </button>
    </div>
    <nav id={panelId} className="sted-menu__panel" aria-label="Primary navigation" hidden={!open} onClick={() => setOpen(false)}>
      <a href="/about#how-it-works">How it works</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>
}
