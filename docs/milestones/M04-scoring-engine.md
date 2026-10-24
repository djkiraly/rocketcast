# M04 — Volleyball scoring engine (`packages/scoring-engine`)

**Goal:** a pure, deterministic, exhaustively tested event-sourced volleyball engine that every other part of the system uses.

**Read first:** SPEC §8 (all), §6 (I-7), CLAUDE.md hard rules.

## Scope
- Types for `VolleyballRules`, all events in SPEC §8.2, derived `MatchState`, `BoxScore`, `SeasonLine`.
- `applyEvent`, `replay`, `validate`, `deriveBoxScore`, `deriveSeasonLine` (SPEC §8.5).
- Rules presets: `usav-juniors-pool`, `usav-juniors-bracket`, `nfhs-hs`, `aau`, `custom`. Put preset values in one file with a comment block marking them **[VERIFY with club director]**.
- Formats: `bestOf` (3/5) and `playN` (pool play — all sets played, splits allowed), point caps, deciding set to 15, win-by-2, timeouts, substitution limits, optional libero tracking.
- Serve and rotation tracking: side-out rotates the receiving team; server is rotation position 1; `ServeOverride` for manual correction.
- Stat mode: `StatAction` attached to the current rally; rally outcome may be entered first and stats attributed after; stats editable via `Correction`.
- Quick mode: only `RallyWon` + structural events; box score limited to team-level.
- `Undo` and `Correction` semantics: undo removes the target event's effect (and anything depending on it) on replay; document edge cases (undo across set end, undo of lineup).
- Stat formulas exactly as SPEC §8.3 table.
- Serializable state (JSON) and a versioned event schema (`schemaVersion`) with an upgrade path.

## Tests
- Unit tests per rule and per event type.
- Property tests (fast-check): replay(events) is deterministic; score never negative; a completed set always satisfies its win condition; undo-then-redo restores the same state; stats sums reconcile (team kills = Σ player kills, etc.).
- **Golden fixtures:** at least 5 hand-built full matches (pool play split, best-of-3 with deciding set, capped set, heavy subs, many corrections) with expected box scores.
- Performance: replaying a 5-set stat-mode match (~1,500 events) < 20 ms in Node.

## Acceptance criteria
- [ ] 100% of golden fixtures pass; property tests run ≥ 1,000 cases each in CI.
- [ ] Zero runtime dependencies; no `Date.now`, `Math.random`, or I/O in the package (lint rule enforces it).
- [ ] Public API documented with examples in the package README.
- [ ] `deriveSeasonLine` aggregates multiple matches correctly, including a correction made to an earlier match.

## Out of scope
Persistence, sync, UI.
