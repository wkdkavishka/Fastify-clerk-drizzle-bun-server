const fs = require('fs');
const path = require('path');

console.log('Running post-build tasks...');

// Ensure the dist directory exists
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy package.json to dist for production
const packageJson = require('../package.json');
const { devDependencies, scripts, ...prodPackage } = packageJson;

// Add production-specific settings
prodPackage.scripts = {
  start: "node server.js"
};

// Write production package.json
fs.writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(prodPackage, null, 2)
);

// Copy .env file if it exists
const envPath = path.join(__dirname, '../.env');
const envDistPath = path.join(distDir, '.env');

if (fs.existsSync(envPath)) {
  fs.copyFileSync(envPath, envDistPath);
  console.log('Copied .env file to dist directory');
}

console.log('Post-build tasks completed!');
