# @rocketcast/scoring-engine

Pure TypeScript volleyball scoring engine. It derives game state (sets, points, rotation, timeouts, substitutions) by folding an ordered list of `game_events`; it never holds a mutable "current score" of its own. Hard rules (CLAUDE.md): **zero runtime dependencies**, no I/O, no clocks (`Date`, `performance.now`), no randomness (`Math.random`, `crypto`), no Node built-ins. The purity rules are enforced by `pureEngine` lint fragment on `src/**` (tests are exempt) and by `src/purity.test.ts`, which fails if a `dependencies` key ever appears in `package.json`. M00 ships only `ENGINE_VERSION` and `schemaVersion`; rules and reducers arrive in M02.

```sh
pnpm --filter @rocketcast/scoring-engine test
pnpm --filter @rocketcast/scoring-engine typecheck
pnpm --filter @rocketcast/scoring-engine build   # emits dist/
```
