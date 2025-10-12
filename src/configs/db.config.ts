import { drizzle } from 'drizzle-orm/postgres-js';
import { ENV } from './env.config.js';

// Create Postgres client
const db = drizzle({
  connection: {
    url: ENV.DATABASE_URL,
    ssl: ENV.BUN_ENV === 'prod' ? true : false,
    max: 10, // max 10 connections in the pool
    idle_timeout: 10000, // release idle connections after 10s
  },
});

export default db;
