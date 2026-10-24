# M10 — YouTube integration

**Goal:** a club connects its YouTube channel once; every match becomes its own YouTube live video automatically, with correct title, privacy, and audience settings — and a manual stream-key fallback always works.

**Read first:** SPEC §11, §6 (I-1), §16 (made-for-kids, tokens); M07 output adapter.

## Scope
- OAuth connect flow at org level, optional team-level override; least-privilege scopes; encrypted refresh tokens; disconnect/revoke.
- Channel readiness check: live streaming enabled on the channel; surface clear guidance if not (e.g., new channels may need enablement time) — [VERIFY] current requirements.
- Per-team settings: title template (`{team} vs {opponent} · {event} · {court}`), description template, default privacy (public/unlisted/private), **made-for-kids choice required**, thumbnail (auto-generated from theme: team logos + matchup).
- Per match: create `liveBroadcast`, bind to a reusable `liveStream`, transition states via API; store IDs on `stream_sessions`.
- **Next Match on YouTube:** keep the contribution/ingest connection up; end the previous broadcast and start the next one on the same reusable stream. [VERIFY] rebinding behavior and timing; if not reliable, fall back to per-match stream keys with a seamless compositor output switch.
- Concurrent streams: multiple teams from one club live on one channel simultaneously — [VERIFY] limits and document.
- Viewer counts: poll concurrent viewers where available for sponsor exposure estimates — [VERIFY] API field/availability.
- Quota tracking: count units per call; daily usage stored; alert at 70% of quota; document per-operation costs.
- Manual fallback: paste stream URL + key per team; compositor uses it; no per-match automation.
- Error handling: token revoked, quota exhausted, broadcast creation failure → automatic fallback path with a clear operator message; never block going live if a stream key exists.

## Acceptance criteria
- [ ] Connect channel → stream a match → appears as its own YouTube video with templated title and chosen privacy/audience.
- [ ] Back-to-back matches produce separate YouTube videos while the phone stays connected (or documented fallback works).
- [ ] Revoked token mid-day: next match goes live via fallback path with an operator message.
- [ ] All [VERIFY] items resolved with citations in NOTES-M10.md.
- [ ] Google OAuth verification status recorded (approved / pending with date).

## Out of scope
Other destinations (Facebook etc.).
