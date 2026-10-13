# QA Portfolio - Playwright Automation Framework

A JavaScript Playwright automation framework for testing a full-stack QA portfolio application across the UI, API, database, authentication, accessibility, and cross-browser layers.

The Application Under Test (AUT) is maintained in a separate repository:

[QA-Automation-Portfolio](https://github.com/KSely/QA-Automation-Portfolio)

---

## Project Overview

This framework demonstrates practical Playwright automation against a real full-stack application rather than isolated demo pages.

Coverage includes:

- UI functional testing
- Authentication and authorization
- API testing
- PostgreSQL validation
- UI-to-database and API-to-database checks
- Accessibility testing with axe-core
- Cross-browser testing across Chromium, Firefox, and WebKit
- Smoke and regression testing
- Defect regression coverage
- Test data creation and cleanup
- Playwright HTML reporting
- GitHub Actions CI

The UI automation uses the Page Object Model to keep locators and page actions separate from test logic.

Reusable helpers support database access, schema validation, authentication test data, and cleanup.

---

## Tech Stack

- JavaScript
- Node.js
- Playwright 1.62.1
- `@axe-core/playwright`
- Ajv
- PostgreSQL / `pg`
- npm
- Playwright HTML Report
- Git
- GitHub
- GitHub Actions

---

## Test Coverage

The framework currently contains **52 unique automated cases**.

| Test Layer | Unique Cases | Execution |
|---|---:|---|
| UI | 24 | Chromium, Firefox, WebKit |
| Accessibility | 6 | Chromium |
| API | 20 | Executed once |
| Database | 2 | Executed once |
| **Total** | **52** | |

The 24 UI cases run across three browser engines:

```text
24 UI × 3 browsers = 72
6 accessibility     =  6
20 API               = 20
2 database           =  2
────────────────────────
Total                = 100
```

The full configured suite therefore contains **100 test executions** before retries.

Latest verified local full regression:

```text
100 passed
0 failed
0 skipped
```

Latest verified accessibility regression:

```text
6 passed
0 failed
0 skipped
```

The latest GitHub Actions Playwright workflow also completed successfully.

---

## Main Coverage Areas

### UI Testing

The UI suite covers:

- Home page content and navigation
- Project and Automation pages
- Contact form workflows
- Positive and negative form validation
- Successful contact submission
- Database persistence after successful submission
- Recovery after server-side validation rejection
- JavaScript page-error detection
- Registration
- Login
- Logout
- Protected Account access
- Guest access restrictions
- Standard-user authorization
- Admin authorization
- Session persistence after refresh
- Responsive navigation
- Cross-browser regression

### API Testing

Playwright's `APIRequestContext` is used for direct backend validation.

Coverage includes:

- `GET /api/status`
- `POST /contact`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/admin`
- Positive and negative scenarios
- HTTP status codes
- Response values and messages
- Authentication state
- Authorization behavior
- Database persistence or non-persistence where applicable
- JSON Schema validation with Ajv where implemented

### Database Testing

The framework connects directly to PostgreSQL using the `pg` client.

Coverage includes:

- Database connectivity
- Contact-message persistence
- Verification that rejected contact data is not stored
- User creation after registration
- Normalized email values
- Default `user` role
- bcrypt password-hash verification
- User / Admin role verification
- Test-data lifecycle validation
- Parameterized SQL
- Cleanup of test-owned users, messages, and session records

### Accessibility Testing

Accessibility checks use Playwright and axe-core.

Coverage includes:

- Full-page WCAG-oriented scans
- Color contrast
- Accessible names
- Form semantics
- Keyboard focus
- Enter activation
- Contact-form focus order
- Authentication navigation focus state
- Responsive navigation behavior

Current accessibility result:

```text
6 passed
0 failed
0 skipped
```

Automated accessibility testing covers only part of WCAG. Manual testing is still required for areas such as screen-reader behavior, zoom and reflow, reading order, and broader usability.

---

## Authentication and Authorization Coverage

The AUT uses server-side sessions and role-based authorization.

Playwright coverage includes both browser and API scenarios.

### UI Authentication Coverage

The UI suite verifies:

- Registration creates a usable account
- Registration leads to protected Account access
- Session persists after page refresh
- Logout invalidates the authenticated session
- Existing users can log in
- Guests cannot access the protected Account page
- Standard users cannot access the Admin page
- Admin users can access the Admin page after controlled role elevation

### API Authentication Coverage

The API suite verifies:

- Registration creates a session
- Email normalization
- Public registration cannot assign an admin role
- No credentials or password hashes are returned in responses
- Registered passwords are stored as bcrypt hashes
- Duplicate normalized email returns `409`
- Existing-user login succeeds
- Wrong password and unknown email return the same generic `401`
- Unauthenticated `/api/auth/me` returns `401`
- Logout invalidates the session
- `/api/auth/admin` returns the expected unauthenticated, user, and admin results

### Session and Role Validation

Authentication requests use browser-managed or API-managed session cookies.

The tests verify:

- Session creation
- Session persistence
- Session invalidation
- Protected resource access
- User / Admin authorization boundaries
- Database state where applicable

Test users use unique generated email addresses and are removed after execution.

---

## Cross-Browser Testing

The functional UI suite runs across:

- Chromium
- Firefox
- WebKit

Each browser project executes the same 24 UI cases.

```text
Chromium    24
Firefox     24
WebKit      24
──────────────
UI Total    72
```

Accessibility, API, and database tests run in separate Playwright projects so they are not unnecessarily repeated for every browser engine.

---

## Page Object Model

The framework uses Page Object Model classes for reusable page interaction.

Current page objects include coverage for:

- Home
- Project
- Login
- Register
- Account
- Admin

This keeps test intent readable and reduces repeated locator and interaction code.

---

## UI-to-Database Validation

The contact form includes end-to-end validation from the browser to PostgreSQL.

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

The positive workflow:

1. Opens the application
2. Enters valid contact information
3. Submits the form
4. Verifies the success state
5. Queries PostgreSQL
6. Confirms the submitted data was persisted
7. Removes the generated test record

Negative workflows also verify that rejected data is not persisted.

---

## API Contract Validation

Ajv is used for JSON Schema validation alongside normal Playwright assertions.

Schema validation checks response structure and data types, while Playwright assertions continue to verify exact business values and messages.

Implemented schema coverage includes:

- `GET /api/status`
- Successful `POST /contact`
- Missing required-field responses
- Whitespace-only validation responses
- Invalid-email responses

No separate schema-only test count is added; schema validation is part of the existing API cases.

---

## Test Data Management

Tests use unique test-owned data to remain repeatable and independent.

Contact and authentication data use generated identifiers so parallel and repeated executions do not depend on shared records.

Cleanup removes test-owned data after validation.

Database operations use parameterized SQL.

For authentication scenarios, cleanup also removes related server-side session records where applicable.

---

## Defect Regression Coverage

The framework includes automated regression coverage for confirmed application defects.

### DEF-001 — Shared Footer JavaScript Error

A shared footer script attempted to bind a contact-form event listener on pages where the form did not exist.

Playwright reproduced the JavaScript error before the fix and verified the null-safe event-binding fix afterward.

### DEF-002 — Contact Form Recovery After Server-Side Rejection

A server-side validation rejection left the contact form submit button disabled in the `Sending...` state.

Playwright verified:

- HTTP `400` rejection
- `success: false`
- No matching database record
- Submit button recovery
- Button text restored to `Send Message`

The regression test failed before the fix and passed after the application correction.

### DEF-003 — Home Page CTA Contrast

axe-core identified insufficient contrast on the Home page project-details button.

The contrast was corrected and accessibility regression passed.

### DEF-004 — Architecture Label Contrast

axe-core identified insufficient contrast on Project-page architecture connector labels.

The label color was updated and the accessibility regression passed.

### DEF-005 — Authentication Navigation Contrast

The `Login / Account` navigation link could extend outside the dark navbar and appear over the white page background.

The responsive navigation layout was corrected and the existing accessibility coverage verifies the fixed state.

### DEF-006 — Authentication Link Keyboard-Focus Contrast

The authentication navigation link inherited a dark Bootstrap focus color against the dark navbar.

A dedicated Playwright accessibility case verifies the corrected keyboard-focus color and interaction behavior.

All six documented defects are closed and passed retesting.

---

## Responsive Navigation Accessibility

The application navbar can be expanded on larger viewports or collapsed behind the Bootstrap navigation toggle on narrower viewports.

The accessibility tests support both states.

When a navigation link is hidden by the responsive menu, the test:

1. Locates the navigation toggle
2. Verifies the toggle is visible and enabled
3. Focuses it with the keyboard
4. Activates it with `Enter`
5. Confirms `aria-expanded="true"`
6. Continues the keyboard-accessibility validation on the target link

This keeps the accessibility checks aligned with the current responsive application behavior.

---

## Test Suites

### Full Regression

Runs the complete configured Playwright suite:

```bash
npm test
```

Current configured execution:

```text
100 executions
```

### UI

Runs the functional UI suite across Chromium, Firefox, and WebKit:

```bash
npm run test:ui
```

Individual browsers can also be run directly:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Accessibility

Runs the accessibility project in Chromium:

```bash
npm run test:accessibility
```

### API

Runs API tests independently:

```bash
npm run test:api
```

### Database

Runs PostgreSQL tests independently:

```bash
npm run test:db
```

### Smoke

Runs critical tests tagged with `@smoke`:

```bash
npm run test:smoke
```

---

## Project Structure

```text
QA-Portfolio-Playwright/
├── .github/
│   └── workflows/
│       └── playwright-ci.yml
├── pages/
│   ├── AccountPage.js
│   ├── AdminPage.js
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── ProjectPage.js
│   └── RegisterPage.js
├── tests/
│   ├── accessibility/
│   ├── api/
│   ├── database/
│   ├── schemas/
│   ├── support/
│   └── ui/
├── utils/
│   ├── databaseHelper.js
│   └── schemaValidator.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.js
└── README.md
```

---

## Prerequisites

Before running the tests, install:

- Node.js
- npm
- PostgreSQL
- Playwright-managed browsers

Install project dependencies:

```bash
npm install
```

Install browser binaries:

```bash
npx playwright install
```

The AUT must also be available locally or through an authorized configured environment.

---

## Configuration

Local configuration is provided through `.env`.

Example:

```env
BASE_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=qa_portfolio
DB_USER=postgres
DB_PASSWORD=your_database_password
```

The real `.env` file is excluded from version control.

`BASE_URL` selects the application environment under test and defaults to `http://localhost:3000` when not set.

The framework keeps UI, accessibility, API, and database execution in separate Playwright projects.

---

## Reporting and Failure Diagnostics

The framework uses Playwright's built-in HTML reporter.

Open the report with:

```bash
npx playwright show-report
```

Failure diagnostics include:

- Screenshots on failure
- One configured retry
- Trace recording on the first retry
- Browser / project information
- Failure details
- Execution duration

Current configuration includes:

```javascript
screenshot: "only-on-failure"
retries: 1
trace: "on-first-retry"
```

The generated `playwright-report` directory is excluded from version control.

---

## CI/CD Integration

GitHub Actions provides automated CI verification for this framework.

The workflow:

1. Runs on a GitHub-hosted Ubuntu runner
2. Starts PostgreSQL 16
3. Checks out the Playwright repository
4. Checks out the AUT repository
5. Sets up Node.js 22
6. Installs dependencies
7. Creates test and application environment configuration
8. Initializes the PostgreSQL schema
9. Starts the AUT
10. Verifies application availability through `GET /api/status`
11. Installs Playwright browser binaries and required system dependencies
12. Runs API tests
13. Runs database tests
14. Runs smoke tests
15. Runs accessibility tests
16. Runs cross-browser UI tests
17. Uploads the Playwright HTML report on failure

The latest workflow completed successfully against the current AUT.

---

## npm Scripts

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

---

## Framework Highlights

This project demonstrates practical experience with:

- Playwright browser automation
- JavaScript test automation
- Page Object Model
- Cross-browser testing
- UI functional testing
- Authentication and authorization testing
- Server-side session validation
- REST API testing
- JSON Schema validation with Ajv
- Accessibility testing with axe-core
- Keyboard navigation checks
- PostgreSQL integration
- UI-to-database validation
- API-to-database validation
- Parameterized SQL
- Test-data lifecycle management
- Automatic cleanup
- Smoke and regression testing
- Defect regression automation
- Failure diagnostics
- Playwright HTML reporting
- GitHub Actions CI

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

This project was created as a practical QA automation portfolio demonstrating Playwright testing across the UI, API, database, authentication, accessibility, cross-browser, and CI layers.

The focus is on maintainable automation, realistic validation scenarios, reliable test data, regression coverage, and clear failure diagnostics.

The repository is publicly available for review by potential employers and recruiters.

No open-source license is currently provided for this repository.
