# M08 — Mobile app: team switching and offline-first scoring; web share-link scorer

**Goal:** a parent can score a full volleyball match on a phone with no network and lose nothing; helpers without the app can score Quick mode from a link.

**Read first:** SPEC §3.3, §6 (I-6, I-7, I-8, I-9), §8, §12, §13 (share-link scorer).

## Scope

### Mobile

- Navigation: sign-in (M03 flow), global team switcher, Game Day screen (today's games across all teams), game detail.
- **Team switch teardown (I-6):** all query caches, realtime subscriptions, and local store handles keyed by teamId/gameId; switching disposes them. Add a dev-only assertion that fails if a team-scoped hook renders with a stale teamId.
- Local persistence with expo-sqlite: games, roster snapshot, events, **outbox** (`clientId`, `clientSeq`), sync cursor.
- Sync worker: drains outbox to `POST /api/games/:id/events` with backoff; reconciles server_seq; surfaces rejected events clearly.
- Scorer lease UI: acquire, "scoring on another device" state, request/approve handoff.
- Pre-match setup: rules preset, format, home/away, first serve, lineups (stat mode), libero.
- **Quick mode UI:** two big point buttons, undo, timeout, sub, serve indicator, set/match end confirmation.
- **Stat mode UI:** rally winner first, then optional fast attribution (player + action grid); edit last rally; designed for one-handed use; target ≤ 2 taps for a typical point in Quick mode and ≤ 4 in Stat mode.
- Live box score view.

### Web

- **Share-link scorer** (Quick mode only): team admin generates a link scoped to one game; expires at match end; holds the scorer lease like a device.

## Acceptance criteria

- [ ] Airplane-mode E2E (Maestro): full 3-set match scored offline, reconnect, all events synced, server state equals device state.
- [ ] Kill the app mid-set and relaunch: state restored exactly.
- [ ] Switching from Team A's live game to Team B never shows Team A data on any Team B screen (automated test).
- [ ] Two devices: only the lease holder can score; handoff works mid-set.
- [ ] Share-link scorer works on mobile Safari and Chrome; expired link is rejected.

## Out of scope

Camera streaming (M09).
