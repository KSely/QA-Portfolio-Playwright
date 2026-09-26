# QA Portfolio - Playwright Automation Framework

A QA automation framework built with JavaScript and Playwright for testing a full-stack portfolio web application.

The project demonstrates practical automated testing across the UI, API, and database layers, including cross-browser testing, end-to-end validation, test data management, reporting, and CI/CD integration.

## Tech Stack

- JavaScript
- Node.js
- Playwright 1.62.1
- PostgreSQL / node-postgres (`pg`)
- npm
- Playwright HTML Report
- Git / GitHub
- GitHub Actions

## Project Overview

This repository contains a Playwright automation framework created for a full-stack QA portfolio web application.

The framework demonstrates several types of automated testing:

- **UI Testing** — browser-based functional and navigation testing
- **Cross-Browser Testing** — UI validation across Chromium, Firefox, and WebKit
- **API Testing** — direct REST API validation using Playwright's `APIRequestContext`
- **Database Testing** — PostgreSQL validation using the `pg` client
- **End-to-End Testing** — UI-to-database validation of contact form workflows
- **Smoke Testing** — focused validation of critical frontend and backend functionality
- **Regression Testing** — complete UI, API, and database test execution
- **Test Reporting** — Playwright HTML reports, screenshots, retries, and traces
- **CI/CD** — GitHub Actions workflow for automated framework verification

The UI automation follows the Page Object Model (POM) design pattern. Reusable database helper functions are used for database validation, test data creation, and cleanup.

## Test Coverage

The framework currently includes 29 unique automated tests across the UI, API, and database layers.

| Test Layer | Unique Tests | Execution | Test Executions |
|---|---:|---|---:|
| UI | 14 | Chromium, Firefox, and WebKit | 42 |
| API | 13 | Executed once | 13 |
| Database | 2 | Executed once | 2 |
| **Total** | **29** | **Full regression suite** | **57** |

The 14 UI tests run across three Playwright-managed browser engines:

- Chromium
- Firefox
- WebKit

This provides 42 cross-browser UI test executions while keeping API and database tests independent from browser-specific execution.

Additional coverage includes:

- Database validation for UI and API workflows
- Positive and negative test scenarios
- Browser-side form validation
- API response and status-code validation
- Data-driven negative testing
- Test data creation and cleanup
- 2 critical smoke tests

Latest local regression result:

```text
57 passed
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
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.js
└── README.md
```

## Test Suites

The project supports separate test suites for different testing layers.

### Smoke Suite

Runs critical frontend and backend checks tagged with `@smoke`.

```bash
npm run test:smoke
```

Current smoke coverage:

- Backend availability through `GET /api/status`
- Frontend availability through the Home Page

### Full Regression Suite

Runs the complete configured test suite:

- 14 UI tests in Chromium
- 14 UI tests in Firefox
- 14 UI tests in WebKit
- 13 API tests
- 2 database tests

```bash
npm test
```

The full regression suite contains 57 test executions.

### UI Suite

Runs the 14 UI tests across Chromium, Firefox, and WebKit.

```bash
npm run test:ui
```

This produces 42 UI test executions.

Individual browser projects can also be executed separately:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### API Suite

Runs API tests independently.

```bash
npm run test:api
```

Current API suite:

```text
13 passed
```

### Database Suite

Runs PostgreSQL integration tests independently.

```bash
npm run test:db
```

Current database suite:

```text
2 passed
```

## Prerequisites

Before running the tests, make sure the following are installed and available:

- Node.js
- npm
- PostgreSQL
- The portfolio web application running locally on `http://localhost:3000`

Install project dependencies:

```bash
npm install
```

Install the Playwright-managed browser binaries:

```bash
npx playwright install
```

The framework uses Playwright-managed Chromium, Firefox, and WebKit for cross-browser UI testing.

## Configuration

Database configuration is managed through environment variables stored in a local `.env` file.

The real `.env` file is excluded from version control.

A safe configuration template is provided in:

```text
.env.example
```

Example:

```properties
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=qa_portfolio
DB_USER=postgres
DB_PASSWORD=your_database_password
```

Create a local `.env` file from this template and provide the appropriate local PostgreSQL credentials.

The application base URL is configured in `playwright.config.js`:

```javascript
baseURL: "http://localhost:3000"
```

The framework uses separate Playwright projects for UI, API, and database testing.

UI tests run across three Playwright-managed browser engines:

```javascript
projects: [
  {
    name: "chromium",
    testMatch: /tests\/ui\/.*\.spec\.js/,
    use: {
      ...devices["Desktop Chrome"]
    }
  },
  {
    name: "firefox",
    testMatch: /tests\/ui\/.*\.spec\.js/,
    use: {
      ...devices["Desktop Firefox"]
    }
  },
  {
    name: "webkit",
    testMatch: /tests\/ui\/.*\.spec\.js/,
    use: {
      ...devices["Desktop Safari"]
    }
  }
]
```

