# QA Portfolio - Playwright Automation Framework

A comprehensive QA automation framework built with JavaScript and Playwright for testing a full-stack portfolio web application.

The project demonstrates practical automation testing across multiple layers of the application, including UI, API, and database validation.

## Tech Stack

- JavaScript
- Node.js
- Playwright
- PostgreSQL / node-postgres (`pg`)
- npm
- Playwright HTML Report
- Git / GitHub
- GitHub Actions

## Project Overview

This repository contains an automated testing framework created for a full-stack QA portfolio web application.

The framework demonstrates testing across multiple application layers:

- **UI Testing** — automated browser testing using Playwright
- **API Testing** — direct REST API validation using Playwright's APIRequestContext
- **Database Testing** — PostgreSQL validation using the `pg` client
- **End-to-End Testing** — UI-to-database validation of contact form workflows
- **Smoke Testing** — focused execution of critical application checks
- **Regression Testing** — complete UI, API, and database test execution
- **Test Reporting** — Playwright HTML reports with execution results and failure diagnostics
- **CI/CD** — GitHub Actions workflow for automated framework verification

The framework follows the Page Object Model (POM) design pattern and uses reusable components for page locators, database operations, environment configuration, and test execution.

## Test Coverage

The automation framework currently includes:

- **14 UI tests** covering the Home, Project, and Contact functionality
- **13 API tests** covering application health, response headers, successful contact submission, required field validation, whitespace validation, and invalid email formats
- **2 database tests** covering PostgreSQL connectivity and test-data lifecycle validation
- **29 automated tests** in the complete regression suite
- **Database validation for API and UI workflows** to verify accepted data is persisted and rejected data is not stored where applicable
- **Automatic test data cleanup** to keep tests independent and repeatable
- **2 critical smoke tests** covering frontend and backend availability

Current regression baseline:

```text
UI          14
API         13
Database     2
────────────────
TOTAL       29
```

Latest local regression result:

```text
29 passed
```

## Project Structure

```text
QA-Portfolio-Playwright/
├── .github/
│   └── workflows/
│       └── playwright-ci.yml
│
├── pages/
│   ├── HomePage.js
│   └── ProjectPage.js
│
├── tests/
│   ├── api/
│   │   ├── contactApi.spec.js
│   │   └── statusApi.spec.js
│   │
│   ├── database/
│   │   └── databaseConnection.spec.js
│   │
│   └── ui/
│       ├── contact.spec.js
│       ├── home.spec.js
│       └── project.spec.js
│
├── utils/
│   └── databaseHelper.js
│
├── .env
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.js
└── README.md
```

## Test Suites

The framework supports different test execution strategies through Playwright configuration, test directories, npm scripts, and test tags:

- **Smoke Suite** — runs a focused set of critical frontend and backend checks tagged with `@smoke`
- **Regression Suite** — runs the complete automated test suite
- **UI Suite** — runs browser-based UI tests independently
- **API Suite** — runs API tests independently without opening a browser
- **Database Suite** — runs PostgreSQL integration tests independently

## Running the Tests

### Prerequisites

Before running the tests, make sure the following are installed and available:

- Node.js
- npm
- Google Chrome
- PostgreSQL for database-related tests
- The portfolio web application running locally on `http://localhost:3000`

Install project dependencies:

```bash
npm install
```

### Run the Full Regression Suite

```bash
npm test
```

### Run the Smoke Suite

```bash
npm run test:smoke
```

### Run the UI Suite

```bash
npm run test:ui
```

### Run the API Suite

```bash
npm run test:api
```

### Run the Database Suite

```bash
npm run test:db
```

## Configuration

The framework uses environment variables stored in a local `.env` file for database configuration.

For security reasons, `.env` is excluded from version control and is not committed to the repository.

A safe configuration template is provided in:

```text
.env.example
```

Example configuration:

```properties
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=qa_portfolio
DB_USER=postgres
DB_PASSWORD=your_database_password
```

Create a local `.env` file from the example and provide the appropriate local database credentials.

Never commit real database credentials to version control.

The application base URL is configured in `playwright.config.js`:

```javascript
baseURL: "http://localhost:3000"
```

The framework currently uses the locally installed Google Chrome browser through a Playwright project:

