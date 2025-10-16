import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import cron from "node-cron";
import { DEV, ENV } from "./env.config.js";
import { logError } from "./error.config.js";
import { logger } from "./log.config.js";

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

export async function setupVacuumScheduler(): Promise<void> {
	logger.info("cron [VACUUM JOB] Setting up weekly vacuum scheduler...");
	// Runs every Wednesday at 02:00 AM
	cron.schedule("0 2 * * 3", async () => {
		logger.info("cron [VACUUM JOB] Running weekly vacuum...");
		try {
			await db.execute(sql`VACUUM ANALYZE;`);
			logger.info("cron [VACUUM JOB] Completed successfully.");
		} catch (err: unknown) {
			logError("cron [VACUUM JOB] Failed:", err);
		}
	});
}

export default db;
