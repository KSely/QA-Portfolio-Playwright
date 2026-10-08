// Reusable PostgreSQL helper functions for database tests.

import pg from "pg";

const { Client } = pg;

const REQUIRED_DATABASE_ENVIRONMENT_VARIABLES = [
  "DB_HOST",
  "DB_PORT",
  "DB_DATABASE",
  "DB_USER",
  "DB_PASSWORD",
];


// ============================================================
// Database Client
// ============================================================

// Create a client using validated environment variables.
export function createDatabaseClient() {
  const missingVariables = REQUIRED_DATABASE_ENVIRONMENT_VARIABLES.filter(
    (variableName) => !process.env[variableName]?.trim(),
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required database environment variables: ${missingVariables.join(", ")}`,
    );
  }

  return new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
}


// ============================================================
// Check Message
// ============================================================

// Check if a contact message exists in the database.
export async function messageExists(email, message) {
  return messageExistsByTestData({ email, message });
}

// Check for a test-owned message using its available unique identifiers.
export async function messageExistsByTestData({ email, message }) {
  const client = createDatabaseClient();
  const { clause, values } = buildContactIdentifierClause({ email, message });

  try {
    await client.connect();

    const result = await client.query(
      `
        SELECT id
        FROM messages
        WHERE ${clause}
        LIMIT 1
      `,
      values,
    );

    return result.rowCount > 0;

  } finally {
    // Always close the database connection.
    await client.end();
  }
}


// ============================================================
// Insert Message
// ============================================================

// Insert a message and return its database ID.
export async function insertMessage(name, email, message) {
  const client = createDatabaseClient();

  try {
    await client.connect();

    const result = await client.query(
      `
        INSERT INTO messages (name, email, message)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      [name, email, message],
    );

    return result.rows[0].id;

  } finally {
    // Always close the database connection.
    await client.end();
  }
}


// ============================================================
// Delete Message
// ============================================================

// Delete a message and return the number of deleted rows.
export async function deleteMessage(email, message) {
  return deleteContactTestData({ email, message });
}

// Delete test-owned contact data using its available unique identifiers.
export async function deleteContactTestData({ email, message }) {
  const client = createDatabaseClient();
  const { clause, values } = buildContactIdentifierClause({ email, message });

  try {
    await client.connect();

    const result = await client.query(
      `
        DELETE FROM messages
        WHERE ${clause}
      `,
      values,
    );

    return result.rowCount;

  } finally {
    // Always close the database connection.
    await client.end();
  }
}

function buildContactIdentifierClause({ email, message }) {
  const conditions = [];
  const values = [];

  if (typeof email === "string" && email.length > 0) {
    values.push(email);
    conditions.push(`email = $${values.length}`);
  }

  if (typeof message === "string" && message.length > 0) {
    values.push(message);
    conditions.push(`message = $${values.length}`);
  }

  if (conditions.length === 0) {
    throw new Error(
      "Contact test-data lookup requires a non-empty email or message.",
    );
  }

  return {
    clause: conditions.join(" AND "),
    values,
  };
}
