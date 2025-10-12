import { drizzle } from 'drizzle-orm/postgres-js';
import { DEV, ENV } from './env.config.js';

// Create Postgres client
const db = drizzle({
  connection: {
    url: ENV.DATABASE_URL,
    ssl: DEV ? false : true,
    max: 10, // max 10 connections in the pool // num of cores * 2 , in the vps server // recomended
    idle_timeout: 10000, // release idle connections after 10s
  },
});

export default db;
