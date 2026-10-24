# @rocketcast/db

Drizzle ORM schema and migrations for Neon Postgres, plus `createDb(connectionString)` which wraps `drizzle-orm/neon-http`. Tables arrive in M03; game state is always derived from `game_events`, never from a mutable score column (CLAUDE.md).

## Setup

Copy `.env.example` to `.env` and set `DATABASE_URL` to your Neon connection string. `.env` is git-ignored.

## Migrations

Edit `src/schema.ts`, then:

```sh
pnpm db:generate     # drizzle-kit generate -> writes SQL to packages/db/drizzle/ (commit these)
pnpm db:migrate      # drizzle-kit migrate  -> applies pending migrations to DATABASE_URL
pnpm --filter @rocketcast/db db:studio   # browse the database locally
```

The root `db:generate` / `db:migrate` scripts forward to this package. `drizzle-kit` reads `drizzle.config.ts`, which loads `DATABASE_URL` from the environment (use `dotenv` or your shell; drizzle-kit also picks up a local `.env`).

## Usage

```ts
import { createDb } from "@rocketcast/db";
const db = createDb(process.env.DATABASE_URL!);
```
