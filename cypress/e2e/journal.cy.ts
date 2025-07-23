describe("Journal E2E Tests", () => {
  // Test de base pour la page d'accueil
  it("should show homepage", () => {
    cy.visit("/");
    cy.contains("MindTrack AI").should("be.visible");
  });

  describe("Journal Entry Creation", () => {
    it("should navigate to login page", () => {
      cy.visit("/login");
      cy.get('[data-testid="email-input"]').should("be.visible");
      cy.get('[data-testid="password-input"]').should("be.visible");
      cy.get('[data-testid="login-button"]').should("be.visible");
    });

    it("should create a new journal entry", () => {
      cy.visit("/dashboard/journal");
      cy.get('[data-testid="new-journal-entry-button"]').click();

      cy.get('[data-testid="mood-good"]').click();

      cy.get('[data-testid="journal-thought-input"]').type(
        "Aujourd'hui, j'ai passé une excellente journée. J'ai fait beaucoup de progrès sur mon projet."
      );

      cy.get('[data-testid="save-journal-button"]').click();

      cy.contains("Entrée de journal créée avec succès").should("be.visible");

      cy.contains("Aujourd'hui, j'ai passé une excellente journée").should(
        "be.visible"
      );
    });
  });

  describe("Responsive Navigation", () => {
    it("should render properly on mobile devices", () => {
      cy.viewport("iphone-6");
      cy.visit("/login");
      cy.get('[data-testid="email-input"]').should("be.visible");
      cy.get('[data-testid="password-input"]').should("be.visible");
      cy.get('[data-testid="login-button"]').should("be.visible");
    });
  });
});
