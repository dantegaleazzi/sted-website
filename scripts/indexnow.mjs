// IndexNow: tells Bing (and the other IndexNow engines, which share submissions) that the site changed,
// so they recrawl now instead of in days. ChatGPT search leans on Bing's index. Run after a deploy:
//   npm run indexnow
// The key is public by design: https://www.sted.ai/55762028c2fc6a97d235547635f7ed07.txt proves we own the host.
const KEY = '55762028c2fc6a97d235547635f7ed07'
const HOST = 'www.sted.ai'
// Every page in the live sitemap (so run it after the deploy), plus the pages kept out of it.
const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text()
const URLS = [...new Set([...[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]), ...['/start', '/delete-account', '/llms.txt'].map(path => `https://${HOST}${path}`)])]

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: URLS }),
})
console.log(`IndexNow: ${response.status} ${response.statusText} for ${URLS.length} URLs`)
if (!response.ok && response.status !== 202) process.exit(1)
