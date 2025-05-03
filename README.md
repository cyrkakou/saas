# NextJS SaaS Starter

A modern SaaS starter kit built with NextJS, Tailwind CSS, and more, following SOLID principles and Clean Architecture. This project is designed to be a production-ready foundation for building SaaS applications with a focus on maintainability, scalability, and developer experience.

## Features

- **NextJS with App Router**: Modern React framework with server components
- **Tailwind CSS**: Utility-first CSS framework
- **Authentication System**: Secure authentication with JWT
- **Admin Management System**: Complete admin panel for managing users, roles, permissions, organizations, and more
- **RESTful API**: Versioned API with comprehensive endpoints for all resources
- **Role-Based Access Control**: Fine-grained permissions system
- **Drizzle ORM**: Type-safe SQL query builder with database adapter pattern
- **Multi-Database Support**: SQLite (default), MySQL, and PostgreSQL support
- **Zod Validation**: Runtime type checking and validation
- **TanStack Query**: Data fetching and caching
- **TanStack Table**: Headless UI for building powerful tables
- **Clean Architecture**: Separation of concerns with domain-driven design
- **Automated Git Workflow**: Streamlined version control with GitHub integration
- **Comprehensive Documentation**: Detailed guides and code documentation

## Project Structure

The project follows a Clean Architecture approach with the following structure:

```
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Protected dashboard routes
│   ├── admin/              # Admin management routes
│   ├── api/                # API routes
│   │   └── v1/             # Versioned API endpoints
│   └── page.tsx            # Homepage
├── core/                   # Core business logic (framework agnostic)
│   ├── domain/             # Domain entities and business rules
│   │   ├── entities/       # Domain entities (User, Role, Permission, etc.)
│   │   └── repositories/   # Repository interfaces
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
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/cyrkakou/saas.git
   cd saas
   ```
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

### Git Setup and Automation

The project includes a comprehensive Git automation system that handles version control, GitHub issues, and project management.

#### Initial Setup

If you're starting from scratch:

```bash
# Initialize Git and set up the repository
./git-init.bat
```

This will:
- Initialize the Git repository
- Configure the remote repository
- Create standard labels in GitHub
- Set up the project structure

#### Automated Git Operations

The project includes several scripts to automate Git operations:

```bash
# Commit changes with a message
./git-commit.bat "Your commit message"

# Commit changes with a message and link to an issue
./git-commit.bat "Your commit message" 123

# Start working on an issue (creates branch and updates status)
./git-work.bat 123

# Complete an issue (commits, creates PR, closes issue)
./git-complete.bat 123 "Implementation details"
```

#### Configuration

All automation settings are stored in `git/config.json`. You can customize the behavior by editing this file:

```json
{
  "automation": {
    "issues": {
      "updateStatus": true,
      "addComments": true,
      "addLabels": true,
      "linkPullRequests": true
    },
    "git": {
      "autoCommit": true,
      "autoPush": true,
      "createBranchForIssue": true,
      "addIssueReferenceToCommit": true
    }
  }
}
```

Set any option to `false` to disable that specific automation feature.

#### GitHub Integration

The automation system integrates with GitHub to:
- Automatically update issue status based on commits
- Add comments to issues with progress updates
- Add labels to issues to indicate their status
- Link pull requests to issues
- Update milestone progress
- Create branches for issues

For full functionality, set your GitHub token as an environment variable:

```bash
# In .env file
GITHUB_TOKEN=your_github_token
```

## Database Strategy Pattern

The project uses a database adapter pattern to support multiple database engines:

- SQLite (default for development)
- MySQL (optional)
- PostgreSQL (optional)

This allows for easy switching between database engines without changing the application code.

### Configuring the Database

The database provider is configured through environment variables in the `.env` or `.env.local` file:

```bash
# Database Configuration
# Options: sqlite, mysql, postgres
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./sqlite.db

# MySQL/PostgreSQL Configuration (when using those providers)
# DATABASE_HOST=localhost
# DATABASE_PORT=3306  # 3306 for MySQL, 5432 for PostgreSQL
# DATABASE_USERNAME=root
# DATABASE_PASSWORD=password
# DATABASE_NAME=saas
# DATABASE_SSL=false
```

