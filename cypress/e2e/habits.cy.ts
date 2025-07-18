describe("Habits E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Authentication Flow", () => {
    it("should show login form", () => {
      cy.visit("/login");
      cy.get('[data-testid="email-input"]').should("be.visible");
      cy.get('[data-testid="password-input"]').should("be.visible");
      cy.get('[data-testid="login-button"]').should("be.visible");
    });
  });

  describe("Form Validation", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("should show error for invalid email", () => {
      cy.get('[data-testid="email-input"]').type("invalid-email");
      cy.get('[data-testid="login-button"]').click();
      cy.get("form")
        .contains(/email|courriel|valide/i)
        .should("be.visible");
    });

    it("should show error for empty password", () => {
      cy.get('[data-testid="email-input"]').type("test@example.com");
      cy.get('[data-testid="login-button"]').click();
      cy.contains("Le mot de passe est requis").should("be.visible");
    });
  });

  describe("Navigation", () => {
    it("should navigate to register page", () => {
      cy.visit("/login");
      cy.contains("S'inscrire").click();
      cy.url().should("include", "/register");
    });

    it("should navigate back to login page", () => {
      cy.visit("/register");
      cy.contains("Se connecter").click();
      cy.url().should("include", "/login");
    });
  });

  describe("Habit Management", () => {
    beforeEach(() => {
      cy.login("test@example.com", "password123");
      cy.visit("/dashboard/habits");
    });

    it("should display habits page", () => {
      cy.get('[data-testid="habits-page"]').should("be.visible");
      cy.get('[data-testid="add-habit-button"]').should("be.visible");
    });

    it("should create a new habit", () => {
      cy.createHabit("Exercise", "Daily workout routine", "💪");

      cy.get('[data-testid="habits-list"]').should("contain", "Exercise");
      cy.get('[data-testid="habits-list"]').should(
        "contain",
        "Daily workout routine"
      );
      cy.get('[data-testid="habits-list"]').should("contain", "💪");
    });

    it("should toggle habit completion", () => {
      cy.createHabit("Reading", "Read for 30 minutes");

      cy.get('[data-testid^="habit-"]')
        .first()
        .within(() => {
          cy.get('[data-testid="toggle-completion-button"]').click();
        });

      cy.get('[data-testid="habit-completed-toast"]').should("be.visible");
      cy.get('[data-testid^="habit-"]')
        .first()
        .should("have.class", "completed");
    });

    it("should edit an existing habit", () => {
      cy.createHabit("Meditation", "Daily meditation");

      cy.get('[data-testid^="habit-"]')
        .first()
        .within(() => {
          cy.get('[data-testid="edit-habit-button"]').click();
        });

      cy.get('[data-testid="habit-name-input"]').clear().type("Mindfulness");
      cy.get('[data-testid="habit-description-input"]')
        .clear()
        .type("Mindfulness practice");
      cy.get('[data-testid="update-habit-button"]').click();

      cy.get('[data-testid="habit-updated-toast"]').should("be.visible");
      cy.get('[data-testid="habits-list"]').should("contain", "Mindfulness");
      cy.get('[data-testid="habits-list"]').should(
        "contain",
        "Mindfulness practice"
      );
    });

    it("should delete a habit", () => {
      cy.createHabit("Temporary Habit", "This will be deleted");

      cy.get('[data-testid^="habit-"]')
        .first()
        .then(($habit) => {
          const habitId = $habit.attr("data-testid")?.replace("habit-", "");
          if (habitId) {
            cy.deleteHabit(habitId);
          }
        });

      cy.get('[data-testid="habits-list"]').should(
        "not.contain",
        "Temporary Habit"
      );
    });

    it("should filter habits by completion status", () => {
      cy.createHabit("Completed Habit", "This is completed");
      cy.createHabit("Incomplete Habit", "This is not completed");

      cy.get('[data-testid^="habit-"]')
        .first()
        .within(() => {
          cy.get('[data-testid="toggle-completion-button"]').click();
        });

      cy.get('[data-testid="filter-completed"]').click();
      cy.get('[data-testid="habits-list"]').should(
        "contain",
        "Completed Habit"
      );
      cy.get('[data-testid="habits-list"]').should(
        "not.contain",
        "Incomplete Habit"
      );

      cy.get('[data-testid="filter-incomplete"]').click();
      cy.get('[data-testid="habits-list"]').should(
        "contain",
        "Incomplete Habit"
      );
      cy.get('[data-testid="habits-list"]').should(
        "not.contain",
        "Completed Habit"
      );
    });
  });

  describe("Habit Statistics", () => {
    beforeEach(() => {
      cy.login("test@example.com", "password123");
      cy.visit("/dashboard/analysis");
    });

    it("should display habit statistics", () => {
      cy.get('[data-testid="statistics-page"]').should("be.visible");
      cy.get('[data-testid="habit-streak-chart"]').should("be.visible");
      cy.get('[data-testid="completion-percentage"]').should("be.visible");
    });

    it("should show habit streaks", () => {
      cy.get('[data-testid="streak-counter"]').should("contain", "days");
      cy.get('[data-testid="longest-streak"]').should("be.visible");
      cy.get('[data-testid="current-streak"]').should("be.visible");
    });
  });

  describe("Responsive Design", () => {
    it("should work on mobile devices", () => {
      cy.viewport("iphone-6");
      cy.login("test@example.com", "password123");
      cy.visit("/dashboard/habits");

      cy.get('[data-testid="mobile-menu-button"]').should("be.visible");
      cy.get('[data-testid="mobile-habits-list"]').should("be.visible");
    });

    it("should work on tablet devices", () => {
      cy.viewport("ipad-2");
      cy.login("test@example.com", "password123");
      cy.visit("/dashboard/habits");

      cy.get('[data-testid="tablet-layout"]').should("be.visible");
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors gracefully", () => {
      cy.intercept("GET", "/api/habits", { forceNetworkError: true }).as(
        "getHabitsError"
      );
      cy.login("test@example.com", "password123");
      cy.visit("/dashboard/habits");

      cy.wait("@getHabitsError");
      cy.get('[data-testid="error-message"]').should("be.visible");
      cy.get('[data-testid="retry-button"]').should("be.visible");
    });

    it("should handle invalid form data", () => {
      cy.login("test@example.com", "password123");
      cy.visit("/dashboard/habits");

      cy.get('[data-testid="add-habit-button"]').click();
      cy.get('[data-testid="create-habit-button"]').click();

      cy.get('[data-testid="name-error"]').should("be.visible");
      cy.get('[data-testid="name-error"]').should(
        "contain",
        "Name is required"
      );
    });
  });

  describe("Responsive Design", () => {
    it("should render login form on mobile devices", () => {
      cy.viewport("iphone-6");
      cy.visit("/login");
      cy.get('[data-testid="email-input"]').should("be.visible");
      cy.get('[data-testid="password-input"]').should("be.visible");
      cy.get('[data-testid="login-button"]').should("be.visible");
    });

    it("should render login form on tablet devices", () => {
      cy.viewport("ipad-2");
      cy.visit("/login");
      cy.get('[data-testid="email-input"]').should("be.visible");
      cy.get('[data-testid="password-input"]').should("be.visible");
      cy.get('[data-testid="login-button"]').should("be.visible");
    });
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
  });
});
