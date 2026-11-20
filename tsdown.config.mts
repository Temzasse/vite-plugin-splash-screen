import { defineConfig, type UserConfig } from 'tsdown';

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
  },
  {
    ...shared,
    entry: ['src/runtime.ts'],
    outDir: 'dist/runtime',
    platform: 'browser',
  },
]);