```javascript
projects: [
  {
    name: "chrome",
    use: {
      channel: "chrome"
    }
  }
]
```

The project-based configuration provides a foundation for adding additional browser configurations in the future.

## Playwright Reporting

The framework uses Playwright's built-in HTML reporter.

The report provides:

- Test execution status
- Passed and failed tests
- Skipped tests
- Flaky test identification
- Execution duration
- Individual test results
- Failure details

After running the tests, open the HTML report with:

```bash
npx playwright show-report
```

The generated `playwright-report` directory is excluded from version control.

## Failure Diagnostics

The framework includes diagnostic configuration to simplify failure investigation.

### Failure Screenshots

Screenshots are automatically captured when a test fails:

```javascript
screenshot: "only-on-failure"
```

### Retry Strategy

Failed tests are retried once:

```javascript
retries: 1
```

### Playwright Trace

A Playwright trace is recorded during the first retry:

```javascript
trace: "on-first-retry"
```

Trace data can be used to investigate test actions, page state, network activity, timing, and failure context.

## Page Object Model

The UI automation follows the Page Object Model design pattern.

Page-specific locators are separated from test logic:

```text
pages/
├── HomePage.js
└── ProjectPage.js
```

This approach improves:

- Test maintainability
- Locator reuse
- Test readability
- Separation of page structure from test logic

## UI Testing

The UI suite validates user-facing functionality through Google Chrome.

Current UI coverage includes:

- Home page availability
- Main page content validation
- Navigation between application sections
- Navigation to the project details page
- Project page content validation
- Contact form successful submission
- Required Name validation
- Email format validation
- Required Message validation
- Success-message validation
- Database persistence after successful submission
- Database non-persistence after rejected form submissions

The contact form negative tests validate both browser-side HTML5 constraints and database behavior.

## API Testing

Playwright's built-in APIRequestContext is used to test backend endpoints directly without opening a browser.

### `GET /api/status`

The framework validates:

- Successful HTTP response
- HTTP status code
- Backend status value
- Response message
- JSON `Content-Type` response header

### `POST /contact`

The framework validates:

- Successful contact submission
- Required field validation
- Missing field validation
- Whitespace-only field validation
- Invalid email validation
- HTTP status codes
- JSON response bodies
- Database persistence for accepted requests
- Database non-persistence for rejected whitespace and invalid-email requests

Data-driven API tests are used to cover multiple validation scenarios without unnecessary test duplication.

## Database Testing

The framework integrates directly with PostgreSQL using the `pg` client.

Database testing includes:

- PostgreSQL connectivity validation
- Direct SQL queries from automated tests
- Verification of submitted contact messages
- Verification that rejected data is not stored where applicable
- Controlled test-data creation
- Test-data lifecycle validation
- Automatic cleanup of generated test records
- Verification that cleanup successfully removed test data
- Parameterized SQL queries

Reusable database operations are implemented in:

```text
utils/databaseHelper.js
```

The helper provides reusable operations for:

```text
insertMessage()
messageExists()
deleteMessage()
```

The database lifecycle test validates:

```text
INSERT
  ↓
Verify record exists
  ↓
DELETE
  ↓
Verify one record was deleted
  ↓
Verify record no longer exists
```

Database connections are closed after operations to keep test execution controlled and repeatable.

Safety cleanup is also performed when necessary so failed test executions do not leave unnecessary test data in PostgreSQL.

## End-to-End Validation

The contact form UI test validates the application across multiple layers:

```text
Browser UI
    ↓
Contact Form
    ↓
POST /contact
    ↓
Express Backend
    ↓
PostgreSQL
    ↓
Database Verification
```

The automated workflow:

1. Opens the application in the browser
2. Enters valid contact information
3. Submits the form through the UI
4. Verifies the success message
5. Queries PostgreSQL directly
6. Confirms the submitted data was persisted
7. Removes the generated test record during cleanup

This demonstrates end-to-end validation from the browser through the backend to the database.

## Key Testing Scenarios

The framework covers practical quality scenarios, including:

