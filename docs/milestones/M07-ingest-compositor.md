# M07 — Ingest, compositor service, and controller (production)

**Goal:** turn the M01 spike into a reliable service: sessions are created, assigned to workers, composited, pushed to an output destination, monitored, failed over, and metered.

**Read first:** SPEC §2.3 (compute rules), §6 (I-1, I-5, I-10, I-11), §10, §17; M01 notes; COST_MODEL.

## Scope

### Ingest (`services/ingest`)

- MediaMTX config: SRT + RTMP ingest; per-session stream ID/passphrase validated via an auth hook against the API; WebRTC and/or LL-HLS output for the return preview (decide and ADR).
- Generic external encoder support: session-specific RTMP/SRT URL + QR data returned by the API.

### Compositor worker (`services/compositor`)

- Worker agent manages N pipelines; each pipeline = one session; **new renderer instance per session, destroyed at end** (I-1).
- Pipeline: pull input → decode → composite overlay (chosen approach) → encode H.264 (1080p30 default, 1080p60 option, 720p fallback) → output adapter.
- Output adapter interface (`OutputTarget`) with YouTube RTMPS implementation; stream key supplied per session.
- Input-loss detection → reconnecting slate with live scoreboard + silent audio; continuous output timeline; configurable max slate duration (default 10 min).
- Return preview: low-res (360p) copy published back to ingest (I-11).
- Health metrics every 2 s to controller; structured logs keyed by sessionId.

### Controller (`services/controller`)

- Session assignment to workers with capacity accounting (bin packing).
- **Schedule-based pre-warm:** reads upcoming games and keeps enough warm capacity per region; no spot instances for live sessions.
- Failover: worker heartbeat loss → reassign session to warm spare and restart output; record event.
- Metering: writes `usage_records` for time the output is live.
- Admin endpoint/dashboard data: active sessions, worker load, health.

## Acceptance criteria

- [ ] End-to-end: test feed → ingest → compositor → YouTube test channel with overlay driven by M05 realtime events.
- [ ] Input dropout 60 s: YouTube stays live on slate; camera resumes ≤ 3 s after return.
- [ ] Kill a worker mid-session: output resumes ≤ 15 s on another worker; [VERIFY] YouTube reconnect tolerance documented.
- [ ] Return preview latency measured; target ≤ 3 s glass-to-glass.
- [ ] 50 sequential sessions on one worker leave no leaked processes/memory growth beyond a documented bound.
- [ ] Usage records match actual live output time within 1%.
- [ ] Bitrate profiles reflect YouTube's current recommendations ([VERIFY], cite source).

## Out of scope

YouTube API broadcast creation (M10) — use a manually created stream key for testing.
