# @rocketcast/realtime

Cloudflare Worker + Durable Objects. One Durable Object per stream session fans out ordered
`Envelope` messages to overlay renderers, web viewers, and the control room (SPEC §5.1, §14).
M00 ships a hello-world object; M05 adds the real snapshot/delta protocol.

## Run locally

```sh
pnpm --filter @rocketcast/realtime dev
```

Wrangler starts a local workerd on `http://localhost:8787`. In another shell:

```sh
curl -s http://localhost:8787/health
# {"ok":true}

curl -s http://localhost:8787/session/abc
# {"hello":"world","id":"<durable object id>","seq":1}
curl -s http://localhost:8787/session/abc
# {"hello":"world","id":"<same id>","seq":2}       <- seq persists in Durable Object storage
curl -s http://localhost:8787/session/xyz
# {"hello":"world","id":"<different id>","seq":1}  <- a different session is a different object
```

Anything else returns `404 {"error":"not_found"}`; a non-GET on a known route returns `405`.

## Scripts

| Script       | What it does                                                                      |
| ------------ | --------------------------------------------------------------------------------- |
| `dev`        | `wrangler dev` (local workerd, SQLite-backed Durable Objects)                     |
| `deploy`     | `wrangler deploy` (needs `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_API_TOKEN`)        |
| `lint`       | ESLint with the shared `@rocketcast/config/eslint` preset                         |
| `typecheck`  | `tsc --noEmit` against `@cloudflare/workers-types`                                |
| `test`       | Vitest unit tests (`src/**/*.test.ts`)                                            |
| `cf-typegen` | `wrangler types --include-runtime=false`, regenerates `worker-configuration.d.ts` |

## Layout

- `wrangler.jsonc` — worker name, `SESSION` Durable Object binding, SQLite migration `v1`, observability.
- `src/index.ts` — `SessionDO` class and the worker entry (`/health`, `/session/:id`).
- `src/router.ts` — pure path matcher, unit-tested without the workers runtime.
- `worker-configuration.d.ts` — hand-written `Env` bindings (what `wrangler types` would generate).
- `.dev.vars.example` — documented local secrets (none yet).

## Testing note

`@cloudflare/vitest-pool-workers` 0.23.0 requires Vitest 4 (`peerDependencies.vitest: ^4.1.0`) and
the repo is on Vitest 5, so there is no in-runtime integration test yet. Verify the Durable Object by
hand with the curls above; M05 adds runtime tests once the pool supports Vitest 5 (or via
`wrangler dev` + fetch in a Vitest `globalSetup`).
