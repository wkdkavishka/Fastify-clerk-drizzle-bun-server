import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Running post-build tasks using Bun natives...");

// Paths
const distProdDir = join(__dirname, "../dist-prod");
const packageJsonPath = join(__dirname, "../package.json");
const envPath = join(__dirname, "../.env");
const envDistPath = join(distProdDir, ".env");

// 1️⃣ Ensure dist-prod directory exists
if (!Bun.file(distProdDir).exists()) {
	Bun.mkdir(distProdDir, { recursive: true });
}

// 2️⃣ Read package.json and prepare production version
const packageJsonText = await Bun.file(packageJsonPath).text();
const packageJson = JSON.parse(packageJsonText);

// Add production-specific scripts
packageJson.scripts = {
	start: "bun server.mjs",
	"start:prod": "bun server.mjs",
};

// Remove devDependencies
delete packageJson.devDependencies;

// Write production package.json
Bun.write(
	join(distProdDir, "package.json"),
	JSON.stringify(packageJson, null, 2),
);

// 3️⃣ Handle environment variables
if (Bun.file(envPath).exists()) {
	// Copy .env to dist-prod
	const envContent = await Bun.file(envPath).text();
	await Bun.write(envDistPath, envContent);

	// Load env variables for current process
	const envConfig = dotenv.parse(Bun.file(envPath).text());
	for (const key in envConfig) {
		process.env[key] = envConfig[key];
	}
}

// 4️⃣ Set default environment variables if not already set
process.env.NODE_ENV ||= "prod";
process.env.PORT ||= "3000";
process.env.HOST ||= "0.0.0.0";

console.log("✅ Post-build tasks completed using Bun natives!");
