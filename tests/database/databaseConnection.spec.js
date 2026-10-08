import { test, expect } from "@playwright/test";

import {
  createDatabaseClient,
  insertMessage,
  messageExists,
  deleteMessage,
} from "../../utils/databaseHelper.js";
import {
  createContactTestData,
  withContactCleanup,
} from "../support/contactTestData.js";


// ============================================================
// Database Tests
// ============================================================

// Verify the PostgreSQL connection.
test("should connect to PostgreSQL database successfully", async () => {
  const client = createDatabaseClient();

  try {
    await client.connect();

    // Simple query to verify the connection.
    const result = await client.query("SELECT 1 AS connection_test");

    expect(result.rows[0].connection_test).toBe(1);
  } finally {
    // Always close the database connection.
    await client.end();
  }
});


// Verify the test data lifecycle.
test("should create, verify, and clean up test data successfully", async () => {
  const testData = createContactTestData({ prefix: "playwright-db" });

  await withContactCleanup(testData, async () => {
    // Insert test data.
    const insertedId = await insertMessage(
      testData.name,
      testData.email,
      testData.message,
    );

    expect(insertedId).toBeDefined();

    // Verify that the record exists.
    const existsAfterInsert = await messageExists(
      testData.email,
      testData.message,
    );

    expect(existsAfterInsert).toBe(true);

    // Delete test data.
    const deletedRows = await deleteMessage(
      testData.email,
      testData.message,
    );

    expect(deletedRows).toBe(1);

    // Verify that the record was removed.
    const existsAfterDelete = await messageExists(
      testData.email,
      testData.message,
    );

    expect(existsAfterDelete).toBe(false);
  });
});
