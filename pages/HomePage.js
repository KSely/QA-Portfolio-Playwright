// Page Object for the Home Page.
// Contains reusable locators used by the UI tests.

export default class HomePage {

  constructor(page) {
    this.page = page;


    // Hero section
    this.mainHeading = page.getByRole('heading', {
      name: /Software Tester\s*\|\s*SDET/i
    });

    this.viewProjectLink = page.getByRole('link', {
      name: 'View QA Project'
    });


    // Featured Project section
    this.projectHeading = page.getByRole('heading', {
      name: 'Full-Stack QA Automation Project'
    });

    this.projectDetailsLink = page.getByRole('link', {
      name: 'View Project Details'
    });


    // Contact form
    this.nameInput = page.getByLabel('Name');

    this.emailInput = page.getByLabel('Email');

    this.messageInput = page.getByLabel('Message');

    this.sendMessageButton = page.getByRole('button', {
      name: 'Send Message'
    });

    // Success message shown after the form is submitted.
    this.successMessage = page.locator('#success-message');
  }

  async open() {
    await this.page.goto('/');
  }

  async fillContactForm({ name, email, message }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.messageInput.fill(message);
  }

  async clickSendMessage() {
    await this.sendMessageButton.click();
  }

  async submitContactForm(contactData) {
    await this.fillContactForm(contactData);
    await this.clickSendMessage();
  }

}
