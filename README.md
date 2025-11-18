<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A NestJS application built with <strong>Domain-Driven Design (DDD)</strong> and <strong>Hexagonal Architecture</strong> principles, implementing <strong>CQRS</strong> pattern for scalable and maintainable server-side applications.</p>

## 🏗️ Architecture Overview

This project follows **Hexagonal Architecture** (also known as Ports & Adapters) combined with **Domain-Driven Design (DDD)** principles, ensuring a clean separation of concerns and framework-agnostic domain logic.

### Architecture Layers

The application is organized into four main layers:

#### 1. **Domain Layer** (`domain/`)

The core business logic, completely framework-agnostic and independent of external dependencies.

- **Entities**: Rich domain models with business behavior and invariants
- **Value Objects**: Immutable objects with branded types (`Brand<K, T>`) for compile-time type safety
- **Domain Events**: Events representing important business occurrences
- **Factories**: Encapsulate complex object creation logic
- **Contracts/Repositories**: Interfaces (ports) defining data access contracts
- **Read Models**: Projections optimized for querying (CQRS read side)

#### 2. **Application Layer** (`application/`)

Orchestrates domain objects to perform application tasks, implementing use cases.

- **Commands**: Write operations (CQRS command side)
- **Queries**: Read operations (CQRS query side)
- **Command/Query Handlers**: Business logic orchestration
- **Event Handlers**: React to domain events (event-driven architecture)
- **Application Services**: Facade coordinating use cases

#### 3. **Infrastructure Layer** (`infrastructure/`)

Technical implementations (adapters) of domain contracts.

- **Database Adapters**:
  - Kysely (PostgreSQL) for write model
  - Mongoose (MongoDB) for read model
- **Repository Implementations**: Concrete implementations of domain repository interfaces
- **Logging**: Pino-based structured logging
- **Configuration**: Environment-based configuration management
- **Database Migrations**: Type-safe Kysely migrations

#### 4. **Presentation Layer** (`presentation/`)

External interfaces exposing application functionality.

- **HTTP Controllers**: REST API endpoints
- **DTOs**: Data Transfer Objects with validation
- **Exception Filters**: Error handling and transformation

## 📁 Project Structure

```
src/
├── alarms/                          # Feature module (Bounded Context)
│   ├── domain/                      # Domain layer (framework-agnostic)
│   │   ├── contracts/               # Repository interfaces (ports)
│   │   │   └── repositories/
│   │   ├── entities/                # Domain entities
│   │   │   ├── alarm.entity.ts
│   │   │   └── alarm-entry.entity.ts
│   │   ├── events/                  # Domain events
│   │   │   └── alarm-created.event.ts
│   │   ├── factories/               # Entity factories
│   │   ├── read-models/             # Query projections (CQRS)
│   │   └── value-objects/           # Value objects with branded types
│   │       ├── alarm-id.vo.ts
│   │       ├── alarm-name.vo.ts
│   │       └── alarm-severity.vo.ts
│   ├── application/                 # Application layer
│   │   ├── commands/                # CQRS commands
│   │   │   ├── create-alarm.command.ts
│   │   │   └── create-alarm.command-handler.ts
│   │   ├── queries/                 # CQRS queries
│   │   │   ├── get-alarms.query.ts
│   │   │   └── get-alarms.query-handler.ts
│   │   ├── event-handlers/          # Domain event handlers
│   │   │   └── alarm-created.event-handler.ts
│   │   ├── errors/                  # Application-specific errors
│   │   └── alarms.service.ts        # Application service (facade)
│   ├── infrastructure/              # Infrastructure layer (adapters)
│   │   ├── database/
│   │   │   ├── kysely/              # PostgreSQL adapter (write model)
│   │   │   │   ├── alarms/
│   │   │   │   │   ├── alarm.repository.ts
│   │   │   │   │   ├── alarm.mapper.ts
│   │   │   │   │   └── alarm.table.ts
│   │   │   │   └── migrations/
│   │   │   └── mongoose/            # MongoDB adapter (read model)
│   │   │       └── alarms/
│   │   │           ├── alarm-view.repository.ts
│   │   │           └── alarm-view.schema.ts
│   │   └── ioc/                     # Dependency injection tokens
│   ├── presentation/                # Presentation layer
│   │   └── http/
│   │       ├── controllers/
│   │       │   └── alarms.controller.ts
│   │       └── dto/
│   │           ├── create-alarm.dto.ts
│   │           └── get-alarms.dto.ts
│   └── test/                        # Feature-specific tests
│       ├── e2e/                     # End-to-end tests
│       ├── fixtures/                # Test data builders
│       └── mocks/                   # Test doubles
├── shared/                          # Shared kernel
│   ├── domain/                      # Shared domain primitives
│   │   ├── base/
│   │   │   ├── entity.base.ts
│   │   │   ├── value-object.base.ts
│   │   │   └── unique-identifier.base.ts
│   │   ├── contracts/               # Shared contracts
│   │   └── errors/                  # Domain error types
│   ├── application/                 # Shared application layer
│   │   └── contracts/
│   │       └── logger.contract.ts
│   ├── infrastructure/              # Shared infrastructure
│   │   ├── adapters/                # External service adapters
│   │   ├── database/
│   │   │   ├── kysely/              # Kysely configuration
│   │   │   └── mongoose/            # Mongoose configuration
│   │   ├── logger/                  # Pino logger implementation
│   │   └── scripts/                 # Database migration scripts
│   ├── lib/                         # Utility functions
│   │   ├── types/
│   │   │   └── brand.ts             # Brand<K, T> type definition
│   │   └── type-validations.ts
│   └── configuration/               # Configuration module
└── app.module.ts
```

