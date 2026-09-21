// Page Object Model for the portfolio Project Page.
//
// This class represents the dedicated Project Details page
// available through the "/project" route.
//
// Page-specific locators and reusable actions for the Project
// page will be stored here instead of inside the test files.
class ProjectPage {
  // The constructor receives the Playwright "page" fixture
  // from the test.
  //
  // This allows the ProjectPage object to interact with
  // the same browser page that is being used by the test.
  constructor(page) {
    // Store the Playwright page instance.
    this.page = page;

    // Main heading displayed on the Project Details page.
    //
    // The page currently contains more than one heading with
    // this accessible name, therefore first() selects the first
    // matching heading.
    //
    // getByRole() keeps the locator based on user-visible and
    // accessibility information instead of CSS or XPath.
    this.mainHeading = page
      .getByRole("heading", {
        name: "Full-Stack QA Automation Project",
      })
      .first();

    // "Application Architecture" heading displayed in the
    // System Design section of the Project Page.
    //
    // This locator verifies that the architecture section,
    // which describes the application's system design,
    // is rendered on the Project Details page.
    this.architectureHeading = page.getByRole("heading", {
      name: "Application Architecture",
    });

    // "Technology Stack" heading displayed in the
    // Application Technologies section of the Project Page.
    //
    // This locator is used to verify that the section describing
    // the technologies used to build the application is rendered.
    this.technologyStackHeading = page.getByRole("heading", {
      name: "Technology Stack",
    });

    // "QA & Testing Stack" heading displayed in the
    // Quality Engineering section of the Project Page.
    //
    // This locator is used to verify that the section describing
    // the tools and technologies used for quality engineering
    // and automated testing is rendered.
    this.qaTestingStackHeading = page.getByRole("heading", {
      name: "QA & Testing Stack",
    });

    // "Test Strategy & Coverage" heading displayed in the
    // Test Strategy section of the Project Page.
    //
    // This locator is used to verify that the section describing
    // the project's testing approach and coverage is rendered.
    this.testStrategyHeading = page.getByRole("heading", {
      name: "Test Strategy & Coverage",
    });

    // "API Coverage & Endpoints" heading displayed in the
    // API Validation section of the Project Page.
    //
    // This locator is used to verify that the section describing
    // API test coverage and application endpoints is rendered.
    this.apiCoverageHeading = page.getByRole("heading", {
      name: "API Coverage & Endpoints",
    });

    // "Database Testing" heading displayed in the
    // Database Validation section of the Project Page.
    //
    // This locator is used to verify that the section describing
    // database validation and testing is rendered.
    this.databaseTestingHeading = page.getByRole("heading", {
      name: "Database Testing",
    });
  }
}

// Export the ProjectPage class so it can be imported
// and used inside Playwright test files.
module.exports = ProjectPage;
