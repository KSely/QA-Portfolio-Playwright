# QA Portfolio - Playwright Automation Framework

A QA automation framework built with JavaScript and Playwright for testing a full-stack portfolio web application.

The project demonstrates practical automated testing across the UI, API, and database layers, including cross-browser testing, end-to-end validation, test data management, defect regression testing, reporting, and CI/CD integration.

The Application Under Test (AUT) is maintained in a separate repository:

[QA-Automation-Portfolio](https://github.com/KSely/QA-Automation-Portfolio)

---

## Tech Stack

- JavaScript
- Node.js
- Playwright 1.62.1
- `@axe-core/playwright` 4.13.0
- PostgreSQL / node-postgres (`pg`)
- npm
- Playwright HTML Report
- Git / GitHub
- GitHub Actions

---

## Project Overview

This repository contains a Playwright automation framework created for a full-stack QA portfolio web application.

The framework demonstrates several types of automated testing:

- **UI Testing** — browser-based functional and navigation testing
- **Accessibility Testing** — WCAG-oriented axe scans and focused keyboard/semantic checks in Chromium
- **Cross-Browser Testing** — UI validation across Chromium, Firefox, and WebKit
- **API Testing** — direct REST API validation using Playwright's `APIRequestContext`
- **Database Testing** — PostgreSQL validation using the `pg` client
- **End-to-End Testing** — UI-to-database validation of contact form workflows
- **Smoke Testing** — focused validation of critical frontend and backend functionality
- **Regression Testing** — UI, API, and database regression coverage
- **Defect Regression Testing** — automated reproduction and verification of confirmed defects
- **Test Reporting** — Playwright HTML reports, screenshots, retries, and traces
- **CI/CD** — GitHub Actions workflow for automated framework verification

The UI automation follows the Page Object Model (POM) design pattern.

Reusable database helper functions are used for database validation, test data creation, persistence verification, and cleanup.

---

## Test Coverage

The framework currently includes **37 unique automated tests** across the UI, accessibility, API, and database layers.

| **Test Layer** | **Unique Tests** | **Execution** | **Configured Test Executions** |
|---|---:|---|---:|
| UI | 17 | Chromium, Firefox, and WebKit | 51 |
| Accessibility | 5 | Chromium | 5 |
| API | 13 | Executed once | 13 |
| Database | 2 | Executed once | 2 |
| **Total** | **37** | **Full configured suite** | **71** |

The 17 UI tests are configured to run across three Playwright-managed browser engines:

- Chromium
- Firefox
- WebKit

This provides **51 configured cross-browser UI executions** while keeping API and database tests independent from browser-specific execution.

The full configured Playwright suite contains:

**17 UI × 3 browsers + 5 accessibility + 13 API + 2 database = 71 configured executions before retries.**

The configured execution count represents framework configuration and should not be confused with the scope of an individual verification cycle.

Additional coverage includes:

- Database validation for UI and API workflows
- Positive and negative test scenarios
- Browser-side form validation
- API response and status-code validation
- Data-driven negative testing
- Test data creation and cleanup
- JavaScript page-error detection
- Server-side validation rejection recovery
- Database non-persistence verification for rejected submissions
- 2 critical smoke tests

### Recent DEF-002 Chromium Regression Result

```text
17 passed
0 failed
0 skipped
```

The GitHub Actions CI pipeline also completed successfully after the DEF-001 and DEF-002 fixes were published.

---

## Project Structure

```text
QA-Portfolio-Playwright/
│
├── .github/
│   └── workflows/
│       └── playwright-ci.yml
│
├── pages/
│   ├── HomePage.js
│   └── ProjectPage.js
│
├── tests/
│   ├── accessibility/
│   │   └── accessibility.spec.js
│   │
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
│       ├── pageErrors.spec.js
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

---

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

---

### Full Regression Suite

Runs the complete configured Playwright suite:

- 17 UI tests in Chromium
- 17 UI tests in Firefox
- 17 UI tests in WebKit
- 5 accessibility tests in Chromium
- 13 API tests
- 2 database tests

```bash
npm test
```

The configured full regression suite contains **71 test executions before retries**.

---

### UI Suite

Runs the 17 UI tests across Chromium, Firefox, and WebKit.

```bash
npm run test:ui
```

This produces **51 configured UI test executions before retries**.

Individual browser projects can also be executed separately:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

### Accessibility Suite

Runs five system/UI accessibility tests once in Chromium:

- Full-page axe scans for `/`, `/project`, and `/project/automation`
- Main-navigation link focus and Enter activation
- Contact-form accessible names, required semantics, and keyboard focus order

```bash
npm run test:accessibility
```

The axe scans use the supported WCAG A/AA tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and `wcag22aa`. Genuine violations fail the tests and include the axe rule ID, impact, help text, and affected selectors in the failure output.

Automated scans detect only some accessibility issues. They do not prove full WCAG compliance or replace manual testing for keyboard-only use, logical tab order, visible focus, zoom and reflow, screen-reader behavior, meaningful reading order, or validation feedback usability.

---

### API Suite

Runs API tests independently.

```bash
npm run test:api
```

Current API suite:

```text
13 tests
```

---

### Database Suite

Runs PostgreSQL integration tests independently.

```bash
npm run test:db
```

Current database suite:

```text
2 tests
```

---

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

---

## Configuration

Database configuration is managed through environment variables stored in a local `.env` file.

The real `.env` file is excluded from version control.

A safe configuration template is provided in:

```text
.env.example
```

Example:

```env
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

The framework uses separate Playwright projects for UI, accessibility, API, and database testing.

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
  },
  {
    name: "accessibility",
    testMatch: /tests\/accessibility\/.*\.spec\.js/,
    use: {
      ...devices["Desktop Chrome"]
    }
  }
]
```

Accessibility, API, and database tests are configured as separate projects and run once rather than being repeated for every browser engine.

This keeps cross-browser execution focused on functional UI coverage while avoiding unnecessary duplication of accessibility, API, and database tests.

---

## Cross-Browser Testing

The UI automation is configured against three Playwright-managed browser engines:

- **Chromium**
- **Firefox**
- **WebKit**

Each browser project executes the same 17 UI test cases.

```text
Chromium    17
Firefox     17
WebKit      17
──────────────
UI Total    51
```

This configuration validates UI behavior across multiple browser engines while keeping the test architecture centralized in one framework.

During earlier cross-browser verification, a success-message locator was updated to use the element's unique ID:

```javascript
page.locator("#success-message")
```

This provided consistent visibility behavior across Chromium, Firefox, and WebKit.

---

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

---

## UI Testing

The UI suite provides functional and regression coverage configured across Chromium, Firefox, and WebKit.

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
- JavaScript page-error detection on Project and Automation pages
- Contact-form recovery after server-side validation rejection
- Verification that rejected contact data is not persisted

The contact form negative tests use browser-side HTML5 validation where appropriate and also verify database behavior.

---

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

---

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

---

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

---

### Database Connection Test

A lightweight query verifies that the PostgreSQL connection is working:

```sql
SELECT 1 AS connection_test
```

---

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

---

## Defects Found by Automation

Automation and structured source/test review identified several validation and UI defects during framework development.

### Whitespace Validation

Negative API tests revealed that whitespace-only values could pass required-field validation and be persisted in PostgreSQL.

The backend validation was updated to reject:

- Missing values
- Empty values
- Whitespace-only values

Regression tests were then used to verify the fix and protect the behavior from future regressions.

---

### Email Format Validation

API automation also identified that incomplete email addresses such as:

```text
test@
```

were accepted because the original validation only checked whether the email contained an `@` character.

The backend email validation was improved, and additional data-driven API tests were added for invalid email formats.

Database assertions verify that rejected invalid-email requests are not persisted.

---

### DEF-001 — Shared Footer JavaScript Error

Regression investigation identified a shared JavaScript error on pages where the contact form was not present.

The shared footer attempted to register a contact-form event listener when the contact form element was `null`.

Affected routes included:

- `/project`
- `/project/automation`

The browser generated a JavaScript `TypeError`.

Two Playwright regression tests were added in:

```text
tests/ui/pageErrors.spec.js
```

The regression tests:

- Capture JavaScript `pageerror` events
- Reproduced the defect before the fix
- Failed against the defective implementation
- Passed after null-safe event binding was introduced
- Continued to pass during broader regression verification

The application fix used null-safe event binding so the shared footer script does not fail on pages without the contact form.

---

### DEF-002 — Contact Form Recovery After Server-Side Validation Rejection

A browser-valid contact submission could be rejected by server-side validation while leaving the UI stuck in the submitting state.

The backend correctly returned:

```json
{
  "success": false,
  "message": "All fields are required."
}
```

Before the fix:

- The submit button remained disabled
- The button text remained `Sending...`
- Normal button-based retry was unavailable
- The rejected submission was correctly not persisted in PostgreSQL

A focused Playwright regression test was added:

```text
contact form should recover after server-side validation rejection
```

The test verifies:

- Browser-valid data reaches the backend
- The backend returns HTTP `400`
- The JSON response contains `success: false`
- No matching database record is created
- The submit button becomes enabled again
- The button text returns to `Send Message`
- The UI no longer remains in the `Sending...` state

The regression test failed before the application fix.

After the fix:

- The submit button is restored
- The button text returns to `Send Message`
- Valid submission behavior remains unchanged
- Valid data still persists correctly
- Rejected data remains non-persistent
- The focused regression test passes

A broader Chromium UI regression subsequently completed with:

```text
17 passed
0 failed
0 skipped
```

The DEF-002 regression test is also included in the configured cross-browser CI execution.

---

## Defect Verification Workflow

The project demonstrates a structured defect lifecycle:

**Identify → Reproduce → Document → Automate → Fail → Fix → Retest → Regression → Report**

For confirmed defects:

1. The problem is identified and reproduced
2. The defect is documented
3. Focused regression coverage is added
4. The automated test reproduces the pre-fix failure
5. The application is fixed
6. The focused test is rerun
7. Related functionality is verified
8. Broader regression testing is performed
9. Results are documented and traced

Detailed QA documentation is maintained in the AUT repository:

[QA Documentation](https://github.com/KSely/QA-Automation-Portfolio/tree/main/docs/qa)

---

## Test Data Management

Tests that create database records use unique values based on the current timestamp.

Example:

```javascript
const timestamp = Date.now();
```

This helps keep test executions independent and prevents conflicts with data created during previous runs.

Tests that create data also remove it after validation.

Cleanup is placed in `finally` blocks where appropriate so test data can still be removed if an assertion fails.

The DEF-002 regression test also checks whether rejected data was unexpectedly persisted before attempting cleanup.

---

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
- Browser/project information

The generated `playwright-report` directory is excluded from version control.

---

## Failure Diagnostics

The framework includes several features to support failure investigation.

### Screenshots

A screenshot is captured when a test fails:

```javascript
screenshot: "only-on-failure"
```

### Retry Strategy

Failed tests are retried once according to the configured framework behavior:

```javascript
retries: 1
```

### Playwright Trace

A Playwright trace is recorded during the first retry:

```javascript
trace: "on-first-retry"
```

Trace data can be used to investigate:

- Test actions
- Page state
- Network activity
- Timing
- Failure context

---

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

The framework contains **37 unique tests**.

Because the 17 UI tests are configured across three browser engines and the 5 accessibility tests run once in Chromium, the complete configured Playwright run contains **71 executions before retries**.

```text
Unique Tests

