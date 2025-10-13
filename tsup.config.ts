import { defineConfig } from "tsup";

export default defineConfig({
	// We bundle from the compiled JS to preserve tsconfig paths resolution via tsc + tsc-alias
	entry: ["dist/server.js"],
	outDir: "dist-prod",
	platform: "node", // wokrs with bun , does not support officialy
	target: "node22", // works with bun
	format: ["esm"], // Using ESM format
	sourcemap: true,
	minify: true,
	treeshake: true,
	clean: true,
	splitting: false,
	dts: false,
	// Use .mjs extension for ESM modules
	outExtension: () => ({ js: ".mjs" }),
	env: {
		NODE_ENV: "prod",
	},
	// Keep all node externals bundled except dynamic/optional ones; tsup handles this well for server apps
	external: [],
	noExternal: [
		// Add any packages that should be bundled
	],
	banner: {
		js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
	},
});
