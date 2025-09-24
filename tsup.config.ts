import { defineConfig } from "tsup";

export default defineConfig({
  // We bundle from the compiled JS to preserve tsconfig paths resolution via tsc + tsc-alias
  entry: ["dist/server.js"],
  outDir: "dist-prod",
  platform: "node",
  target: "node22",
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
    NODE_ENV: "production",
  },
  // Keep all node externals bundled except dynamic/optional ones; tsup handles this well for server apps
  external: ["pg-native"],
  noExternal: [
    // Add any packages that should be bundled
  ],
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
});