### Database Commands

```bash
# Generate database schema
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

# Initialize admin tables (roles, permissions, etc.)
npm run db:migrate-admin
```

### Database Structure

The database implementation follows the repository pattern:

1. **Domain Interfaces**: Core repository interfaces in `core/domain/repositories`
2. **Adapters**: Database provider adapters in `infrastructure/database/providers`
3. **Schemas**: Database schemas for each provider in `infrastructure/database/schemas`
4. **Repositories**: Concrete repository implementations in `infrastructure/database/repositories`

## Authentication

The authentication system includes:

- User registration and login
- JWT-based authentication
- Protected routes
- Role-based access control with fine-grained permissions
- Organization-based access control

## Admin Management System

The admin management system provides a comprehensive interface for managing all aspects of the application:

- **User Management**: Create, update, and delete users
- **Role Management**: Define roles with specific permissions
- **Permission Management**: Create and assign granular permissions
- **Organization Management**: Manage organizations and their members
- **Report Management**: Create and view reports with various filters
- **Settings Management**: Configure application settings

## API Structure

The API follows RESTful principles with versioning to ensure backward compatibility:

```
/api/v{version}/{resource}/{id?}/{sub-resource?}
```

### Core Resources

- `/api/v1/users` - User management
- `/api/v1/roles` - Role management
- `/api/v1/permissions` - Permission management
- `/api/v1/organizations` - Organization management
- `/api/v1/reports` - Report management
- `/api/v1/settings` - Settings management
- `/api/v1/subscriptions` - Subscription management

### Nested Resources

- `/api/v1/roles/{id}/permissions` - Permissions for a specific role
- `/api/v1/users/{id}/roles` - Roles for a specific user
- `/api/v1/organizations/{id}/users` - Users in a specific organization
- `/api/v1/organizations/{id}/reports` - Reports for a specific organization
- `/api/v1/users/{id}/reports` - Reports created by a specific user

### Query Parameters

- `limit` and `offset` - For pagination
- `sort` and `order` - For sorting results
- Resource-specific filters (e.g., `type`, `status`)

All API endpoints use standard HTTP methods (GET, POST, PUT, DELETE) and return appropriate status codes.

## Development Roadmap

See [tasks.md](./tasks.md) for the detailed development roadmap.

## Project Maintenance and Best Practices

### Code Organization

1. **Follow Clean Architecture Principles**
   - Keep domain logic independent of frameworks
   - Maintain clear separation between layers
   - Use dependency injection for external dependencies

2. **Component Structure**
   - Place UI components in the appropriate folders:
     - `presentation/components/ui`: Reusable UI primitives
     - `presentation/components/auth`: Authentication components
     - `presentation/components/dashboard`: Dashboard components
     - `presentation/components/landing`: Landing page components
     - `presentation/components/shared`: Shared components

3. **State Management**
   - Use React Context for global state
   - Leverage TanStack Query for server state
   - Keep component state local when possible

### Development Workflow

1. **Feature Development Process**
   - Create a GitHub issue for the feature
   - Use `git-work.bat <issue-number>` to start working
   - Implement the feature with tests
   - Use `git-complete.bat <issue-number> "Implementation details"` when done

2. **Code Quality**
   - Write tests for all new features
   - Follow the established code style
   - Use TypeScript for type safety
   - Document complex logic and public APIs

3. **Database Changes**
   - Update schemas for all supported database types
   - Run migrations with `npm run db:push`
   - Test with different database providers

### Deployment

1. **Environment Setup**
   - Configure environment variables for each environment
   - Use different database configurations for dev/staging/prod

2. **Deployment Process**
   - Build the application with `npm run build`
   - Test the production build locally
   - Deploy to the hosting platform

## Contributing

Contributions are welcome! Please follow these steps:

1. Create an issue describing the feature or bug
2. Fork the repository
3. Create a branch for your feature
4. Make your changes
5. Submit a pull request

## License

MIT
