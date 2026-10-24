import { defineConfig } from "vitest/config";

// Pure TS unit tests only in M00; no React Native rendering (no testing-library yet).
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
