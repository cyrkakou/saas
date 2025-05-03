#!/bin/bash
# Script to set up NextJS project

# Create Next.js project
npx create-next-app@latest . --typescript --eslint --tailwind --app

# Install additional dependencies
npm install drizzle-orm @tanstack/react-query @tanstack/react-table zod
npm install -D drizzle-kit better-sqlite3 @types/better-sqlite3

# Create basic folder structure according to architecture.md
mkdir -p app/api
mkdir -p core/domain/entities
mkdir -p core/domain/repositories
mkdir -p core/domain/services
mkdir -p core/domain/value-objects
mkdir -p core/domain/errors
mkdir -p core/use-cases/user
mkdir -p core/use-cases/subscription
mkdir -p core/interfaces/storage
mkdir -p core/interfaces/payment
mkdir -p core/interfaces/email
mkdir -p infrastructure/database/drizzle
mkdir -p infrastructure/database/repositories
mkdir -p infrastructure/payment
mkdir -p infrastructure/email
mkdir -p infrastructure/storage
mkdir -p presentation/components/ui
mkdir -p presentation/components/auth
mkdir -p presentation/components/dashboard
mkdir -p presentation/components/layouts
mkdir -p presentation/components/shared
mkdir -p presentation/hooks
mkdir -p presentation/providers
mkdir -p presentation/utils
mkdir -p lib/api
mkdir -p lib/config
mkdir -p lib/utils
mkdir -p lib/validation
mkdir -p types
mkdir -p tests/e2e
mkdir -p tests/integration
mkdir -p tests/unit/core
mkdir -p tests/unit/infrastructure
mkdir -p tests/unit/presentation

echo "Setup completed successfully!"
