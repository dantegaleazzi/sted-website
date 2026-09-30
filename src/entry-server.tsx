import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { Root } from './root'

/** Build-time only (scripts/prerender.mjs): the HTML of one page, with every lazy chunk resolved. */
export async function render(pathname: string): Promise<string> {
  const { prelude } = await prerender(<StrictMode><Root pathname={pathname} /></StrictMode>)
  const reader = prelude.getReader()
  const decoder = new TextDecoder()
  let html = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return html + decoder.decode()
    html += decoder.decode(value, { stream: true })
  }
}
