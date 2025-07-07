# Stratégie de Tests - MindTrack AI

Ce document décrit la stratégie de tests mise en place pour le projet MindTrack AI.

## Vue d'ensemble

Notre approche de test suit la pyramide de tests classique :

1. **Tests unitaires** : Tests des composants individuels
2. **Tests d'intégration** : Tests des interactions entre composants
3. **Tests end-to-end (E2E)** : Tests de l'application complète

## Structure des Tests

```
src/
├── __tests__/                  # Tests d'intégration
│   ├── integration/            # Tests d'intégration spécifiques
│   │   └── habit-flow.test.ts
│   │   └── journal-flow.test.ts
│   ├── setup.ts                # Configuration des tests
│   └── utils/                  # Utilitaires pour les tests
├── domain/
│   ├── entities/
│   │   └── __tests__/          # Tests unitaires des entités
│   │       ├── habit.entity.test.ts
│   │       └── journal.entity.test.ts
│   └── usecases/
│       └── __tests__/          # Tests unitaires des cas d'utilisation
│           └── habit.usecase.test.ts
├── infrastructure/
│   └── repositories/
│       └── __tests__/          # Tests des repositories
└── userinterface/
    └── components/
        └── habits/
            └── views/
                └── __tests__/  # Tests des composants UI
cypress/
└── e2e/                        # Tests end-to-end
    ├── auth/                   # Tests d'authentification
    ├── habits/                 # Tests des fonctionnalités d'habitudes
    ├── habits.cy.ts
    ├── journal/                # Tests des fonctionnalités de journal
    └── journal.cy.ts
```

## Tests Unitaires

Les tests unitaires vérifient le comportement des composants individuels de l'application.

### Tests des Entités

Les tests des entités (`domain/entities/__tests__/`) vérifient que les règles métier sont correctement implémentées :

- **Habit Entity** : Vérifie la création, la validation et les méthodes de l'entité Habit
- **Journal Entity** : Vérifie la création, la validation et les méthodes de l'entité Journal

### Tests des Cas d'Utilisation

Les tests des cas d'utilisation (`domain/usecases/__tests__/`) vérifient la logique d'orchestration :

- **Habit Usecase** : Vérifie la création, la récupération, la mise à jour et la suppression des habitudes

## Tests d'Intégration

Les tests d'intégration (`src/__tests__/integration/`) vérifient les interactions entre différentes couches de l'application :

- Tests des repositories avec la base de données
- Tests des présentateurs avec les cas d'utilisation
- Tests des actions serveur avec les cas d'utilisation

## Tests End-to-End (E2E)

Les tests E2E (`cypress/e2e/`) vérifient le comportement de l'application du point de vue de l'utilisateur :

### Tests d'Authentification

- Inscription d'un nouvel utilisateur
- Connexion d'un utilisateur existant
- Gestion des erreurs d'authentification

### Tests des Habitudes

- Création d'une nouvelle habitude
- Mise à jour d'une habitude existante
- Suppression d'une habitude
- Marquage d'une habitude comme complétée

### Tests du Journal

- Création d'une nouvelle entrée de journal
- Mise à jour d'une entrée de journal existante
- Suppression d'une entrée de journal
- Filtrage des entrées de journal

## Exécution des Tests

```bash
# Exécution des tests unitaires et d'intégration
pnpm test

# Exécution des tests unitaires avec couverture
pnpm test:coverage

# Exécution des tests E2E avec Cypress
pnpm test:e2e

# Exécution des tests E2E en mode headless
pnpm test:e2e:headless
```

## Mocks et Fixtures

Les mocks et fixtures sont utilisés pour isoler les composants testés et simuler des dépendances externes :

- **Mocks de repositories** : Simulent l'accès à la base de données
- **Mocks d'authentification** : Simulent l'authentification des utilisateurs
- **Fixtures de données** : Fournissent des données de test cohérentes

## Intégration Continue (CI)

Les tests sont automatiquement exécutés dans le pipeline CI à chaque pull request :

1. Tests unitaires et d'intégration
2. Vérification de la couverture de code
3. Tests E2E avec Cypress
