import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/plugin.ts'],
  splitting: false,
  sourcemap: false,
  outDir: 'dist/plugin',
  dts: true,
  format: ['esm', 'cjs'],
});
