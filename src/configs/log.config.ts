import pino, { type Logger } from "pino";

// Logger configuration
export const loggerConfig = {
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "HH:MM:ss.l",
			ignore: "pid,hostname",
		},
	},
} as const;

// Create a typed logger instance
export const logger: Logger = pino(loggerConfig);

// ## Error Messages For Try Catch ##
export function logError(message: string, error: unknown): void {
	if (error instanceof Error) {
		logger.error(
			`${message}\n Error.message --> ${error.message}\n Error.cause --> ${error?.cause}`,
		);
	} else {
		logger.error(`${message}\n Error (unknown) --> ${error}`);
	}
}
