import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { Root } from './root'

export { PAGE_META } from './page-meta'
export { COMPARE_PATHS } from './components/compare/compare-paths'
export { ARCHIVE_PATHS } from './archive-paths'

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
