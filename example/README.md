# vite-plugin-splash-screen examples

The example site deployed at
https://temzasse.github.io/vite-plugin-splash-screen/.

A landing page (`index.html`) links to one page per example
(`examples/*.html`). The examples are defined in
[`src/examples.ts`](src/examples.ts), which both the pages and
`vite.config.ts` use, so an example needs an entry there and a matching
`examples/<id>.html` file. The landing page previews the built-in loaders
with the plugin's own loader CSS from `../src/loaders`.

The plugin normally applies to every HTML page, so `vite.config.ts` limits
each `splashScreen()` instance to its own page with a small `onlyForPage`
wrapper. A regular single-page app doesn't need this.

The example uses the plugin from this repo (`file:..`), so build the plugin
first. Run these from the repo root:

```sh
npm run build            # or `npm run watch` while developing
npm run example:install
npm run example:dev      # http://localhost:4000
```

To deploy the site to GitHub Pages (pushes `example/dist` to the
`gh-pages` branch):

```sh
npm run example:deploy
```