## 🎯 Key DDD Concepts

### Value Objects with Branded Types

Value objects use TypeScript's branded types pattern for compile-time type safety:

```typescript
// Brand type definition
export type Brand<T, B extends string> = T & { __brand: B };

// Value object implementation
type AlarmNameBrand = Brand<string, 'AlarmName'>;

export class AlarmName extends ValueObject<AlarmNameBrand> {
  private constructor(value: AlarmNameBrand) {
    super(value);
  }

  static from(value: string): AlarmName {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Alarm name cannot be empty');
    }
    return new AlarmName(value as AlarmNameBrand);
  }
}
```

This ensures that `AlarmName` cannot be accidentally mixed with other string-based value objects at compile time.

### Entities

Entities are objects with identity and lifecycle, containing business logic:

```typescript
export class Alarm extends Entity<AlarmPrimitives> {
  // Factory method for creating new instances
  static create(props: AlarmProps): Alarm { ... }

  // Hydration from persistence
  static hydrate(primitives: AlarmPrimitives): Alarm { ... }

  // Domain behavior
  acknowledge(): void {
    this.isAcknowledged = true;
  }

  addAlarmEntry(entry: AlarmEntry): void {
    this.entries.push(entry);
  }
}
```

### Domain Events

Events represent important business occurrences:

```typescript
export class AlarmCreatedEvent {
  constructor(public readonly alarm: Alarm) {}
}
```

### CQRS Pattern

Commands (write) and Queries (read) are separated:

**Command Side:**

```typescript
@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler implements ICommandHandler<CreateAlarmCommand> {
  async execute(command: CreateAlarmCommand): Promise<Alarm> {
    // Business logic
    // Persist to write database (PostgreSQL via Kysely)
    // Publish domain events
  }
}
```

**Query Side:**

```typescript
@QueryHandler(GetAlarmsQuery)
export class GetAlarmsQueryHandler implements IQueryHandler<GetAlarmsQuery> {
  async execute(query: GetAlarmsQuery): Promise<AlarmReadModel[]> {
    // Read from optimized read database (MongoDB via Mongoose)
  }
}
```

## 🛠️ Technology Stack

### Core Framework

- **NestJS** - Progressive Node.js framework with dependency injection
- **TypeScript** - Type-safe JavaScript with advanced type features
- **CQRS Module** (`@nestjs/cqrs`) - Command Query Responsibility Segregation

### Database & Persistence

- **Kysely** - Type-safe SQL query builder for PostgreSQL (write model)
- **Mongoose** - MongoDB ODM for read model and projections
- **PostgreSQL** - Relational database for write model
- **MongoDB** - Document database for read model
- **@nestjs-cls/transactional** - Transaction management with CLS

### Validation & Transformation

- **class-validator** - Decorator-based validation
- **class-transformer** - Object transformation
- **Zod** - TypeScript-first schema validation

### Testing

- **Vitest** - Fast unit test framework with native ESM support
- **Supertest** - HTTP assertion library for E2E tests
- **Testcontainers** - Docker-based integration testing
- **@faker-js/faker** - Test data generation

