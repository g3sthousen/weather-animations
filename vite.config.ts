import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src/demo',
  test: {
    include: [path.resolve(__dirname, 'tests/unit/**/*.test.ts')],
    environment: 'node',
    globals: true,
  },
});
