import { defineConfig, defaultExclude } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./vitest.setup.ts",
		exclude: [...defaultExclude, "**/e2e/**"],
	},
});
