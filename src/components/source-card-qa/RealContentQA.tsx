import { portalFixtures as realContentFixtures } from '../content-tunnel/portal-fixtures'
import { VisualSourceCard as SourceCard } from '../source-cards/VisualSourceCard'
import './RealContentQA.css'

const groups = [
  ['Articles', 'article'], ['Videos', 'youtube'], ['X Posts', 'x'],
  ['GitHub Repos', 'github'], ['Websites', 'website'], ['Instagram', 'instagram'], ['Pinterest', 'pinterest'], ['Spotify', 'spotify'], ['Places', 'place'],
] as const

export function RealContentQA() {
  return <main className="real-content-qa">
    <header><a href="/internal/content-tunnel-preview"><img src="/brand/sted-primary-horizontal.svg" alt="Sted" width="120" /></a><a href="/internal/content-tunnel-preview">Ver content tunnel →</a></header>
    <h1>Contenido guardado</h1><p>{realContentFixtures.length} contenidos reales · Primera selección del Product Design System</p>
    {groups.map(([label, type]) => <section key={type}>
      <h2>{label}</h2><div className="real-content-grid">{realContentFixtures.filter(item => item.type === type).map(item => <div key={item.id}>
        <SourceCard item={item} />
        {!item.image && <p className="real-content-pending">Imagen suministrada pendiente.</p>}
        <a className="real-content-source" href={item.url} target="_blank" rel="noreferrer">Ver en {item.source} ↗</a>
      </div>)}</div>
    </section>)}
  </main>
}
