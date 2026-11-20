# vite-plugin-splash-screen examples

A landing page (`index.html`) that links to one page per splash screen
example (`examples/*.html`). The examples are defined in
[`src/examples.ts`](src/examples.ts), which both the landing page and
`vite.config.ts` use, so adding an example there adds a page and its splash
screen config.

The plugin normally applies to every HTML page, so `vite.config.ts` restricts
each `splashScreen()` instance to its own page with a small `onlyForPage`
wrapper. A regular single-page app doesn't need this.

```sh
# from the repo root: build the plugin and push it into the example
npm run build && npm run example:sync

cd example
npm run dev      # http://localhost:4000
npm run build && npm run preview
```
