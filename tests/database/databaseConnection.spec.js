const { test, expect } = require('@playwright/test');
const { Client } = require('pg');

const {
  insertMessage,
  messageExists,
  deleteMessage
} = require('../../utils/databaseHelper');


// ============================================================
// Database Tests
// ============================================================

// Verify the PostgreSQL connection.
test('should connect to PostgreSQL database successfully', async () => {

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  try {

    await client.connect();

    // Simple query to verify the connection.
    const result = await client.query(
      'SELECT 1 AS connection_test'
    );

    expect(result.rows[0].connection_test).toBe(1);

  } finally {

    // Always close the database connection.
    await client.end();

  }

});


// Verify the test data lifecycle.
test('should create, verify, and clean up test data successfully', async () => {

  // Use unique data for each test run.
  const timestamp = Date.now();

  const testName = 'Playwright DB Test';
  const testEmail = `db-test-${timestamp}@example.com`;
  const testMessage = `Database lifecycle test ${timestamp}`;

  let recordDeleted = false;

  try {

    // Insert test data.
    const insertedId = await insertMessage(
      testName,
      testEmail,
      testMessage
    );

    expect(insertedId).toBeDefined();


    // Verify that the record exists.
    const existsAfterInsert = await messageExists(
      testEmail,
      testMessage
    );

    expect(existsAfterInsert).toBe(true);


    // Delete test data.
    const deletedRows = await deleteMessage(
      testEmail,
      testMessage
    );

    expect(deletedRows).toBe(1);

    recordDeleted = true;


    // Verify that the record was removed.
    const existsAfterDelete = await messageExists(
      testEmail,
      testMessage
    );

    expect(existsAfterDelete).toBe(false);

  } finally {

    // Remove test data if normal cleanup did not complete.
    if (!recordDeleted) {
      await deleteMessage(
        testEmail,
        testMessage
      );
    }

  }

});