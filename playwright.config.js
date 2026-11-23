import { defineConfig, devices } from '@playwright/test';

// En tu PC basta con: npx playwright install chromium
// CHROMIUM_PATH solo se usa si quieres apuntar a un navegador ya instalado.
const executablePath = process.env.CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'test-results/e2e.json' }]],
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath,
      args: executablePath ? ['--no-sandbox', '--disable-gpu'] : [],
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
