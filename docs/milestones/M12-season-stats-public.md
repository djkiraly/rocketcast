# M12 — Season stats and public team pages

**Goal:** every match rolls into season totals per athlete and team automatically, corrections flow through, and families get a clean public page — with minors' privacy protected by default.

**Read first:** SPEC §7 (projections), §8.3, §13, §16; M04 `deriveSeasonLine`.

## Scope

- Projection jobs: on accepted events, rebuild affected game box score and season lines (`season_stat_lines`); full rebuild command for any season.
- Stats UI (web + mobile read-only): game box scores, season totals and per-set averages, leaderboards (kills, aces, digs, blocks, hitting % with minimum attempts), team trends across a season and by event.
- Athlete view across seasons (persistent `athletes` identity).
- Exports: CSV per season; recruiting-friendly athlete summary (opt-in by club).
- **Public team page:** schedule, results, live/next YouTube embed, live scoreboard (realtime viewer token), season stats.
- Privacy controls (club-level defaults, team overrides): name display (first + last initial + jersey default), hide individual stats, hide roster photos, unlisted page option.

## Acceptance criteria

- [ ] Correcting a stat in an earlier match updates season totals within 30 s and a full rebuild produces identical results.
- [ ] Leaderboard minimum-attempt rules applied and documented.
- [ ] Public page never shows a full last name unless the club enabled it (test).
- [ ] Live scoreboard on the public page updates without the YouTube player and uses a viewer-scoped token.

## Out of scope

Highlights/clips, Phase 2 sports.
