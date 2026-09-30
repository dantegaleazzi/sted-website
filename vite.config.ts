import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode, isSsrBuild }) => {
  const funnelPreview = mode === 'funnel-preview'
  const previewMetadata: Plugin = {
      name: 'funnel-preview-metadata',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: '_headers', source: '/*\n  X-Robots-Tag: noindex, nofollow\n' })
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: 'User-agent: *\nDisallow: /\n' })
        this.emitFile({ type: 'asset', fileName: '_redirects', source: '/support https://www.sted.ai/support 302\n/terms https://www.sted.ai/terms 302\n/privacy https://www.sted.ai/privacy 302\n' })
      },
  }
  return {
    plugins: [react(), ...(funnelPreview ? [previewMetadata] : [])],
    // The client manifest tells scripts/prerender.mjs which CSS and chunks each prerendered page needs.
    build: { outDir: funnelPreview ? 'dist-funnel-preview' : 'dist', manifest: !isSsrBuild && !funnelPreview },
  }
})
