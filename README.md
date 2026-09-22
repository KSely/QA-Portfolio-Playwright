# QA Portfolio - Playwright Automation Framework

A QA automation framework built with JavaScript and Playwright for testing a full-stack portfolio web application.

The project demonstrates practical automated testing across the UI, API, and database layers, including end-to-end validation, test data management, reporting, and CI/CD integration.

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

This repository contains a Playwright automation framework created for a full-stack QA portfolio web application.

The framework demonstrates several types of automated testing:

- **UI Testing** — browser-based functional and navigation testing
- **API Testing** — direct REST API validation using Playwright's `APIRequestContext`
- **Database Testing** — PostgreSQL validation using the `pg` client
- **End-to-End Testing** — UI-to-database validation of contact form workflows
- **Smoke Testing** — focused validation of critical frontend and backend functionality
- **Regression Testing** — complete UI, API, and database test execution
- **Test Reporting** — Playwright HTML reports, screenshots, retries, and traces
- **CI/CD** — GitHub Actions workflow for automated framework verification

The UI automation follows the Page Object Model (POM) design pattern. Reusable database helper functions are used for database validation, test data creation, and cleanup.

## Test Coverage

The framework currently includes:

| Test Layer | Tests | Coverage |
|---|---:|---|
| UI | 14 | Home page, navigation, project page, contact form |
| API | 13 | Status endpoint, contact endpoint, positive and negative validation |
| Database | 2 | PostgreSQL connection and test-data lifecycle |
| **Total** | **29** | **Complete regression suite** |

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

Runs all UI, API, and database tests.

```bash
npm test
```

### UI Suite

Runs browser-based UI tests.

```bash
npm run test:ui
```

### API Suite

Runs API tests independently.

```bash
npm run test:api
```

### Database Suite

Runs PostgreSQL integration tests.

```bash
npm run test:db
```

## Prerequisites

Before running the tests, make sure the following are installed and available:

- Node.js
- npm
- Google Chrome
- PostgreSQL
- The portfolio web application running locally on `http://localhost:3000`

Install project dependencies:

```bash
npm install
```

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

The framework currently uses locally installed Google Chrome:

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

This project-based configuration provides a foundation for adding additional browser configurations in the future.

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

The UI suite validates user-facing functionality through Google Chrome.

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

The complete regression suite contains:

```text
UI          14
API         13
Database     2
────────────────
TOTAL       29
```

Run the complete regression suite with:

```bash
npm test
```

Latest local execution:

```text
29 passed
```

## CI/CD

The project includes a GitHub Actions workflow for Continuous Integration.

The workflow runs on:

- Pushes to the `main` branch
- Pull requests targeting the `main` branch

The current pipeline:

1. Runs on a GitHub-hosted Ubuntu runner
2. Starts a PostgreSQL 16 service container
3. Sets up Node.js 22
4. Installs dependencies using `npm ci`
5. Creates the CI configuration from `.env.example`
6. Initializes the required PostgreSQL database schema
7. Loads the Playwright configuration
8. Discovers and verifies the automated test suite

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

The full regression suite currently requires the portfolio application under test to be running on `http://localhost:3000`.

Full remote regression execution can be added when the application under test is available to the GitHub Actions runner.

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

The framework focuses on maintainable test architecture, reusable components, realistic validation scenarios, test independence, database verification, failure diagnostics, reporting, and CI/CD integration.