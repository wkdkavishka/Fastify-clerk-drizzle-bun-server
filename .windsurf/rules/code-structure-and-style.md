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

- **src/**
  - **configs/** - Configuration files
    - [clerk.config.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/configs/clerk.config.ts:0:0-0:0) - Clerk authentication configuration
    - [db.config.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/configs/db.config.ts:0:0-0:0) - Database configuration
    - [env.config.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/configs/env.config.ts:0:0-0:0) - Environment variables
    - [error.config.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/configs/error.config.ts:0:0-0:0) - Error handling configuration
    - [log.config.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/configs/log.config.ts:0:0-0:0) - Logging configuration
  
  - **controllers/** - Request handlers
    - [login.controller.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/controllers/login.controller.ts:0:0-0:0) - Login route handlers
  
  - **core/** - Core application logic (currently empty)
  
  - **features/** - Feature modules (currently empty)
  
  - **middlewares/** - Custom middlewares
    - [clerk.middleware.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/middlewares/clerk.middleware.ts:0:0-0:0) - Clerk authentication middleware
  
  - **repositories/** - Database repositories (currently empty)
  
  - **routes/** - Route definitions
    - [login.routes.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/routes/login.routes.ts:0:0-0:0) - Login route definitions
    - **preHandlers/** - Route pre-handlers
      - [login.preHandler.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/routes/preHandlers/login.preHandler.ts:0:0-0:0) - Login route pre-handler
    - **schemas/** - Request/response schemas
      - [login.schema.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/routes/schemas/login.schema.ts:0:0-0:0) - Login request/response schemas
  
  - **services/** - Business logic
    - [login.service.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/services/login.service.ts:0:0-0:0) - Login service
  
  - **temp/** - Temporary files (should be gitignored)
    - [de-login.schemas.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/temp/de-login.schemas.ts:0:0-0:0) - Temporary schema definitions
    - [dev-login.routes.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/temp/dev-login.routes.ts:0:0-0:0) - Temporary route definitions
  
  - **types/** - Custom type definitions
    - [fastify.d.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/types/fastify.d.ts:0:0-0:0) - Fastify type extensions
  
  - [server.ts](cci:7://file:///mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server/src/server.ts:0:0-0:0) - Application entry point

