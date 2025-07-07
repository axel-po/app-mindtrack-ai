# MindTrack AI

Application de suivi d'habitudes et de journal personnel utilisant les principes de Clean Architecture.

## Architecture du Projet

Ce projet est structuré selon les principes de Clean Architecture, ce qui permet une séparation claire des responsabilités et une meilleure testabilité.

### Structure des Dossiers

```
src/
├── domain/               # Cœur de l'application (entités, cas d'utilisation)
│   ├── entities/         # Objets métier avec logique et règles
│   ├── models/           # Interfaces et types du domaine
│   └── usecases/         # Logique d'application
├── infrastructure/       # Implémentations techniques
│   ├── database/         # Accès à la base de données
│   ├── presenters/       # Transformation des données pour l'UI
│   └── repositories/     # Implémentation des repositories
├── userinterface/        # Interface utilisateur
│   ├── actions/          # Actions serveur Next.js
│   └── components/       # Composants React
├── di/                   # Injection de dépendances
└── lib/                  # Utilitaires et configurations
```

### Principes de Clean Architecture

1. **Indépendance des frameworks** : Le cœur de l'application ne dépend pas des détails d'implémentation.
2. **Testabilité** : Chaque couche peut être testée indépendamment.
3. **Indépendance de l'UI** : L'interface utilisateur peut changer sans affecter la logique métier.
4. **Indépendance de la base de données** : La logique métier ne dépend pas de la base de données.
5. **Indépendance des agents externes** : Le cœur de l'application ne dépend pas des API externes.

### Flux de Données

1. **Entités** : Contiennent les règles métier critiques.
2. **Cas d'utilisation** : Orchestrent le flux de données vers et depuis les entités.
3. **Adaptateurs d'interface** : Convertissent les données entre le format pratique pour les cas d'utilisation et les entités.
4. **Frameworks et drivers** : Outils et frameworks comme la base de données, le framework web, etc.

### Technologies Utilisées

- **Frontend** : Next.js, React, Tailwind CSS
- **Backend** : Next.js, Server Actions
- **Base de données** : SQL avec Drizzle ORM
- **Authentification** : Better Auth
- **Tests** : Vitest, Cypress

## Installation et Démarrage

```bash
# Installation des dépendances
pnpm install

# Démarrage en mode développement
pnpm dev

# Construction pour la production
pnpm build

# Démarrage en mode production
pnpm start
```

## Docker

Le projet peut être exécuté dans Docker pour le développement et les tests :

```bash
# Construction et démarrage du conteneur de test
docker-compose -f docker/test/docker-compose.yml up -d

# Construction et démarrage du conteneur de production
docker-compose -f docker/prod/docker-compose.yml up -d
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
