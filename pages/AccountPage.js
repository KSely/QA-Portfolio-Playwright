export default class AccountPage {

  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      name: "Account",
      exact: true,
      level: 1,
    });
    this.logoutButton = page.getByRole("button", {
      name: "Logout",
      exact: true,
    });
  }

  emailValue(email) {
    return this.page.getByText(email, { exact: true });
  }

  roleValue(role) {
    return this.page.getByText(role, { exact: true });
  }

  async open() {
    await this.page.goto("/auth/account");
  }

  async logout() {
    await this.logoutButton.click();
  }
}
