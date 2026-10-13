export default class RegisterPage {

  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      name: "Register",
      exact: true,
      level: 1,
    });
    this.emailInput = page.getByLabel("Email", { exact: true });
    this.passwordInput = page.getByLabel("Password", { exact: true });
    this.confirmPasswordInput = page.getByLabel("Confirm Password", {
      exact: true,
    });
    this.registerButton = page.getByRole("button", {
      name: "Register",
      exact: true,
    });
  }

  async open() {
    await this.page.goto("/auth/register");
  }

  async register({ email, password }) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.registerButton.click();
  }
}
