# RocketCast

Team-branded YouTube streaming with live score overlays and season-long stats for travel sports clubs. Published by RocketCore.

Read `CLAUDE.md`, then `docs/SPEC.md` and `docs/DECISIONS.md`. Work is organized in `docs/milestones/`.

## Prerequisites

- Node 26 (`.nvmrc`), pnpm 10 (`corepack enable` or `npm i -g pnpm`)
- For mobile: Xcode (iOS) and Android Studio (Android). The app uses an Expo **dev client**, not Expo Go.
- For realtime: a Cloudflare account for `wrangler dev` login (local dev works without one).

## Commands

```bash
pnpm install
pnpm lint && pnpm typecheck && pnpm test   # must pass at root before every commit
pnpm --filter @rocketcast/web dev          # http://localhost:3000
pnpm --filter @rocketcast/realtime dev     # wrangler dev, http://localhost:8787
pnpm --filter @rocketcast/mobile start     # Expo dev client (see apps/mobile/README.md)
pnpm db:generate && pnpm db:migrate        # Drizzle, needs DATABASE_URL
```

## Layout

```
apps/web            Next.js (admin, branding, sponsors, stats, public pages, API)
apps/mobile         Expo app (scoring, camera)
packages/config     Shared tsconfig/eslint/prettier/tailwind presets + src/brand.ts (the only hard-coded name)
packages/db         Drizzle schema + migrations (Neon Postgres)
packages/scoring-engine  Pure TS volleyball engine (zero deps, no I/O)
packages/overlay    Overlay templates + render function
packages/protocol   Realtime envelope + API contracts (zod)
services/realtime   Cloudflare Worker + Durable Objects
services/ingest     MediaMTX config + auth hook (cloud path)
services/compositor GStreamer pipelines + worker agent (cloud path)
services/controller Session assignment, pre-warm, failover, metering
modules/            Native streaming modules (M02)
tools/              Test harnesses (M14)
docs/               SPEC, DECISIONS, COST_MODEL, milestones
```

## Environment variables

Each app/service has a `.env.example`. Never commit real values.
