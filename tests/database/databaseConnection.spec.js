// Import Playwright's test function and assertion library.
//
// test   - defines and executes the test.
// expect - verifies that the actual result matches
//          the expected result.
const { test, expect } = require('@playwright/test');


// Import PostgreSQL Client.
//
// This allows the test to connect directly to the
// PostgreSQL database without using the application UI.
const { Client } = require('pg');


// Import reusable database helper functions.
//
// insertMessage() - creates controlled test data.
// messageExists() - verifies that the record exists.
// deleteMessage() - removes test data after validation.
const {
  insertMessage,
  messageExists,
  deleteMessage
} = require('../../utils/databaseHelper');


// ============================================================
// Test 1
// Database Connection Test
// ============================================================
//
// Verify that the Playwright test framework can successfully
// connect to the PostgreSQL database.
//
// This test does not interact with the browser or application.
// It validates the database connection independently.
test('should connect to PostgreSQL database successfully', async () => {

  // Create a PostgreSQL client using database configuration
  // loaded from the .env file.
  //
  // dotenv is loaded in playwright.config.js, which makes
  // these values available through process.env.
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });


  try {

    // Open the connection to PostgreSQL.
    await client.connect();


    // Execute a simple database query.
    //
    // SELECT 1 does not depend on any application table.
    // It is commonly used as a lightweight way to verify
    // that the database connection is working.
    const result = await client.query(
      'SELECT 1 AS connection_test'
    );


    // Verify that PostgreSQL returned the expected value.
    expect(result.rows[0].connection_test).toBe(1);

  } finally {

    // Always close the database connection after the test,
    // even if the query or assertion fails.
    await client.end();

  }

});


// ============================================================
// Test 2
// Database Test Data Lifecycle
// ============================================================
//
// Verify that automated test data can be:
//
// 1. Inserted into the database.
// 2. Found after insertion.
// 3. Deleted during cleanup.
// 4. Confirmed as removed after cleanup.
//
// This validates the database helper functions used by
// the Playwright automation framework.
test('should create, verify, and clean up test data successfully', async () => {

  // Generate unique test data for every execution.
  //
  // Date.now() prevents this test from conflicting with
  // records created during previous or parallel test runs.
  const timestamp = Date.now();

  const testName = 'Playwright DB Test';
  const testEmail = `db-test-${timestamp}@example.com`;
  const testMessage = `Database lifecycle test ${timestamp}`;


  // Track whether the record was successfully deleted.
  //
  // This value will allow us to perform an additional cleanup
  // inside finally if the test fails before normal deletion.
  let recordDeleted = false;


  try {

    // --------------------------------------------------------
    // Step 1: Insert test data
    // --------------------------------------------------------

    // Create a new message directly in PostgreSQL.
    //
    // insertMessage() returns the database-generated ID
    // of the newly created record.
    const insertedId = await insertMessage(
      testName,
      testEmail,
      testMessage
    );


    // Verify that PostgreSQL generated an ID for the record.
    expect(insertedId).toBeDefined();


    // --------------------------------------------------------
    // Step 2: Verify inserted data
    // --------------------------------------------------------

    // Query the database and confirm that the newly created
    // message can be found.
    const existsAfterInsert = await messageExists(
      testEmail,
      testMessage
    );

    expect(existsAfterInsert).toBe(true);


    // --------------------------------------------------------
    // Step 3: Delete test data
    // --------------------------------------------------------

    // Remove the exact record created by this test.
    const deletedRows = await deleteMessage(
      testEmail,
      testMessage
    );


    // Exactly one record should have been deleted because
    // the test data is unique for every execution.
    expect(deletedRows).toBe(1);

    recordDeleted = true;


    // --------------------------------------------------------
    // Step 4: Verify cleanup
    // --------------------------------------------------------

    // Query PostgreSQL again after deletion.
    const existsAfterDelete = await messageExists(
      testEmail,
      testMessage
    );


    // The record should no longer exist.
    expect(existsAfterDelete).toBe(false);

  } finally {

    // Safety cleanup.
    //
    // If an assertion or database operation fails before
    // the normal DELETE step completes, remove the test
    // record here so failed test runs do not leave data
    // behind in PostgreSQL.
    if (!recordDeleted) {
      await deleteMessage(
        testEmail,
        testMessage
      );
    }

  }

});