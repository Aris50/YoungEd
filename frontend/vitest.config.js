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
      include: ['app/welcome/studentForm.jsx', 'app/welcome/studentTable.jsx', 'app/welcome/studentUtils.js'],
      exclude: ['app/welcome/**/*.{test,spec}.{js,jsx}',   'frontend/app/welcome/GradeChart.jsx', 'frontend/app/welcome/mockStudents.js', 'frontend/app/welcome/page.js' ]
    }
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './app')
    }
  }
}); 