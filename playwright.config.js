// Load environment variables from the .env file.
//
// This makes values such as DB_HOST, DB_USER and DB_PASSWORD
// available through process.env throughout the Playwright project.
require("dotenv").config();

const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({

  // ============================================================
  // Retry Policy
  // ============================================================
  //
  // Retry failed tests once.
  //
  // If a test fails on the first attempt, Playwright will
  // execute it one more time.
  //
  // This works together with:
  // trace: "on-first-retry".
  retries: 1,


  // ============================================================
  // Reporter
  // ============================================================
  //
  // Generate a Playwright HTML report after test execution.
  reporter: [
    ["html", { open: "never" }]
  ],


  // ============================================================
  // Shared Test Configuration
  // ============================================================
  //
  // These settings are shared by all browser projects.
  use: {

    // Base URL of the locally running portfolio application.
    baseURL: "http://localhost:3000",

    // Capture a screenshot only when a test fails.
    screenshot: "only-on-failure",

    // Record a trace during the first retry of a failed test.
    trace: "on-first-retry"

  },


  // ============================================================
  // Browser Projects
  // ============================================================
  //
  // Playwright Projects allow the same tests to be executed
  // against different browsers or configurations.
  //
  // For now, only the locally installed Google Chrome browser
  // is configured.
  //
  // Firefox and WebKit can be added later after Playwright's
  // managed browser installation issue is resolved.
  projects: [

    {
      name: "chrome",

      use: {

        // Use the Google Chrome browser installed
        // on the local computer.
        channel: "chrome"

      }
    }

  ]

});