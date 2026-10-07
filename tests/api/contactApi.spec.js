import { test, expect } from "@playwright/test";
import contactResponseSchema from "../schemas/contact-response.schema.json" with { type: "json" };

import {
  messageExists,
  deleteMessage
} from "../../utils/databaseHelper.js";
import {
  createSchemaValidator,
} from "../../utils/schemaValidator.js";

const validateContactResponse = createSchemaValidator(contactResponseSchema);


// ============================================================
// POST /contact
// ============================================================

// Verify successful submission and database persistence.
test("POST /contact should create a message with valid data", async ({
  request,
}) => {

  // Use unique data for each test run.
  const timestamp = Date.now();

  const testName = "Playwright API Test User";
  const testEmail = `playwright.api.${timestamp}@example.com`;
  const testMessage = `Playwright API contact test ${timestamp}`;

  try {

    const response = await request.post("/contact", {
      form: {
        name: testName,
        email: testEmail,
        message: testMessage
      }
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toBe(
      "Message sent successfully!"
    );

    const schemaResult = validateContactResponse(responseBody);

    expect(
      schemaResult.valid,
      JSON.stringify(schemaResult.errors, null, 2),
    ).toBe(true);

    // Verify that the message was saved in the database.
    const isMessageStored = await messageExists(
      testEmail,
      testMessage
    );

    expect(isMessageStored).toBe(true);

  } finally {

    // Remove test data even if the test fails.
    await deleteMessage(
      testEmail,
      testMessage
    );

  }

});


// ============================================================
// Missing Required Fields
// ============================================================

// Test data for missing required fields.
const missingFieldTestCases = [

  {
    field: "name",
    formData: {
      email: "missing.name@example.com",
      message: "Missing name API test"
    }
  },

  {
    field: "email",
    formData: {
      name: "Playwright API Test User",
      message: "Missing email API test"
    }
  },

  {
    field: "message",
    formData: {
      name: "Playwright API Test User",
      email: "missing.message@example.com"
    }
  }

];

// Run the same validation test for each missing field.
for (const testCase of missingFieldTestCases) {

  test(`POST /contact should reject request when ${testCase.field} is missing`,
    async ({ request }) => {

      const response = await request.post("/contact", {
        form: testCase.formData
      });

      expect(response.status()).toBe(400);

      const responseBody = await response.json();

      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe(
        "All fields are required."
      );

      const schemaResult = validateContactResponse(responseBody);

      expect(
        schemaResult.valid,
        JSON.stringify(schemaResult.errors, null, 2),
      ).toBe(true);

    }
  );

}


// ============================================================
// Whitespace Required Fields
// ============================================================

// Test data for fields containing only spaces.
const whitespaceFieldTestCases = [

  {
    field: "name",
    formData: {
      name: "   ",
      email: "whitespace.name@example.com",
      message: "Whitespace name API test"
    }
  },

  {
    field: "email",
    formData: {
      name: "Playwright API Test User",
      email: "   ",
      message: "Whitespace email API test"
    }
  },

  {
    field: "message",
    formData: {
      name: "Playwright API Test User",
      email: "whitespace.message@example.com",
      message: "   "
    }
  }

];

// Run the same validation test for each whitespace field.
for (const testCase of whitespaceFieldTestCases) {

  test(`POST /contact should reject request when ${testCase.field} contains only whitespace`,
    async ({ request }) => {

      const response = await request.post("/contact", {
        form: testCase.formData
      });

      expect(response.status()).toBe(400);

      const responseBody = await response.json();

      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe(
        "All fields are required."
      );

      const schemaResult = validateContactResponse(responseBody);

      expect(
        schemaResult.valid,
        JSON.stringify(schemaResult.errors, null, 2),
      ).toBe(true);

      // Verify that rejected data was not saved.
      const isMessageStored = await messageExists(
        testCase.formData.email,
        testCase.formData.message
      );

      expect(isMessageStored).toBe(false);

    }
  );

}


// ============================================================
// Invalid Email Formats
// ============================================================

// Test data for invalid email formats.
const invalidEmailTestCases = [

  {
    description: "missing @ symbol",
    email: "invalidemail.com"
  },

  {
    description: "missing local part",
    email: "@example.com"
  },

  {
    description: "missing domain",
    email: "user@"
  },

  {
    description: "missing top-level domain",
    email: "user@example"
  }

];

// Run the same validation test for each invalid email.
for (const testCase of invalidEmailTestCases) {

  test(`POST /contact should reject email with ${testCase.description}`,
    async ({ request }) => {

      // Use a unique message for each test run.
      const timestamp = Date.now();

      const testName = "Playwright API Test User";
      const testMessage =
        `Invalid email API test ${testCase.description} ${timestamp}`;

      const response = await request.post("/contact", {
        form: {
          name: testName,
          email: testCase.email,
          message: testMessage
        }
      });

      expect(response.status()).toBe(400);

      const responseBody = await response.json();

      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe(
        "Invalid email address."
      );

      const schemaResult = validateContactResponse(responseBody);

      expect(
        schemaResult.valid,
        JSON.stringify(schemaResult.errors, null, 2),
      ).toBe(true);

      // Verify that rejected data was not saved.
      const isMessageStored = await messageExists(
        testCase.email,
        testMessage
      );

      expect(isMessageStored).toBe(false);

    }
  );

}
