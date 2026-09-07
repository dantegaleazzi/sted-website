import { realContentFixtures } from '../source-cards/real-content-fixtures'
import { visualExplorationFixtures } from './visual-exploration-fixtures'

const collection = [...realContentFixtures, ...visualExplorationFixtures]
// Interleave photography and text on both sides throughout the entire loop.
const order = ['pinterest', 'youtube1', 'x1', 'recipe', 'spotify-playlist', 'karakeep', 'travel', 'x2', 'anydoc', 'instagram-visual', 'youtube2', 'place', 'openai', 'spotify-episode', 'revenuecat', 'firecrawl']
export const portalFixtures = order.map(id => collection.find(item => item.id === id)!)
