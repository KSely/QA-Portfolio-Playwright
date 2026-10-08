import { test, expect } from "@playwright/test";

import HomePage from "../../pages/HomePage.js";
import {
  messageExists,
  messageExistsByTestData,
} from "../../utils/databaseHelper.js";
import {
  createContactTestData,
  withContactCleanup,
} from "../support/contactTestData.js";


// ============================================================
// Contact Form
// ============================================================

// Verify successful form submission and database persistence.
test("contact form should submit successfully with valid data", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const testData = createContactTestData({ prefix: "playwright-ui" });

  await withContactCleanup(testData, async () => {
    await homePage.open();
    await homePage.submitContactForm(testData);

    await expect(homePage.successMessage).toBeVisible();
    await expect(homePage.successMessage).toHaveText(
      "Message sent successfully!",
    );

    // Verify that the message was saved in the database.
    const isMessageStored = await messageExists(
      testData.email,
      testData.message,
    );

    expect(isMessageStored).toBe(true);
  });
});


// DEF-002: Recover after a browser-valid submission is rejected by the server.
test("contact form should recover after server-side validation rejection", async ({ page }) => {
  const homePage = new HomePage(page);
  // Use a stable selector because the button's accessible name changes while sending.
  const sendButton = page.locator("#send-message-button");
  const testData = {
    ...createContactTestData({ prefix: "playwright-recovery" }),
    name: "   ",
  };

  await withContactCleanup(testData, async () => {
    await homePage.open();
    await homePage.fillContactForm(testData);

    expect(
      await page.locator("#contact-form").evaluate((form) => form.checkValidity()),
    ).toBe(true);

    const responsePromise = page.waitForResponse((response) =>
      new URL(response.url()).pathname === "/contact" &&
      response.request().method() === "POST"
    );
    await homePage.clickSendMessage();
    const response = await responsePromise;
    const body = await response.json();
    console.log("DEF-002 rejection:", response.status(), JSON.stringify(body));
    expect(response.status()).toBe(400);
    expect(body).toEqual({ success: false, message: "All fields are required." });

    const isMessageStored = await messageExists(
      testData.email,
      testData.message,
    );
    console.log("DEF-002 matching database row exists:", isMessageStored);
    expect(isMessageStored).toBe(false);

    await expect.soft(sendButton).toBeEnabled();
    await expect.soft(sendButton).toHaveText("Send Message");
    await expect.soft(sendButton).not.toHaveText("Sending...");
  });
});


// Verify browser validation when Name is empty.
test("contact form should not submit when name is empty", async ({ page }) => {
  const homePage = new HomePage(page);
  const testData = {
    ...createContactTestData({ prefix: "playwright-empty-name" }),
    name: "",
  };
  const cleanupIdentifiers = {
    email: testData.email,
    message: testData.message,
  };

  await withContactCleanup(cleanupIdentifiers, async () => {
    await homePage.open();
    await homePage.fillContactForm(testData);
    await homePage.clickSendMessage();

    // Check HTML form validation.
    const isNameValid = await homePage.nameInput.evaluate((input) =>
      input.checkValidity(),
    );

    expect(isNameValid).toBe(false);
    await expect(homePage.successMessage).toBeHidden();

    // Verify that invalid data was not saved.
    const isMessageStored = await messageExistsByTestData(cleanupIdentifiers);

    expect(isMessageStored).toBe(false);
  });
});


// Verify browser validation for an invalid email.
test("contact form should not submit with invalid email", async ({ page }) => {
  const homePage = new HomePage(page);
  const generatedData = createContactTestData({
    prefix: "playwright-invalid-email",
  });
  const testData = {
    ...generatedData,
    email: generatedData.email.replace("@", ""),
  };
  const cleanupIdentifiers = { message: testData.message };

  await withContactCleanup(cleanupIdentifiers, async () => {
    await homePage.open();
    await homePage.fillContactForm(testData);
    await homePage.clickSendMessage();

    // Check HTML form validation.
    const isEmailValid = await homePage.emailInput.evaluate((input) =>
      input.checkValidity(),
    );

    expect(isEmailValid).toBe(false);
    await expect(homePage.successMessage).toBeHidden();

    // Verify that invalid data was not saved.
    const isMessageStored = await messageExistsByTestData(cleanupIdentifiers);

    expect(isMessageStored).toBe(false);
  });
});


// Verify browser validation when Message is empty.
test("contact form should not submit when message is empty", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const testData = {
    ...createContactTestData({ prefix: "playwright-empty-message" }),
    message: "",
  };
  const cleanupIdentifiers = { email: testData.email };

  await withContactCleanup(cleanupIdentifiers, async () => {
    await homePage.open();
    await homePage.fillContactForm(testData);
    await homePage.clickSendMessage();

    // Check HTML form validation.
    const isMessageValid = await homePage.messageInput.evaluate((textarea) =>
      textarea.checkValidity(),
    );

    expect(isMessageValid).toBe(false);
    await expect(homePage.successMessage).toBeHidden();

    // Verify that invalid data was not saved.
    const isMessageStored = await messageExistsByTestData(cleanupIdentifiers);

    expect(isMessageStored).toBe(false);
  });
});
