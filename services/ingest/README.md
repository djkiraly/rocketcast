# services/ingest

MediaMTX deployment, per SPEC §5.1: accepts the contribution feed over SRT (preferred, HEVC/H.264)
with RTMP fallback, authenticates each publisher by a per-session stream ID/passphrase via an auth
hook against the web API, hands the stream to the compositor worker (pull), and serves the low-res
return preview over WebRTC and/or LL-HLS (I-11; which one is decided with an ADR in M07). External
encoders (Mevo, GoPro, OBS) get a session-specific SRT/RTMP URL and QR payload from the API.

**ADR-019 (hybrid compositing):** ingest is part of the _cloud_ path only. Device-composited
phone sessions publish straight to YouTube and never pass through MediaMTX; only
`composite_mode: 'cloud'` sessions (external encoders, outage-resilient clubs) are ingested here.

**Arrives in:** M01 (spike: a reproducible 1080p30 test feed published over SRT and RTMP into
MediaMTX for the compositor benchmark) and then M07 (production: auth hook, per-session stream
IDs, return-preview protocol decision). This folder is not a pnpm workspace (no `package.json`);
`Dockerfile` and `mediamtx.yml` are minimal placeholders.
