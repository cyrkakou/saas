# NextJS SaaS Starter

A modern SaaS starter kit built with NextJS, Tailwind CSS, and more, following SOLID principles and Clean Architecture.

## Features

- **NextJS with App Router**: Modern React framework with server components
- **Tailwind CSS**: Utility-first CSS framework
- **Authentication System**: Secure authentication with JWT
- **Drizzle ORM**: Type-safe SQL query builder with SQLite (adaptable to MySQL/PostgreSQL)
- **Zod Validation**: Runtime type checking and validation
- **TanStack Query**: Data fetching and caching
- **TanStack Table**: Headless UI for building powerful tables
- **Clean Architecture**: Separation of concerns with domain-driven design

## Project Structure

The project follows a Clean Architecture approach with the following structure:

```
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Protected dashboard routes
│   ├── api/                # API routes
│   └── page.tsx            # Homepage
├── core/                   # Core business logic (framework agnostic)
│   ├── domain/             # Domain entities and business rules
│   ├── use-cases/          # Application use cases
│   └── interfaces/         # Ports for external adapters
├── infrastructure/         # External implementations (adapters)
│   ├── database/           # Database adapters and repositories
│   ├── payment/            # Payment service adapters
│   ├── email/              # Email service adapters
│   └── storage/            # Storage service adapters
├── presentation/           # UI logic
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── providers/          # Context providers
│   └── utils/              # Presentation utilities
└── lib/                    # Shared utilities and config
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
3. Set up the database:
   ```bash
   npm run db:generate
   npm run db:push
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

## Database Strategy Pattern

The project uses a database adapter pattern to support multiple database engines:

- SQLite (default for development)
- MySQL (optional)
- PostgreSQL (optional)

This allows for easy switching between database engines without changing the application code.

## Authentication

The authentication system includes:

- User registration and login
- JWT-based authentication
- Protected routes
- Role-based access control

## Development Roadmap

See [tasks.md](./tasks.md) for the detailed development roadmap.

## License

MIT
