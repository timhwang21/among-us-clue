import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: './test/e2e',
  retries: 2,
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:8765',
    browserName: 'chromium',
    headless: true,
    actionTimeout: 45000,
  },
  webServer: {
    command: 'python3 -m http.server 8765',
    url: 'http://localhost:8765/index.html',
    cwd: __dirname,
    reuseExistingServer: true,
    timeout: 10000,
  },
});
