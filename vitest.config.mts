import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    // Vitest stubs CSS by default; the plugin inlines its CSS via `?raw`
    css: { include: [/.+/] },
  },
});
