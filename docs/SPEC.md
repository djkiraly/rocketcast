# Product Spec — RocketCast

> Product name: **RocketCast**. Developer/publisher: **RocketCore**. Package scope: `@rocketcast/*`. App bundle IDs: `com.rocketcore.rocketcast` (iOS/Android) **[VERIFY name clearance before store submission — see DECISIONS ADR-013]**.

> Status: v0.1 (2026-10-23). Source of truth for Claude Code. Decisions are logged in `docs/DECISIONS.md`.
> Anything marked **[VERIFY]** must be confirmed during the named milestone before code depends on it.

---

## 1. Product summary

A mobile (iOS + Android) and web platform that lets **travel sports clubs** stream games to **their own YouTube channels** with broadcast-quality, team-branded score and stat overlays, sponsor graphics, and **season-long stat tracking**.

**Phase 1 sport: volleyball (club / travel).** Phase 2: softball, baseball.

### 1.1 Positioning (low-key, proof-first)
- **Free to watch, forever.** Video lives on the club's YouTube channel. No viewer paywall, no app download for families. (Counter to GameChanger, which now caps free viewers and sells a $239/season team pass.)
- **The overlay is always right.** Switching teams or matches never shows the wrong team's graphics. (Counter to SidelineHD's stale/cached overlay problem.)
- **Stats that build all season.** Every match rolls into season totals per player. (Counter to SidelineHD's game-by-game scoring.)
- **Sponsors cover the cost.** Club-wide sponsor inventory with on-screen-time reports clubs can show sponsors.
- **Priced at cost + margin**, not as a profit center.

### 1.2 Primary competitor
SidelineHD (Diamond Kinetics): streams direct to YouTube/Facebook, scoreboard via shareable link, sponsor logos, HEVC low-bandwidth mode, $3–$21/mo paid tiers. Known complaints: post-update instability, YouTube reconnect issues, stats/clips paywalled, per-game (not season) scoring. Volleyball does not appear in its published sport list **[VERIFY before marketing claims]**.

---

## 2. Business constraints (drive every technical decision)

### 2.1 Pricing rule
Price covers fully-loaded cost with a **35% gross margin**:

```
price = (variable_cost + fixed_cost_allocation + payment_fixed_fee) / (0.65 - payment_pct_fee)
```
Note: a 35% margin is cost ÷ 0.65 (≈ cost × 1.54), **not** cost × 1.35.

### 2.2 Packaging
- **Subscriber = team.** Billed **monthly per team** with an included block of stream-hours (ADR-014). Prices, included hours, trial, and overage rates are admin-configurable; placeholders until the app is complete.
- **Club billing:** a club (organization) can buy and manage many teams on one invoice.
- **Overage:** per stream-hour, priced with the same formula; structure detailed at M13 from expected costs.
- **Web-only purchase (Stripe).** No in-app purchases — app store fees (15–30%) would consume the margin. Mobile apps must not present purchase UI that violates store rules **[VERIFY current Apple/Google US link-out rules at M13]**.

### 2.3 Cost drivers (measure in M01; record in `docs/COST_MODEL.md`)
| Driver | Notes |
|---|---|
| Compositor compute per stream-hour | Biggest variable cost. Pack many sessions per GPU host. |
| **Egress to YouTube** | ~6 Mbps out ≈ 2.7 GB/stream-hour. On hyperscalers egress can rival compute. Prefer hosts with large included transfer. |
| Return-preview egress | ~0.5 Mbps to operator device. |
| Realtime messaging | Small. |
| Database / storage | Small. Overlays and logos are tiny. No video storage in Phase 1 (YouTube is the archive). |
| Support time | Real cost. Stability is a margin feature. |

**Compute rules:** no spot/preemptible instances for live sessions; capacity is pre-warmed from the published game schedule (travel volleyball load peaks Saturday/Sunday tournament days).

### 2.4 Illustrative (not validated) unit math
Assume a volleyball team streams ~45 matches × ~1 hr = 45 stream-hours over a ~6-month season (~7.5 h/month), compositor + egress ≈ $0.40/hr, fixed allocation ≈ $2.50/team/month → cost ≈ $5.50/month → price ≈ $8.50/team/month before payment fees. **Replace with measured numbers after M01.** If measured cost per stream-hour cannot support a price competitive with SidelineHD's paid tiers, stop and revisit architecture (see DECISIONS ADR-002).

---

## 3. Users, tenancy, roles

### 3.1 Tenancy
```
User ──< OrgMembership >── Organization (club)
User ──< TeamMembership >── Team ── belongs to ── Organization
```
- A user can belong to **many teams across many clubs** (coach of two teams, parent with kids on two teams, a scorekeeper who helps several teams).
- A team always belongs to exactly one organization. Independent teams get an auto-created single-team org.

### 3.2 Roles
| Scope | Role | Can |
|---|---|---|
| Org | Owner | Billing, everything below |
| Org | Admin | Manage teams, club branding, club sponsors, YouTube channel connection |
| Team | Team Admin / Coach | Roster, schedule, team branding overrides, team sponsors, assign scorers/videographers |
| Team | Scorekeeper | Score matches |
| Team | Videographer | Start/stop streams |
| Team | Follower | View private stats (optional; public pages need no account) |

Scorekeeper and Videographer are separate so one parent can film while another scores. One person may hold both.

### 3.3 Team switching (core UX requirement)
- Global team switcher available everywhere (web + mobile).
- **Game Day** screen lists today's matches across *all* of the user's teams, sorted by start time.
- **Next Match** action: ends the current match session and starts the next one on the **same camera connection** — no re-pairing, no re-entering keys. Target: < 10 s from tap to correct overlay in compositor output. When the next match goes to the **same YouTube channel**, a configurable minimum separation (default 5 min) applies so the broadcast transition completes cleanly (ADR-015).
- Switching team context fully resets client state (see Invariant I-1).

---

## 4. Scope

### 4.1 Phase 1 — Volleyball MVP (target: in beta during the 2026–27 club season)
- Orgs, teams, rosters (athlete identity persists across seasons), seasons, schedules, events (tournaments)
- Volleyball scoring: **Quick mode** (score only) and **Stat mode** (player stats, Tier 2)
- Offline-first scoring on mobile; **web share-link scorer** (Quick mode only) for helpers without the app
- Phone camera streaming (iOS + Android) to cloud ingest; **generic external encoder** support via RTMP/SRT URL + QR code (works for Mevo, GoPro, OBS)
- Cloud compositor: overlays, sponsor graphics, reconnect slate, RTMPS to YouTube at up to 1080p
- YouTube OAuth: auto-create broadcasts per match; manual stream-key fallback
- Branding: club theme + team overrides (colors, logos, fonts from approved list, abbreviations)
- Sponsors: club-wide and team-specific, rotation rules, on-screen-time reports
- Season stats per player and team; public team page with privacy controls
- Billing: Stripe, per-team per-season, club invoices, usage metering
- Event media-rights checklist before streaming at an event (see §16)

### 4.2 Phase 2
- Softball and baseball scoring (rules presets: DP/FLEX, courtesy runners, continuous batting order, pitch counts)
- First-class Mevo Core support (SRT direct from camera, tested profiles)
- Court/Field mode for host clubs (camera stays on a court, matches roll over automatically)
- Local backup recording upload and stitched VOD
- Highlights/clips

### 4.3 Out of scope (do not build)
- Multi-camera switching / production switcher
- 4K (1080p is the ceiling)
- Hosting video (YouTube is the player and archive)
- Viewer accounts or paywalls
- Pitch-by-pitch / spray charts (Tier 3) — deferred indefinitely
- Facebook, Twitch, or other destinations (design output adapters so they can be added, but don't build)

---

## 5. Architecture overview

> **Hybrid compositing (ADR-019).** Phone-camera sessions default to `composite_mode: 'device'`: the overlay is drawn in the phone's encode pipeline and the phone streams RTMP(S) directly to YouTube. The diagram below shows the `cloud` path, used for external encoders (Mevo, GoPro, OBS) and for clubs that opt into outage resilience (I-10). Both paths render the same `packages/overlay` definition.

```
 ┌──────────────┐  SRT (HEVC/H.264)   ┌──────────────┐   pull   ┌──────────────────────┐  RTMPS H.264  ┌─────────┐
 │ Phone camera │ ──────────────────► │   Ingest     │ ───────► │ Compositor worker    │ ────────────► │ YouTube │
 │ (or external │  RTMP fallback      │  (MediaMTX)  │          │ 1 pipeline / session │               └─────────┘
 │  encoder)    │ ◄── return preview ─│              │ ◄─ low-res preview ─┘ overlay layer ▲
 └──────────────┘   (WebRTC/LL-HLS)   └──────────────┘                                    │ snapshot + events
        ▲                                                                                │ (session-scoped)
        │ assign session                                                          ┌──────┴────────┐
 ┌──────┴───────┐   events (outbox sync)   ┌──────────────┐   per-session channel │ Realtime      │
 │ Mobile app   │ ───────────────────────► │  Web/API     │ ────────────────────► │ (Durable Obj, │
 │ scoring +    │ ◄─────────────────────── │  Next.js     │                       │ 1 per session)│
 │ camera       │                          │  Neon (PG)   │ ◄──── controller ───► └───────────────┘
 └──────────────┘                          └──────┬───────┘   (assign worker, pre-warm, metering)
                                                  │ YouTube Data API (broadcasts), Stripe
```

### 5.1 Components
| Component | Tech | Notes |
|---|---|---|
| `apps/web` | Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Auth.js, Drizzle | Admin, branding editor, sponsors, stats, public pages, control room, API routes |
| `apps/mobile` | Expo (dev client) + React Native, TypeScript, expo-sqlite | Scoring (offline), camera streaming via native modules |
| `packages/db` | Drizzle schema + migrations, Neon Postgres | Single schema package used by web and services |
| `packages/scoring-engine` | Pure TypeScript, zero runtime deps | Event-sourced volleyball engine, rules presets, stat derivation. Shared everywhere. |
| `packages/overlay` | TypeScript + HTML/CSS templates | One overlay definition rendered in compositor, web preview, OBS browser source |
| `packages/protocol` | TypeScript types + zod schemas | Realtime envelope, sync API contracts |
| `services/realtime` | Cloudflare Workers + Durable Objects | One Durable Object per stream session (natural isolation boundary) **[VERIFY cost at M05]** |
| `services/ingest` | MediaMTX (SRT + RTMP ingest, WebRTC/LL-HLS preview) | Stream-ID auth per session |
| `services/compositor` | GStreamer pipelines on Linux GPU hosts (NVDEC/NVENC), worker agent in TypeScript or Rust | Overlay render approach chosen in M01 |
| `services/controller` | TypeScript service | Assigns sessions to workers, pre-warms from schedule, health checks, failover, metering |
| `modules/streaming-ios` | Swift, HaishinKit (via Expo Modules API) | SRT/RTMP publish **[VERIFY SRT support/maturity at M02]** |
| `modules/streaming-android` | Kotlin, RootEncoder (pedroSG94) (via Expo Modules API) | SRT/RTMP publish **[VERIFY at M02]** |

Hosting (initial): web on Vercel; realtime on Cloudflare; ingest/compositor/controller on dedicated GPU hosts chosen in M01 for cost (compute + egress).

---

## 6. Non-negotiable invariants

These are requirements, not guidelines. Each has an automated test (see §17).

- **I-1 Session isolation.** Every broadcast attempt is a `StreamSession` with an immutable ID. A compositor overlay renderer is bound to exactly one session for its whole life and is destroyed when the session ends. Renderers are **never** reused across sessions, teams, or matches.
- **I-2 Frozen theme snapshots.** At session start, all branding (colors, logos, fonts, sponsor set, layout options) is resolved into an immutable `ThemeSnapshot` with a content hash. The renderer only ever reads that snapshot. Editing branding mid-session creates a new snapshot that is explicitly pushed; nothing is read from mutable config.
- **I-3 Content-addressed assets.** Every image/font is stored and served by content hash (`/a/{sha256}.{ext}`), with immutable cache headers. A changed logo is a new URL. No mutable asset URLs anywhere in overlays.
- **I-4 Session-scoped messages.** Every realtime message carries `sessionId`, `gameId`, `teamId`, and a monotonic `seq`. Renderers and clients drop any message whose `sessionId` ≠ their bound session or whose `seq` ≤ last applied. On (re)connect, the server sends a full **snapshot** before any deltas.
- **I-5 Blank-until-verified.** A new renderer shows a neutral slate until it receives a snapshot whose `sessionId` matches. It never displays previous state.
- **I-6 Client reset on switch.** In web and mobile, every query cache key, subscription, and local store handle is keyed by `teamId` (and `gameId` where relevant). Switching team tears all of them down.
- **I-7 Event-sourced scoring.** Match state = `reduce(events)`. Events are append-only; corrections are new events (`Undo`, `Correction`). No mutable "current score" column is the source of truth.
- **I-8 Offline-first scoring.** Scoring never blocks on network. Events go to a local outbox and sync when possible. Losing connectivity for an entire match loses no data.
- **I-9 Single active scorer.** One device holds the scorer lease for a match at a time. The lease has a TTL (default 2 min) renewed by heartbeat; expiry permits takeover, which is recorded like an explicit handoff (ADR-016). (Avoids merge conflicts entirely.)
- **I-10 No dead air on YouTube during short outages (cloud sessions).** If contribution input drops, the compositor keeps the YouTube output alive with a branded slate showing the live scoreboard, and resumes the camera within 3 s of input returning.
- **I-11 What you preview is what YouTube gets.** In cloud mode the operator's preview comes from the compositor's actual output (low-res return feed). In device mode the preview is the composited frame being encoded. Never a separate local imitation.
- **I-12 No in-app purchases.** Billing is web-only.

---

## 7. Domain model (initial — Drizzle in `packages/db`)

| Table | Key fields |
|---|---|
| `users` | id, email, name, created_at |
| `organizations` | id, name, slug, timezone, default_theme_id |
| `org_memberships` | org_id, user_id, role (owner/admin) |
| `teams` | id, org_id, name, abbreviation, sport ('volleyball'), age_group, gender, theme_override_id, youtube_connection_id (nullable → falls back to org) |
| `team_memberships` | team_id, user_id, role (admin/coach/scorekeeper/videographer/follower) |
| `athletes` | id, org_id, first_name, last_name, grad_year, privacy_level — **persists across seasons** |
| `seasons` | id, team_id, name, starts_on, ends_on |
| `roster_entries` | season_id, athlete_id, jersey_number, positions[], active |
| `events` | id, org_id, name, venue, starts_on, ends_on, media_rights_status ('unknown'/'allowed'/'restricted'), media_rights_note |
| `opponents` | id, org_id, name, abbreviation, logo_asset_id, external_club_code (USAV/AAU code, nullable) |
| `games` | id, season_id, event_id (nullable), opponent_id, scheduled_at, court_label, rules_preset, rules_json, status, scoring_mode ('quick'/'stat') |
| `game_events` | id (ULID), game_id, client_id, client_seq, server_seq, type, payload_json, created_by, created_at — **append-only** |
| `scorer_leases` | game_id, device_id, user_id, acquired_at, released_at |
| `stream_sessions` | id, game_id, team_id, composite_mode ('device'/'cloud'), theme_snapshot_id, ingest_stream_id, worker_id, youtube_broadcast_id, state, started_at, ended_at, end_reason |
| `stream_session_health` | session_id, ts, input_bitrate, fps, dropped_frames, output_state, rtt — time-series (downsampled) |
| `themes` | id, owner_type ('org'/'team'), owner_id, tokens_json (colors, fonts, layout options), logo_asset_ids |
| `theme_snapshots` | id, content_hash, resolved_json, created_at — **immutable** |
| `assets` | sha256, mime, bytes, width, height, uploaded_by — content-addressed |
| `sponsors` | id, org_id, team_id (nullable = club-wide), name, asset_id, url, active_from, active_to, weight, placements[] |
| `sponsor_exposures` | session_id, sponsor_id, placement, on_screen_seconds, est_concurrent_viewers |
| `youtube_connections` | id, owner_type, owner_id, channel_id, channel_title, encrypted_refresh_token, scopes |
| `youtube_streams` | id, connection_id, yt_stream_id, ingest info (reusable stream key per team/device) |
| `season_stat_lines` | season_id, athlete_id, stat_json, rebuilt_at — **projection, rebuildable from events** |
| `subscriptions` | org_id, team_id, season_label, stripe_ids, included_hours, status |
| `usage_records` | session_id, team_id, stream_seconds, billed |

Projections (`season_stat_lines`, game box scores) are always rebuildable from `game_events`.

---

## 8. Volleyball scoring engine (`packages/scoring-engine`)

### 8.1 Rules configuration
```ts
type VolleyballRules = {
  format: { kind: 'bestOf'; sets: 3 | 5 } | { kind: 'playN'; sets: 2 | 3 }; // 'playN' = pool play, all sets played, splits allowed
  setPoints: number;            // default 25
  decidingSetPoints: number;    // default 15 (bestOf only)
  winBy: number;                // default 2
  pointCap: number | null;      // e.g. 27 in some pool play
  timeoutsPerSet: number;       // default 2
  subsPerSet: number | null;    // null = unlimited
  liberoTracking: boolean;
  timeCapMinutes: number | null;
};
```
Ship presets: `usav-juniors-pool`, `usav-juniors-bracket`, `nfhs-hs`, `aau`, `custom`. **[VERIFY preset values with club director before release]**

### 8.2 Events (initial set)
`MatchStarted(rules, home/away, firstServe)` · `LineupSet(set, team, rotation[6], liberoIds)` · `RallyWon(team)` · `StatAction(...)` (stat mode, attached to the current rally) · `Substitution(team, in, out)` · `LiberoReplacement(team, in, out)` · `Timeout(team)` · `SetEnded` (derived but recorded on confirm) · `MatchEnded` · `Undo(targetEventId)` · `Correction(targetEventId, replacement)` · `ScorerHandoff(fromDevice, toDevice)` · `ServeOverride(team)` (manual fix).

Opponent stats are team-level only (no opponent roster required).

### 8.3 Stat actions (Stat mode, Tier 2) and definitions
| Stat | Code | Definition |
|---|---|---|
| Kill | K | Attack resulting directly in point |
| Attack error | E | Attack out, into net, blocked for point, violation |
| Total attempts | TA | All attacks |
| Hitting % | — | (K − E) / TA |
| Assist | A | Set leading to kill |
| Ball-handling error | BHE | Lift/double |
| Service ace | SA | Serve results directly in point |
| Service error | SE | Serve fault |
| Serve attempts | SAtt | All serves |
| Reception rating | R0–R3 | 0 = reception error (ace against), 3 = perfect |
| Reception error | RE | = R0 count |
| Dig | DIG | Successful dig of attacked ball |
| Block solo | BS | |
| Block assist | BA | |
| Block error | BE | |
| Total blocks | TB | BS + 0.5 × BA |
| Points | PTS | K + SA + BS + 0.5 × BA |

Stat mode must stay fast enough for a parent scoring live: rally outcome first, stat attribution optional and editable after the rally.

### 8.4 Derived state
Score per set, sets won, serving team, server (rotation position 1), rotation per team, timeouts/subs remaining, set/match point flags, current-set lineups, box score, running team stats. All pure functions of the event list.

### 8.5 Engine API
```ts
applyEvent(state, event): Result<State, RuleViolation>
replay(events): State
validate(state, candidateEvent): RuleViolation[]
deriveBoxScore(events): BoxScore
deriveSeasonLine(gamesEvents[]): SeasonLine
```
Deterministic, no clocks or randomness inside the engine (timestamps come in on events).

---

## 9. Overlay system (`packages/overlay`)

### 9.1 Components (Phase 1, volleyball)
- **Scorebug:** team abbreviations/logos/colors, set score, current points, serving indicator, set number, timeout dots
- **Pre-match card:** teams, event name, court, sponsor
- **Lineup card:** starting rotation per set (stat mode)
- **Set summary / match final:** set scores + top performers (stat mode)
- **Player lower-third:** on kill/ace/block (stat mode, optional, rate-limited)
- **Sponsor bug:** rotating small logo slot
- **Sponsor slate:** full-screen at set breaks/timeouts (configurable)
- **Reconnecting slate:** branded, shows live scoreboard (I-10)
- **Event title bar:** tournament name, court

### 9.2 Rendering rules
- Overlay = `render(themeSnapshot, overlayState, layoutOptions)`. Same function feeds compositor, web preview, and an OBS browser-source URL.
- Overlay state updates only via session-scoped messages (I-4).
- 1920×1080 canvas, safe-area aware, scales to 1280×720.
- Animations: short and optional; renderer must remain correct with animations disabled (compositor approach may disable them for cost).
- Fonts from an approved, licensed list only.

### 9.3 Sponsor rotation
Weights, time windows, placements (bug, slate, pre-match). Exposure tracking writes `sponsor_exposures` (on-screen seconds; estimated concurrent viewers from YouTube where available **[VERIFY API field at M10]**). Monthly sponsor report export (PDF/CSV) per club.

---

## 10. Streaming pipeline

### 10.0 Composite mode (ADR-019)
- `device`: phone composites overlay into the encode pipeline (HaishinKit video effect / RootEncoder filter) and publishes RTMP(S) directly to the YouTube ingest URL. No cloud video path. On disconnect the app reconnects with backoff; YouTube shows its own offline card meanwhile **[VERIFY YouTube disconnect tolerance at M02]**.
- `cloud`: everything in §10.1–10.4 below.

### 10.1 Contribution (camera → ingest; cloud mode)
- **Preferred:** SRT, H.264 by default, HEVC when the device supports hardware HEVC encode.
- **Fallback:** RTMP.
- Resolution/frame rate: 1080p30 default; 1080p60 optional; 720p30 automatic downgrade under poor network or thermal pressure.
- Keyframe interval 2 s. Adaptive bitrate on contribution leg (target range 1.5–8 Mbps).
- Ingest auth: per-session stream ID/passphrase, short-lived.
- External encoders (Mevo, GoPro, OBS): session-specific RTMP/SRT URL shown as text and QR.

### 10.2 Compositor (per session)
`ingest pull → decode (NVDEC) → composite overlay layer (RGBA) → encode (NVENC H.264, CBR) → RTMPS to YouTube`
- Output: 1080p30 (or 60) H.264, AAC 128k. Bitrate profiles configurable **[VERIFY YouTube recommended ranges at M07]**.
- Input-loss detector → switch to reconnecting slate (I-10) with silent audio, keep output timeline continuous. Max slate duration configurable (default 10 min) then graceful end.
- Worker crash → controller reassigns session to warm spare, output resumes; target < 15 s **[VERIFY YouTube ingest reconnect tolerance at M07]**.
- Emits health metrics every 2 s.

### 10.3 Overlay render approach — decided in M01
Benchmark and pick by **cost per stream-hour** and fidelity:
- (A) WPE WebKit (`wpesrc`) rendering the HTML overlay live inside GStreamer
- (B) Headless Chromium rasterizing the overlay only when state changes → RGBA frame → `appsrc`
- (C) Native 2D rendering (e.g., Skia) from the overlay layout definition, re-rendered only on change
Constraint: whichever is chosen, the web preview must render identically from the same overlay definition.

### 10.4 Return preview
Compositor publishes a low-res (360p, ~500 kbps) copy back through ingest; mobile plays it via WebRTC or LL-HLS (I-11). Target glass-to-glass ≤ 3 s **[VERIFY in M07]**.

### 10.5 Device resilience (mobile)
Screen kept awake; thermal state monitored with automatic downgrade; battery and storage warnings; automatic reconnect with backoff; optional local backup recording (segmented MP4) — upload is Phase 2.

---

## 11. YouTube integration
- OAuth connection at org level (club channel) with optional team-level override channel.
- Per match: create `liveBroadcast` (title template, description, privacy default per team, **made-for-kids flag required at setup**), bind to a **reusable** `liveStream` per team or device, transition states via API.
- Goal: one camera connection stays up across back-to-back matches, each match its own YouTube video **[VERIFY rebinding a reusable stream across sequential broadcasts at M10]**.
- Concurrent streams: multiple teams from one club live simultaneously on one channel **[VERIFY limits at M10]**.
- Fallback: user pastes a stream key; compositor targets it; no per-match automation.
- Google OAuth app verification for YouTube scopes takes time — **submit early (start during M03)**; request minimum necessary scopes. Track API quota usage per day; alert at 70%.

---

## 12. Mobile app (Expo)
- Auth, team switcher, Game Day screen, Next Match.
- Modes: **Score**, **Camera**, **Camera + Quick Score** (single-parent setup: score buttons overlaid on camera view).
- Local store: expo-sqlite; outbox of events with `client_id` + `client_seq`; server assigns `server_seq` under scorer lease.
- Scorer lease acquire/release/handoff UI.
- Operator view while streaming: return preview, live/health indicator (bitrate, fps, connection, thermal), big Stop and Next Match controls, overlay quick toggles (show lineup, sponsor slate).

## 13. Web app (Next.js)
- Club admin: teams, users/roles, seasons, rosters, athletes, events, opponents, schedule import (CSV first).
- Branding editor with **live preview** using `packages/overlay`.
- Sponsor manager + reports.
- Control room: per-session view (preview, health, overlay controls) for a remote producer.
- Stats: game box scores, season stats, leaderboards.
- Public team pages (privacy-controlled), embedding current/next YouTube stream + live scoreboard.
- Web share-link scorer (Quick mode only, scoped token, expires after match).
- Billing portal (Stripe Checkout/Customer Portal).

## 14. Realtime protocol (`packages/protocol`)
```ts
type Envelope = {
  v: 1;
  sessionId: string;   // stream session (or 'none' for non-streamed scoring)
  gameId: string;
  teamId: string;
  seq: number;         // monotonic per session
  ts: string;          // server time ISO
  type: 'snapshot' | 'event' | 'theme' | 'control';
  payload: unknown;    // zod-validated per type
};
```
- Channel = one Durable Object per `sessionId` for streamed games (all subscriber roles share it); a per-`gameId` Durable Object only for games scored without a stream (ADR-017).
- Connect → server sends `snapshot` → then ordered deltas. Gap in `seq` → client requests snapshot.
- Auth: short-lived signed tokens scoped to one session/game and a role (renderer, scorer, viewer).

## 15. Billing & metering
- Stripe Products: monthly team plan (with included hours), overage per hour; club-level invoicing. All price inputs live in an admin-editable config (ADR-014).
- Metering: controller writes `usage_records` from session start/end (only time while output is live to YouTube).
- Prices computed from `docs/COST_MODEL.md` via the §2.1 formula; store price inputs so they can be re-derived when costs change.
- Trial: limited included hours (exact number set from cost model).

## 16. Compliance, privacy, event rights
- **Minors:** athletes are minors. Public pages default to first name + last initial + jersey; full names and photos opt-in at club level. No athlete accounts required. Users must be adults (18+) to create accounts.
- Club agreement (subscription terms): club is responsible for parent/guardian consent to stream and publish stats, and chooses the roster display level used by overlays, YouTube titles, and public pages (ADR-018).
- **Event media rights:** many large club volleyball events have exclusive streaming partners (BallerTV holds long-term media rights with hundreds of club organizations and streams major USAV/AAU events). Before streaming at an `event`, the operator confirms the event allows team streaming; status stored on the event; warning shown when `restricted`/`unknown`. Not legal advice; club is responsible.
- YouTube terms and made-for-kids designation are the channel owner's responsibility; app requires an explicit choice.
- Store OAuth refresh tokens encrypted; least-privilege scopes.

## 17. Non-functional requirements (SLOs) and test strategy

| Requirement | Target | Test |
|---|---|---|
| Overlay isolation (I-1..I-6) | **0 frames** of wrong-session overlay | Randomized switch harness: 1,000 rapid A→B→A→C switches; frame-sample OCR/hash check against expected snapshot |
| Score-to-screen latency | ≤ 1 s p95 (online) | Timestamped event → frame detection |
| Input dropout | YouTube output stays live; camera resumes ≤ 3 s after return | netem chaos tests on contribution leg |
| Worker failure | Output resumes ≤ 15 s | Kill worker during session |
| Mobile soak | 3 h at 1080p30 on reference devices, no crash/thermal shutdown (auto-downgrade allowed) | Manual + scripted soak, logged |
| Offline scoring | Full match offline, zero data loss | Airplane-mode E2E (Maestro) |
| Mobile crash-free sessions | ≥ 99.5% | Sentry |
| Engine correctness | 100% golden fixtures pass | Unit + property tests (fast-check) + replay of real matches |

Reference devices **[CONFIRM at M02]**: a 3–4-year-old iPhone and a mid-range Android.

Testing stack: Vitest (packages), fast-check (engine), Playwright (web + overlay visual regression), Maestro (mobile E2E), GStreamer/netem harness (compositor).

## 18. Open items / VERIFY list
| Item | Milestone |
|---|---|
| Overlay render approach + measured cost per stream-hour (compute + egress), cloud path | M01 |
| On-device compositing thermal cost; YouTube disconnect tolerance for device-direct | M02 |
| Host provider for GPU compositor (cost, egress, US regions) | M01 |
| HaishinKit / RootEncoder SRT + HEVC maturity, thermal behavior | M02 |
| Mobile auth approach with Auth.js (token exchange) | M03 |
| Durable Objects cost model at expected message volume | M05 |
| YouTube bitrate recommendations, ingest reconnect tolerance | M07 |
| Reusable stream rebinding, concurrent streams per channel, viewer-count field, quota per operation | M10 |
| Volleyball rules preset values | M04 (with club director) |
| Apple/Google link-out and purchase rules | M13 |
| SidelineHD volleyball support (marketing claim) | Pre-launch |
