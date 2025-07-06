// Custom commands for Cypress tests

// Login command
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should("include", "/dashboard");
});

// Logout command
Cypress.Commands.add("logout", () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should("include", "/login");
});

// Create habit command
Cypress.Commands.add(
  "createHabit",
  (name: string, description?: string, emoji?: string) => {
    cy.get('[data-testid="add-habit-button"]').click();
    cy.get('[data-testid="habit-name-input"]').type(name);

    if (description) {
      cy.get('[data-testid="habit-description-input"]').type(description);
    }

    if (emoji) {
      cy.get('[data-testid="habit-emoji-picker"]').click();
      cy.get(`[data-testid="emoji-${emoji}"]`).click();
    }

    cy.get('[data-testid="create-habit-button"]').click();
    cy.get('[data-testid="habit-created-toast"]').should("be.visible");
  }
);

// Delete habit command
Cypress.Commands.add("deleteHabit", (habitId: string) => {
  cy.get(`[data-testid="habit-${habitId}"]`).within(() => {
    cy.get('[data-testid="delete-habit-button"]').click();
  });
  cy.get('[data-testid="confirm-delete-button"]').click();
  cy.get('[data-testid="habit-deleted-toast"]').should("be.visible");
});

// Add more commands as needed
export {};
