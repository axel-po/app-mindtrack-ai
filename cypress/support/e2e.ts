// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands and overrides here
declare global {
  namespace Cypress {
    interface Chainable {
      // Custom commands
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      createHabit(
        name: string,
        description?: string,
        emoji?: string
      ): Chainable<void>;
      deleteHabit(habitId: string): Chainable<void>;
    }
  }
}

// Prevent TypeScript from reading file as legacy script
export {};
