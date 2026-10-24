# CLAUDE.md

Operating instructions for Claude Code in this repository. Read this file, then `docs/SPEC.md` and `docs/DECISIONS.md`, before any work.

## What we're building
**RocketCast** (by RocketCore). Use `@rocketcast/*` as the workspace package scope and `com.rocketcore.rocketcast` as the app bundle/package ID. Keep the product name in one constants file (`packages/config/src/brand.ts`) so it can be changed in one place.

A mobile (iOS/Android) + web platform for travel sports clubs to stream games to their own YouTube channels with cloud-composited, team-branded score/stat overlays, sponsor graphics, and season-long stats. Phase 1 sport: volleyball. Full spec: `docs/SPEC.md`.

## Priorities (in order)
1. **Correctness of what viewers see.** Never show the wrong team's overlay or a wrong score. (SPEC §6 invariants I-1..I-6)
2. **Stability.** Streams and scoring survive bad networks, crashes, and long sessions.
3. **Cost per stream-hour.** Pricing is cost + 35% margin; inefficient infrastructure is a product bug.
4. Features.

## How to work
- Work one milestone at a time from `docs/milestones/`. Do not start the next milestone's scope.
- Begin each milestone by writing a short plan in `docs/milestones/NOTES-Mxx.md` (approach, files, risks, open questions). Proceed unless a question blocks a hard-to-reverse decision.
- Small, reviewable commits with conventional messages (`feat(scoring): ...`).
- When you make a decision the spec leaves open, add an ADR to `docs/DECISIONS.md`.
- When you resolve a **[VERIFY]** item, record the finding and source in the milestone notes and update SPEC.md.
- If something in the spec is wrong or impossible, stop and explain; don't silently diverge.
- Finish every milestone with: all acceptance criteria checked, tests green, `NOTES-Mxx.md` updated with what was done, what was deferred, and how to run/verify it.

## Stack (do not substitute without an ADR)
- Monorepo: pnpm workspaces + Turborepo. Node LTS. TypeScript `strict` everywhere.
- Web: Next.js (App Router), Tailwind, shadcn/ui, Auth.js, Drizzle ORM, Neon Postgres.
- Mobile: Expo (dev client, not Expo Go), React Native, expo-sqlite. Native streaming via Expo Modules API: HaishinKit (iOS), RootEncoder (Android).
- Realtime: Cloudflare Workers + Durable Objects.
- Ingest: MediaMTX. Compositor: GStreamer on Linux GPU hosts.
- Validation: zod at every boundary. IDs: ULID.
- Tests: Vitest, fast-check, Playwright, Maestro.

## Repo layout
```
apps/web            Next.js app (admin, branding, sponsors, stats, public pages, API)
apps/mobile         Expo app (scoring, camera)
packages/db         Drizzle schema + migrations
packages/scoring-engine  Pure TS volleyball engine (no deps, no I/O)
packages/overlay    Overlay templates + render function
packages/protocol   Realtime envelope + API contracts (zod)
packages/config     Shared tsconfig/eslint/tailwind presets
services/realtime   Cloudflare Worker + Durable Objects
services/ingest     MediaMTX config + auth hook
services/compositor GStreamer pipelines + worker agent
services/controller Session assignment, pre-warm, failover, metering
modules/streaming-ios, modules/streaming-android   Native publish modules
tools/              Test harnesses (isolation switch test, soak, netem chaos)
docs/               SPEC, DECISIONS, COST_MODEL, milestones
```

## Hard rules
- `packages/scoring-engine` has zero runtime dependencies and no I/O, clocks, or randomness.
- Game state is derived from `game_events` only. Never add a mutable "current score" source of truth.
- Overlay renderers bind to exactly one `sessionId`; never reuse across sessions. Drop messages with mismatched `sessionId` or stale `seq`.
- Assets are content-addressed (`/a/{sha256}.{ext}`). No mutable asset URLs in overlays.
- Client caches/subscriptions are keyed by `teamId` (+ `gameId`) and torn down on team switch.
- No in-app purchase code in the mobile app.
- No secrets in the repo. Use `.env.example` with documented variables. YouTube refresh tokens are encrypted at rest.
- Athlete data is minors' data: default to least exposure (first name + last initial + jersey) on anything public.
- Don't add a dependency without stating why in the commit message; prefer small, maintained libraries.

## Definition of done (every milestone)
- `pnpm lint && pnpm typecheck && pnpm test` pass at repo root.
- New behavior has tests; invariant-related code has invariant tests.
- Acceptance criteria in the milestone file are each demonstrated (command, test name, or screenshot path in NOTES).
- Docs updated (SPEC/DECISIONS/COST_MODEL as relevant).
