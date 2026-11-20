import { useEffect, useState } from 'react';
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime';

import type { SplashExample } from './examples';

export function ExamplePage({ example }: { example: SplashExample }) {
  const [hiddenAfterMs, setHiddenAfterMs] = useState<number | null>(null);

  useEffect(() => {
    // Simulate app initialization (loading data, translations etc.)
    const timeout = setTimeout(async () => {
      await hideSplashScreen();
      setHiddenAfterMs(Math.round(performance.now()));
    }, example.appInitMs);

    return () => clearTimeout(timeout);
  }, [example]);

  function reloadWithoutSplash() {
    const params = new URLSearchParams(location.search);
    params.set('vpss', 'false');
    location.search = params.toString();
  }

  return (
    <main className="page">
      <a href="/">← All examples</a>
      <h1>{example.title}</h1>
      <p className="muted">{example.description}</p>

      <dl className="stats">
        <dt>App ready after</dt>
        <dd>{example.appInitMs} ms</dd>
        <dt>Splash removed after</dt>
        <dd>{hiddenAfterMs === null ? '…' : `${hiddenAfterMs} ms`}</dd>
      </dl>

      <pre>{JSON.stringify(example.options, null, 2)}</pre>

      <div className="actions">
        <button className="button" onClick={() => location.reload()}>
          Replay splash
        </button>
        <button className="button secondary" onClick={reloadWithoutSplash}>
          Reload without splash
        </button>
      </div>
    </main>
  );
}
