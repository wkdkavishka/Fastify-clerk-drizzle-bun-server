---
trigger: always_on
---

# Fastify-Clerk-Drizzle Project Structure & Style Guide

## Project Overview

- **Framework**: Fastify with TypeScript
- **Authentication**: Clerk
- **Database**: PostgreSQL with Drizzle ORM
- **Runtime**: Bun
- **Build Tool**: tsup

## Directory Structure

src/ ├── configs/ # Configuration files │ ├── db.config.ts # Database configuration │ └── env.config.ts # Environment variables ├── controllers/ # Request handlers │ └── login.controller.ts ├── middlewares/ # Custom middlewares │ └── clerk.middleware.ts ├── routes/ # Route definitions │ ├── login.routes.ts │ ├── preHandlers/ # Route pre-handlers │ │ └── login.preHandler.ts │ └── schemas/ # Request/response schemas │ └── login.schema.ts ├── services/ # Business logic │ └── login.service.ts ├── types/ # Custom type definitions │ └── fastify.d.ts └── server.ts # Application entry point

## Code Style Guidelines

### 1. TypeScript

- Use strict mode with `"strict": true` in tsconfig.json
- Prefer interfaces over types for public API definitions
- Use absolute imports with `@/` alias
- Enable `esModuleInterop` and `moduleResolution: "node16"`

### 2. File Naming

- Use kebab-case for file names
- Suffix type definition files with [.d.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/types/fastify.d.ts:0:0-0:0)
- Suffix test files with `.test.ts` or `.spec.ts`

### 3. Code Organization

- Keep controller methods static when they don't require instance state
- Use dependency injection for services
- Group related routes in separate files under `routes/`

### 4. Error Handling

- Use Fastify's built-in error handling
- Create custom error classes for business logic errors
- Log errors with appropriate context

### 5. Security

- Use environment variables for sensitive data
- Implement rate limiting
- Use Helmet for security headers
- Enable CORS with specific origins

### 6. API Design

- Use JSON Schema for request/response validation
- Version your API from the start
- Document all endpoints with Swagger/OpenAPI
- Use consistent response formats

### 7. Logging

- Use Pino for structured logging
- Include request IDs in logs
- Log important business events

### 8. Database

- Keep database queries in service layer
- Use Drizzle's query builder for complex queries
- Implement database migrations

### 9. Testing

- Write unit tests for services and utilities
- Write integration tests for API endpoints
- Use a separate test database

## Best Practices

### Fastify Specific

- Use Fastify's dependency injection system
- Leverage Fastify's lifecycle hooks
- Use Fastify plugins for modularity

### Clerk Integration

- Keep authentication logic in dedicated middleware
- Validate Clerk webhook signatures
- Store Clerk user IDs in your database

### Drizzle ORM

- Define database schemas in separate files
- Use migrations for schema changes
- Implement proper transaction handling

## Development Workflow

1. Use `bun run dev` for development
2. Run `bun run format` before committing
3. Run tests before pushing
4. Use semantic commit messages

## Deployment

- Use environment-specific configurations
- Implement health check endpoints
- Set up proper logging and monitoring

## Documentation

- Document API endpoints with Swagger
- Add JSDoc comments to public methods
- Keep README.md up to date

## Performance

- Implement caching where appropriate
- Use connection pooling for database connections
- Optimize database queries