API and database tests are configured as separate projects and run once rather than being repeated for every browser engine.

This keeps browser-specific execution focused on the UI layer while avoiding unnecessary duplication of API and database tests.

## Cross-Browser Testing

The UI automation is executed against three Playwright-managed browser engines:

- **Chromium**
- **Firefox**
- **WebKit**

Each browser project executes the same 14 UI tests.

```text
Chromium    14
Firefox     14
WebKit      14
──────────────
UI Total    42
```

This configuration validates UI behavior across multiple browser engines while keeping the test architecture centralized in one framework.

During cross-browser verification, a success-message locator was updated to use the element's unique ID:

```javascript
page.locator('#success-message')
```

This provided consistent visibility behavior across Chromium, Firefox, and WebKit.

## Page Object Model

The UI automation uses the Page Object Model to separate page-specific locators from test logic.

```text
pages/
├── HomePage.js
└── ProjectPage.js
```

`HomePage.js` contains reusable locators for:

- Main page content
- Project navigation
- Contact form fields
- Contact form submission
- Success message validation

`ProjectPage.js` contains reusable locators for the Project Details page and its main content sections.

This structure improves test readability, locator reuse, and maintainability.

## UI Testing

The UI suite validates user-facing functionality across Chromium, Firefox, and WebKit.

Current UI coverage includes:

- Home page availability
- Page title and main heading validation
- Navigation to the Featured Project section
- Navigation to the Project Details page
- Project page content validation
- Contact form successful submission
- Required Name validation
- Invalid Email validation
- Required Message validation
- Success message validation
- Database persistence after successful form submission
- Database non-persistence after rejected form submissions

The contact form negative tests use browser-side HTML5 validation and also verify database behavior.

### UI-to-Database Validation

The positive contact form test validates the workflow across multiple application layers:

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

The test:

1. Opens the application
2. Enters valid contact information
3. Submits the form through the UI
4. Verifies the success message
5. Queries PostgreSQL directly
6. Confirms that the submitted data was persisted
7. Removes the generated test record during cleanup

This provides end-to-end validation from the browser through the backend to the database.

## API Testing

Playwright's built-in `APIRequestContext` is used to test backend endpoints directly without opening a browser.

### `GET /api/status`

The status endpoint tests validate:

- Successful HTTP response
- HTTP status code `200`
- Backend status value
- Response message
- JSON `Content-Type` response header

Expected response:

```json
{
  "status": "ok",
  "message": "QA Automation Portfolio backend is running"
}
```

### `POST /contact`

The contact endpoint tests cover:

- Successful contact submission
- HTTP response status
- JSON response body
- Missing required fields
- Whitespace-only required fields
- Invalid email formats
- Database persistence for accepted requests
- Database non-persistence for rejected whitespace and invalid-email requests

Data-driven tests are used for multiple validation scenarios to reduce unnecessary test duplication.

Invalid email scenarios include:

```text
invalidemail.com
@example.com
user@
user@example
```

## Database Testing

The framework connects directly to PostgreSQL using the `pg` client.

Database testing includes:

- PostgreSQL connectivity validation
- Direct SQL queries
- Controlled test data creation
- Verification of stored contact messages
- Verification that rejected data is not persisted where applicable
- Test-data lifecycle validation
- Automatic cleanup of generated records
- Parameterized SQL queries

Reusable database operations are implemented in:

```text
utils/databaseHelper.js
```

The helper provides:

```text
insertMessage()
messageExists()
deleteMessage()
```

### Database Connection Test

A lightweight query verifies that the PostgreSQL connection is working:

```sql
SELECT 1 AS connection_test
```

### Test Data Lifecycle

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

Unique test data is generated for each execution.

Database connections are closed after operations, and safety cleanup is used so failed test runs do not leave unnecessary test records in PostgreSQL.

## Defects Found by Automation

Automated API testing identified validation defects in the contact endpoint during framework development.

### Whitespace Validation

Negative API tests revealed that whitespace-only values could pass required-field validation and be persisted in PostgreSQL.

The backend validation was updated to reject:

- Missing values
- Empty values
- Whitespace-only values

Regression tests were then used to verify the fix and protect the behavior from future regressions.

### Email Format Validation

API automation also identified that incomplete email addresses such as:

```text
test@
```

were accepted because the original validation only checked whether the email contained an `@` character.

The backend email validation was improved, and additional data-driven API tests were added for invalid email formats.

Database assertions verify that rejected invalid-email requests are not persisted.

## Test Data Management

Tests that create database records use unique values based on the current timestamp.

Example:

```javascript
const timestamp = Date.now();
```

