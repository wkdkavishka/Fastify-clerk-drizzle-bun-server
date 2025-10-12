import { clerkPlugin } from '@clerk/fastify';
import cookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySensible from '@fastify/sensible';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import Fastify, { FastifyInstance } from 'fastify';
import db from './configs/db.config.js';
import { ENV } from './configs/env.config.js';
import loggerConfig, { logger } from './configs/log.config.js';
import { clerkMiddleware } from './middlewares/clerk.middleware.js';
import loginRoutes from './routes/login.routes.js';
import { devLoginRoute } from './temp/test-login.js';

// Initialize Fastify with JSON Schema type provider and AJV configuration
const server: FastifyInstance = Fastify({
  logger: loggerConfig,
  ajv: {
    customOptions: {
      allErrors: true,
      strict: false,
    },
    plugins: [
      function (ajv: any) {
        const ajvErrors = require('ajv-errors');
        return ajvErrors(ajv, { singleError: true });
      },
    ],
  },
}).withTypeProvider<JsonSchemaToTsProvider>();

// check database connection
async function checkDatabaseConnection() {
  await db
    .execute('select 1')
    .then(() => {
      logger.info('🚀 Database connection established successfully (using postgres-js).');
    })
    .catch(err => {
      logger.error('❌ Failed to connect to the database:', err.message);
      process.exit(1);
    });
}

// Register plugins
async function registerPlugins() {
  // Security headers
  await server.register(fastifyHelmet);

  // CORS
  const origin = `http://${ENV.HOST}:${ENV.PORT}`;
  await server.register(fastifyCors, {
    origin: [origin],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
  });
  server.log.info(`CORS enabled for: ${origin}`);

  // Swagger documentation
  await server.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Fastify Clerk Drizzle API',
        description: 'API documentation for Fastify Clerk Drizzle Server',
        version: '1.0.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: `${ENV.HOST}:${ENV.PORT}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter JWT Bearer token in the format: Bearer <token>',
        },
      },
      security: [
        {
          Bearer: [],
        },
      ],
      tags: [
        { name: 'health', description: 'Health check endpoints' },
        { name: 'auth', description: 'Authentication endpoints' },
        // Add more tags as you add more routes
      ],
    },
  });

  // Swagger UI
  await server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (_request, _reply, next) {
        next();
      },
      preHandler: function (_request, _reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: header => header,
    transformSpecification: swaggerObject => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  // Rate limiting
  await server.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Sensible defaults for Fastify
  await server.register(fastifySensible);

  // Register cookie
  await server.register(cookie, {
    // A secret is required to sign/unsign cookies for security
    secret: ENV.CLERK_COOKIE_SECRET,
    // You can optionally configure auto-parsing options here
  });

  // Register Clerk
  await server.register(clerkPlugin);
}

// register hooks
function registerHooks() {
  //* Clerk middleware for all routes except /docs
  if (ENV.BUN_ENV === 'dev') {
    // only for dev environment
    server.addHook('preHandler', async (request, reply) => {
      // Skip middleware for /docs route
      const routeList = ['/docs', '/dev/dev-login'];
      if (routeList.includes(request.url)) {
        return;
      }
      return clerkMiddleware(request, reply);
    });
  }
}

// routes
async function registerRoutes() {
  //! tood: remove this after testing
  await server.register(devLoginRoute, { prefix: '/dev' });
  await server.register(loginRoutes, { prefix: '/login' });
}

// Health check endpoint
server.get(
  '/health',
  {
    schema: {
      tags: ['health'],
      description: 'Health check endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
);

// Start the server
const start = async () => {
  try {
    // Check database connection
    await checkDatabaseConnection();
    // Register plugins
    await registerPlugins();
    // Register hooks
    registerHooks();
    // Register routes
    await registerRoutes();

    const port: number = ENV.PORT;
    const host: string = ENV.HOST;

    await server.listen({ port, host });
    server.log.info({ url: `http://${host}:${port}` }, 'Server is running');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, async () => {
    await server.close();
    process.exit(0);
  });
});

// Start the application
start();
