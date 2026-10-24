import { defineConfig } from "vitest/config";

// Plain Node Vitest. @cloudflare/vitest-pool-workers 0.23.0 peers on vitest ^4.1.0 and does not
// support Vitest 5 yet, so in-runtime integration tests (Durable Object seq increments) are
// deferred to M05; only pure helpers (router.ts) are unit-tested here.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});
