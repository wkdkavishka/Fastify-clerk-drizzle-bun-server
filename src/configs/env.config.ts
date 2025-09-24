import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
// in dev mode
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['dev', 'prod', 'test']),
  PORT: z.coerce.number(),
  HOST: z.string(),
});

// Validate environment variables against the schema
export const ENV = (() => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.issues.forEach(issue => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
})();

// Export the type for TypeScript
export type Env = z.infer<typeof envSchema>;

export default ENV;
