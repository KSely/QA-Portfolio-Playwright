export default class LoginPage {

  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      name: "Login",
      exact: true,
      level: 1,
    });
    this.emailInput = page.getByLabel("Email", { exact: true });
    this.passwordInput = page.getByLabel("Password", { exact: true });
    this.loginButton = page.getByRole("button", {
      name: "Login",
      exact: true,
    });
  }

  async open() {
    await this.page.goto("/auth/login");
  }

  async login({ email, password }) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
