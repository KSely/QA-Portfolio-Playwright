const { test, expect } = require("@playwright/test");

// ============================================================
// GET /api/status
// ============================================================

// Verify the backend status response.
test("GET /api/status should return backend status @smoke", async ({
  request,
}) => {

  const response = await request.get("/api/status");

  expect(response.ok()).toBe(true);
  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.status).toBe("ok");
  expect(responseBody.message).toBe(
    "QA Automation Portfolio backend is running",
  );
});


// Verify that the endpoint returns JSON.
test("GET /api/status should return JSON content type", async ({ request }) => {

  const response = await request.get("/api/status");

  expect(response.status()).toBe(200);

  const contentType = response.headers()["content-type"];

  // The header may also include charset information.
  expect(contentType).toContain("application/json");
});