import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { colorScheme } from 'vite-plugin-color-scheme';
import { splashScreen } from 'vite-plugin-splash-screen';

import { examplePath, examples } from './src/examples';

const root = import.meta.dirname;

/**
 * The splash screen plugin applies to every HTML page. This example app has a
 * different splash screen config per page, so restrict each instance to one
 * page. In a regular single-page app you just add `splashScreen()` as is.
 */
function onlyForPage(page: string, plugin: Plugin): Plugin {
  const transform = plugin.transformIndexHtml;
  if (typeof transform !== 'function') {
    throw new Error('Expected transformIndexHtml to be a function');
  }

  const filename = resolve(root, page);

  return {
    ...plugin,
    name: `${plugin.name}:${page}`,
    transformIndexHtml(html, ctx) {
      if (resolve(ctx.filename) !== filename) return;
      return transform.call(this, html, ctx);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    colorScheme({
      defaultScheme: 'dark',
      variables: {
        light: {
          '--vpss-bg-splash': '#ffffff',
          '--vpss-bg-loader': '#b18500',
        },
        dark: {
          '--vpss-bg-splash': '#1b1b1a',
          '--vpss-bg-loader': '#ffcb29',
        },
      },
    }),
    ...examples.map((example) =>
      onlyForPage(examplePath(example), splashScreen(example.options))
    ),
  ],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(root, 'index.html'),
        ...Object.fromEntries(
          examples.map((example) => [
            example.id,
            resolve(root, examplePath(example)),
          ])
        ),
      },
    },
  },
  server: {
    port: 4000,
    // The landing page previews the plugin's loader CSS from ../src
    fs: { allow: ['..'] },
  },
});
