import { useEffect, useState } from 'react';
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime';

import { formatOptions, type SplashExample } from './examples';
import { Header } from './Header';

export function ExamplePage({ example }: { example: SplashExample }) {
  const [removedAfterMs, setRemovedAfterMs] = useState<number | null>(null);

  useEffect(() => {
    // Simulate app initialization (loading data, translations etc.)
    const timeout = setTimeout(async () => {
      await hideSplashScreen();
      setRemovedAfterMs(Math.round(performance.now()));
    }, example.appInitMs);

    return () => clearTimeout(timeout);
  }, [example]);

  function reloadWithoutSplash() {
    const params = new URLSearchParams(location.search);
    params.set('vpss', 'false');
    location.search = params.toString();
  }

  return (
    <>
      <Header back />
      <main className="page example">
        <section className="hero">
          <p className="eyebrow">Example</p>
          <h1>{example.title}</h1>
          <p className="lead">{example.description}</p>
        </section>

        <div className="example-grid">
          <section className="panel">
            <h2>What just happened</h2>
            <dl className="stats">
              <div>
                <dt>App ready after</dt>
                <dd>{example.appInitMs} ms</dd>
              </div>
              <div>
                <dt>Splash removed after</dt>
                <dd>
                  {removedAfterMs === null ? '…' : `${removedAfterMs} ms`}
                </dd>
              </div>
            </dl>
            <div className="actions">
              <button className="button" onClick={() => location.reload()}>
                Replay splash screen
              </button>
              <button
                className="button secondary"
                onClick={reloadWithoutSplash}
              >
                Reload without it
              </button>
            </div>
          </section>

          <section className="panel">
            <h2>vite.config.ts</h2>
            <pre className="code">
              <code>{formatOptions(example.options)}</code>
            </pre>
          </section>
        </div>
      </main>
    </>
  );
}
