import { defineConfig } from "drizzle-kit";

// `drizzle-kit generate` needs no database; `migrate` and `studio` read DATABASE_URL.
// See .env.example. Never commit a real connection string.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
