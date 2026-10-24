# @rocketcast/protocol

Shared wire contracts: the realtime `Envelope` (SPEC §14) and, from M04 onward, the per-type payload schemas and sync API contracts. Everything is a zod schema with an inferred TypeScript type, so every boundary (mobile scorer, Cloudflare realtime worker, overlay renderer, web API) validates the same way. The envelope carries `v`, `sessionId`, `gameId`, `teamId`, a monotonic `seq`, an ISO `ts`, a `type` of `snapshot | event | theme | control`, and an opaque `payload`; renderers must drop any envelope whose `sessionId` does not match the one they are bound to or whose `seq` is stale. The only runtime dependency is `zod`.

```sh
pnpm --filter @rocketcast/protocol test
pnpm --filter @rocketcast/protocol build   # emits dist/
```
