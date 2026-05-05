import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',
  timeout: 60000, // Aumentando o timeout global para 60 segundos
  expect: {
    timeout: 10000, // Aumentando o timeout para as asserções para 10 segundos
  },
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }]
  ],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});