### Development Tools

- **SWC** - Fast TypeScript/JavaScript compiler
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Pino** - High-performance JSON logger
- **Docker Compose** - Local development environment

### Build & Runtime

- **pnpm** - Fast, disk space efficient package manager
- **ts-node** - TypeScript execution for scripts
- **dotenv** - Environment variable management

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker and Docker Compose

### Installation

```bash
# Install dependencies
pnpm install

# Start infrastructure (PostgreSQL, MongoDB)
pnpm run docker:up
```

### Database Setup

```bash
# Run migrations
pnpm run db:migration

# Generate new migration
pnpm run db:migration:generate
```

### Environment Configuration

Create a `.env` file based on your environment needs (see shared/configuration for available options).

## 🏃 Running the Application

```bash
# Development mode with watch
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

## 🧪 Testing

The project follows a comprehensive testing strategy:

### Test Types

- **Unit Tests**: Colocated with source files (`.spec.ts`)
- **E2E Tests**: Located in `test/e2e/` directories
- **Integration Tests**: Testing infrastructure adapters

### Running Tests

```bash
# Run all tests (unit + integration + subsystem)
pnpm run test

# Unit tests only
pnpm run test:unit

# Unit tests in watch mode
pnpm run test:unit:watch

# E2E tests
pnpm run test:e2e

# E2E tests in watch mode
pnpm run test:e2e:watch

# Test coverage
pnpm run test:cov

# Test UI (Vitest UI)
pnpm run test:ui
```

### Test Structure

Tests follow the **Given-When-Then** pattern:

```typescript
describe('AlarmId', () => {
  describe('create', () => {
    it('should create a new AlarmId', () => {
      // Given
      const id = 'valid-id-string';

      // When
      const alarmId = AlarmId.create();

      // Then
      expect(alarmId).toBeDefined();
      expect(alarmId.value).toBeTruthy();
    });
  });
});
```

## 📐 Architecture Principles

### Hexagonal Architecture (Ports & Adapters)

- **Ports**: Interfaces defined in the domain (e.g., `AlarmRepository`)
- **Adapters**: Implementations in infrastructure (e.g., `KyselyAlarmRepository`, `MongooseAlarmViewRepository`)
- **Dependency Rule**: Dependencies point inward (infrastructure → application → domain)

### Domain-Driven Design

- **Bounded Contexts**: Features are organized as modules (e.g., `alarms/`)
- **Ubiquitous Language**: Domain concepts reflected in code
- **Aggregates**: Entities with clear boundaries and invariants
- **Value Objects**: Immutable, self-validating domain primitives
- **Domain Events**: First-class citizens for business events

### CQRS (Command Query Responsibility Segregation)

- **Write Model**: PostgreSQL with Kysely for consistency and transactions
- **Read Model**: MongoDB with Mongoose for optimized queries
- **Event Handlers**: Synchronize read model when domain events occur

### Framework-Agnostic Domain

- Domain layer has **zero dependencies** on NestJS or any framework
- Pure TypeScript classes with business logic
- Infrastructure adapters bridge domain and framework

## 🎨 Code Conventions

### File Naming

- Use **dash-case** for files: `alarm-name.vo.ts`
- Include type suffix: `.entity.ts`, `.vo.ts`, `.spec.ts`

### Import Strategy

- Use **absolute imports** with `@/` prefix
- Never use relative imports (`./`, `../`)

```typescript
// ✅ Good
import { AlarmId } from '@/alarms/domain/value-objects/alarm-id.vo';

// ❌ Bad
import { AlarmId } from '../value-objects/alarm-id.vo';
```

### Class Structure

- One class per file
- Static factory method `create()` for new instances
- Static method `hydrate()` for persistence reconstruction
- Private constructors to enforce factory pattern

## 🗄️ Database Strategy

### Write Model (PostgreSQL + Kysely)

- Normalized relational schema
- Type-safe queries with Kysely query builder
- ACID transactions for consistency
- Type-safe migrations

### Read Model (MongoDB + Mongoose)

- Denormalized documents for query performance
- Event handlers update projections
- Optimized for read-heavy operations

## 📝 Development Workflow

```bash
# Format code
pnpm run format

# Lint code
pnpm run lint

# Stop infrastructure
pnpm run docker:down
```

## 🔍 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Kysely Documentation](https://kysely.dev)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)

## 📄 License

This project is [UNLICENSED](LICENSE).
