import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    include: ['**/*.{test,spec}.{js,jsx}'],
    css: false,
    deps: {
      inline: [/@testing-library\/react/],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['app/welcome/**/*.{js,jsx}'],
      exclude: ['app/welcome/**/*.{test,spec}.{js,jsx}']
    }
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './app')
    }
  }
}); 