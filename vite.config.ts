import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/demo',
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    globals: true,
  },
});
