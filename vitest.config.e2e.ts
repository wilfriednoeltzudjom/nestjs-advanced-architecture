import { resolve } from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Enable global test APIs
    globals: true,

    // Set root directory
    root: './',

    // Use Node.js environment
    environment: 'node',

    // E2E test file patterns
    include: ['src/**/*.e2e.spec.ts'],
    exclude: ['node_modules', 'dist'],

    // E2E tests typically need more time
    testTimeout: 30000,
    hookTimeout: 30000,

    // Run E2E tests sequentially
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },

    // Setup files for E2E tests
    setupFiles: ['./src/shared/test/setup.ts'],

    // Mock settings
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },

  plugins: [
    // Use SWC for faster TypeScript compilation
    swc.vite({
      module: { type: 'es6' },
    }),
  ],

  resolve: {
    alias: {
      '@/alarms': resolve(__dirname, './src/alarms'),
      '@/shared': resolve(__dirname, './src/shared'),
      '@/test': resolve(__dirname, './test'),
    },
  },
});
