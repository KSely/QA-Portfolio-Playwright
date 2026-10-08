import dotenv from "dotenv";
import { defineConfig, devices } from "@playwright/test";

dotenv.config(); // Load environment variables from .env.

const baseURL = process.env.BASE_URL || "http://localhost:3000";

export default defineConfig({

  // Retry failed tests once.
  retries: 1,

  // Generate an HTML report after the test run.
  reporter: [
    ["html", { open: "never" }]
  ],

  // Settings shared by all tests.
  use: {

    // URL of the application under test.
    baseURL,

    // Take a screenshot when a test fails.
    screenshot: "only-on-failure",

    // Record a trace when a failed test is retried.
    trace: "on-first-retry"

  },

  projects: [

    // Run UI tests in Chromium.
    {
      name: "chromium",
      testMatch: /tests\/ui\/.*\.spec\.js/,
      use: {
        ...devices["Desktop Chrome"]
      }
    },

    // Run UI tests in Firefox.
    {
      name: "firefox",
      testMatch: /tests\/ui\/.*\.spec\.js/,
      use: {
        ...devices["Desktop Firefox"]
      }
    },

    // Run UI tests in WebKit.
    {
      name: "webkit",
      testMatch: /tests\/ui\/.*\.spec\.js/,
      use: {
        ...devices["Desktop Safari"]
      }
    },

    // Run accessibility tests once in Chromium.
    {
      name: "accessibility",
      testMatch: /tests\/accessibility\/.*\.spec\.js/,
      use: {
        ...devices["Desktop Chrome"]
      }
    },

    // Run API tests once.
    {
      name: "api",
      testMatch: /tests\/api\/.*\.spec\.js/
    },

    // Run database tests once.
    {
      name: "database",
      testMatch: /tests\/database\/.*\.spec\.js/
    }

  ]

});
