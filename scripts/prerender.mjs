// Build-time prerender. Crawlers that don't run JavaScript (most AI search bots) and slow phones get the
// landing's real text in the first response; the browser then hydrates it (src/main.tsx).
// Every other public page gets its own HTML file with its CSS linked, its own title, description and
// canonical (src/page-meta.ts), and its text too where it can render on the server. A page that can't
// falls back to the empty shell.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = 'dist'
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, '.vite/manifest.json'), 'utf8'))
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
const { render, PAGE_META, COMPARE_PATHS, ARCHIVE_PATHS } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href)

// Page → [file written, the lazy module it renders, prerender it?]. Keep in sync with src/root.tsx and PUBLIC_PAGES.
const LANDING = 'src/components/landing-4c/Landing4CPreview.tsx'
const SITE = 'src/site.tsx'
const FUNNEL = 'src/components/growth-funnel/ConversationalFunnel.tsx'
const CONTENT = 'src/components/content-pages/ContentPages.tsx'
const COMPARE = 'src/components/compare/ComparePages.tsx'
const PAGES = [
  ['/', 'index.html', LANDING, true],
  ['/start', 'start.html', FUNNEL, false], // session and funnel state live in the browser
  ['/privacy', 'privacy.html', SITE, true],
  ['/terms', 'terms.html', SITE, true],
  ['/delete-account', 'delete-account.html', SITE, true],
  ['/support', 'support.html', SITE, true],
  ['/about', 'about.html', SITE, true],
  ['/contact', 'contact.html', SITE, true],
  ['/how-to-use', 'how-to-use.html', CONTENT, true],
  ['/pocket-alternative', 'pocket-alternative.html', CONTENT, true],
  // /vs/recall → vs/recall.html, served at /vs/recall by the assets' auto-trailing-slash handling.
  ...COMPARE_PATHS.map(path => [path, `${path.slice(1)}.html`, COMPARE, true]),
  // The Shipaton archive (old guides): prerendered, noindex (also X-Robots-Tag in worker.ts).
  ...ARCHIVE_PATHS.map(path => [path, `${path.slice(1)}.html`, SITE, true]),
]

const escape = text => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** The landing's head, with this page's title, description, canonical and share URL. */
function headFor(pathname) {
  const meta = PAGE_META[pathname]
  if (!meta) return template
  const url = `https://www.sted.ai${pathname}`
  const title = escape(meta.title)
  const description = escape(meta.description)
  const set = (html, pattern, value) => {
    if (!pattern.test(html)) throw new Error(`prerender: ${pattern} not found in index.html`)
    return html.replace(pattern, value)
  }
  let html = template
  html = set(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`)
  for (const key of ['name="description"', 'property="og:description"', 'name="twitter:description"'])
    html = set(html, new RegExp(`(<meta ${key} content=")[^"]*"`), `$1${description}"`)
  for (const key of ['property="og:title"', 'name="twitter:title"'])
    html = set(html, new RegExp(`(<meta ${key} content=")[^"]*"`), `$1${title}"`)
  html = set(html, /(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
  html = set(html, /(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
  if (ARCHIVE_PATHS.includes(pathname)) html = html.replace('</title>', '</title>\n    <meta name="robots" content="noindex" />')
  return html
}

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
  const html = headFor(pathname).replace('</head>', `  ${links}\n  </head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  fs.mkdirSync(path.dirname(path.join(DIST, file)), { recursive: true })
  fs.writeFileSync(path.join(DIST, file), html)
  console.log(`prerender: ${pathname} → dist/${file}${body ? ` (${Math.round(body.length / 1024)} KB of HTML)` : ' (shell)'}`)
}

// The manifest was only for this script; don't ship it.
fs.rmSync(path.join(DIST, '.vite'), { recursive: true, force: true })