- Home page availability and content validation
- Navigation between application sections and pages
- Project page content validation
- Contact form submission through the UI
- Contact form browser-side negative validation
- Contact API positive and negative testing
- Required field validation
- Whitespace-only input validation
- Email format validation using data-driven tests
- API response header validation
- PostgreSQL verification after successful UI and API submissions
- Verification that rejected UI and API data is not persisted where applicable
- Database connectivity testing
- Database test-data lifecycle validation
- Automatic test-data cleanup
- Smoke testing of critical frontend and backend functionality
- Full regression execution

## Defects Found by Automation

Automated API testing identified real validation defects in the contact endpoint during framework development.

### Whitespace Validation

Automated negative tests revealed that whitespace-only values could pass required-field validation and be persisted in PostgreSQL.

The backend validation was updated to reject missing, empty, and whitespace-only values.

Regression testing was then used to verify the fix and protect the behavior from future regressions.

### Email Format Validation

API automation also identified that incomplete email addresses such as `test@` were accepted because the original validation only checked for the presence of the `@` character.

The backend email validation was improved, and additional data-driven API test cases were added for invalid email formats.

Database assertions verify that rejected invalid-email requests are not persisted.

## Smoke Testing

Critical tests are tagged with:

```text
@smoke
```

The current smoke suite validates:

- Backend availability through `GET /api/status`
- Frontend availability through the Home Page smoke test

Run the smoke suite with:

```bash
npm run test:smoke
```

Current smoke suite:

```text
2 tests
```

## Regression Testing

The complete UI, API, and database automation suite acts as the regression suite.

Run the full regression suite with:

```bash
npm test
```

Current regression coverage:

```text
29 automated tests
```

Latest local execution:

```text
29 passed
```

## CI/CD

The project uses GitHub Actions for Continuous Integration.

The CI workflow is configured to run automatically on pushes and pull requests to the `main` branch.

The current pipeline:

1. Runs on a GitHub-hosted Ubuntu runner
2. Starts a PostgreSQL 16 service container
3. Sets up Node.js 22
4. Installs project dependencies using `npm ci`
5. Creates the CI test configuration from `.env.example`
6. Initializes the required PostgreSQL database schema
7. Loads the Playwright configuration and discovers the automated test suite
8. Verifies that the Playwright framework can be successfully initialized in the CI environment

Current CI workflow:

```text
Push / Pull Request
        ↓
GitHub Actions
        ↓
Ubuntu Runner
        ↓
PostgreSQL 16
        ↓
Node.js 22
        ↓
npm ci
        ↓
Test Configuration
        ↓
Database Schema
        ↓
Playwright Test Discovery
        ↓
Framework Verification
```

The CI verification command is:

```bash
npx playwright test --list
```

The current CI pipeline performs framework and test-discovery verification rather than executing the complete 29-test regression suite.

The full regression suite currently requires the portfolio application under test to be running on `http://localhost:3000`. Full remote regression execution can be added to the CI pipeline when the application under test is made available to the GitHub Actions runner.

The workflow configuration is stored in:

```text
.github/workflows/playwright-ci.yml
```

## npm Scripts

The project provides dedicated commands for different types of test execution:

```json
"scripts": {
  "test": "playwright test",
  "test:ui": "playwright test tests/ui",
  "test:api": "playwright test tests/api",
  "test:db": "playwright test tests/database",
  "test:smoke": "playwright test --grep @smoke"
}
```

This allows the complete regression suite or individual testing layers to be executed independently.

## Framework Highlights

This project demonstrates:

- Playwright browser automation
- JavaScript-based test automation
- Page Object Model
- Direct REST API testing
- HTTP response header validation
- PostgreSQL database integration
- UI-to-database end-to-end validation
- Positive and negative UI testing
- Positive and negative API testing
- Data-driven test design
- Database test-data lifecycle management
- Smoke and regression testing
- Environment-based configuration
- Secure configuration template using `.env.example`
- Parameterized SQL queries
- Automatic test data cleanup
- Playwright HTML reporting
- Failure screenshots
- Retry and trace diagnostics
- npm-based test execution
- Git-based version control
- GitHub Actions CI/CD configuration

## Purpose

This project was created as a practical QA automation portfolio demonstrating how Playwright can be used to test a full-stack application across the **UI, API, and database layers**.

The framework focuses on maintainable test architecture, reusable components, realistic validation scenarios, test independence, database verification, failure diagnostics, clear reporting, and CI/CD integration.