This helps keep test executions independent and prevents conflicts with data created during previous runs.

Tests that create data also remove it after validation.

Cleanup is placed in `finally` blocks where appropriate so test data can still be removed if an assertion fails.

## Playwright Reporting

The framework uses Playwright's built-in HTML reporter.

After running the tests, open the report with:

```bash
npx playwright show-report
```

The report provides information such as:

- Passed and failed tests
- Skipped tests
- Flaky test identification
- Execution duration
- Individual test results
- Failure details

The generated `playwright-report` directory is excluded from version control.

## Failure Diagnostics

The framework includes several features to support failure investigation.

### Screenshots

A screenshot is captured when a test fails:

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

## Smoke and Regression Testing

Two critical tests are currently tagged with:

```text
@smoke
```

The smoke suite checks:

- Frontend availability
- Backend availability

Run it with:

```bash
npm run test:smoke
```

The framework contains 29 unique tests.

Because the 14 UI tests are executed across three browser engines, the complete regression run contains 57 test executions:

```text
Unique Tests

UI             14
API            13
Database         2
──────────────────
TOTAL           29


Regression Executions

Chromium UI     14
Firefox UI      14
WebKit UI       14
API             13
Database         2
──────────────────
TOTAL           57
```

Run the complete regression suite with:

```bash
npm test
```

Latest local execution:

```text
57 passed
```

## CI/CD

The project includes a GitHub Actions workflow for automated Continuous Integration.

The workflow runs on:

- Pushes to the `main` branch
- Pull requests targeting the `main` branch

The CI pipeline:

1. Runs on a GitHub-hosted Ubuntu runner
2. Starts a PostgreSQL 16 service container
3. Checks out the Playwright automation repository
4. Checks out the portfolio application under test
5. Sets up Node.js 22
6. Installs the Playwright project dependencies using `npm ci`
7. Installs the application dependencies using `npm ci`
8. Creates the test and application environment configurations
9. Initializes the required PostgreSQL database schema
10. Starts the portfolio application under test
11. Verifies application availability through `GET /api/status`
12. Installs the Playwright-managed browser binaries and required system dependencies
13. Runs the API test suite
14. Runs the database test suite
15. Runs the smoke test suite
16. Runs the cross-browser UI test suite across Chromium, Firefox, and WebKit
17. Uploads the Playwright HTML report as a GitHub Actions artifact if the workflow fails

Workflow:

```text
Push / Pull Request
        ↓
GitHub Actions
        ↓
Ubuntu Runner
        ↓
PostgreSQL 16
        ↓
Checkout Playwright Framework
        ↓
Checkout Application Under Test
        ↓
Node.js 22
        ↓
Install Dependencies
        ↓
Environment Configuration
        ↓
Database Schema
        ↓
Start Application
        ↓
Application Health Check
        ↓
Install Playwright Browsers
        ↓
API Tests
        ↓
Database Tests
        ↓
Smoke Tests
        ↓
Cross-Browser UI Tests
        ↓
CI Result
```

The automated CI test stages use:

```bash
npm run test:api
npm run test:db
npm run test:smoke
npm run test:ui
```
The UI suite executes 14 tests across Chromium, Firefox, and WebKit, producing 42 cross-browser UI test executions.

If a test stage fails, the generated Playwright HTML report is uploaded as a GitHub Actions artifact for failure investigation.


The workflow configuration is stored in:

```text
.github/workflows/playwright-ci.yml
```

## npm Scripts

The project provides separate commands for the main test suites:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test tests/ui",
    "test:api": "playwright test tests/api",
    "test:db": "playwright test tests/database",
    "test:smoke": "playwright test --grep @smoke"
  }
}
```

These commands allow the full regression suite or individual testing layers to be executed independently.

## Framework Highlights

This project demonstrates practical experience with:

- Playwright browser automation
- JavaScript test automation
- Cross-browser testing
- Chromium, Firefox, and WebKit browser engines
- Playwright project configuration
- Page Object Model
- UI functional testing
- REST API testing
- Positive and negative testing
- Data-driven test design
- PostgreSQL database integration
- UI-to-database end-to-end validation
- HTTP status and response validation
- Database persistence validation
- Parameterized SQL queries
- Test data lifecycle management
- Automatic test data cleanup
- Smoke and regression testing
- Environment-based configuration
- Playwright HTML reporting
- Failure screenshots
- Retry and trace diagnostics
- npm-based test execution
- Git-based version control
- GitHub Actions CI/CD configuration

## Purpose

This project was created as a practical QA automation portfolio demonstrating how Playwright can be used to test a full-stack application across the **UI, API, and database layers**.

The framework focuses on maintainable test architecture, reusable components, realistic validation scenarios, cross-browser coverage, test independence, database verification, failure diagnostics, reporting, and CI/CD integration.