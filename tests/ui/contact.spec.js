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
const { messageExists, deleteMessage } = require("../../utils/databaseHelper");

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
      "Message sent successfully!",
    );

    // Step 9: Verify that the contact message submitted
    // through the UI was actually stored in PostgreSQL.
    const isMessageStored = await messageExists(testEmail, testMessage);

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
    await deleteMessage(testEmail, testMessage);
  }
});

// ============================================================
// Test 2
// Contact Form - Required Name Validation
// ============================================================
//
// Verify that the Contact Form cannot be submitted
// when the required Name field is empty.
//
// The Name input uses the HTML "required" attribute.
// Therefore, browser validation should prevent the form
// from being submitted before a request reaches the backend.
test("contact form should not submit when name is empty", async ({ page }) => {
  // Create the HomePage Page Object.
  const homePage = new HomePage(page);

  // Generate unique test data.
  //
  // The email and message are unique so that we can also
  // verify that no unexpected database record is created.
  const timestamp = Date.now();

  const testEmail = `playwright.emptyname.${timestamp}@example.com`;
  const testMessage = `Playwright empty name test ${timestamp}`;

  // Step 1: Open the portfolio Home Page.
  await page.goto("/");

  // Step 2: Leave the Name field empty.
  //
  // Explicitly clearing the field makes the test condition
  // clear and documents that an empty Name is intentional.
  await homePage.nameInput.fill("");

  // Step 3: Enter a valid Email.
  await homePage.emailInput.fill(testEmail);

  // Step 4: Enter a valid Message.
  await homePage.messageInput.fill(testMessage);

  // Step 5: Attempt to submit the Contact Form.
  await homePage.sendMessageButton.click();

  // Step 6: Verify that the Name field is invalid.
  //
  // Because the input has the HTML "required" attribute,
  // an empty value should fail browser constraint validation.
  const isNameValid = await homePage.nameInput.evaluate((input) =>
    input.checkValidity(),
  );

  expect(isNameValid).toBe(false);

  // Step 7: Verify that the success message was not displayed.
  //
  // This confirms that the application did not behave
  // as if the form had been successfully submitted.
  await expect(homePage.successMessage).toBeHidden();

  // Step 8: Verify that the rejected form data was not
  // persisted in PostgreSQL.
  const isMessageStored = await messageExists(testEmail, testMessage);

  expect(isMessageStored).toBe(false);
});

// ============================================================
// Test 3
// Contact Form - Invalid Email Validation
// ============================================================
//
// Verify that the Contact Form cannot be submitted
// when the Email field contains an invalid email format.
//
// The Email input uses HTML input type="email".
// Therefore, browser validation should prevent the form
// from being submitted when the email format is invalid.
test("contact form should not submit with invalid email", async ({ page }) => {
  // Create the HomePage Page Object.
  const homePage = new HomePage(page);

  // Generate unique test data.
  //
  // The message is unique so that we can verify that
  // no unexpected database record is created.
  const timestamp = Date.now();

  const testName = "Playwright Invalid Email User";
  const testEmail = "invalid-email";
  const testMessage = `Playwright invalid email UI test ${timestamp}`;

  // Step 1: Open the portfolio Home Page.
  await page.goto("/");

  // Step 2: Enter a valid Name.
  await homePage.nameInput.fill(testName);

  // Step 3: Enter an invalid Email.
  //
  // The value does not match the format expected by
  // an HTML input with type="email".
  await homePage.emailInput.fill(testEmail);

  // Step 4: Enter a valid Message.
  await homePage.messageInput.fill(testMessage);

  // Step 5: Attempt to submit the Contact Form.
  await homePage.sendMessageButton.click();

  // Step 6: Verify that the Email field fails
  // browser constraint validation.
  const isEmailValid = await homePage.emailInput.evaluate((input) =>
    input.checkValidity(),
  );

  expect(isEmailValid).toBe(false);

  // Step 7: Verify that the success message is not displayed.
  //
  // The form should not behave as if the submission
  // was successful.
  await expect(homePage.successMessage).toBeHidden();

  // Step 8: Verify that the rejected form data was not
  // persisted in PostgreSQL.
  const isMessageStored = await messageExists(testEmail, testMessage);

  expect(isMessageStored).toBe(false);
});

// ============================================================
// Test 4
// Contact Form - Required Message Validation
// ============================================================
//
// Verify that the Contact Form cannot be submitted
// when the required Message field is empty.
//
// The Message textarea uses the HTML "required" attribute.
// Therefore, browser validation should prevent the form
// from being submitted before a request reaches the backend.
test("contact form should not submit when message is empty", async ({
  page,
}) => {
  // Create the HomePage Page Object.
  const homePage = new HomePage(page);

  // Generate unique test data.
  //
  // The email is unique so that we can verify that
  // no unexpected database record is created.
  const timestamp = Date.now();

  const testName = "Playwright Empty Message User";
  const testEmail = `playwright.emptymessage.${timestamp}@example.com`;

  // Step 1: Open the portfolio Home Page.
  await page.goto("/");

  // Step 2: Enter a valid Name.
  await homePage.nameInput.fill(testName);

  // Step 3: Enter a valid Email.
  await homePage.emailInput.fill(testEmail);

  // Step 4: Leave the Message field empty.
  //
  // Explicitly clearing the field documents that
  // an empty Message is the condition being tested.
  await homePage.messageInput.fill("");

  // Step 5: Attempt to submit the Contact Form.
  await homePage.sendMessageButton.click();

  // Step 6: Verify that the Message field fails
  // browser constraint validation.
  //
  // Because the textarea has the HTML "required" attribute,
  // an empty value should fail browser validation.
  const isMessageValid = await homePage.messageInput.evaluate((textarea) =>
    textarea.checkValidity(),
  );

  expect(isMessageValid).toBe(false);

  // Step 7: Verify that the success message is not displayed.
  //
  // The application should not behave as if the form
  // was successfully submitted.
  await expect(homePage.successMessage).toBeHidden();

  // Step 8: Verify that no record with this unique email
  // was unexpectedly persisted in PostgreSQL.
  //
  // The message argument is an empty string because that is
  // the exact value used in this negative test scenario.
  const isMessageStored = await messageExists(testEmail, "");

  expect(isMessageStored).toBe(false);
});
