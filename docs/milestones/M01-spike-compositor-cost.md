# M01 — SPIKE: Compositor, overlay render approach, and cost per stream-hour

**Type:** spike. Throwaway-quality code is acceptable, but measurements must be reproducible. **Gate (ADR-002 as amended by ADR-019):** this sizes the *cloud* path, which serves external encoders and outage-resilient sessions. GO means the cloud path can be priced as an add-on at 35% margin; NO-GO means Phase 1 ships device-only and external encoders are deferred.

**Goal:** prove the cloud compositor can (1) composite a live overlay onto a 1080p feed and push to YouTube reliably, (2) survive input loss with a slate, and (3) do it at a cost per stream-hour that supports the pricing model.

**Read first:** SPEC §2, §5, §6 (I-1, I-5, I-10), §9.2, §10.2–10.3; docs/COST_MODEL.md.

## Scope
1. **Test feed:** a reproducible 1080p30 H.264 + AAC source (looped sports clip or test pattern) published over SRT and RTMP into MediaMTX.
2. **Pipeline:** GStreamer `ingest pull → decode → composite overlay → NVENC H.264 → RTMPS` to a YouTube test channel (unlisted).
3. **Overlay render approaches — implement all three minimally** with the same simple scorebug (two team names/colors, set score, points, serving dot, one sponsor logo):
   - A: WPE WebKit (`wpesrc`) rendering an HTML page live.
   - B: headless Chromium rasterizing the HTML only on state change → RGBA → `appsrc`.
   - C: native 2D (e.g., Skia) rendering from a JSON layout only on state change.
4. **State updates:** a script that sends score changes at realistic volleyball rates (a point every ~20 s) plus bursts. Measure score-to-frame latency.
5. **Input-loss slate:** kill the input feed; output must switch to a slate (with scoreboard) without the YouTube stream ending; restore input and measure time to camera resume.
6. **Density benchmark:** on one GPU host, ramp concurrent sessions (1, 4, 8, 16, …) until frame drops or latency targets fail. Record CPU, GPU encode/decode utilization, memory, dropped frames per approach.
7. **Cost:** compute $/stream-hour = host $/hr ÷ sustainable sessions; add egress per stream-hour from the host's pricing at ~6 Mbps out. Compare at least two GPU host providers (one hyperscaler, one dedicated/bare-metal provider with included transfer).

## Deliverables
- `services/compositor/spike/` with run instructions.
- Filled-in benchmark table and inputs in `docs/COST_MODEL.md`.
- ADRs: chosen render approach, chosen host provider.
- `NOTES-M01.md` with recommendation and a clear **GO / NO-GO** on ADR-002.

## Acceptance criteria
- [ ] Live 1080p30 output on a YouTube test channel with the overlay, sustained ≥ 60 min.
- [ ] Score-to-frame latency measured; p95 ≤ 1 s for the chosen approach.
- [ ] Input loss for 60 s does not end the YouTube broadcast; camera resumes ≤ 3 s after input returns.
- [ ] Density and $/stream-hour recorded for all three approaches on at least one host; egress cost included.
- [ ] Recommendation states the price implication using the COST_MODEL formula.

## Notes
- **Hybrid constraint (ADR-019):** the chosen approach must have an on-device equivalent. Record for each approach how the same overlay definition would render inside the phone encode pipeline (M02). Approach C (JSON layout → native 2D) is the natural fit; for A/B document the raster contract that would make a WebView-rendered bitmap acceptable on device.
- YouTube's ingest reconnect tolerance and recommended bitrates are [VERIFY] items; record what you observe and cite YouTube docs.
- Fidelity matters: the web preview, OBS browser source, and compositor must render from the same overlay definition. For A and B that definition is HTML. If C wins, the definition becomes the JSON layout and the web preview must use the same renderer in the browser (e.g., Skia's CanvasKit WASM) — document that impact on M06.
