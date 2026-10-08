import { randomUUID } from "node:crypto";

import { deleteContactTestData } from "../../utils/databaseHelper.js";

export function createContactTestData({ prefix = "qa-test" } = {}) {
  const uniqueId = randomUUID();
  const shortId = uniqueId.slice(0, 8);

  return {
    name: `QA Test ${shortId}`,
    email: `${prefix}-${uniqueId}@example.com`,
    message: `Automated ${prefix} message ${uniqueId}`,
  };
}

export async function withContactCleanup(cleanupIdentifiers, testBody) {
  let primaryError;

  try {
    await testBody();
  } catch (error) {
    primaryError = error;
  }

  try {
    await deleteContactTestData(cleanupIdentifiers);
  } catch (cleanupError) {
    if (primaryError) {
      throw new AggregateError(
        [primaryError, cleanupError],
        "The test and its contact-data cleanup both failed.",
      );
    }

    throw cleanupError;
  }

  if (primaryError) {
    throw primaryError;
  }
}
