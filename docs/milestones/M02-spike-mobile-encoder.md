# M02 — SPIKE: Mobile contribution encoder (iOS + Android)

**Type:** spike, go/no-go gate for M09.

**Goal:** prove both platforms can publish the camera at 1080p30 for 3 hours on reference devices, with reconnects and thermal handling, from inside the Expo app — (a) over SRT/RTMP to our ingest (cloud path) and (b) **with the overlay composited on device, RTMP(S) directly to YouTube (device path, ADR-019)**.

**Read first:** SPEC §5.1 (modules), §10.1, §10.5, §17 (mobile soak).

## Scope
- `modules/streaming-ios`: Expo Module wrapping HaishinKit. `modules/streaming-android`: Expo Module wrapping RootEncoder.
- Common JS API (in `apps/mobile/src/streaming/`):
  ```ts
  start({ url, protocol: 'srt'|'rtmp', codec: 'h264'|'hevc', width, height, fps, bitrateKbps, keyframeSec })
  stop()
  setBitrate(kbps)
  onStats((s) => { bitrateKbps, fps, droppedFrames, rttMs?, connection: 'connecting'|'live'|'reconnecting'|'failed', thermal: 'nominal'|'fair'|'serious'|'critical' })
  ```
- Camera preview view component; lens/zoom selection; landscape lock; keep screen awake.
- Adaptive bitrate on congestion; automatic reconnect with backoff; auto-downgrade to 720p on `serious` thermal state.
- Optional: local segmented MP4 recording in parallel (measure the thermal cost; may be deferred).
- A bare test screen: URL field, start/stop, live stats readout.
- **On-device overlay:** draw a simple scorebug (two team names/colors, set score, points, serving dot, one sponsor logo) into the encode pipeline (HaishinKit video effect / RootEncoder filter) from a JSON layout; score updates every ~20 s from a local timer. Document the render contract so M06 can share it with the cloud path.

## Measurements (record in NOTES-M02.md)
- SRT vs RTMP stability under induced packet loss (use a network link conditioner / Android emulator network shaping and a real Wi-Fi test).
- H.264 vs HEVC: bitrate needed for acceptable quality, encoder availability per device, thermal impact.
- 3-hour soak at 1080p30 on each reference device, **with and without on-device overlay**: battery drain, thermal state timeline, dropped frames, any crash.
- Device-direct to YouTube: time from publish start to YouTube "live"; behavior when Wi-Fi drops for 30 s / 2 min / 5 min — when does YouTube end the broadcast? [VERIFY and cite YouTube docs].

## Acceptance criteria
- [ ] Both platforms publish 1080p30 via SRT and via RTMP to MediaMTX, visible in ingest.
- [ ] Reconnect: Wi-Fi toggled off 30 s → stream resumes automatically without user action.
- [ ] 3-hour soak completed on both reference devices with results logged (auto-downgrade allowed; crash is a fail).
- [ ] [VERIFY] items resolved: HaishinKit/RootEncoder SRT and HEVC maturity, with versions pinned.
- [ ] ADR for default contribution codec/protocol per platform.
- [ ] Device path: 1080p30 with overlay, direct to a YouTube test channel, 3-hour soak logged; thermal delta vs. no-overlay recorded.
- [ ] YouTube disconnect tolerance for a direct contribution documented with source.

## Out of scope
Overlays, scoring, auth, YouTube.

## Escalation
If a library fails the soak, document the failure mode and propose alternatives (other library, native app shell for camera mode, 720p default) before proceeding.
