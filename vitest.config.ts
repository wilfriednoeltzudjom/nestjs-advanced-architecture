import { resolve } from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    environment: 'node',
    setupFiles: ['./src/shared/test/setup.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', '**/*.e2e.spec.ts', '**/*.e2e-spec.ts'],
    coverage: {
      provider: 'v8',
      enabled: false,
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules',
        'dist',
        '**/*.spec.ts',
        '**/*.e2e.spec.ts',
        '**/*.config.ts',
        '**/*.module.ts',
        '**/main.ts',
        '**/index.ts',
      ],
      thresholds: {
        lines: 0, // TODO: Increase as tests are added
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
    testTimeout: 5000,
    hookTimeout: 10000,
    pool: 'threads',
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
  plugins: [
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
