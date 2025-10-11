import pino, { type Logger } from 'pino';

// Logger configuration
const loggerConfig = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss.l',
      ignore: 'pid,hostname',
    },
  },
} as const;

// Create a typed logger instance
export const logger: Logger = pino(loggerConfig);

export default loggerConfig;
