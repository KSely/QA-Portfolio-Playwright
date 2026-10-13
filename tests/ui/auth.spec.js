import { test, expect } from "@playwright/test";

import AccountPage from "../../pages/AccountPage.js";
import AdminPage from "../../pages/AdminPage.js";
import LoginPage from "../../pages/LoginPage.js";
import RegisterPage from "../../pages/RegisterPage.js";
import {
  getUserByEmail,
  setUserRole,
} from "../../utils/databaseHelper.js";
import {
  createAuthTestData,
  withAuthCleanup,
} from "../support/authTestData.js";


// ============================================================
// Authentication UI
// ============================================================

test("user should register and reach the protected Account page", async ({
  context,
  page,
}) => {
  const registerPage = new RegisterPage(page);
  const accountPage = new AccountPage(page);
  const testData = createAuthTestData({ prefix: "playwright-ui-register" });

  await withAuthCleanup(testData.email, async () => {
    await registerPage.open();

    const registrationResponsePromise = page.waitForResponse((response) =>
      new URL(response.url()).pathname === "/api/auth/register" &&
      response.request().method() === "POST"
    );
    await registerPage.register(testData);
    const registrationResponse = await registrationResponsePromise;

    expect(registrationResponse.status()).toBe(201);
    const setCookieHeader = await registrationResponse.headerValue(
      "set-cookie",
    );

    expect(setCookieHeader?.includes("HttpOnly")).toBe(true);
    expect(setCookieHeader?.includes("SameSite=Lax")).toBe(true);

    await expect(page).toHaveURL(/\/auth\/account$/);
    await expect(accountPage.heading).toBeVisible();
    await expect(accountPage.emailValue(testData.email)).toBeVisible();
    await expect(accountPage.roleValue("user")).toBeVisible();
    await expect(accountPage.logoutButton).toBeVisible();

    const storedUser = await getUserByEmail(testData.email);

    expect(storedUser).not.toBeNull();
    expect(storedUser.email).toBe(testData.email);
    expect(storedUser.role).toBe("user");
    expect(storedUser.password_hash !== testData.password).toBe(true);
    expect(/^\$2[aby]\$/.test(storedUser.password_hash)).toBe(true);

    const sessionCookie = (await context.cookies()).find(
      (cookie) => cookie.name === "qa_portfolio.sid",
    );

    expect(sessionCookie).toBeDefined();
    const remainingLifetime = sessionCookie.expires - Date.now() / 1000;

    expect(sessionCookie.httpOnly).toBe(true);
    expect(remainingLifetime).toBeGreaterThan(23 * 60 * 60);
    expect(remainingLifetime).toBeLessThanOrEqual(24 * 60 * 60 + 120);
  });
});

test("authenticated session should survive an Account page refresh", async ({
  page,
}) => {
  const registerPage = new RegisterPage(page);
  const accountPage = new AccountPage(page);
  const testData = createAuthTestData({ prefix: "playwright-ui-refresh" });

  await withAuthCleanup(testData.email, async () => {
    await registerPage.open();
    await registerPage.register(testData);

    await expect(page).toHaveURL(/\/auth\/account$/);
    await expect(accountPage.emailValue(testData.email)).toBeVisible();

    await page.reload();

    await expect(page).toHaveURL(/\/auth\/account$/);
    await expect(accountPage.heading).toBeVisible();
    await expect(accountPage.emailValue(testData.email)).toBeVisible();
    await expect(accountPage.roleValue("user")).toBeVisible();
  });
});

test("logout should invalidate Account access and the server session", async ({
  page,
}) => {
  const registerPage = new RegisterPage(page);
  const accountPage = new AccountPage(page);
  const loginPage = new LoginPage(page);
  const testData = createAuthTestData({ prefix: "playwright-ui-logout" });

  await withAuthCleanup(testData.email, async () => {
    await registerPage.open();
    await registerPage.register(testData);
    await expect(accountPage.heading).toBeVisible();

    await accountPage.logout();

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(loginPage.heading).toBeVisible();

    const currentUserResponse = await page.context().request.get(
      "/api/auth/me",
    );

    expect(currentUserResponse.status()).toBe(401);
    expect(await currentUserResponse.json()).toEqual({
      success: false,
      message: "Authentication required.",
    });

    await accountPage.open();

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(accountPage.heading).not.toBeVisible();
  });
});

test("existing user should login successfully", async ({ page, request }) => {
  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);
  const testData = createAuthTestData({ prefix: "playwright-ui-login" });

  await withAuthCleanup(testData.email, async () => {
    const setupResponse = await request.post("/api/auth/register", {
      data: {
        ...testData,
        confirmPassword: testData.password,
      },
    });

    expect(setupResponse.status()).toBe(201);
    expect((await request.post("/api/auth/logout")).status()).toBe(200);

    await loginPage.open();
    await loginPage.login(testData);

    await expect(page).toHaveURL(/\/auth\/account$/);
    await expect(accountPage.heading).toBeVisible();
    await expect(accountPage.emailValue(testData.email)).toBeVisible();
    await expect(accountPage.roleValue("user")).toBeVisible();
  });
});

test("guest should be redirected away from the protected Account page", async ({
  page,
}) => {
  const accountPage = new AccountPage(page);
  const loginPage = new LoginPage(page);

  await accountPage.open();

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(loginPage.heading).toBeVisible();
  await expect(accountPage.heading).not.toBeVisible();
});

test("normal user should see Access denied on the Admin page", async ({
  page,
}) => {
  const registerPage = new RegisterPage(page);
  const accountPage = new AccountPage(page);
  const adminPage = new AdminPage(page);
  const testData = createAuthTestData({ prefix: "playwright-ui-user-admin" });

  await withAuthCleanup(testData.email, async () => {
    await registerPage.open();
    await registerPage.register(testData);
    await expect(accountPage.heading).toBeVisible();
    await adminPage.open();

    await expect(page).toHaveURL(/\/auth\/admin$/);
    await expect(adminPage.accessDeniedHeading).toBeVisible();
    await expect(adminPage.heading).not.toBeVisible();
    await expect(adminPage.accessGrantedMessage).not.toBeVisible();
  });
});

test("admin user should access the Admin page", async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const accountPage = new AccountPage(page);
  const adminPage = new AdminPage(page);
  const testData = createAuthTestData({ prefix: "playwright-ui-admin" });

  await withAuthCleanup(testData.email, async () => {
    await registerPage.open();
    await registerPage.register(testData);
    await expect(accountPage.heading).toBeVisible();

    const updatedUser = await setUserRole(testData.email, "admin");

    expect(updatedUser).toEqual({
      id: expect.any(Number),
      email: testData.email,
      role: "admin",
    });

    await page.reload();

    await expect(accountPage.heading).toBeVisible();
    await expect(accountPage.emailValue(testData.email)).toBeVisible();
    await expect(accountPage.roleValue("admin")).toBeVisible();

    await adminPage.open();

    await expect(page).toHaveURL(/\/auth\/admin$/);
    await expect(adminPage.heading).toBeVisible();
    await expect(adminPage.accessGrantedMessage).toBeVisible();
    await expect(adminPage.accessDeniedHeading).not.toBeVisible();
  });
});
