import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration — UX Logic Thread E2E Suite
 * Project: MindMap / Traceability Mapper
 * Target: http://localhost:5173 (Vite dev server)
 */
export default defineConfig({
  // Directory where test files live
  testDir: './e2e',

  // Run tests in files in parallel
  fullyParallel: false,

  // Fail the build on CI if test.only() is accidentally committed
  forbidOnly: !!process.env.CI,

  // Retry once on failure to catch flaky tests
  retries: 1,

  // Run only one worker to keep dev server interactions sequential
  workers: 1,

  // Reporter — list for CLI readability; HTML for persistent reports
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-reports/html', open: 'never' }],
    ['json', { outputFile: 'test-reports/results.json' }],
  ],

  // Global test settings
  use: {
    // Base URL for all page.goto() calls
    baseURL: 'http://localhost:5173',

    // Capture screenshot only on failure
    screenshot: 'only-on-failure',

    // Capture trace only on first retry (helps debug flakes)
    trace: 'on-first-retry',

    // Global action timeout
    actionTimeout: 15_000,

    // Navigation timeout
    navigationTimeout: 30_000,
  },

  // Per-test timeout
  timeout: 30_000,

  // Chromium only — matches the PRD tech stack requirement
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],

  // Output artifacts (screenshots, traces, videos) go here
  outputDir: 'test-reports/artifacts',
});
