// Page Object for the Project Details page.
// Contains locators used by the project page UI tests.

class ProjectPage {

  constructor(page) {
    this.page = page;


    // Main project heading.
    // first() is used because the page has more than one matching heading.
    this.mainHeading = page
      .getByRole("heading", {
        name: "Full-Stack QA Automation Project",
      })
      .first();


    // Project information sections.
    this.architectureHeading = page.getByRole("heading", {
      name: "Application Architecture",
    });

    this.technologyStackHeading = page.getByRole("heading", {
      name: "Technology Stack",
    });

    this.qaTestingStackHeading = page.getByRole("heading", {
      name: "QA & Testing Stack",
    });

    this.testStrategyHeading = page.getByRole("heading", {
      name: "Test Strategy & Coverage",
    });

    this.apiCoverageHeading = page.getByRole("heading", {
      name: "API Coverage & Endpoints",
    });

    this.databaseTestingHeading = page.getByRole("heading", {
      name: "Database Testing",
    });
  }

}

module.exports = ProjectPage;