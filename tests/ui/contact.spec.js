// Import Playwright's test function and assertion library.
//
// test   - defines and executes Playwright tests.
// expect - verifies that actual application behavior
//          matches the expected behavior.
const { test, expect } = require("@playwright/test");

// Import the HomePage Page Object.
//
// The contact form is located on the Home Page,
// so all form-specific locators are stored in HomePage.js.
const HomePage = require("../../pages/HomePage");

// Import reusable database helper functions.
//
// messageExists() verifies that submitted data was persisted.
// deleteMessage() removes test data after the test finishes.
const {
  messageExists,
  deleteMessage
} = require("../../utils/databaseHelper");


// ============================================================
// Test 1
// Contact Form - Successful Submission
// ============================================================
//
// Verify that a user can complete and successfully submit
// the Contact Form.
//
// The test also verifies that the submitted data is stored
// in PostgreSQL and removes the created record afterward.
test("contact form should submit successfully with valid data", async ({
  page,
}) => {

  // Create the HomePage Page Object.
  const homePage = new HomePage(page);


  // Generate unique test data.
  //
  // Date.now() returns the current timestamp in milliseconds.
  // Adding it to the email and message makes the test data
  // unique for every test execution.
  const timestamp = Date.now();

  const testName = "Playwright Test User";
  const testEmail = `playwright.${timestamp}@example.com`;
  const testMessage = `Playwright contact form test ${timestamp}`;


  // ============================================================
  // Test Execution
  // ============================================================

  try {

    // Step 1: Open the portfolio Home Page.
    await page.goto("/");


    // Step 2: Fill in the Name field.
    await homePage.nameInput.fill(testName);


    // Step 3: Fill in the Email field.
    await homePage.emailInput.fill(testEmail);


    // Step 4: Fill in the Message field.
    await homePage.messageInput.fill(testMessage);


    // Step 5: Verify that the Send Message button is visible
    // before attempting to submit the form.
    await expect(homePage.sendMessageButton).toBeVisible();


    // Step 6: Submit the Contact Form.
    //
    // Clicking this button triggers the application's
    // POST /contact request.
    await homePage.sendMessageButton.click();


    // Step 7: Verify that the application displays the
    // success message after the form is submitted.
    await expect(homePage.successMessage).toBeVisible();


    // Step 8: Verify the content of the success message.
    await expect(homePage.successMessage).toHaveText(
      "Message sent successfully!"
    );


    // Step 9: Verify that the contact message submitted
    // through the UI was actually stored in PostgreSQL.
    const isMessageStored = await messageExists(
      testEmail,
      testMessage
    );


    // Step 10: Verify database persistence.
    expect(isMessageStored).toBe(true);

  } finally {

    // ============================================================
    // Test Data Cleanup
    // ============================================================
    //
    // The finally block executes whether the test passes
    // or fails.
    //
    // This prevents automated test records from accumulating
    // in the PostgreSQL database.
    await deleteMessage(
      testEmail,
      testMessage
    );

  }

});