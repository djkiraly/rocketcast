# services/controller

TypeScript service that owns the fleet side of the cloud path, per SPEC §5.1: assigns stream
sessions to compositor workers with capacity accounting (bin packing), pre-warms capacity per
region from the game schedule (no spot instances for live sessions), watches worker heartbeats,
fails a session over to a warm spare when a worker dies (output resumes within 15 s), and writes
`usage_records` for the time a session's output is actually live to YouTube (SPEC §15). It also
serves the admin/control-room data: active sessions, worker load, ingest health.

**ADR-019 (hybrid compositing):** the controller only manages `composite_mode: 'cloud'` sessions.
Device-composited sessions never touch a worker, so they are not assigned, pre-warmed, failed over,
or metered here (their metering is session start/end from the API). The I-10 slate and the 15 s
failover target apply to cloud sessions only.

**Arrives in:** M07 (ingest, compositor service, and controller — production). The M01 spike runs
pipelines by hand and does not need a controller. This folder is not a pnpm workspace yet (no
`package.json`); the `Dockerfile` is a placeholder that fixes the intended runtime image.
