# M09 — Mobile app: camera streaming, return preview, Next Match

**Goal:** a videographer goes live from the phone in under a minute, sees exactly what YouTube sees, survives network drops, and rolls to the next match in under 10 seconds without re-setup.

**Read first:** SPEC §3.3, §6 (I-1, I-10, I-11), §10, §12; M02 notes and ADRs; M07 API for sessions.

## Scope
- Session lifecycle from the app: create `StreamSession` for a game (API returns ingest URL/credentials, sessionId), start publish (M02 module), end session.
- Modes: **Camera** and **Camera + Quick Score** (score buttons over the camera view, using M08 scoring + lease).
- Operator view: return preview (compositor output, I-11), live indicator, health (bitrate, fps, connection, thermal), Stop, **Next Match**, overlay quick toggles (lineup card, sponsor slate, hide scorebug).
- **Next Match:** ends current session, creates the next game's session, re-targets the existing publish connection to the new session without tearing down the camera when possible (else fastest restart); target < 10 s to correct overlay live. The previous session's renderer must be destroyed before the new one binds (I-1).
- Pre-stream checklist: event media-rights status (warn if `unknown`/`restricted`, require acknowledgment), battery/storage check, network test.
- External encoder flow: show session ingest URL + QR for Mevo/GoPro/OBS; operator view still shows return preview and health.
- Thermal/battery handling per M02 (auto-downgrade, warnings).
- Crash/kill recovery: relaunch offers "resume streaming" for the active session.

## Acceptance criteria
- [ ] Go-live from app open to live on YouTube test channel in < 60 s on a reference device (with manual stream key until M10).
- [ ] Return preview shows actual composited output.
- [ ] Next Match across two different teams: zero frames of the previous team's overlay in YouTube output (run the M14 isolation harness in its early form against this flow).
- [ ] Wi-Fi off 30 s mid-stream: YouTube shows slate, then camera resumes automatically.
- [ ] 3-hour field soak per platform completed and logged (David — real gym).

## Out of scope
YouTube broadcast automation (M10), branding editor (M11).
