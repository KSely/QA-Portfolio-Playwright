import { test, expect } from "@playwright/test";

import ProjectPage from "../../pages/ProjectPage.js";


// ============================================================
// Project Page
// ============================================================

let projectPage;

test.beforeEach(async ({ page }) => {
  projectPage = new ProjectPage(page);
  await projectPage.open();
});

// Verify that the Project Details page opens successfully.
test("project page should open successfully", async ({ page }) => {
  await expect(page).toHaveURL(/\/project$/);
  await expect(projectPage.mainHeading).toBeVisible();
});

// Verify that the Application Architecture section is visible.
test("Application Architecture section should be visible", async () => {
  await expect(projectPage.architectureHeading).toBeVisible();
});

// Verify that the Technology Stack section is visible.
test("Technology Stack section should be visible", async () => {
  await expect(projectPage.technologyStackHeading).toBeVisible();
});

// Verify that the QA & Testing Stack section is visible.
test("QA & Testing Stack section should be visible", async () => {
  await expect(projectPage.qaTestingStackHeading).toBeVisible();
});

// Verify that the Test Strategy & Coverage section is visible.
test("Test Strategy & Coverage section should be visible", async () => {
  await expect(projectPage.testStrategyHeading).toBeVisible();
});

// Verify that the API Coverage & Endpoints section is visible.
test("API Coverage & Endpoints section should be visible", async () => {
  await expect(projectPage.apiCoverageHeading).toBeVisible();
});

// Verify that the Database Testing section is visible.
test("Database Testing section should be visible", async () => {
  await expect(projectPage.databaseTestingHeading).toBeVisible();
});
