# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
pnpm dev                # Start development server (with db check)
pnpm build              # Build for production
pnpm start              # Start production server
```

### Code Quality
```bash
pnpm lint               # Run ESLint
pnpm format             # Check formatting with Prettier
pnpm format:fix         # Fix formatting with Prettier
```

### Database Operations
```bash
pnpm db:check           # Check database connection
pnpm db:generate        # Generate Drizzle migrations
pnpm db:migrate         # Run migrations
pnpm db:push            # Push schema to database
pnpm db:studio          # Open Drizzle Studio
pnpm db:seed            # Seed database with test data
pnpm db:reset-seed      # Full reset: clear, drop, generate, push, and seed
```

### Testing
```bash
pnpm test               # Run unit tests in watch mode
pnpm test:run           # Run unit tests once
pnpm test:coverage      # Run tests with coverage report
pnpm test:e2e           # Run Cypress E2E tests
pnpm test:e2e:open      # Open Cypress test runner
pnpm test:all           # Run all tests (unit + E2E)
pnpm test:ci            # Run tests for CI (coverage + E2E)
```

## Architecture Overview

This is a **Next.js 15** application implementing **Clean Architecture** principles with the following structure:

### Core Architecture Layers

1. **Domain Layer** (`src/domain/`):
   - `entities/` - Business objects with core logic (HabitEntity, JournalEntity)
   - `usecases/` - Application business rules orchestration
   - `models/` - Domain interfaces and types

2. **Infrastructure Layer** (`src/infrastructure/`):
   - `repositories/` - Data access implementations
   - `database/` - Database schemas (Drizzle ORM) and connection
   - `presenters/` - Data transformation for UI consumption

3. **User Interface Layer** (`src/userinterface/`):
   - `components/` - React components organized by feature
   - `actions/` - Next.js Server Actions

4. **Dependency Injection** (`src/di/`):
   - IoC containers for each domain (habit, journal, analytics, streak)
   - Singleton pattern for dependency management

### Key Technologies

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js Server Actions, Better Auth
- **Database**: PostgreSQL with Drizzle ORM
- **Testing**: Vitest (unit), Cypress (E2E)
- **UI Components**: Radix UI, shadcn/ui components
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation

### Database Schema

Database schemas are located in `src/infrastructure/database/schemas/`:
- `habits.schema.ts` - Habit tracking
- `entries.schema.ts` - Journal entries
- `entryHabits.schema.ts` - Many-to-many relation between entries and habits
- `user.schema.ts` - User management

### Component Organization

Components are organized by feature in `src/userinterface/components/`:
- `habits/` - Habit management (create, delete, views)
- `journal/` - Journal functionality (create, update, delete, views)
- `analytics/` - Charts and data visualization
- `@shared/` - Shared components (nav, sidebar, theme, emojis)
- `ui/` - shadcn/ui base components

### Authentication

Uses Better Auth with Next.js integration:
- Server-side auth in `src/lib/auth-server.ts`
- Client-side auth in `src/lib/auth-client.ts`
- Auth configuration in `src/lib/auth.ts`

### Testing Strategy

- **Unit Tests**: Located alongside source files in `__tests__/` directories
- **E2E Tests**: Located in `cypress/e2e/` directory
- **Coverage**: Configured to exclude test files, configs, and type definitions
- **Setup**: Test setup files in `src/__tests__/setup.ts`

### Development Workflow

1. Use `pnpm dev` to start development (automatically checks database)
2. Run `pnpm db:check` before development to ensure database is ready
3. Use `pnpm db:reset-seed` for fresh development data
4. Run tests with `pnpm test` for unit tests or `pnpm test:e2e` for E2E
5. Use `pnpm lint` and `pnpm format` to maintain code quality

### Important Patterns

- **Dependency Injection**: Use IoC containers in `src/di/` for use case dependencies
- **Server Actions**: Located in `src/userinterface/actions/` for server-side operations
- **View Models**: Components use view models for state management (e.g., `create-habit.viewmodel.ts`)
- **Clean Architecture**: Maintain dependency flow: UI → Use Cases → Entities
- **Feature Organization**: Group related components, actions, and view models by feature

### File Naming Conventions

- Components: PascalCase (e.g., `HabitView.tsx`)
- View Models: kebab-case with `.viewmodel.ts` suffix
- Actions: kebab-case with `.actions.ts` suffix
- Entities: kebab-case with `.entity.ts` suffix
- Use Cases: kebab-case with `.usecase.ts` suffix

## Environment Setup

Ensure `.env.local` contains:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret for Better Auth
- `BETTER_AUTH_URL` - Base URL for authentication