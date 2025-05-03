# Database Layer

This directory contains the database layer of the application, following a clean architecture approach with a focus on maintainability and flexibility.

## Structure

```
infrastructure/database/
├── core/                      # Core database functionality
│   ├── interfaces/            # Database interfaces
│   │   └── database-provider.interface.ts  # Core provider interface
│   ├── abstract-database-provider.ts       # Abstract base class for providers
│   ├── database-service.ts    # Main service for database operations
│   ├── factory.ts             # Factory for creating provider instances
│   └── repository-factory.ts  # Factory for creating repositories
│
├── providers/                 # Database provider implementations
│   ├── sqlite/                # SQLite implementation
│   │   ├── sqlite-provider.ts # Provider implementation
│   │   ├── sqlite-schema.ts   # Schema definition
│   │   ├── repository/        # SQLite-specific repositories
│   │   └── migrations/        # SQLite migrations
│   │
│   ├── mysql/                 # MySQL implementation
│   │   ├── mysql-provider.ts
│   │   ├── mysql-schema.ts
│   │   ├── repository/
│   │   └── migrations/
│   │
│   └── postgres/              # PostgreSQL implementation
│       ├── postgres-provider.ts
│       ├── postgres-schema.ts
│       ├── repository/
│       └── migrations/
│
├── migrations/               # Common migration utilities and scripts
└── init-db.ts               # Database initialization script
```

## Usage

### Initializing the Database

```typescript
import { initializeDatabase } from '@/infrastructure/database';

// Initialize the database
await initializeDatabase();
```

### Using Repositories

```typescript
import { getUserRepository } from '@/infrastructure/database';

// Get the user repository
const userRepository = await getUserRepository();

// Use the repository
const user = await userRepository.findById('user-id');
```

### Configuring the Database Provider

The database provider is configured using environment variables:

- `DATABASE_PROVIDER`: The database provider to use (`sqlite`, `mysql`, or `postgres`)
- `DATABASE_URL`: The database connection URL (optional)
- `DATABASE_HOST`: The database host (if not using URL)
- `DATABASE_PORT`: The database port (if not using URL)
- `DATABASE_USERNAME`: The database username (if not using URL)
- `DATABASE_PASSWORD`: The database password (if not using URL)
- `DATABASE_NAME`: The database name (if not using URL)
- `DATABASE_SSL`: Whether to use SSL for the connection (if not using URL)

## Database Commands

```bash
# Generate schema for all database types
npm run db:generate

# Generate schema for a specific database type
npm run db:generate:sqlite
npm run db:generate:mysql
npm run db:generate:postgres

# Push schema changes to the database
npm run db:push

# Initialize the database
npm run db:init

# Set up admin user
npm run db:setup-admin
```

## Adding a New Provider

To add a new database provider:

1. Create a new directory in `providers/` for the provider
2. Implement the provider class extending `AbstractDatabaseProvider`
3. Create the schema definition
4. Implement the repository classes
5. Update the factory to support the new provider
6. Update the drizzle.config.ts file to support the new provider

## Architecture

This database layer follows the adapter pattern, allowing the application to switch between different database providers without changing the core business logic. The key components are:

- **Core Interfaces**: Define the contract for database providers and repositories
- **Abstract Provider**: Provides common functionality for all providers
- **Concrete Providers**: Implement the provider interface for specific databases
- **Repository Factory**: Creates repositories based on the current provider
- **Database Service**: Manages the database connection and provides access to the database
