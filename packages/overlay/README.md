# @rocketcast/overlay

Overlay templates and the pure render function that turns a game snapshot plus a team theme into a 1920x1080 scoreboard/stat frame for the cloud compositor. A renderer instance binds to exactly one `sessionId`, drops envelopes with a mismatched `sessionId` or stale `seq`, and is never reused across sessions (CLAUDE.md hard rules, SPEC §6 I-1..I-6). All sponsor/logo assets are referenced by content-addressed URLs (`/a/{sha256}.{ext}`), never mutable URLs. The package targets the DOM lib because templates will render as HTML/CSS; it has no runtime dependencies today and will depend on `@rocketcast/protocol` once envelope handling lands (M05). M00 ships only `OVERLAY_CANVAS`.

```sh
pnpm --filter @rocketcast/overlay test
pnpm --filter @rocketcast/overlay build   # emits dist/
```
