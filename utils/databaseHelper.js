// Reusable PostgreSQL helper functions for database tests.

import pg from "pg";

const { Client } = pg;


// ============================================================
// Database Client
// ============================================================

// Create a client using environment variables.
function createClient() {
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
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      `
        SELECT id
        FROM messages
        WHERE email = $1
          AND message = $2
        LIMIT 1
      `,
      [email, message],
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
  const client = createClient();

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
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      `
        DELETE FROM messages
        WHERE email = $1
          AND message = $2
      `,
      [email, message],
    );

    return result.rowCount;

  } finally {
    // Always close the database connection.
    await client.end();
  }
}
