import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file immediately upon import.
dotenv.config();

//! add new env heare
// Define the schema for environment variables using Zod.
const envSchema = z.object({
  BUN_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  PORT: z.coerce.number().min(1024),
  HOST: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  CLERK_SECRET_KEY: z.string().nonempty(),
  CLERK_PUBLISHABLE_KEY: z.string().nonempty(),
  CLERK_COOKIE_SECRET: z.string().nonempty(),
});

// Export the type for TypeScript consumers (what the final ENV object looks like).
export type EnvType = z.infer<typeof envSchema>;

class EnvValidator {
  private constructor() {}

  public static validateAndLoad(): EnvType {
    try {
      const validatedEnv = envSchema.parse(process.env);
      console.log('✅ Environment variables validated successfully.');
      return validatedEnv;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('\n❌ Invalid environment variables detected:');
        error.issues.forEach(issue => {
          const variableName = issue.path.join('.');
          console.error(
            `  - [${variableName}] Error: ${issue.message}. ` +
              `Received value: "${process.env[issue.path[0] as keyof NodeJS.ProcessEnv] || 'undefined'}"`
          );
        });
        process.exit(1);
      }
      throw error;
    }
  }
}

export const ENV: EnvType = EnvValidator.validateAndLoad();
