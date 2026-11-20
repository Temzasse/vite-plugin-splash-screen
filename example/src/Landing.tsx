import { examplePath, examples } from './examples';

export function Landing() {
  return (
    <main className="page">
      <header>
        <h1>vite-plugin-splash-screen</h1>
        <p className="muted">
          Each example is a separate page with its own splash screen config.
          Open one to see the splash screen while the app "loads".
        </p>
      </header>

      <ul className="examples">
        {examples.map((example) => (
          <li key={example.id} className="card">
            <h2>{example.title}</h2>
            <p className="muted">{example.description}</p>
            <pre>{JSON.stringify(example.options, null, 2)}</pre>
            <a className="button" href={examplePath(example)}>
              Open example
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
