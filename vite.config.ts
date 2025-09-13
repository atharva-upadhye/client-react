import checker from "vite-plugin-checker";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  base: "/client-react",
  build: {
    rollupOptions: {
      // eslint-disable-next-line no-warning-comments
      // TODO: verify if this is working
      treeshake: "recommended",
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    checker({
      typescript: {
        tsconfigPath: "./tsconfig.app.json",
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
