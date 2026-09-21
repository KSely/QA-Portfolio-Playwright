// Import Playwright's test function and assertion library.
//
// Playwright can test APIs directly without opening a browser.
// The built-in "request" fixture provides an APIRequestContext
// that can send HTTP requests to the application.
const { test, expect } = require("@playwright/test");


// ============================================================
// GET /api/status
// ============================================================
//
// Verify that the backend status endpoint is available
// and returns the expected HTTP response and JSON body.
test("GET /api/status should return backend status @smoke", async ({ request }) => {

  // Step 1: Send a GET request to the backend status endpoint.
  //
  // Because baseURL is configured in playwright.config.js,
  // we can use "/api/status" instead of the full URL:
  // http://localhost:3000/api/status
  const response = await request.get("/api/status");


  // Step 2: Verify the HTTP response status.
  //
  // response.ok() returns true for successful HTTP responses
  // in the 200-299 range.
  expect(response.ok()).toBe(true);


  // Step 3: Verify the exact HTTP status code.
  expect(response.status()).toBe(200);


  // Step 4: Parse the JSON response body.
  const responseBody = await response.json();


  // Step 5: Verify the "status" property.
  expect(responseBody.status).toBe("ok");


  // Step 6: Verify the backend message.
  expect(responseBody.message).toBe(
    "QA Automation Portfolio backend is running"
  );

});
