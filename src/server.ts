import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySensible from '@fastify/sensible';
import type { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import ENV from './configs/env.config.js';

// Initialize Fastify with JSON Schema type provider
const server: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<JsonSchemaToTsProvider>();

// Register pluginsc
async function registerPlugins() {
  // Security headers
  await server.register(fastifyHelmet);

  // CORS
  const origin = ENV.NODE_ENV === 'prod' 
    ? `http://${ENV.HOST}:${ENV.PORT}`
    : `http://${ENV.HOST}:${ENV.PORT}`;

  await server.register(fastifyCors, {
    origin: [origin],
    credentials: true,
  });
  
  console.log(`CORS enabled for: ${origin}`);

  // Rate limiting
  await server.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Sensible defaults for Fastify
  await server.register(fastifySensible);
}

// Health check endpoint
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

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
