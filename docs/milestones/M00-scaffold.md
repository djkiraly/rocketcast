# M00 — Monorepo scaffold and CI

**Goal:** an empty-but-wired monorepo where every app/package/service builds, lints, typechecks, and tests in CI.

**Read first:** CLAUDE.md (repo layout, stack), SPEC §5.

## Scope
- pnpm workspaces + Turborepo with the layout in CLAUDE.md.
- Workspace package scope `@rocketcast/*`; Expo app bundle/package ID `com.rocketcore.rocketcast`.
- `packages/config`: shared `tsconfig` (strict), ESLint, Prettier, Tailwind preset, and `src/brand.ts` (product name "RocketCast", publisher "RocketCore") — the only place the name is hard-coded.
- `apps/web`: Next.js App Router + Tailwind + shadcn/ui initialized; a placeholder home page.
- `apps/mobile`: Expo app with dev client config, TypeScript, placeholder screen; builds for iOS simulator and Android emulator.
- `packages/db`: Drizzle configured for Neon (`DATABASE_URL`), empty schema, migration command.
- `packages/scoring-engine`, `packages/overlay`, `packages/protocol`: empty packages with Vitest wired and one passing test each.
- `services/realtime`: Wrangler project with a hello-world Durable Object.
- `services/compositor`, `services/controller`, `services/ingest`: README + Dockerfile placeholders.
- `tools/`: empty with README describing planned harnesses.
- Root scripts: `dev`, `build`, `lint`, `typecheck`, `test`, `db:generate`, `db:migrate`.
- CI (GitHub Actions): install, lint, typecheck, test on push/PR, with Turborepo caching.
- `.env.example` per app/service documenting variables.

## Acceptance criteria
- [ ] Fresh clone → `pnpm install && pnpm lint && pnpm typecheck && pnpm test` passes.
- [ ] `pnpm --filter web dev` serves the placeholder page.
- [ ] Mobile app launches in iOS simulator and Android emulator (document commands).
- [ ] `wrangler dev` runs the hello-world Durable Object.
- [ ] CI passes on the initial commit.

## Out of scope
Any product features, database tables, auth.
