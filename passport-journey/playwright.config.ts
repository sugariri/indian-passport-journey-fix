import { defineConfig, devices } from "@playwright/test"

/**
 * The suite used to point at a hard-coded http://127.0.0.1:5173, which meant it
 * only ran if someone happened to have a dev server up on that exact port - and
 * in a git worktree that server is usually serving a different checkout, so the
 * tests would pass or fail against code nobody was editing. Playwright starts
 * its own server here instead, on its own port, against this checkout.
 */
const PORT = 5273
const HOST = "127.0.0.1"

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "line",
  use: {
    baseURL: `http://${HOST}:${PORT}`,
    ...devices["Desktop Chrome"],
  },
  webServer: {
    // --host pins the listen address: Vite's default binds IPv6 loopback only,
    // which 127.0.0.1 cannot reach.
    command: `npm run dev -- --port ${PORT} --strictPort --host ${HOST}`,
    url: `http://${HOST}:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
