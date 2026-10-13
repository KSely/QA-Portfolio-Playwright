import { randomUUID } from "node:crypto";

import { deleteUserByEmail } from "../../utils/databaseHelper.js";

export function createAuthTestData({ prefix = "playwright-auth" } = {}) {
  const uniqueId = randomUUID();
  const compactId = uniqueId.replaceAll("-", "");

  return {
    email: `${prefix}-${uniqueId}@example.com`,
    password: `Qa!${compactId.slice(0, 20)}aA1`,
  };
}

export async function withAuthCleanup(email, testBody) {
  let primaryError;

  try {
    await testBody();
  } catch (error) {
    primaryError = error;
  }

  try {
    await deleteUserByEmail(email);
  } catch (cleanupError) {
    if (primaryError) {
      throw new AggregateError(
        [primaryError, cleanupError],
        "The test and its authentication-data cleanup both failed.",
      );
    }

    throw cleanupError;
  }

  if (primaryError) {
    throw primaryError;
  }
}
