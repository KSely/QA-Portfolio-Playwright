import { test, expect } from "@playwright/test";

import HomePage from "../../pages/HomePage.js";
import { messageExists, deleteMessage } from "../../utils/databaseHelper.js";


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


// DEF-002: Recover after a browser-valid submission is rejected by the server.
test("contact form should recover after server-side validation rejection", async ({ page }) => {
  const homePage = new HomePage(page);
  // Use a stable selector because the button's accessible name changes while sending.
  const sendButton = page.locator("#send-message-button");
  const timestamp = Date.now();
  const testEmail = `playwright.recovery.${timestamp}@example.com`;
  const testMessage = `Playwright rejection recovery test ${timestamp}`;

  try {
    await page.goto("/");
    await homePage.nameInput.fill("   ");
    await homePage.emailInput.fill(testEmail);
    await homePage.messageInput.fill(testMessage);

    expect(await page.locator("#contact-form").evaluate(form => form.checkValidity())).toBe(true);

    const responsePromise = page.waitForResponse(response =>
      new URL(response.url()).pathname === "/contact" &&
      response.request().method() === "POST"
    );
    await sendButton.click();
    const response = await responsePromise;
    const body = await response.json();
    console.log("DEF-002 rejection:", response.status(), JSON.stringify(body));
    expect(response.status()).toBe(400);
    expect(body).toEqual({ success: false, message: "All fields are required." });

    const isMessageStored = await messageExists(testEmail, testMessage);
    console.log("DEF-002 matching database row exists:", isMessageStored);
    expect(isMessageStored).toBe(false);

    await expect.soft(sendButton).toBeEnabled();
    await expect.soft(sendButton).toHaveText("Send Message");
    await expect.soft(sendButton).not.toHaveText("Sending...");
  } finally {
    // Remove only this test's data if an unexpected write occurred.
    if (await messageExists(testEmail, testMessage)) {
      console.log("DEF-002 cleanup deleted rows:", await deleteMessage(testEmail, testMessage));
    } else {
      console.log("DEF-002 cleanup not needed: no matching database row.");
    }
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
