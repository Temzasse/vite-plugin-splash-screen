import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/runtime.ts'],
  splitting: false,
  sourcemap: false,
  outDir: 'dist/runtime',
  dts: true,
  format: ['esm', 'cjs'],
});
