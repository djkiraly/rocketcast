# M14 — Hardening, invariant suites, observability, beta launch

**Goal:** prove the SLOs in SPEC §17 with automated evidence, instrument production, and run a real beta with travel club teams.

**Read first:** SPEC §6, §17; all NOTES-Mxx.md files.

## Scope
### Invariant and resilience suites (`tools/`)
- **Overlay isolation harness:** randomized sequences of team switches, Next Match, theme pushes, worker failovers, and reconnects (≥ 1,000 transitions). Sample compositor output frames and verify the overlay matches the expected session's snapshot (by rendering the expected overlay and comparing regions, or by an embedded per-session marker readable from the frame). **Pass = 0 mismatched frames.** Runs nightly and on any PR touching overlay/realtime/compositor/client state.
- **Chaos:** netem profiles on contribution leg (loss, jitter, outage), ingest restart, worker kill, realtime DO restart, API outage during scoring.
- **Soak:** 4-hour multi-session compositor soak; memory/process leak checks.
- **Score latency probe:** timestamped events → frame detection; p95 reported.

### Observability
- Sentry (web, mobile, services), structured logs keyed by sessionId/gameId/teamId.
- Metrics + dashboards: active sessions, worker load, ingest health, slate time, failovers, score latency, YouTube API errors/quota, sync rejection rate, cost per stream-hour (actual vs model).
- Alerts: session on slate > 2 min, failover events, quota 70%, sync error spikes.
- Operator-facing incident view in the control room.

### Beta readiness
- Runbooks: worker failure, ingest outage, YouTube API outage, token revocation, bad deploy rollback.
- Privacy policy + terms drafts covering minors, consent, media rights (for legal review — not legal advice).
- App store submission checklists (camera/microphone permission strings, background behavior, no purchase UI).
- Beta onboarding guide for clubs (plain, proof-first).
- Feedback capture in app (shake-to-report with session diagnostics).

## Acceptance criteria
- [ ] Isolation harness: 0 mismatched frames across ≥ 1,000 transitions, three consecutive nightly runs.
- [ ] All SPEC §17 SLO rows have a linked passing test or recorded measurement.
- [ ] Actual cost per stream-hour from production telemetry is within 20% of COST_MODEL, or COST_MODEL and prices updated.
- [ ] Beta: ≥ 2 clubs, ≥ 30 real matches streamed; issues triaged and logged.
- [ ] App store builds submitted.
