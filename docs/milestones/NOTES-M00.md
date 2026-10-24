# NOTES — M00 Monorepo scaffold and CI

Started 2026-10-24. Status: **in progress**.

## Plan

### Approach
Build the monorepo skeleton top-down: root tooling and `packages/config` first (everything else depends on them), then the leaf workspaces in parallel (sub-agents: packages, web, mobile, realtime+services+CI), then a single root `pnpm install && pnpm lint && pnpm typecheck && pnpm test` pass with fixes. Commits are per area (`chore(root)`, `feat(config)`, `feat(web)`, …).

### Toolchain decisions (M00-local, not ADRs unless they stick)
| Choice | Value | Why |
|---|---|---|
| Node | 26 LTS (`.nvmrc` = 26), engines `>=22` | Current LTS on David's machine; CI uses 22 and 26 |
| pnpm | 10.x via `packageManager` field | Already installed; Turborepo-friendly |
| TypeScript | **5.x pinned** (7.x is current) | TS 7 is the native-port compiler; typescript-eslint, Next, Expo peers were not yet verified against it. Revisit after M02. |
| ESLint | 10.x flat config, `typescript-eslint` 8 | Flat config only; shared preset in `packages/config` |
| Prettier | 3.x | Shared config in `packages/config` |
| Vitest | 5.x | Per CLAUDE.md |
| Tailwind | 4.x (`@tailwindcss/postcss`) | Current major; shared preset file is a CSS `@theme` + tokens TS |
| Next.js | 16.x App Router | Per CLAUDE.md |
| Expo | SDK 58, dev client | Per CLAUDE.md; `.npmrc` uses `node-linker=hoisted` because RN tooling expects a flat `node_modules` |
| Drizzle | drizzle-orm 0.45 + drizzle-kit 0.31, `@neondatabase/serverless` | Per CLAUDE.md |
| Cloudflare | wrangler 4.x, `@cloudflare/workers-types` | Per CLAUDE.md |
| zod | 4.x | Per CLAUDE.md |

### Files / layout
```
.gitattributes .gitignore .editorconfig .npmrc .nvmrc
package.json pnpm-workspace.yaml turbo.json tsconfig.json eslint.config.js prettier.config.js
.github/workflows/ci.yml
packages/config        tsconfig/*.json, eslint/index.js, prettier/index.js, tailwind/preset.css, src/brand.ts
packages/db            drizzle.config.ts, src/schema.ts (empty), src/index.ts, .env.example
packages/scoring-engine, packages/overlay, packages/protocol   src/index.ts + one Vitest test each
apps/web               Next.js 16 App Router + Tailwind 4 + shadcn/ui init, placeholder page, .env.example
apps/mobile            Expo 58 dev-client app, placeholder screen, app.json with bundle IDs, .env.example
services/realtime      wrangler.toml, src/index.ts (hello-world Durable Object), Vitest test
services/compositor, services/controller, services/ingest   README.md + Dockerfile placeholders
tools/                 README.md describing planned harnesses
```

### Risks
- **Expo in a pnpm monorepo.** Hoisting is required; `metro.config.js` must watch the workspace root. Mitigation: `.npmrc` hoisting + standard Expo monorepo metro config.
- **Tailwind 4 + shadcn/ui init.** shadcn's CLI expects a Next app it can write into; run `shadcn init` non-interactively with defaults, keep a `components.json`.
- **TS 7 ecosystem drift.** Pinned to 5.x; the pin is in `packages/config` tsconfig consumers via root `devDependencies`.
- **Windows dev host.** Scripts must not rely on bash-only syntax in `package.json`; CI runs on ubuntu. Line endings normalized to LF via `.gitattributes`.
- **Mobile acceptance criterion (simulator/emulator launch)** cannot be verified from this environment (no Xcode/Android SDK here). Will document commands and mark as "David to verify".

### Open questions
None blocking. Name clearance (ADR-013) is deferred by David; `brand.ts` is the single edit point.

## Done
(filled in at the end)

## Acceptance criteria
- [ ] Fresh clone → `pnpm install && pnpm lint && pnpm typecheck && pnpm test` passes.
- [ ] `pnpm --filter web dev` serves the placeholder page.
- [ ] Mobile app launches in iOS simulator and Android emulator (document commands).
- [ ] `wrangler dev` runs the hello-world Durable Object.
- [ ] CI passes on the initial commit.

## Deferred
(filled in at the end)
