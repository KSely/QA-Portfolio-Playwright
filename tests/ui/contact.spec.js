const { test, expect } = require("@playwright/test");

const HomePage = require("../../pages/HomePage");
const { messageExists, deleteMessage } = require("../../utils/databaseHelper");


// ============================================================
// Contact Form
// ============================================================

// Verify successful form submission and database persistence.
test("contact form should submit successfully with valid data", async ({
  page,
}) => {

  const homePage = new HomePage(page);

  // Use unique data for each test run.
  const timestamp = Date.now();

  const testName = "Playwright Test User";
  const testEmail = `playwright.${timestamp}@example.com`;
  const testMessage = `Playwright contact form test ${timestamp}`;

  try {
    await page.goto("/");

    await homePage.nameInput.fill(testName);
    await homePage.emailInput.fill(testEmail);
    await homePage.messageInput.fill(testMessage);

    await expect(homePage.sendMessageButton).toBeVisible();

    await homePage.sendMessageButton.click();

    await expect(homePage.successMessage).toBeVisible();
    await expect(homePage.successMessage).toHaveText(
      "Message sent successfully!",
    );

    // Verify that the message was saved in the database.
    const isMessageStored = await messageExists(testEmail, testMessage);

    expect(isMessageStored).toBe(true);

  } finally {
    // Remove test data even if the test fails.
    await deleteMessage(testEmail, testMessage);
  }
});


// Verify browser validation when Name is empty.
test("contact form should not submit when name is empty", async ({ page }) => {

  const homePage = new HomePage(page);

  const timestamp = Date.now();

  const testEmail = `playwright.emptyname.${timestamp}@example.com`;
  const testMessage = `Playwright empty name test ${timestamp}`;

  await page.goto("/");

  await homePage.nameInput.fill("");
  await homePage.emailInput.fill(testEmail);
  await homePage.messageInput.fill(testMessage);

  await homePage.sendMessageButton.click();

  // Check HTML form validation.
  const isNameValid = await homePage.nameInput.evaluate((input) =>
    input.checkValidity(),
  );

  expect(isNameValid).toBe(false);

  await expect(homePage.successMessage).toBeHidden();

  // Verify that invalid data was not saved.
  const isMessageStored = await messageExists(testEmail, testMessage);

  expect(isMessageStored).toBe(false);
});


// Verify browser validation for an invalid email.
test("contact form should not submit with invalid email", async ({ page }) => {

  const homePage = new HomePage(page);

  const timestamp = Date.now();

  const testName = "Playwright Invalid Email User";
  const testEmail = "invalid-email";
  const testMessage = `Playwright invalid email UI test ${timestamp}`;

  await page.goto("/");

  await homePage.nameInput.fill(testName);
  await homePage.emailInput.fill(testEmail);
  await homePage.messageInput.fill(testMessage);

  await homePage.sendMessageButton.click();

  // Check HTML form validation.
  const isEmailValid = await homePage.emailInput.evaluate((input) =>
    input.checkValidity(),
  );

  expect(isEmailValid).toBe(false);

  await expect(homePage.successMessage).toBeHidden();

  // Verify that invalid data was not saved.
  const isMessageStored = await messageExists(testEmail, testMessage);

  expect(isMessageStored).toBe(false);
});


// Verify browser validation when Message is empty.
test("contact form should not submit when message is empty", async ({
  page,
}) => {

  const homePage = new HomePage(page);

  const timestamp = Date.now();

  const testName = "Playwright Empty Message User";
  const testEmail = `playwright.emptymessage.${timestamp}@example.com`;

  await page.goto("/");

  await homePage.nameInput.fill(testName);
  await homePage.emailInput.fill(testEmail);
  await homePage.messageInput.fill("");

  await homePage.sendMessageButton.click();

  // Check HTML form validation.
  const isMessageValid = await homePage.messageInput.evaluate((textarea) =>
    textarea.checkValidity(),
  );

  expect(isMessageValid).toBe(false);

  await expect(homePage.successMessage).toBeHidden();

  // Verify that invalid data was not saved.
  const isMessageStored = await messageExists(testEmail, "");

  expect(isMessageStored).toBe(false);
});