UI             17
Accessibility   5
API            13
Database        2
──────────────────
TOTAL          37


Configured Executions

Chromium UI    17
Firefox UI     17
WebKit UI      17
Accessibility   5
API            13
Database        2
──────────────────
TOTAL          71
```

Run the complete configured suite with:

```bash
npm test
```

A focused Chromium UI regression performed after the DEF-002 fix completed successfully:

```text
17 passed
0 failed
0 skipped
```

The configured full-suite execution count should not be confused with the scope of an individual defect-verification cycle.

---

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
16. Runs the Chromium accessibility test suite
17. Runs the cross-browser UI test suite across Chromium, Firefox, and WebKit
18. Uploads the Playwright HTML report as a GitHub Actions artifact if the workflow fails

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
Accessibility Tests
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
npm run test:accessibility
npm run test:ui
```

The UI suite contains 17 UI cases configured across Chromium, Firefox, and WebKit, producing **51 configured cross-browser UI executions before retries**.

The CI workflow runs the smoke suite as a separate gate before the broader UI stage, so smoke-tagged UI scenarios may execute again when the complete UI suite runs.

If a test stage fails, the generated Playwright HTML report is uploaded as a GitHub Actions artifact for failure investigation.

The workflow configuration is stored in:

```text
.github/workflows/playwright-ci.yml
```

