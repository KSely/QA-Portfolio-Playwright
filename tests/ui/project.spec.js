// Import Playwright's test function and assertion library.
//
// test   - defines and executes Playwright tests.
// expect - verifies that actual application behavior
//          matches the expected behavior.
const { test, expect } = require('@playwright/test');

// Import the ProjectPage Page Object.
//
// ProjectPage contains locators that belong specifically
// to the dedicated Project Details page.
const ProjectPage = require('../../pages/ProjectPage');


// ============================================================
// Test 1
// Project Page Smoke Test
// ============================================================
//
// Verify that the dedicated Project Details page can be opened
// directly and displays the expected main content.
test('project page should open successfully', async ({ page }) => {

  // Create the ProjectPage Page Object.
  //
  // The Playwright page fixture is passed to the constructor
  // so the Page Object can interact with the current browser page.
  const projectPage = new ProjectPage(page);


  // Step 1: Navigate directly to the Project Details page.
  //
  // The baseURL is configured globally in playwright.config.js:
  // http://localhost:3000
  //
  // Therefore Playwright resolves "/project" to:
  // http://localhost:3000/project
  await page.goto('/project');


  // Step 2: Verify that the browser reached the expected route.
  //
  // toHaveURL() is a Playwright web-first assertion.
  // Playwright automatically waits for the expected URL.
  await expect(page).toHaveURL('http://localhost:3000/project');


  // Step 3: Verify that the main Project Page heading is visible.
  //
  // mainHeading is defined in ProjectPage.js, so the test
  // does not need to know how the element is located.
  await expect(projectPage.mainHeading).toBeVisible();

});

// ============================================================
// Test 2
// Application Architecture Section
// ============================================================
//
// Verify that the Application Architecture section is displayed
// on the Project Details page.
test('Application Architecture section should be visible', async ({ page }) => {

  // Create the ProjectPage Page Object.
  const projectPage = new ProjectPage(page);


  // Step 1: Navigate directly to the Project Details page.
  await page.goto('/project');


  // Step 2: Verify that the Application Architecture
  // section heading is visible.
  //
  // architectureHeading is defined in ProjectPage.js.
  await expect(projectPage.architectureHeading).toBeVisible();

});

// ============================================================
// Test 3
// Technology Stack Section
// ============================================================
//
// Verify that the Technology Stack section is displayed
// on the Project Details page.
//
// This section describes the main technologies used to build
// the portfolio application's frontend, backend, and database.
test('Technology Stack section should be visible', async ({ page }) => {

  // Create the ProjectPage Page Object.
  const projectPage = new ProjectPage(page);


  // Step 1: Navigate directly to the Project Details page.
  await page.goto('/project');


  // Step 2: Verify that the Technology Stack
  // section heading is visible.
  //
  // technologyStackHeading is defined in ProjectPage.js.
  await expect(projectPage.technologyStackHeading).toBeVisible();

});

// ============================================================
// Test 4
// QA & Testing Stack Section
// ============================================================
//
// Verify that the QA & Testing Stack section is displayed
// on the Project Details page.
//
// This section describes the tools and technologies used
// for quality engineering and automated testing.
test('QA & Testing Stack section should be visible', async ({ page }) => {

  // Create the ProjectPage Page Object.
  const projectPage = new ProjectPage(page);


  // Step 1: Navigate directly to the Project Details page.
  await page.goto('/project');


  // Step 2: Verify that the QA & Testing Stack
  // section heading is visible.
  //
  // qaTestingStackHeading is defined in ProjectPage.js.
  await expect(projectPage.qaTestingStackHeading).toBeVisible();

});

// ============================================================
// Test 5
// Test Strategy & Coverage Section
// ============================================================
//
// Verify that the Test Strategy & Coverage section is displayed
// on the Project Details page.
//
// This section describes the overall testing approach and
// the areas of the application covered by automated testing.
test('Test Strategy & Coverage section should be visible', async ({ page }) => {

  // Create the ProjectPage Page Object.
  const projectPage = new ProjectPage(page);


  // Step 1: Navigate directly to the Project Details page.
  await page.goto('/project');


  // Step 2: Verify that the Test Strategy & Coverage
  // section heading is visible.
  //
  // testStrategyHeading is defined in ProjectPage.js.
  await expect(projectPage.testStrategyHeading).toBeVisible();

});

// ============================================================
// Test 6
// API Coverage & Endpoints Section
// ============================================================
//
// Verify that the API Coverage & Endpoints section is displayed
// on the Project Details page.
//
// This section describes the application's API endpoints
// and the API testing coverage included in the QA project.
test('API Coverage & Endpoints section should be visible', async ({ page }) => {

  // Create the ProjectPage Page Object.
  const projectPage = new ProjectPage(page);


  // Step 1: Navigate directly to the Project Details page.
  await page.goto('/project');


  // Step 2: Verify that the API Coverage & Endpoints
  // section heading is visible.
  //
  // apiCoverageHeading is defined in ProjectPage.js.
  await expect(projectPage.apiCoverageHeading).toBeVisible();

});

// ============================================================
// Test 7
// Database Testing Section
// ============================================================
//
// Verify that the Database Testing section is displayed
// on the Project Details page.
//
// This section describes the database validation approach
// used to verify application data stored in PostgreSQL.
test('Database Testing section should be visible', async ({ page }) => {

  // Create the ProjectPage Page Object.
  const projectPage = new ProjectPage(page);


  // Step 1: Navigate directly to the Project Details page.
  await page.goto('/project');


  // Step 2: Verify that the Database Testing
  // section heading is visible.
  //
  // databaseTestingHeading is defined in ProjectPage.js.
  await expect(projectPage.databaseTestingHeading).toBeVisible();

});