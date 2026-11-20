import customLoaderHtml from './custom-loader.html?raw';
import { examplePath, examples, groups } from './examples';
import { Header } from './Header';
import { LoaderPreview } from './LoaderPreview';

const base = import.meta.env.BASE_URL;

/** Previews for examples that don't use a built-in loader */
const customPreviews: Record<string, string> = {
  'custom-loader': customLoaderHtml,
};

export function Landing() {
  return (
    <>
      <Header />
      <main className="page">
        <section className="hero">
          <h1>Splash screens for Vite apps</h1>
          <p className="lead">
            Show your logo and a loading indicator while your app's JavaScript
            loads, then fade it out when the app is ready. Works with any
            framework. Pick an example to see it in action.
          </p>
          <pre className="install">
            <code>npm install -D vite-plugin-splash-screen</code>
          </pre>
        </section>

        {groups.map((group) => (
          <section key={group.id} className="group">
            <header className="group-header">
              <h2>{group.title}</h2>
              <p className="muted">{group.description}</p>
            </header>

            <ul className="cards">
              {examples
                .filter((example) => example.group === group.id)
                .map((example) => (
                  <li key={example.id}>
                    <a className="card" href={base + examplePath(example)}>
                      {example.previewLoader ? (
                        <LoaderPreview loader={example.previewLoader} />
                      ) : customPreviews[example.id] ? (
                        <div
                          className="preview"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{
                            __html: customPreviews[example.id],
                          }}
                        />
                      ) : (
                        <div
                          className="preview preview-icon"
                          aria-hidden="true"
                        >
                          <img
                            src={`${base}vite.svg`}
                            alt=""
                            width={40}
                            height={40}
                          />
                        </div>
                      )}
                      <div className="card-body">
                        <h3>{example.title}</h3>
                        <p className="muted">{example.description}</p>
                      </div>
                      <span className="card-cta">
                        Open example <span aria-hidden="true">→</span>
                      </span>
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </main>
    </>
  );
}
