# services/compositor

GStreamer pipelines on Linux GPU hosts (NVDEC/NVENC) plus a worker agent, per SPEC §5.1. Each
pipeline serves exactly one stream session: pull the session's input from ingest, decode, composite
the `packages/overlay` definition, encode H.264 (1080p30 default), and push RTMPS to the session's
output target (YouTube). A new renderer instance is created per session and destroyed at its end
(I-1), input loss switches the output to a branded slate with the live scoreboard instead of ending
the stream (I-10), and a 360p return preview is published back to ingest (I-11). The agent reports
health to the controller every 2 s and logs structured records keyed by `sessionId`.

**ADR-019 (hybrid compositing):** this service is the _cloud_ path only. Phone-camera sessions
default to `composite_mode: 'device'` and stream directly to YouTube with the overlay drawn on the
phone; the compositor serves `composite_mode: 'cloud'` sessions, i.e. external encoders (Mevo,
GoPro, OBS) and clubs that opt into outage resilience. Both paths render the same overlay
definition, and the isolation harness in `tools/` runs against both.

**Arrives in:** M01 (spike: three overlay render approaches, slate on input loss, density benchmark,
measured cost per stream-hour; throwaway quality, reproducible measurements) and then M07
(production worker: pipeline manager, `OutputTarget` adapter, slate, return preview, health
metrics). This folder is not a pnpm workspace yet (no `package.json`); the `Dockerfile` is a
placeholder that documents the intended base image and GStreamer packages.
