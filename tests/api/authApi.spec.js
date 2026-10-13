import { test, expect } from "@playwright/test";

import {
  getUserByEmail,
  setUserRole,
  userExistsByEmail,
} from "../../utils/databaseHelper.js";
import {
  createAuthTestData,
  withAuthCleanup,
} from "../support/authTestData.js";


// ============================================================
// Authentication API
// ============================================================

test("POST /api/auth/register should create a user session without exposing credentials", async ({
  request,
}) => {
  const testData = createAuthTestData({ prefix: "playwright-api-register" });
  const submittedEmail = `  ${testData.email.toUpperCase()}  `;

  await withAuthCleanup(testData.email, async () => {
    const response = await request.post("/api/auth/register", {
      data: {
        email: submittedEmail,
        password: testData.password,
        confirmPassword: testData.password,
        role: "admin",
      },
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      success: true,
      message: "Registration successful.",
      user: {
        id: expect.any(Number),
        email: testData.email,
        role: "user",
      },
    });
    expect(Object.hasOwn(responseBody, "password")).toBe(false);
    expect(Object.hasOwn(responseBody.user, "password")).toBe(false);
    expect(Object.hasOwn(responseBody.user, "password_hash")).toBe(false);

    const currentUserResponse = await request.get("/api/auth/me");

    expect(currentUserResponse.status()).toBe(200);
    expect(await currentUserResponse.json()).toEqual({
      success: true,
      user: responseBody.user,
    });

    const storedUser = await getUserByEmail(testData.email);

    expect(storedUser).not.toBeNull();
    expect(storedUser.email).toBe(testData.email);
    expect(storedUser.role).toBe("user");
    expect(storedUser.password_hash !== testData.password).toBe(true);
    expect(/^\$2[aby]\$/.test(storedUser.password_hash)).toBe(true);
  });
});

test("POST /api/auth/register should reject a duplicate normalized email", async ({
  request,
}) => {
  const testData = createAuthTestData({ prefix: "playwright-api-duplicate" });

  await withAuthCleanup(testData.email, async () => {
    const firstResponse = await request.post("/api/auth/register", {
      data: {
        ...testData,
        confirmPassword: testData.password,
      },
    });

    expect(firstResponse.status()).toBe(201);

    const duplicateResponse = await request.post("/api/auth/register", {
      data: {
        email: testData.email.toUpperCase(),
        password: testData.password,
        confirmPassword: testData.password,
      },
    });

    expect(duplicateResponse.status()).toBe(409);
    expect(await duplicateResponse.json()).toEqual({
      success: false,
      message: "An account with this email already exists.",
    });
  });
});

test("POST /api/auth/login should authenticate an existing user", async ({
  request,
}) => {
  const testData = createAuthTestData({ prefix: "playwright-api-login" });

  await withAuthCleanup(testData.email, async () => {
    const registrationResponse = await request.post("/api/auth/register", {
      data: {
        ...testData,
        confirmPassword: testData.password,
      },
    });

    expect(registrationResponse.status()).toBe(201);
    expect((await request.post("/api/auth/logout")).status()).toBe(200);

    const loginResponse = await request.post("/api/auth/login", {
      data: testData,
    });

    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();

    expect(loginBody).toEqual({
      success: true,
      message: "Login successful.",
      user: {
        id: expect.any(Number),
        email: testData.email,
        role: "user",
      },
    });
    expect(Object.hasOwn(loginBody.user, "password_hash")).toBe(false);

    const currentUserResponse = await request.get("/api/auth/me");

    expect(currentUserResponse.status()).toBe(200);
    expect(await currentUserResponse.json()).toEqual({
      success: true,
      user: loginBody.user,
    });
  });
});

test("POST /api/auth/login should use the same generic error for invalid credentials", async ({
  request,
}) => {
  const testData = createAuthTestData({ prefix: "playwright-api-invalid" });
  const expectedError = {
    success: false,
    message: "Invalid email or password.",
  };

  await withAuthCleanup(testData.email, async () => {
    const registrationResponse = await request.post("/api/auth/register", {
      data: {
        ...testData,
        confirmPassword: testData.password,
      },
    });

    expect(registrationResponse.status()).toBe(201);
    expect((await request.post("/api/auth/logout")).status()).toBe(200);

    const wrongPasswordResponse = await request.post("/api/auth/login", {
      data: {
        email: testData.email,
        password: `${testData.password}Wrong`,
      },
    });
    const unknownEmailResponse = await request.post("/api/auth/login", {
      data: {
        email: `unknown-${testData.email}`,
        password: testData.password,
      },
    });

    expect(wrongPasswordResponse.status()).toBe(401);
    expect(await wrongPasswordResponse.json()).toEqual(expectedError);
    expect(unknownEmailResponse.status()).toBe(401);
    expect(await unknownEmailResponse.json()).toEqual(expectedError);
  });
});

test("GET /api/auth/me should reject an unauthenticated request", async ({
  request,
}) => {
  const response = await request.get("/api/auth/me");

  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({
    success: false,
    message: "Authentication required.",
  });
});

test("POST /api/auth/logout should invalidate the authenticated session", async ({
  request,
}) => {
  const testData = createAuthTestData({ prefix: "playwright-api-logout" });

  await withAuthCleanup(testData.email, async () => {
    const registrationResponse = await request.post("/api/auth/register", {
      data: {
        ...testData,
        confirmPassword: testData.password,
      },
    });

    expect(registrationResponse.status()).toBe(201);

    const logoutResponse = await request.post("/api/auth/logout");

    expect(logoutResponse.status()).toBe(200);
    expect(await logoutResponse.json()).toEqual({
      success: true,
      message: "Logout successful.",
    });

    const currentUserResponse = await request.get("/api/auth/me");

    expect(currentUserResponse.status()).toBe(401);
    expect(await currentUserResponse.json()).toEqual({
      success: false,
      message: "Authentication required.",
    });
  });
});

test("GET /api/auth/admin should enforce authentication and role authorization", async ({
  request,
}) => {
  const testData = createAuthTestData({ prefix: "playwright-api-admin" });

  await withAuthCleanup(testData.email, async () => {
    const unauthenticatedResponse = await request.get("/api/auth/admin");

    expect(unauthenticatedResponse.status()).toBe(401);
    expect(await unauthenticatedResponse.json()).toEqual({
      success: false,
      message: "Authentication required.",
    });

    const registrationResponse = await request.post("/api/auth/register", {
      data: {
        ...testData,
        confirmPassword: testData.password,
      },
    });

    expect(registrationResponse.status()).toBe(201);

    const forbiddenResponse = await request.get("/api/auth/admin");

    expect(forbiddenResponse.status()).toBe(403);
    expect(await forbiddenResponse.json()).toEqual({
      success: false,
      message: "Forbidden.",
    });

    const updatedUser = await setUserRole(testData.email, "admin");

    expect(updatedUser).toEqual({
      id: expect.any(Number),
      email: testData.email,
      role: "admin",
    });

    const adminResponse = await request.get("/api/auth/admin");

    expect(adminResponse.status()).toBe(200);
    expect(await adminResponse.json()).toEqual({
      success: true,
      message: "Admin access granted.",
    });

    const storedUserExists = await userExistsByEmail(testData.email);

    expect(storedUserExists).toBe(true);
  });
});
