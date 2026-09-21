// Import Playwright's test function and assertion library.
//
// test   - defines and executes Playwright tests.
// expect - verifies that actual application behavior
//          matches the expected behavior.
const { test, expect } = require('@playwright/test');

// Import Page Objects.
const HomePage = require('../../pages/HomePage');
const ProjectPage = require('../../pages/ProjectPage');


// ============================================================
// Test 1
// Home Page Smoke Test
// ============================================================
//
// Verify that the portfolio Home Page opens successfully
// and displays the expected title and main heading.
test('home page should open successfully @smoke', async ({ page }) => {

  // Create the HomePage Page Object.
  const homePage = new HomePage(page);


  // Step 1: Navigate to the Home Page.
  //
  // baseURL is configured in playwright.config.js:
  // http://localhost:3000
  await page.goto('/');


  // Step 2: Verify the browser page title.
  //
  // toHaveTitle() is a Playwright web-first assertion.
  // Playwright automatically waits for the expected title.
  await expect(page).toHaveTitle(/QA Automation Portfolio/i);


  // Step 3: Verify that the main Home Page heading is visible.
  //
  // mainHeading is defined in HomePage.js.
  await expect(homePage.mainHeading).toBeVisible();

});


// ============================================================
// Test 2
// Home Page In-Page Navigation
// ============================================================
//
// Verify that the "View QA Project" link navigates
// to the Featured Project section on the Home Page.
test('View QA Project link should navigate to the project section', async ({ page }) => {

  // Create the HomePage Page Object.
  const homePage = new HomePage(page);


  // Step 1: Open the Home Page.
  await page.goto('/');


  // Step 2: Verify that the "View QA Project" link is visible.
  //
  // viewProjectLink is defined in HomePage.js.
  await expect(homePage.viewProjectLink).toBeVisible();


  // Step 3: Click the "View QA Project" link.
  await homePage.viewProjectLink.click();


  // Step 4: Verify that the URL contains "#project".
  await expect(page).toHaveURL(/#project$/);


  // Step 5: Verify that the Featured Project heading is visible.
  //
  // projectHeading is defined in HomePage.js.
  await expect(homePage.projectHeading).toBeVisible();

});


// ============================================================
// Test 3
// Navigation to Project Details Page
// ============================================================
//
// Verify that the "View Project Details" link navigates
// from the Home Page to the dedicated Project page.
test('View Project Details link should navigate to the project page', async ({ page }) => {

  // Create Page Objects for both pages involved in this test.
  //
  // HomePage represents the starting page.
  // ProjectPage represents the destination page.
  //
  // Both objects receive the same Playwright page fixture because
  // navigation occurs inside the same browser tab.
  const homePage = new HomePage(page);
  const projectPage = new ProjectPage(page);


  // Step 1: Open the Home Page.
  await page.goto('/');


  // Step 2: Verify that the "View Project Details" link
  // is visible before interacting with it.
  await expect(homePage.projectDetailsLink).toBeVisible();


  // Step 3: Click the "View Project Details" link.
  //
  // This navigates the browser from the Home Page
  // to the dedicated "/project" route.
  await homePage.projectDetailsLink.click();


  // Step 4: Verify that navigation to the Project page
  // completed successfully.
  await expect(page).toHaveURL('http://localhost:3000/project');


  // Step 5: Verify that the Project Page main heading is visible.
  //
  // The locator is now stored in ProjectPage.js instead of
  // being defined directly inside the test.
  await expect(projectPage.mainHeading).toBeVisible();

});