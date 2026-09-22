
require("dotenv").config(); // Load environment variables from .env.

const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({

  // Retry failed tests once.
  retries: 1,

  // Generate an HTML report after the test run.
  reporter: [
    ["html", { open: "never" }]
  ],

  // Settings shared by all tests.
  use: {

    // URL of the application under test.
    baseURL: "http://localhost:3000",

    // Take a screenshot when a test fails.
    screenshot: "only-on-failure",

    // Record a trace when a failed test is retried.
    trace: "on-first-retry"

  },

  // Browser used for UI tests.
  projects: [
    {
      name: "chrome",

      use: {
        // Use locally installed Google Chrome.
        channel: "chrome"
      }
    }
  ]

});