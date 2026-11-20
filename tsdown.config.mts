import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { defineConfig, type UserConfig } from 'tsdown';

/**
 * Inline `?raw` imports (e.g. `import css from './styles.css?raw'`) as strings
 * so the plugin never needs to read its own assets from disk at runtime.
 */
const rawImport = {
  name: 'raw-import',
  resolveId(source: string, importer?: string) {
    if (!source.endsWith('?raw') || !importer) return null;
    return resolve(dirname(importer), source);
  },
  load(id: string) {
    if (!id.endsWith('?raw')) return null;
    const content = readFileSync(id.slice(0, -'?raw'.length), 'utf8');
    return `export default ${JSON.stringify(content)};`;
  },
};

const shared: UserConfig = {
  format: ['cjs', 'esm'],
  target: 'es2020',
  sourcemap: false,
  dts: true,
  outExtensions: ({ format }) => ({
    js: format === 'es' ? '.mjs' : '.js',
    dts: format === 'es' ? '.d.mts' : '.d.ts',
  }),
};

export default defineConfig([
  {
    ...shared,
    entry: ['src/plugin.ts'],
    outDir: 'dist/plugin',
    platform: 'node',
    deps: { neverBundle: ['vite'] },
    plugins: [rawImport],
  },
  {
    ...shared,
    entry: ['src/runtime.ts'],
    outDir: 'dist/runtime',
    platform: 'neutral',
  },
]);
