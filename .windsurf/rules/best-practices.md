---
trigger: always_on
---

## Best Practices

### Fastify Specific

- Use Fastify's dependency injection system
- Leverage Fastify's lifecycle hooks
- Use Fastify plugins for modularity

### Clerk Integration

- Keep authentication logic in dedicated middleware , src/middlewares/clerk.middleware.ts
- Validate Clerk webhook signatures
- Store Clerk user IDs in your database

### Drizzle ORM

- Define database schemas in separate files
- Use migrations for schema changes
- Implement proper transaction handling

## Documentation

- Document API endpoints with Swagger
- Add JSDoc comments to public methods
- Keep README.md up to date

## Performance

- Implement caching where appropriate
- Use connection pooling for database connections
- Optimize database queries