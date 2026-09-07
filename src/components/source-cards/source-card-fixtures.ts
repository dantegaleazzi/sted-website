import youtubeThumbnail from './assets/temporary-youtube-thumbnail.svg'
import instagramImage from './assets/temporary-instagram-image.svg'
import tiktokFrame from './assets/temporary-tiktok-frame.svg'
import articleHero from './assets/temporary-article-hero.svg'
import substackCover from './assets/temporary-substack-cover.svg'
import pinterestImage from './assets/temporary-pinterest-image.svg'
import spotifyArtwork from './assets/temporary-spotify-artwork.svg'
import placePhoto from './assets/temporary-place-photo.svg'
import productScreenshot from './assets/temporary-product-screenshot.svg'
import pdfCover from './assets/temporary-pdf-cover.svg'
import webOgImage from './assets/temporary-web-og-image.svg'
import type { SourceCardItem } from './types'

export const sourceCardFixtures: SourceCardItem[] = [
  { id: 'x-founder-notes', type: 'x', author: 'Lenny Rachitsky', handle: '@lennysan', title: 'The best product teams make fewer decisions twice.', body: 'Write down what you learned. Make the next decision smaller.', metadata: '12.4K likes · 1,102 reposts' },
  { id: 'youtube-ai-agents', type: 'youtube', source: 'YouTube', title: 'I built an AI agent that ships with me', body: 'A practical tour of the tiny tools behind a one-person studio.', metadata: 'Maya Lin · 18:42', image: youtubeThumbnail, imageAlt: 'Abstract mountain landscape with building slowly title' },
  { id: 'instagram-studio', type: 'instagram', source: 'Instagram', handle: '@slow.weekends', title: 'A desk, good light, and nowhere else to be.', body: 'Saved from a very good Sunday.', metadata: '2,841 likes', image: instagramImage, imageAlt: 'Illustration of a quiet green studio' },
  { id: 'tiktok-build-in-public', type: 'tiktok', source: 'TikTok', handle: '@mari.builds', title: 'The five-minute version of building in public.', body: 'The part no one puts in the launch post.', metadata: '384K views', image: tiktokFrame, imageAlt: 'Colorful frame about designing in public' },
  { id: 'github-tiny-tools', type: 'github', source: 'GitHub', handle: 'quiet-tools / daily', title: 'Small software for the days when focus is hard.', body: 'A collection of tiny, readable utilities for creative work.', metadata: 'Public · updated yesterday' },
  { id: 'medium-attention', type: 'medium', source: 'Medium', author: 'Nadia Eghbal', title: 'The craft of paying attention', body: 'What changes when the work is allowed to take the time it needs.', metadata: '8 min read · Common Ground', image: articleHero, imageAlt: 'Editorial cover titled The craft of paying attention' },
  { id: 'substack-reading-room', type: 'substack', source: 'Substack', handle: 'The Reading Room', title: 'Five links for a curious Friday', body: 'A good essay, a tiny tool, and one place worth going slowly.', metadata: 'Issue 42 · 4 min', image: substackCover, imageAlt: 'Reading Room illustrated newsletter cover' },
  { id: 'notion-product-notes', type: 'notion', source: 'Notion', title: 'A small operating system for a small studio', body: 'What we keep, what we ignore, and how we come back to the important bits.', metadata: 'Private note · edited 2 days ago', eyebrow: 'STED / PRODUCT NOTES' },
  { id: 'pdf-field-guide', type: 'pdf', source: 'PDF', title: 'The Creative Field Guide', body: 'Questions for starting before you feel ready.', metadata: '24 pages · saved from are.na', image: pdfCover, imageAlt: 'PDF cover titled The Creative Field Guide' },
  { id: 'reddit-workspace', type: 'reddit', source: 'Reddit', handle: 'r/Entrepreneur', title: 'What did you stop doing that made your product better?', body: 'The highest-voted answer was: stopped adding settings.', metadata: '186 comments · 4 days ago' },
  { id: 'pinterest-reference', type: 'pinterest', source: 'Pinterest', handle: 'design references', title: 'Warm interfaces with a little breathing room', body: 'A reference board for the next Sted pass.', metadata: '23 saves · design references', image: pinterestImage, imageAlt: 'Editorial studio reference board' },
  { id: 'spotify-small-hours', type: 'spotify', source: 'Spotify', handle: 'Small Hours', title: 'Doing good work at a human pace', body: 'A conversation about attention, creative routines, and knowing when to stop.', metadata: 'Episode 18 · 38 min', eyebrow: 'SMALL HOURS / 018', image: spotifyArtwork, imageAlt: 'Abstract Small Hours podcast artwork' },
  { id: 'maps-porto', type: 'place', source: 'Google Maps', title: 'Mesa 325', body: 'Tiny coffee, tiled walls, and the best place to write after 4pm.', metadata: 'Porto · saved place', image: placePhoto, imageAlt: 'Illustrated landscape from a morning in Kyoto' },
  { id: 'product-sted', type: 'product', source: 'Product Hunt', handle: 'new today', title: 'Sted — keep the good things close', body: 'A calmer way to collect the internet without losing the reason you saved it.', metadata: '1,248 points · 86 comments', eyebrow: 'A calmer way to collect.', image: productScreenshot, imageAlt: 'Product screenshot with Sted interface' },
  { id: 'website-morning-studio', type: 'website', source: 'Website', handle: 'morning.studio', title: 'Objects for a slower day', body: 'Made with care. Kept for years.', metadata: 'saved from morning.studio', image: webOgImage, imageAlt: 'Morning Studio editorial website image' },
]

