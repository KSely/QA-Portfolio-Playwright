import { test, expect } from "@playwright/test";
import contactResponseSchema from "../schemas/contact-response.schema.json" with { type: "json" };

import {
  messageExists,
  messageExistsByTestData,
} from "../../utils/databaseHelper.js";
import { createSchemaValidator } from "../../utils/schemaValidator.js";
import {
  createContactTestData,
  withContactCleanup,
} from "../support/contactTestData.js";

const validateContactResponse = createSchemaValidator(contactResponseSchema);


// ============================================================
// POST /contact
// ============================================================

// Verify successful submission and database persistence.
test("POST /contact should create a message with valid data", async ({
  request,
}) => {
  const testData = createContactTestData({ prefix: "playwright-api" });

  await withContactCleanup(testData, async () => {
    const response = await request.post("/contact", {
      form: testData,
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toBe("Message sent successfully!");

    const schemaResult = validateContactResponse(responseBody);

    expect(
      schemaResult.valid,
      JSON.stringify(schemaResult.errors, null, 2),
    ).toBe(true);

    // Verify that the message was saved in the database.
    const isMessageStored = await messageExists(
      testData.email,
      testData.message,
    );

    expect(isMessageStored).toBe(true);
  });
});


// ============================================================
// Missing Required Fields
// ============================================================

const missingFieldTestCases = ["name", "email", "message"];

// Run the same validation test for each missing field.
for (const missingField of missingFieldTestCases) {
  test(`POST /contact should reject request when ${missingField} is missing`,
    async ({ request }) => {
      const testData = createContactTestData({
        prefix: `playwright-api-missing-${missingField}`,
      });
      const formData = { ...testData };
      delete formData[missingField];

      const cleanupIdentifiers = getIdentifiersWithoutField(
        testData,
        missingField,
      );

      await withContactCleanup(cleanupIdentifiers, async () => {
        const response = await request.post("/contact", { form: formData });

        expect(response.status()).toBe(400);

        const responseBody = await response.json();

        expect(responseBody.success).toBe(false);
        expect(responseBody.message).toBe("All fields are required.");

        const schemaResult = validateContactResponse(responseBody);

        expect(
          schemaResult.valid,
          JSON.stringify(schemaResult.errors, null, 2),
        ).toBe(true);

        // Verify that rejected data was not saved.
        const isMessageStored = await messageExistsByTestData(
           cleanupIdentifiers,
        );

        expect(isMessageStored).toBe(false);
      });
    }
  );
}


// ============================================================
// Whitespace Required Fields
// ============================================================

const whitespaceFieldTestCases = ["name", "email", "message"];

// Run the same validation test for each whitespace field.
for (const whitespaceField of whitespaceFieldTestCases) {
  test(`POST /contact should reject request when ${whitespaceField} contains only whitespace`,
    async ({ request }) => {
      const testData = createContactTestData({
        prefix: `playwright-api-whitespace-${whitespaceField}`,
      });
      const formData = {
        ...testData,
        [whitespaceField]: "   ",
      };
      const cleanupIdentifiers = getIdentifiersWithoutField(
        testData,
        whitespaceField,
      );

      await withContactCleanup(cleanupIdentifiers, async () => {
        const response = await request.post("/contact", { form: formData });

        expect(response.status()).toBe(400);

        const responseBody = await response.json();

        expect(responseBody.success).toBe(false);
        expect(responseBody.message).toBe("All fields are required.");

        const schemaResult = validateContactResponse(responseBody);

        expect(
          schemaResult.valid,
          JSON.stringify(schemaResult.errors, null, 2),
        ).toBe(true);

        // Verify that rejected data was not saved.
        const isMessageStored = await messageExistsByTestData(
          cleanupIdentifiers,
        );

        expect(isMessageStored).toBe(false);
      });
    }
  );
}


// ============================================================
// Invalid Email Formats
// ============================================================

const invalidEmailTestCases = [
  {
    description: "missing @ symbol",
    createInvalidEmail: (validEmail) => validEmail.replace("@", ""),
  },
  {
    description: "missing local part",
    createInvalidEmail: (validEmail) => validEmail.replace(/^[^@]+/, ""),
  },
  {
    description: "missing domain",
    createInvalidEmail: (validEmail) => validEmail.replace(/@.*$/, "@"),
  },
  {
    description: "missing top-level domain",
    createInvalidEmail: (validEmail) => validEmail.replace(/\.com$/, ""),
  },
];

// Run the same validation test for each invalid email.
for (const testCase of invalidEmailTestCases) {
  test(`POST /contact should reject email with ${testCase.description}`,
    async ({ request }) => {
      const generatedData = createContactTestData({
        prefix: "playwright-api-invalid-email",
      });
      const formData = {
        ...generatedData,
        email: testCase.createInvalidEmail(generatedData.email),
      };
      const cleanupIdentifiers = { message: formData.message };

      await withContactCleanup(cleanupIdentifiers, async () => {
        const response = await request.post("/contact", { form: formData });

        expect(response.status()).toBe(400);

        const responseBody = await response.json();

        expect(responseBody.success).toBe(false);
        expect(responseBody.message).toBe("Invalid email address.");

        const schemaResult = validateContactResponse(responseBody);

        expect(
          schemaResult.valid,
          JSON.stringify(schemaResult.errors, null, 2),
        ).toBe(true);

        // Verify that rejected data was not saved.
        const isMessageStored = await messageExistsByTestData(
          cleanupIdentifiers,
        );

        expect(isMessageStored).toBe(false);
      });
    }
  );
}

function getIdentifiersWithoutField(testData, excludedField) {
  if (excludedField === "email") {
    return { message: testData.message };
  }

  if (excludedField === "message") {
    return { email: testData.email };
  }

  return {
    email: testData.email,
    message: testData.message,
  };
}
