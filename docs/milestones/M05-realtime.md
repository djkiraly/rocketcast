# M05 — Realtime service and scoring sync protocol

**Goal:** score events flow from the scorer to the database and to every subscriber (overlay renderers, web viewers, control room) in order, scoped to exactly one session/game, with snapshot-on-connect.

**Read first:** SPEC §6 (I-4, I-8, I-9), §14, §7 (`game_events`, `scorer_leases`, `stream_sessions`).

## Scope

- `packages/protocol`: zod schemas for the realtime `Envelope` and each payload type; sync API request/response schemas.
- Tables: `game_events`, `scorer_leases`, `stream_sessions` (state machine: `created → starting → live → reconnecting → ended`), plus `end_reason`.
- **Sync API** (web): `POST /api/games/:id/events` accepts a batch from the device outbox `{clientId, clientSeq, event}`; idempotent on `(clientId, clientSeq)`; requires the scorer lease; assigns `server_seq`; validates with the scoring engine; returns accepted/rejected with reasons.
- Scorer lease: acquire / heartbeat / release / forced handoff (team admin), with `ScorerHandoff` event recorded.
- `services/realtime`: one Durable Object per `sessionId` (and per `gameId` for unstreamed games). Receives accepted events from the API (signed internal call), maintains latest snapshot, fans out envelopes with monotonic `seq`.
- On connect: send full `snapshot`; then deltas. Client detects `seq` gap → requests snapshot.
- Tokens: short-lived signed tokens scoped to `{sessionId|gameId, role}`; renderer tokens are bound to one sessionId.
- Client library (`packages/protocol/client`) used by web, mobile, and compositor renderer: enforces I-4 drop rules in one place.

## Acceptance criteria

- [ ] Duplicate batch submission creates no duplicate events.
- [ ] Second device without the lease cannot write; handoff works and is recorded.
- [ ] A subscriber bound to session A never applies a message for session B (test injects cross-session and stale-seq messages).
- [ ] Reconnect after 60 s offline yields correct state via snapshot.
- [ ] Load test: 200 concurrent sessions × realistic event rate; p95 server fan-out latency recorded; Durable Objects cost estimate added to COST_MODEL ([VERIFY] resolved).

## Out of scope

Mobile UI, overlay visuals, video.
