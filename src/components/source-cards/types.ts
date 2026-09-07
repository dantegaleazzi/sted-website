export type SourceType =
  | 'x'
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'github'
  | 'article'
  | 'medium'
  | 'substack'
  | 'notion'
  | 'pdf'
  | 'reddit'
  | 'pinterest'
  | 'spotify'
  | 'place'
  | 'product'
  | 'website'
  | 'threads'
  | 'bluesky'

export type SourceCardItem = {
  url?: string
  verifiedContent?: boolean
  caption?: string
  postType?: string
  publishedAt?: string
  duration?: string
  id: string
  type: SourceType
  title: string
  source?: string
  author?: string
  handle?: string
  metadata?: string
  body?: string
  image?: string
  imageAlt?: string
  eyebrow?: string
  stats?: string
  accent?: string
}

