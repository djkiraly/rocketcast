import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export * as schema from "./schema";

/**
 * Create a Drizzle client over Neon's HTTP driver (stateless, serverless-friendly).
 * Pass `process.env.DATABASE_URL`; this module never reads the environment itself.
 */
export function createDb(connectionString: string) {
  return drizzle(neon(connectionString), { schema });
}

export type Db = ReturnType<typeof createDb>;
