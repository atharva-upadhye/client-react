import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    root: "./src",
    setupFiles: "./vitest.setup.ts",
  },
});
