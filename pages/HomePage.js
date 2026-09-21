// Page Object Model for the portfolio Home Page.
//
// This class represents the Home Page of the application and
// contains page-specific locators and reusable actions.
//
// Keeping page interactions inside a Page Object separates
// test logic from UI implementation details and makes the
// automation framework easier to maintain and reuse.
class HomePage {

  // The constructor receives the Playwright "page" fixture
  // from the test and stores it inside the Page Object.
  constructor(page) {

    // Store the Playwright page instance.
    this.page = page;


    // ============================================================
    // Hero Section
    // ============================================================

    // Main heading displayed in the hero section.
    this.mainHeading = page.getByRole('heading', {
      name: /Software Tester\s*\|\s*SDET/i
    });


    // "View QA Project" link displayed in the hero section.
    //
    // This link navigates to the Featured Project section
    // on the same Home Page using the "#project" URL fragment.
    this.viewProjectLink = page.getByRole('link', {
      name: 'View QA Project'
    });


    // ============================================================
    // Featured Project Section
    // ============================================================

    // Main heading displayed in the Featured Project section.
    this.projectHeading = page.getByRole('heading', {
      name: 'Full-Stack QA Automation Project'
    });


    // "View Project Details" link displayed in the
    // Featured Project section.
    //
    // This link navigates from the Home Page to the
    // dedicated "/project" route.
    this.projectDetailsLink = page.getByRole('link', {
      name: 'View Project Details'
    });


    // ============================================================
    // Contact Form
    // ============================================================

    // Name input field.
    //
    // getByLabel() locates the input through its associated
    // <label for="name">Name</label>.
    //
    // This is preferred over implementation-specific selectors
    // because it reflects how the field is identified to users
    // and assistive technologies.
    this.nameInput = page.getByLabel('Name');


    // Email input field.
    //
    // The locator uses the visible form label associated
    // with the email input.
    this.emailInput = page.getByLabel('Email');


    // Message textarea.
    //
    // The locator uses the visible "Message" label associated
    // with the textarea element.
    this.messageInput = page.getByLabel('Message');


    // "Send Message" submit button.
    //
    // getByRole() identifies the element using its accessible
    // button role and visible name.
    this.sendMessageButton = page.getByRole('button', {
      name: 'Send Message'
    });


    // Success message displayed after the contact form
    // has been submitted successfully.
    //
    // The application renders this element with role="alert",
    // allowing Playwright to locate it using its accessible role.
    this.successMessage = page.getByRole('alert');

  }

}

// Export the HomePage class so it can be imported
// and used inside Playwright test files.
module.exports = HomePage;