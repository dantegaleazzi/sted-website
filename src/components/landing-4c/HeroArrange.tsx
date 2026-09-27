import { useEffect, useState } from 'react'
import './HeroArrange.css'

const CARDS = ['podcast', 'post', 'kyoto', 'web', 'repo'] as const

type Placement = { left: number; top: number; width: number; deg: number }

function read(el: HTMLElement): Placement {
  const matrix = new DOMMatrix(getComputedStyle(el).transform === 'none' ? undefined : getComputedStyle(el).transform)
  const deg = Math.round(Math.atan2(matrix.b, matrix.a) * 180 / Math.PI * 2) / 2
  return { left: Math.round(el.offsetLeft), top: Math.round(el.offsetTop), width: el.offsetWidth, deg }
}

function write(el: HTMLElement, p: Placement) {
  el.style.left = `${p.left}px`
  el.style.top = `${p.top}px`
  el.style.width = `${p.width}px`
  el.style.transform = p.deg ? `rotate(${p.deg}deg)` : 'none'
  el.style.setProperty('--l4c-tilt', `${p.deg}deg`)
}

function css(placements: Record<string, Placement>) {
  return CARDS.map(name => {
    const p = placements[name]
    const transform = p.deg ? `rotate(${p.deg}deg)` : 'none'
    return `.l4c-card-${name} { left: ${p.left}px; top: ${p.top}px; width: ${p.width}px; transform: ${transform}; --l4c-tilt: ${p.deg}deg; }`
  }).join('\n')
}

/**
 * DEV only, with ?arrange=1: drag the five hero cards on the 1600×820 canvas. Wheel rotates the card
 * under the pointer by 0.5°, Shift+wheel changes its width by 2px. Every change prints the CSS.
 */
export default function HeroArrange() {
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const scene = document.querySelector<HTMLElement>('.l4c-scene')
    const cards = CARDS.map(name => document.querySelector<HTMLElement>(`.l4c-card-${name}`))
    if (!scene || cards.some(card => !card)) return
    const elements = cards as HTMLElement[]
    const placements: Record<string, Placement> = Object.fromEntries(CARDS.map((name, i) => [name, read(elements[i])]))
    const publish = () => {
      const text = css(placements)
      setOutput(text)
      console.info(`[arrange]\n${text}`)
    }
    publish()
    document.documentElement.classList.add('l4c-arranging')

    const scale = () => scene.getBoundingClientRect().width / 1600
    const cleanups = elements.map((el, i) => {
      const name = CARDS[i]
      let start: { x: number; y: number; left: number; top: number } | null = null
      const down = (event: PointerEvent) => {
        event.preventDefault()
        el.setPointerCapture(event.pointerId)
        start = { x: event.clientX, y: event.clientY, left: placements[name].left, top: placements[name].top }
      }
      const move = (event: PointerEvent) => {
        if (!start) return
        const k = scale()
        placements[name] = { ...placements[name], left: Math.round(start.left + (event.clientX - start.x) / k), top: Math.round(start.top + (event.clientY - start.y) / k) }
        write(el, placements[name])
      }
      const up = () => { if (start) { start = null; publish() } }
      const wheel = (event: WheelEvent) => {
        event.preventDefault()
        const step = event.deltaY > 0 ? 1 : -1
        const p = placements[name]
        placements[name] = event.shiftKey
          ? { ...p, width: Math.max(120, p.width + step * 2) }
          : { ...p, deg: Math.max(-6, Math.min(6, p.deg + step * 0.5)) }
        write(el, placements[name])
        publish()
      }
      const click = (event: MouseEvent) => event.preventDefault()
      el.addEventListener('pointerdown', down)
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerup', up)
      el.addEventListener('pointercancel', up)
      el.addEventListener('wheel', wheel, { passive: false })
      el.addEventListener('click', click)
      return () => {
        el.removeEventListener('pointerdown', down)
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerup', up)
        el.removeEventListener('pointercancel', up)
        el.removeEventListener('wheel', wheel)
        el.removeEventListener('click', click)
      }
    })
    return () => {
      cleanups.forEach(cleanup => cleanup())
      document.documentElement.classList.remove('l4c-arranging')
    }
  }, [])

  const copy = () => {
    void navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    })
  }

  return <aside className="l4c-arrange-panel" aria-label="Arrange hero cards">
    <header>
      <strong>Arrange</strong>
      <span>Drag a card · wheel rotates · Shift+wheel resizes</span>
      <button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy CSS'}</button>
    </header>
    <pre>{output}</pre>
  </aside>
}