---

### Latest Regression CI Verification

After the DEF-001 and DEF-002 regression tests and corresponding application fixes were published, the Playwright CI workflow completed successfully.

The GitHub Actions pipeline verified the updated regression coverage against the current Application Under Test across the configured CI test stages.

This provides independent CI verification that the DEF-001 and DEF-002 regression tests execute successfully against the corrected application.

---

## npm Scripts

The project provides separate commands for the main test suites:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test tests/ui",
    "test:accessibility": "playwright test --project=accessibility",
    "test:api": "playwright test tests/api",
    "test:db": "playwright test tests/database",
    "test:smoke": "playwright test --grep @smoke"
  }
}
```

These commands allow the full configured suite or individual testing layers to be executed independently.

---

## Framework Highlights

This project demonstrates practical experience with:

- Playwright browser automation
- JavaScript test automation
- Cross-browser testing
- Chromium, Firefox, and WebKit browser engines
- Playwright project configuration
- Page Object Model
- UI functional testing
- WCAG-oriented axe accessibility scanning
- Keyboard and form-semantics accessibility checks
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
- Defect regression automation
- JavaScript page-error detection
- Server-side rejection recovery validation
- Pre-fix failure and post-fix verification
- Environment-based configuration
- Playwright HTML reporting
- Failure screenshots
- Retry and trace diagnostics
- npm-based test execution
- Git-based version control
- GitHub Actions CI/CD configuration
- CI regression verification

---

## Related Repositories

### Application Under Test

Full-stack Node.js / Express / PostgreSQL application used by this framework.

[QA-Automation-Portfolio](https://github.com/KSely/QA-Automation-Portfolio)

### Selenium Automation

Independent Java Selenium automation framework for the same AUT.

[QA-Portfolio-Selenium](https://github.com/KSely/QA-Portfolio-Selenium)

### JMeter Performance Testing

Independent Apache JMeter performance testing project for the same AUT.

[QA-Portfolio-Performance](https://github.com/KSely/QA-Portfolio-Performance)

---

## Purpose

This project was created as a practical QA automation portfolio demonstrating how Playwright can be used to test a full-stack application across the **UI, API, and database layers**.

The framework focuses on:

- Maintainable test architecture
- Reusable components
- Realistic validation scenarios
- Cross-browser test configuration
- Test independence
- Database verification
- Defect investigation and regression coverage
- Failure diagnostics
- Test reporting
- CI/CD integration

The repository is publicly available for review by potential employers and recruiters.

No open-source license is currently provided for this repository.
