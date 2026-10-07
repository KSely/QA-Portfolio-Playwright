import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import HomePage from "../../pages/HomePage.js";
import ProjectPage from "../../pages/ProjectPage.js";

const WCAG_A_AA_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
];

function formatAxeViolations(violations) {
  return violations
    .map((violation) => {
      const affectedNodes = violation.nodes
        .map((node) => {
          const selectors = node.target.join(" > ");
          const summary = node.failureSummary || "See the axe rule help for details.";

          return `    - ${selectors}\n      ${summary}`;
        })
        .join("\n");

      return [
        `${violation.id} [${violation.impact || "impact not specified"}]`,
        `  ${violation.help}`,
        `  ${violation.description}`,
        `  ${violation.helpUrl}`,
        "  Affected elements:",
        affectedNodes,
      ].join("\n");
    })
    .join("\n\n");
}

async function expectNoAutomaticallyDetectableViolations(page) {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_A_AA_TAGS)
    .analyze();

  expect(
    results.violations.length,
    `Automatically detectable accessibility violations:\n\n${formatAxeViolations(results.violations)}`,
  ).toBe(0);
}

const pagesToScan = [
  { name: "home", path: "/" },
  { name: "project", path: "/project" },
  { name: "automation", path: "/project/automation" },
];

for (const pageToScan of pagesToScan) {
  test(`${pageToScan.name} page should have no automatically detectable accessibility violations`, async ({
    page,
  }) => {
    await page.goto(pageToScan.path, { waitUntil: "load" });
    await expect(page.locator("body")).toBeVisible();

    await expectNoAutomaticallyDetectableViolations(page);
  });
}

test("main navigation link should support focus and Enter activation", async ({
  page,
}) => {
  const projectPage = new ProjectPage(page);

  await page.goto("/project", { waitUntil: "load" });

  const architectureLink = page
    .getByRole("navigation")
    .getByRole("link", { name: "Architecture", exact: true });

  await architectureLink.focus();
  await expect(architectureLink).toBeFocused();
  await expect(architectureLink).toBeEnabled();

  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/project#architecture$/);
  await expect(projectPage.architectureHeading).toBeVisible();
});

test("contact form fields should expose accessible names and keyboard focus", async ({
  page,
}) => {
  const homePage = new HomePage(page);

  await page.goto("/", { waitUntil: "load" });

  await expect(homePage.nameInput).toHaveAccessibleName("Name");
  await expect(homePage.emailInput).toHaveAccessibleName("Email");
  await expect(homePage.messageInput).toHaveAccessibleName("Message");
  await expect(homePage.sendMessageButton).toHaveAccessibleName("Send Message");

  await expect(homePage.nameInput).toHaveAttribute("required", "");
  await expect(homePage.emailInput).toHaveAttribute("required", "");
  await expect(homePage.messageInput).toHaveAttribute("required", "");

  await homePage.nameInput.focus();
  await expect(homePage.nameInput).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(homePage.emailInput).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(homePage.messageInput).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(homePage.sendMessageButton).toBeFocused();
  await expect(homePage.sendMessageButton).toBeEnabled();
});
