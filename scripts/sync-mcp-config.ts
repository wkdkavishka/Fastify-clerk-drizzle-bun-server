import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// get the mcp config in
const mcpConfigFilePath = resolve(
	"/home/wkdkavishka/.codeium/windsurf/mcp_config.json",
);

// check if file path exists
if (!existsSync(mcpConfigFilePath)) {
	console.log("MCP config file does not exist");
	process.exit(1);
}

// read the mcp config file
const mcpConfig = JSON.parse(readFileSync(mcpConfigFilePath, "utf-8"));

// update the mcp config file
//* add or update postgres server
mcpConfig.mcpServers.postgresql = {
	command: "npx",
	args: [
		"-y",
		"@modelcontextprotocol/server-postgres",
		`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
	],
	env: {
		DB_USER: process.env.DB_USER,
		DB_PASSWORD: process.env.DB_PASSWORD,
		DB_HOST: process.env.DB_HOST,
		DB_PORT: process.env.DB_PORT,
		DB_NAME: process.env.DB_NAME,
	},
	disabled: false,
};
//* add or update filesystem server
mcpConfig.mcpServers.filesystem = {
	command: "npx",
	args: [
		"-y",
		"@modelcontextprotocol/server-filesystem",
		"/mnt/Storage/Projects/Samples/Fastify-clerk-drizzle-bun-server",
	],
	env: {},
	disabled: false,
};

// write the mcp config file
writeFileSync(mcpConfigFilePath, JSON.stringify(mcpConfig, null, 2));

// check if the mcp config file is updated
if (existsSync(mcpConfigFilePath)) {
	console.log("MCP config file updated successfully");
	// log created file path
	console.log("MCP config file path: ", mcpConfigFilePath);
} else {
	console.log("MCP config file update failed");
	process.exit(1);
}
