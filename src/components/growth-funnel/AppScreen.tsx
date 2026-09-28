import type { ExampleSave } from './funnel-content'

export function SourceTile({ source }: { source: ExampleSave['source'] }) {
  const icon = source === 'web' ? 'web' : source
  return <img className="cf-tile" src={`/brand/source-icons/${icon}-tile.svg`} alt="" width={20} height={20} />
}

/**
 * The app's item screen. Uses the real iPhone screenshot when there is one; until then it draws
 * the same layout (thumbnail, title, link, Summary, Key ideas, Topics) from the example data.
 */
export function AppScreen({ example, className = '' }: { example: ExampleSave; className?: string }) {
  return <div className={`cf-phone ${className}`} role="img" aria-label={`“${example.title}” saved in the Sted app, with its summary and key ideas`}>
    {example.screen
      ? <img className="cf-phone-shot" src={example.screen} alt="" />
      : <div className="cf-app" aria-hidden="true">
        <div className="cf-app-status"><i /></div>
        <span className="cf-app-back">‹</span>
        <img className="cf-app-thumb" src={example.thumb} alt="" />
        <p className="cf-app-title">{example.title}</p>
        <p className="cf-app-link"><SourceTile source={example.source} /><span>{example.displayUrl}</span></p>
        <p className="cf-app-meta">Today · <span>+ Topic</span> · <span>+ Project</span></p>
        <p className="cf-app-heading">Summary</p>
        <p className="cf-app-summary">{example.summary}</p>
        <p className="cf-app-heading">Key ideas</p>
        <ul className="cf-app-ideas">{example.keyIdeas.map(idea => <li key={idea}>{idea}</li>)}</ul>
        <p className="cf-app-heading">Topics</p>
        <p className="cf-app-topics">{example.topics.map(topic => <span key={topic}>{topic}</span>)}</p>
        <div className="cf-app-tabs"><span>The Recap</span><span>Sted</span><span className="is-active">Library</span></div>
      </div>}
  </div>
}
