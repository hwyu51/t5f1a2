import { defineConfig, devices } from '@playwright/test';

/**
 * 사용 방법:
 *   1. 별도 터미널에서 `npm run dev` 띄움
 *   2. 다른 터미널에서 `npm run test`
 *
 * 자동 webServer는 Windows + firebase 사전 번들링 시간 때문에
 * 안정성이 떨어져서 수동 띄우기 흐름으로 통일.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173/t5f1a2/',
    locale: 'ko-KR',
    storageState: { cookies: [], origins: [] },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
