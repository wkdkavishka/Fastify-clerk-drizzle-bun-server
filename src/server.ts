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
import LoginRoute from './routes/login.route.js';

// check database connection
await db
  .execute('select 1')
  .then(() => {
    console.log('🚀 Database connection established successfully (using postgres-js).');
  })
  .catch((err: Error) => {
    console.error('❌ Failed to connect to the database:', err.message);
    process.exit(1);
  });

// Initialize Fastify with JSON Schema type provider and AJV configuration
const server: FastifyInstance = Fastify({
  logger: true,
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
  console.log(`CORS enabled for: ${origin}`);

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
      tags: [
        { name: 'health', description: 'Health check endpoints' },
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

  // Register routes
  await server.register(LoginRoute, { prefix: '/login' });
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
    await registerPlugins();

    const port: number = ENV.PORT;
    const host: string = ENV.HOST;

    await server.listen({ port, host });
    console.log(`Server is running on http://${host}:${port}`);
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
