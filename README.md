# QA Portfolio — Playwright Automation Framework

A Playwright automation framework for testing the **QA Automation Portfolio** full-stack web application.

The framework demonstrates practical QA automation across multiple application layers:

- UI testing
- API testing
- Database validation
- End-to-end UI → Backend → Database verification
- Page Object Model
- Smoke and regression testing
- HTML reporting
- Retry and trace diagnostics

---

## Technology Stack

### Automation

- Playwright
- JavaScript
- Node.js
- npm

### Application Under Test

- Node.js
- Express
- EJS
- PostgreSQL
- Bootstrap

### Testing Areas

- UI Testing
- API Testing
- Database Testing
- End-to-End Testing
- Smoke Testing
- Regression Testing

---

## Project Structure

```text
QA-Portfolio-Playwright/
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
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.js
└── README.md
```

---

## Test Coverage

The framework currently contains **24 automated tests** covering UI, API, and database functionality.

### UI Tests

UI tests validate key functionality of the portfolio application, including:

- Home page loading
- Page title and main heading
- Navigation to the QA project section
- Navigation to the project details page
- Project page content
- Contact form submission
- Success message validation

The contact form test also verifies that successfully submitted data is persisted in PostgreSQL.

### API Tests

API tests validate:

#### `GET /api/status`

- Successful HTTP response
- HTTP status code
- Response JSON structure
- Backend status and message

#### `POST /contact`

Coverage includes:

- Successful form submission
- Missing required fields
- Whitespace-only required fields
- Invalid email formats
- Expected HTTP status codes
- Expected JSON responses
- Database persistence for successful submissions
- Database non-persistence checks for rejected whitespace and invalid-email submissions

### Database Tests

Database testing includes:

- PostgreSQL connectivity verification
- SQL queries executed directly from automated tests
- Verification of submitted contact messages
- Cleanup of test-generated database records
- Parameterized SQL queries

---

## Page Object Model

The UI automation uses the **Page Object Model (POM)** design pattern.

Page-specific locators are separated from test logic:

```text
pages/
├── HomePage.js
└── ProjectPage.js
```

This improves:

- maintainability
- readability
- locator reuse
- separation of test logic from page structure

---

## End-to-End Validation

The contact form test demonstrates validation across multiple application layers:

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

The automated test:

1. Opens the application.
2. Completes the contact form.
3. Submits the form through the UI.
4. Verifies the success message.
5. Queries PostgreSQL directly.
6. Confirms that the submitted data was stored.
7. Deletes the generated test record during cleanup.

This provides end-to-end validation from the browser through the backend to the database.

---

## Smoke Testing

Critical application checks are tagged with:

```text
@smoke
```

The current smoke suite verifies:

- Backend status endpoint availability
- Home page availability

Run the smoke suite:

```bash
npm run test:smoke
```

---

## Regression Testing

The complete automated test suite acts as the regression suite.

Run all tests:

```bash
npm test
```

Current regression suite:

```text
24 automated tests
```

---

## Running Tests by Layer

### UI Tests

```bash
npm run test:ui
```

### API Tests

```bash
npm run test:api
```

### Database Tests

```bash
npm run test:db
```

### Smoke Tests

```bash
npm run test:smoke
```

### Full Regression Suite

```bash
npm test
```

---

## HTML Report

Playwright HTML reporting is configured in:

```text
playwright.config.js
```

After running the tests, open the report with:

```bash
npx playwright show-report
```

The report provides information about:

- passed tests
- failed tests
- skipped tests
- flaky tests
- execution time
- individual test results

---

## Failure Diagnostics

The framework includes additional diagnostics for failed tests.

### Screenshots

A screenshot is captured when a test fails:

```javascript
screenshot: "only-on-failure"
```

### Retries

Failed tests are retried once:

```javascript
retries: 1
```

### Playwright Trace

A trace is recorded during the first retry:

```javascript
trace: "on-first-retry"
```

Playwright Trace can help investigate:

- test actions
- DOM state
- network activity
- console activity
- timing
- failure context

---

## Browser Configuration

The framework currently executes tests using the locally installed **Google Chrome** browser:

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

The project structure is prepared for additional browser projects.

Playwright-managed Chromium, Firefox, and WebKit are not currently enabled because of a local Playwright browser-download issue.

---

## Environment Configuration

Database credentials are stored locally in a `.env` file.

Example:

```properties
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=qa_portfolio
DB_USER=postgres
DB_PASSWORD=your_password
```

The `.env` file is excluded from Git using `.gitignore`.

Sensitive credentials should never be committed to the repository.

---

## Installation

Install project dependencies:

```bash
npm install
```

The application under test must be running locally at:

```text
http://localhost:3000
```

before executing tests that depend on the application.

---

## Example Test Execution

Run the complete regression suite:

```bash
npm test
```

Expected current result:

```text
24 passed
```

Run only critical smoke tests:

```bash
npm run test:smoke
```

Expected current result:

```text
2 passed
```

---

## Framework Highlights

This project demonstrates:

- Playwright UI automation
- API testing without opening a browser
- PostgreSQL database validation
- UI-to-database end-to-end testing
- Page Object Model
- Data-driven API testing
- Positive and negative test scenarios
- Smoke testing
- Regression testing
- Test data cleanup
- Parameterized SQL queries
- HTML reporting
- Failure screenshots
- Retry and trace diagnostics
- Environment-based database configuration
- npm scripts for targeted test execution

---

## Purpose

This project was created as a practical QA automation portfolio demonstrating how Playwright can be used to validate a full-stack application across the **UI, API, and database layers**.