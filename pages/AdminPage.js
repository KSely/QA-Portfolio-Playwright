export default class AdminPage {

  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      name: "Admin",
      exact: true,
      level: 1,
    });
    this.accessGrantedMessage = page.getByText("Admin access granted.", {
      exact: true,
    });
    this.accessDeniedHeading = page.getByRole("heading", {
      name: "Access denied",
      exact: true,
      level: 1,
    });
  }

  async open() {
    await this.page.goto("/auth/admin");
  }
}
