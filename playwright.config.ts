import { defineConfig, devices } from "@playwright/test";

// Point the suite at a deployed URL to smoke-test it; otherwise run against a local dev server.
const remoteBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const localURL = "http://localhost:3005";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  use: {
    baseURL: remoteBaseURL ?? localURL,
    trace: "on-first-retry",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  ...(remoteBaseURL
    ? {}
    : {
        webServer: {
          command: "npx next dev --port 3005",
          url: localURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
