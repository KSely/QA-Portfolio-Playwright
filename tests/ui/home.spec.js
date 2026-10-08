import { test, expect } from "@playwright/test";

import HomePage from "../../pages/HomePage.js";
import ProjectPage from "../../pages/ProjectPage.js";


// ============================================================
// Home Page
// ============================================================

// Verify that the Home Page loads with the expected title and heading.
test("home page should open successfully @smoke", async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.open();

  await expect(page).toHaveTitle(/QA Automation Portfolio/i);
  await expect(homePage.mainHeading).toBeVisible();
});


// Verify navigation to the Featured Project section.
test("View QA Project link should navigate to the project section", async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.open();
  await expect(homePage.viewProjectLink).toBeVisible();

  await homePage.viewProjectLink.click();

  await expect(page).toHaveURL(/\/#project$/);
  await expect(homePage.projectHeading).toBeVisible();
});


// Verify navigation from the Home Page to the Project Details page.
test("View Project Details link should navigate to the project page", async ({ page }) => {
  const homePage = new HomePage(page);
  const projectPage = new ProjectPage(page);

  await homePage.open();
  await expect(homePage.projectDetailsLink).toBeVisible();

  await homePage.projectDetailsLink.click();

  await expect(page).toHaveURL(/\/project$/);
  await expect(projectPage.mainHeading).toBeVisible();
});
