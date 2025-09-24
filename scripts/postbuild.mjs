import dotenv from 'dotenv';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Running post-build tasks...');

// Ensure the dist-prod directory exists
const distProdDir = join(__dirname, '../dist-prod');
if (!existsSync(distProdDir)) {
  mkdirSync(distProdDir, { recursive: true });
}

// Import package.json
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const { devDependencies, scripts, ...prodPackage } = packageJson;

// Add production-specific settings
prodPackage.scripts = {
  start: 'node server.mjs',
  'start:prod': 'node server.mjs',
};

// Clean up devDependencies and other unnecessary fields
delete prodPackage.devDependencies;

// Write production package.json
writeFileSync(join(distProdDir, 'package.json'), JSON.stringify(prodPackage, null, 2));

// Handle environment variables
const envPath = join(__dirname, '../.env');
const envDistPath = join(distProdDir, '.env');

// Load environment variables from .env file if it exists
if (existsSync(envPath)) {
  // Copy the .env file to dist-prod
  copyFileSync(envPath, envDistPath);

  // Load the environment variables for the current process
  const envConfig = dotenv.parse(readFileSync(envPath));
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
}

// Ensure required environment variables are set
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'prod';
if (!process.env.PORT) process.env.PORT = '3000';
if (!process.env.HOST) process.env.HOST = '0.0.0.0';
