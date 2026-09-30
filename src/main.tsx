import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { Root } from './root'

// Pages prerendered at build time (scripts/prerender.mjs) arrive with their HTML already in #root:
// hydrate it, so the text people and crawlers got is kept. Anything else renders from scratch.
const container = document.getElementById('root')!
const app = <StrictMode><Root pathname={window.location.pathname} /></StrictMode>
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)
