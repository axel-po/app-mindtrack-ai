# Guide de Test - MindTrack AI

Ce guide explique comment utiliser les différents types de tests mis en place dans l'application MindTrack AI.

## Types de Tests

### 1. Tests Unitaires (Vitest)

Les tests unitaires testent des composants individuels en isolation.

**Localisation :**

- `src/domain/entities/__tests__/`
- `src/domain/usecases/__tests__/`
- `src/infrastructure/repositories/__tests__/`

**Commandes :**

```bash
# Exécuter tous les tests unitaires en mode watch
npm run test

# Exécuter les tests une fois
npm run test:run

# Exécuter avec couverture de code
npm run test:coverage

# Interface utilisateur pour les tests
npm run test:ui
```

### 2. Tests d'Intégration (Vitest)

Les tests d'intégration testent comment les différentes couches de l'application fonctionnent ensemble.

**Localisation :** `src/__tests__/integration/`

**Exemple :**

```typescript
// Test du flux complet habit creation
describe("Habit Flow Integration Tests", () => {
  it("should create a habit through the entire flow", async () => {
    // Test use case + repository + entity
  });
});
```

### 3. Tests d'API (Vitest)

Les tests d'API testent les endpoints REST de l'application.

**Localisation :** `src/app/api/**/__tests__/`

**Commandes :**

```bash
# Inclus dans les tests unitaires
npm run test:run
```

### 4. Tests de Composants React (Vitest + Testing Library)

Les tests de composants testent les composants React individuels.

**Localisation :** `src/userinterface/components/**/__tests__/`

**Exemple :**

```typescript
import { render, screen } from "@testing-library/react";
import { HabitView } from "../HabitView";

describe("HabitView", () => {
  it("should render habits list", () => {
    render(<HabitView />);
    expect(screen.getByText("Exercise")).toBeInTheDocument();
  });
});
```

### 5. Tests End-to-End (Cypress)

Les tests E2E testent l'application complète du point de vue utilisateur.

**Localisation :** `cypress/e2e/`

**Commandes :**

```bash
# Exécuter les tests E2E en mode headless
npm run test:e2e

# Ouvrir l'interface Cypress
npm run test:e2e:open

# Tests E2E headless pour CI
npm run test:e2e:headless
```

### 6. Tests de Composants Cypress

Tests de composants individuels dans un environnement réel.

**Commandes :**

```bash
# Exécuter les tests de composants
npm run test:component

# Ouvrir l'interface pour les tests de composants
npm run test:component:open
```

## Configuration des Tests

### Vitest Configuration

- **Fichier :** `vitest.config.ts`
- **Setup :** `src/__tests__/setup.ts`
- **Helpers :** `src/__tests__/utils/test-helpers.ts`

### Cypress Configuration

- **Fichier :** `cypress.config.ts`
- **Support E2E :** `cypress/support/e2e.ts`
- **Commandes :** `cypress/support/commands.ts`

## Commandes de Test Globales

```bash
# Exécuter tous les tests (unitaires + E2E)
npm run test:all

# Commandes pour CI/CD
npm run test:ci

# Tests avec couverture de code
npm run test:coverage
```

## Structure des Tests

### Tests Unitaires

```
src/
├── domain/
│   ├── entities/__tests__/
│   │   ├── habit.entity.test.ts
│   │   └── journal.entity.test.ts
│   └── usecases/__tests__/
│       ├── habit.usecase.test.ts
│       └── journal.usecase.test.ts
├── infrastructure/
│   └── repositories/__tests__/
│       ├── habits.repository.test.ts
│       └── journal.repository.test.ts
└── userinterface/
    └── components/**/__tests__/
        └── *.test.tsx
```

### Tests d'Intégration

```
src/__tests__/
├── integration/
│   ├── habit-flow.test.ts
│   └── journal-flow.test.ts
├── setup.ts
└── utils/
    └── test-helpers.ts
```

### Tests E2E

```
cypress/
├── e2e/
│   ├── habits.cy.ts
│   ├── journal.cy.ts
│   └── auth.cy.ts
├── support/
│   ├── commands.ts
│   └── e2e.ts
└── fixtures/
    └── test-data.json
```

## Mocking et Helpers

### Mocks Disponibles

- Database client mock
- Auth service mock
- Next.js navigation mock
- API endpoints mock

### Helpers de Test

- `createMockHabit()` - Crée un habit de test
- `createMockJournal()` - Crée un journal de test
- `mockUser` - Utilisateur de test
- `mockSession` - Session de test

## Bonnes Pratiques

### 1. Tests Unitaires

- Tester une fonction/classe à la fois
- Utiliser des mocks pour les dépendances
- Tester les cas d'erreur
- Vérifier les cas limites

### 2. Tests d'Intégration

- Tester les flux complets
- Utiliser des mocks pour les services externes
- Vérifier les interactions entre couches

### 3. Tests E2E

- Tester les parcours utilisateur principaux
- Utiliser des `data-testid` pour les sélecteurs
- Nettoyer les données après chaque test
- Tester sur différents viewports

### 4. Tests de Composants

- Tester le rendu et les interactions
- Utiliser les matchers de testing-library
- Tester l'accessibilité
- Mocker les props et hooks

## Couverture de Code

```bash
# Générer un rapport de couverture
npm run test:coverage

# Ouvrir le rapport HTML
open coverage/index.html
```

**Objectifs de couverture :**

- Entités : 100%
- Use cases : 95%
- Repositories : 90%
- Composants : 80%

## Debugging des Tests

### Vitest

```bash
# Mode debug
npm run test -- --reporter=verbose

# Tests spécifiques
npm run test -- src/domain/entities/__tests__/habit.entity.test.ts
```

### Cypress

```bash
# Mode debug avec interface
npm run test:e2e:open

# Screenshots et vidéos dans cypress/screenshots/ et cypress/videos/
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
```

## Troubleshooting

### Erreurs Communes

1. **Mocks non configurés** : Vérifier `src/__tests__/setup.ts`
2. **Timeout E2E** : Augmenter `defaultCommandTimeout` dans cypress.config.ts
3. **Erreurs de types** : Vérifier les imports et les déclarations

### Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Library](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
