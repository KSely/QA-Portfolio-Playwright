// Import Playwright's test function and assertion library.
//
// The built-in "request" fixture allows us to send HTTP
// requests directly to the backend without using a browser.
const { test, expect } = require("@playwright/test");

// Import reusable database helper functions.
//
// messageExists() verifies whether submitted data exists
// in PostgreSQL.
//
// deleteMessage() removes test data after a successful
// positive API test.
const {
  messageExists,
  deleteMessage
} = require("../../utils/databaseHelper");


// ============================================================
// POST /contact
// Positive API Test
// ============================================================
//
// Verify that the Contact API accepts valid form data,
// returns the expected response, and stores the submitted
// message in PostgreSQL.
test("POST /contact should create a message with valid data", async ({
  request,
}) => {

  // Generate unique test data for every execution.
  const timestamp = Date.now();

  const testName = "Playwright API Test User";
  const testEmail = `playwright.api.${timestamp}@example.com`;
  const testMessage = `Playwright API contact test ${timestamp}`;


  try {

    // Step 1: Send valid form data to POST /contact.
    const response = await request.post("/contact", {
      form: {
        name: testName,
        email: testEmail,
        message: testMessage
      }
    });


    // Step 2: Verify HTTP 200 OK.
    expect(response.status()).toBe(200);


    // Step 3: Parse the JSON response.
    const responseBody = await response.json();


    // Step 4: Verify the API response.
    expect(responseBody.success).toBe(true);

    expect(responseBody.message).toBe(
      "Message sent successfully!"
    );


    // Step 5: Verify that the submitted data
    // was persisted in PostgreSQL.
    const isMessageStored = await messageExists(
      testEmail,
      testMessage
    );

    expect(isMessageStored).toBe(true);

  } finally {

    // Remove test data even if an assertion fails.
    await deleteMessage(
      testEmail,
      testMessage
    );

  }

});


// ============================================================
// POST /contact
// Negative API Tests - Missing Required Fields
// ============================================================
//
// Instead of creating three separate tests containing almost
// identical logic, we define the test data once.
//
// Each object represents one negative validation scenario.
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


// Generate one Playwright test for every test case.
//
// This is data-driven testing:
// one test implementation executes against multiple
// sets of input data.
for (const testCase of missingFieldTestCases) {

  test(`POST /contact should reject request when ${testCase.field} is missing`,
    async ({ request }) => {

      // Step 1: Send a request with one required field missing.
      const response = await request.post("/contact", {
        form: testCase.formData
      });


      // Step 2: Verify HTTP 400 Bad Request.
      expect(response.status()).toBe(400);


      // Step 3: Parse the JSON response.
      const responseBody = await response.json();


      // Step 4: Verify the validation response.
      expect(responseBody.success).toBe(false);

      expect(responseBody.message).toBe(
        "All fields are required."
      );

    }
  );

}

// ============================================================
// POST /contact
// Negative API Test Data - Whitespace Required Fields
// ============================================================
//
// These test cases verify that required fields containing
// only whitespace are treated as empty values.
//
// This is an important boundary condition because the field
// technically exists in the request, but does not contain
// meaningful user input.
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

// ============================================================
// POST /contact
// Negative API Tests - Whitespace Required Fields
// ============================================================
//
// Generate one Playwright test for every whitespace test case.
//
// These tests verify that values containing only spaces
// are rejected by backend validation.
for (const testCase of whitespaceFieldTestCases) {

  test(`POST /contact should reject request when ${testCase.field} contains only whitespace`,
    async ({ request }) => {

      // Step 1: Send a request where one required field
      // contains only whitespace characters.
      const response = await request.post("/contact", {
        form: testCase.formData
      });


      // Step 2: Verify HTTP 400 Bad Request.
      expect(response.status()).toBe(400);


      // Step 3: Parse the JSON response.
      const responseBody = await response.json();


      // Step 4: Verify the validation response.
      expect(responseBody.success).toBe(false);

      expect(responseBody.message).toBe(
        "All fields are required."
      );


      // Step 5: Verify that rejected data was NOT
      // persisted in PostgreSQL.
      //
      // messageExists() searches using the email and message
      // supplied by the current test case.
      const isMessageStored = await messageExists(
        testCase.formData.email,
        testCase.formData.message
      );


      // Step 6: Rejected requests must not create
      // records in the database.
      expect(isMessageStored).toBe(false);

    }
  );

}

// ============================================================
// POST /contact
// Negative API Test Data - Invalid Email Formats
// ============================================================
//
// These test cases verify that the backend rejects
// malformed email addresses.
//
// Each case represents a different email validation
// boundary condition.
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

// ============================================================
// POST /contact
// Negative API Tests - Invalid Email Formats
// ============================================================
//
// Generate one Playwright test for every invalid email case.
//
// These tests verify that malformed email addresses
// are rejected by backend validation and are not
// persisted in PostgreSQL.
for (const testCase of invalidEmailTestCases) {

  test(`POST /contact should reject email with ${testCase.description}`,
    async ({ request }) => {

      // Generate a unique message for this test execution.
      //
      // This allows us to verify that this exact rejected
      // request was not persisted in PostgreSQL.
      const timestamp = Date.now();

      const testName = "Playwright API Test User";
      const testMessage =
        `Invalid email API test ${testCase.description} ${timestamp}`;


      // Step 1: Send the request with an invalid email address.
      const response = await request.post("/contact", {
        form: {
          name: testName,
          email: testCase.email,
          message: testMessage
        }
      });


      // Step 2: Verify HTTP 400 Bad Request.
      expect(response.status()).toBe(400);


      // Step 3: Parse the JSON response.
      const responseBody = await response.json();


      // Step 4: Verify the validation response.
      expect(responseBody.success).toBe(false);

      expect(responseBody.message).toBe(
        "Invalid email address."
      );


      // Step 5: Verify that the rejected request
      // was NOT persisted in PostgreSQL.
      const isMessageStored = await messageExists(
        testCase.email,
        testMessage
      );


      // Step 6: Invalid data must not create
      // a database record.
      expect(isMessageStored).toBe(false);

    }
  );

}
