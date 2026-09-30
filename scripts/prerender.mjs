// Build-time prerender. Crawlers that don't run JavaScript (most AI search bots) and slow phones get the
// landing's real text in the first response; the browser then hydrates it (src/main.tsx).
// Every other public page gets its own HTML file with its CSS linked, so none of them opens on the
// landing's markup. A page that can't render on the server falls back to the empty shell.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = 'dist'
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, '.vite/manifest.json'), 'utf8'))
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
const { render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href)

// Page → [file written, the lazy module it renders, prerender it?]. Keep in sync with src/root.tsx and PUBLIC_PAGES.
const LANDING = 'src/components/landing-4c/Landing4CPreview.tsx'
const SITE = 'src/site.tsx'
const FUNNEL = 'src/components/growth-funnel/ConversationalFunnel.tsx'
const PAGES = [
  ['/', 'index.html', LANDING, true],
  ['/start', 'start.html', FUNNEL, false],
  ['/privacy', 'privacy.html', SITE, false],
  ['/terms', 'terms.html', SITE, false],
  ['/delete-account', 'delete-account.html', SITE, false],
  ['/support', 'support.html', SITE, false],
  ['/about', 'about.html', SITE, false],
  ['/contact', 'contact.html', SITE, false],
]

/** The CSS and JS a lazy module needs, following its static imports (shared chunks carry CSS too). */
function assetsFor(key, seen = new Set()) {
  const chunk = manifest[key]
  if (!chunk || seen.has(key)) return { css: [], js: [] }
  seen.add(key)
  const out = { css: [...(chunk.css ?? [])], js: [chunk.file] }
  for (const child of chunk.imports ?? []) {
    const sub = assetsFor(child, seen)
    out.css.push(...sub.css)
    out.js.push(...sub.js)
  }
  return out
}

for (const [pathname, file, module, prerender] of PAGES) {
  const { css, js } = assetsFor(module)
  // Skip what the shell already links (the entry script and its CSS).
  const fresh = href => !template.includes(`/${href}"`)
  const links = [...new Set(css)].filter(fresh).map(href => `<link rel="stylesheet" crossorigin href="/${href}">`)
    .concat([...new Set(js)].filter(fresh).map(href => `<link rel="modulepreload" crossorigin href="/${href}">`)).join('\n    ')
  let body = ''
  if (prerender) {
    try { body = await render(pathname) } catch (error) { console.warn(`prerender: ${pathname} falls back to the shell:`, error.message) }
  }
  const html = template.replace('</head>', `  ${links}\n  </head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  fs.writeFileSync(path.join(DIST, file), html)
  console.log(`prerender: ${pathname} → dist/${file}${body ? ` (${Math.round(body.length / 1024)} KB of HTML)` : ' (shell)'}`)
}

// The manifest was only for this script; don't ship it.
fs.rmSync(path.join(DIST, '.vite'), { recursive: true, force: true })
