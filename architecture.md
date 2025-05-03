│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── api/                # API routes
│   │   │   ├── [[...route]]/
│   │   │   └── webhooks/
│   │   └── page.tsx            # Homepage
│   ├── core/                   # Core business logic (framework agnostic)
│   │   ├── domain/             # Domain entities and business rules
│   │   │   ├── entities/       # Business objects
│   │   │   │   ├── user.ts
│   │   │   │   └── subscription.ts
│   │   │   ├── repositories/   # Repository interfaces
│   │   │   │   ├── user-repository.interface.ts
│   │   │   │   └── subscription-repository.interface.ts
│   │   │   ├── services/       # Domain services
│   │   │   │   ├── authentication-service.ts
│   │   │   │   └── billing-service.ts
│   │   │   ├── value-objects/  # Value objects
│   │   │   └── errors/         # Domain-specific errors
│   │   ├── use-cases/          # Application use cases
│   │   │   ├── user/
│   │   │   │   ├── register-user.use-case.ts
│   │   │   │   └── login-user.use-case.ts
│   │   │   └── subscription/
│   │   │       ├── create-subscription.use-case.ts
│   │   │       └── cancel-subscription.use-case.ts
│   │   └── interfaces/         # Ports for external adapters
│   │       ├── storage/
│   │       ├── payment/
│   │       └── email/
│   ├── infrastructure/         # External implementations (adapters)
│   │   ├── database/
│   │   │   ├── prisma/         # Prisma ORM
│   │   │   │   ├── schema.prisma
│   │   │   │   └── migrations/
│   │   │   └── repositories/   # Repository implementations
│   │   │       ├── prisma-user-repository.ts
│   │   │       └── prisma-subscription-repository.ts
│   │   ├── payment/
│   │   │   └── stripe/
│   │   ├── email/
│   │   │   └── sendgrid/
│   │   └── storage/
│   │       └── s3/
│   ├── presentation/           # UI logic
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # UI primitives
│   │   │   │   ├── button.tsx
│   │   │   │   └── input.tsx
│   │   │   ├── auth/           # Auth-related components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── layouts/        # Layout components
│   │   │   └── shared/         # Shared/common components
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── use-auth.ts
│   │   │   └── use-subscription.ts
│   │   ├── providers/          # Context providers
│   │   │   ├── auth-provider.tsx
│   │   │   └── theme-provider.tsx
│   │   └── utils/              # Presentation utilities
│   ├── lib/                    # Shared utilities and config
│   │   ├── api/                # API utilities
│   │   │   ├── api-response.ts
│   │   │   └── middleware.ts
│   │   ├── config/             # Configuration
│   │   ├── utils/              # General utilities
│   │   └── validation/         # Validation schemas (Zod/Yup)
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── scripts/                    # Build/deployment scripts
├── tests/                      # Tests
│   ├── e2e/                    # End-to-end tests
│   ├── integration/            # Integration tests
│   └── unit/                   # Unit tests
│       ├── core/               # Tests for core domain
│       ├── infrastructure/     # Tests for infrastructure
│       └── presentation/       # Tests for presentation