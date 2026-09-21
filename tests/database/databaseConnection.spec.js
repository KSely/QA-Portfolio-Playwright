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


// ============================================================
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
    const result = await client.query('SELECT 1 AS connection_test');


    // Verify that PostgreSQL returned the expected value.
    expect(result.rows[0].connection_test).toBe(1);

  } finally {

    // Always close the database connection after the test,
    // even if the query or assertion fails.
    await client.end();

  }

});