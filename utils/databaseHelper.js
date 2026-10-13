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


// ============================================================
// Authentication Test Data
// ============================================================

// Return a test user, including its password hash for focused storage checks.
export async function getUserByEmail(email) {
  const client = createDatabaseClient();
  const normalizedEmail = normalizeAuthEmail(email);

  try {
    await client.connect();

    const result = await client.query(
      `
        SELECT id, email, password_hash, role, created_at
        FROM users
        WHERE email = $1
        LIMIT 1
      `,
      [normalizedEmail],
    );

    return result.rows[0] ?? null;
  } finally {
    await client.end();
  }
}

export async function userExistsByEmail(email) {
  return (await getUserByEmail(email)) !== null;
}

// Change only the role of the uniquely identified test-owned user.
export async function setUserRole(email, role) {
  const allowedRoles = new Set(["user", "admin"]);
  const normalizedRole = typeof role === "string"
    ? role.trim().toLowerCase()
    : "";

  if (!allowedRoles.has(normalizedRole)) {
    throw new Error("User role must be either user or admin.");
  }

  const client = createDatabaseClient();
  const normalizedEmail = normalizeAuthEmail(email);

  try {
    await client.connect();

    const result = await client.query(
      `
        UPDATE users
        SET role = $1
        WHERE email = $2
        RETURNING id, email, role
      `,
      [normalizedRole, normalizedEmail],
    );

    return result.rows[0] ?? null;
  } finally {
    await client.end();
  }
}

// Delete one test-owned user and only the sessions associated with its user ID.
export async function deleteUserByEmail(email) {
  const client = createDatabaseClient();
  const normalizedEmail = normalizeAuthEmail(email);

  try {
    await client.connect();
    await client.query("BEGIN");

    const userResult = await client.query(
      `
        SELECT id
        FROM users
        WHERE email = $1
        FOR UPDATE
      `,
      [normalizedEmail],
    );

    if (userResult.rowCount === 0) {
      await client.query("COMMIT");
      return { usersDeleted: 0, sessionsDeleted: 0 };
    }

    const userId = userResult.rows[0].id;
    const sessionResult = await client.query(
      `
        DELETE FROM user_sessions
        WHERE sess->>'userId' = $1
      `,
      [String(userId)],
    );
    const deleteResult = await client.query(
      `
        DELETE FROM users
        WHERE id = $1
      `,
      [userId],
    );

    await client.query("COMMIT");

    return {
      usersDeleted: deleteResult.rowCount,
      sessionsDeleted: sessionResult.rowCount,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

function normalizeAuthEmail(email) {
  if (typeof email !== "string" || email.trim().length === 0) {
    throw new Error("Authentication test-data operations require an email.");
  }

  return email.trim().toLowerCase();
}
