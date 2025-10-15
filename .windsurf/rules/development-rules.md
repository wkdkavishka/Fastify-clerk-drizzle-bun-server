---
trigger: always_on
---

## Code Style Guidelines

### 1. TypeScript

- Use strict mode with `"strict": true` in tsconfig.json
- Prefer interfaces over types for public API definitions
- Use absolute imports with `@/` alias
- Enable `esModuleInterop` and `moduleResolution: "node16"`

### 2. File Naming

- Use chamelCase for variables.
- use Capitalized for env varibles and env.config.ts


### 4. Error Handling

- use logError for try catch blocks error information.


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
- always export type of the 

### 7. Logging

- Use Pino for structured logging
- Include request IDs in logs
- Log important business events

### 8. Database

- Keep database queries in repositories floder
- Use Drizzle's query builder for complex queries
- Implement database migrations
