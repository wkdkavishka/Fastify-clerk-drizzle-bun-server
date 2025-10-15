import { drizzle } from "drizzle-orm/postgres-js";
import { DEV, ENV } from "./env.config.js";

const dbUrl = `postgres://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`;

// Create Postgres client
const db = drizzle({
	connection: {
		url: dbUrl,
		ssl: !DEV,
		max: 10, // max 10 connections in the pool // num of cores * 2 , in the vps server // recomended
		idle_timeout: 10000, // release idle connections after 10s
	},
});

export default db;
