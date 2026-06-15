import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const entry = process.env.LIB_ENTRY ?? 'core';
const entryFile = entry === 'react'
  ? resolve(__dirname, 'src/react/WeatherBackground.tsx')
  : resolve(__dirname, 'src/core/index.ts');

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: entry === 'core',
    lib: {
      entry: entryFile,
      formats: ['es', 'cjs'],
      name: 'WeatherAnimations',
      fileName: (format) => `${entry}.${format === 'es' ? 'esm.js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        globals: { react: 'React', 'react/jsx-runtime': 'ReactJSX' },
      },
    },
  },
});
