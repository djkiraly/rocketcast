# NOTES — M00 Monorepo scaffold and CI

Started 2026-10-24. Status: **complete** (pending David's device check, see Deferred).

## Plan

### Approach

Build the monorepo skeleton top-down: root tooling and `packages/config` first (everything else depends on them), then the leaf workspaces in parallel (sub-agents: packages, web, mobile, realtime+services+CI), then a single root `pnpm install && pnpm lint && pnpm typecheck && pnpm test` pass with fixes. Commits per area.

### Toolchain decisions (M00-local, not ADRs unless they stick)

| Choice     | Value                                                           | Why                                                                                                                    |
| ---------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Node       | 26 (`.nvmrc`), engines `>=22`                                   | Current on David's machine; CI runs 22 and 26                                                                          |
| pnpm       | 10.15 via `packageManager`; `node-linker=hoisted`               | RN/Metro tooling expects a flat `node_modules`                                                                         |
| TypeScript | **5.9 pinned** (7.x is current)                                 | typescript-eslint 8 requires `<6.1`; TS 7 is the native-port compiler. Revisit after M02.                              |
| ESLint     | 10.x flat config, typescript-eslint 8                           | Shared fragments in `packages/config/eslint`: `base`, `node`, `browser`, `pureEngine`                                  |
| Prettier   | 3.x                                                             | Shared config; `pnpm format:check` runs in CI                                                                          |
| Vitest     | 5.x                                                             | `@cloudflare/vitest-pool-workers` 0.23 only supports Vitest 4, so realtime has a plain unit test for now (revisit M05) |
| Tailwind   | 4.x (`@tailwindcss/postcss`)                                    | Shared `@theme` preset CSS; shadcn new-york tokens in `apps/web/app/globals.css`                                       |
| Next.js    | 16.4 App Router                                                 | `typecheck` runs `next typegen` first; `next-env.d.ts` is generated and gitignored                                     |
| Expo       | SDK 58, dev client, RN 0.88, React 19.3.0 (exact, as Expo pins) | Dynamic `app.config.ts` imports `BRAND`; `newArchEnabled` removed (always on in SDK 58)                                |
| Drizzle    | drizzle-orm 0.45 + drizzle-kit 0.31, `@neondatabase/serverless` | Per CLAUDE.md                                                                                                          |
| Cloudflare | wrangler 4.152, workers-types 5.x, `wrangler.jsonc`             | SQLite-backed DO class via `new_sqlite_classes`                                                                        |
| zod        | 4.x                                                             | `EnvelopeSchema` uses `z.iso.datetime({ offset: true })`                                                               |
| Libraries  | `exports` point at `dist/`; turbo tasks `dependsOn: ["^build"]` | Proper package hygiene; dev consumers get built output via turbo                                                       |

### Risks (as planned → outcome)

- Expo in a pnpm monorepo → hoisting + explicit Metro `watchFolders`; `expo config --type public` resolves bundle IDs from `brand.ts`. Simulator launch not verifiable here.
- Tailwind 4 + shadcn → hand-written `components.json`, `cn()`, Button (without `asChild`; `pnpm dlx shadcn add button` restores upstream and adds radix).
- TS 7 drift → pinned 5.9.
- Windows host → LF normalized via `.gitattributes`; all scripts are plain `pnpm`/`tsc`/`eslint`.
- One lint interaction found: eslint-config-next parses JS with Babel, so `consistent-type-imports` is now scoped to TS files in the shared config.

## Done

- Root: pnpm workspaces, Turborepo, strict tsconfig presets, ESLint/Prettier/Tailwind presets, `packages/config/src/brand.ts` as the single hard-coded name.
- `packages/scoring-engine` (zero deps + purity lint + purity test), `packages/overlay`, `packages/protocol` (SPEC §14 `EnvelopeSchema`), `packages/db` (Drizzle + Neon, empty schema, generate/migrate scripts).
- `apps/web`: Next 16 App Router, Tailwind 4, shadcn/ui init, placeholder page, RTL test.
- `apps/mobile`: Expo 58 dev-client app, dynamic config from brand, Metro monorepo config, unit test.
- `services/realtime`: wrangler project, `SessionDO` with persisted counter, `/health` and `/session/:id` routes, unit tests.
- `services/{compositor,controller,ingest}` README + Dockerfile placeholders (cloud path per ADR-019), `tools/README.md`.
- CI: `.github/workflows/ci.yml` (lint/typecheck/test on Node 22 + 26, Turborepo cache, format check), PR template.
- `.env.example` in `apps/web`, `apps/mobile`, `packages/db`; `.dev.vars.example` in `services/realtime`.

## Acceptance criteria

- [x] Fresh clone → `pnpm install && pnpm lint && pnpm typecheck && pnpm test` passes.
      Evidence: `pnpm turbo run lint typecheck test --continue` → `Tasks: 24 successful, 24 total`; `pnpm format:check` → "All matched files use Prettier code style!" (2026-10-24, Windows, Node 26.10, pnpm 10.15.1). Tests: config 2, scoring-engine 3, overlay 1, protocol 4, db 2, web 1, mobile 3, realtime 4.
- [x] `pnpm --filter @rocketcast/web dev` serves the placeholder page.
      Evidence: `next dev -p 3105` → "Ready in 262ms"; `curl http://localhost:3105/` → HTTP 200 with "RocketCast" and the tagline in the HTML. (The milestone text says `--filter web`; pnpm filters by package name, so the command is `--filter @rocketcast/web`.)
- [ ] Mobile app launches in iOS simulator and Android emulator (document commands).
      Commands documented in `apps/mobile/README.md` (`prebuild` → `ios`/`android` → `start`). Verified here: `expo config --type public` loads `app.config.ts` and emits `ios.bundleIdentifier` / `android.package` = `com.rocketcore.rocketcast`; typecheck/lint/test pass. **David: run on simulator/emulator** (no Xcode/Android SDK on this host).
- [x] `wrangler dev` runs the hello-world Durable Object.
      Evidence: `wrangler dev --port 8799` → `/health` `{"ok":true}`; `/session/abc` twice → `seq` 1 then 2 (same DO id); `/session/xyz` → different id, `seq` 1; `/nope` → 404.
- [x] CI passes on the initial commit.
      Evidence: run 40120641728 on `master` (first push, 2026-10-24): `format` 32s, `verify (node 22)` 38s, `verify (node 26)` 43s, all green.

## CI

Pushed to `https://github.com/djkiraly/rocketcast` (`master`). First run 40120641728: all three jobs passed. Annotations warned that the v4 actions target the deprecated Node 20 runtime; bumped in the follow-up commit.

## Deferred

- iOS simulator / Android emulator launch (David, real toolchain).
- `@cloudflare/vitest-pool-workers` integration test for the DO (blocked on Vitest 5 support; M05).
- shadcn Button `asChild` (needs `radix-ui`; add when a real component is needed).
- `next build` production build was not exercised in M00 (typecheck + dev server were); M03 adds it to CI when there is a real app.

## How to run / verify

```bash
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm --filter @rocketcast/web dev          # http://localhost:3000
pnpm --filter @rocketcast/realtime dev     # curl localhost:8787/health ; curl localhost:8787/session/abc
pnpm --filter @rocketcast/mobile prebuild && pnpm --filter @rocketcast/mobile ios   # or android
```
