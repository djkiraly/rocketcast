# Decision Log

Append new decisions at the bottom. Never edit an accepted decision; supersede it with a new entry.
Format: ID · date · status · decision · why · consequences.

---

### ADR-001 · 2026-10-23 · Accepted

**Subscriber is the team; buyer is the travel club.**
Users may belong to many teams across many clubs. Clubs manage and pay for many teams.
_Consequences:_ Org → Team hierarchy, club invoicing, club-level branding/sponsors with team overrides, global team switcher, Game Day view across teams.

### ADR-002 · 2026-10-23 · Accepted

**Overlays are composited in the cloud, not on the device.**
Camera sends a clean feed (SRT preferred) to our ingest; a compositor worker adds overlays and pushes RTMPS to YouTube.
_Why:_ one overlay engine for every camera source (phone, Mevo, GoPro, OBS); keeps YouTube live with a slate during short outages; overlay correctness is controlled server-side.
_Consequences:_ per-stream-hour compute + egress cost; compositor reliability becomes critical path. **Revisit if M01 measured cost per stream-hour cannot support a price competitive with SidelineHD's paid tiers.**

### ADR-003 · 2026-10-23 · Accepted

**1080p is the ceiling.** Default 1080p30, optional 1080p60, automatic 720p downgrade. No 4K.

### ADR-004 · 2026-10-23 · Accepted

**Cost-plus pricing at 35% gross margin.** price = cost / 0.65 (adjusted for payment fees). Streaming is not a profit center.
_Consequences:_ every infra choice is judged on cost per stream-hour; usage metering is required; web-only billing (ADR-005).

### ADR-005 · 2026-10-23 · Accepted

**Billing is web-only (Stripe). No in-app purchases.**
_Why:_ 15–30% store fees would consume most of the margin.

### ADR-006 · 2026-10-23 · Accepted

**Volleyball (club/travel) is the Phase 1 sport.** Softball/baseball follow in Phase 2.
_Why:_ nearest season window (club season runs winter–summer), indoor venues with more reliable networks, simpler scoring rules, apparent gap in the primary competitor, and a director-level beta customer is available.

### ADR-007 · 2026-10-23 · Accepted

**Primary competitor is SidelineHD.** Differentiate on overlay correctness across team/match switches, stability, season-long stats, volleyball support, and club-wide sponsor reporting. Secondary: GameChanger (viewer paywall, $239/season team pass).

### ADR-008 · 2026-10-23 · Accepted

**Overlay isolation invariants I-1 through I-6 (SPEC §6) are non-negotiable** and covered by an automated randomized switch test that must pass on every build touching overlay, realtime, compositor, or client state.

### ADR-009 · 2026-10-23 · Accepted

**Scoring is event-sourced, offline-first, single active scorer per match.** Season stats are projections rebuilt from events.

### ADR-010 · 2026-10-23 · Accepted

**Stack:** pnpm + Turborepo monorepo; Next.js / TypeScript / Tailwind / shadcn/ui / Drizzle / Neon / Auth.js for web; Expo + React Native with native streaming modules (HaishinKit on iOS, RootEncoder on Android) for mobile; Cloudflare Durable Objects for realtime; MediaMTX for ingest; GStreamer on GPU hosts for compositing.
_Open within this ADR:_ overlay render approach (M01), GPU host provider (M01), mobile auth token exchange (M03).

### ADR-011 · 2026-10-23 · Accepted

**YouTube is the only output destination in Phase 1.** Output is behind an adapter interface so others can be added later.

### ADR-012 · 2026-10-23 · Accepted

**Event media-rights check before streaming at tournaments.** Many large club volleyball events have exclusive streaming partners. The app records each event's rights status and warns the operator; the club is responsible.

### ADR-013 · 2026-10-23 · Accepted

**Product name is RocketCast, published by RocketCore.**
Package scope `@rocketcast/*`; bundle ID `com.rocketcore.rocketcast`; name lives in one brand constants file.
_Known risk:_ an existing App Store app named "Rocket Video Cast" is similar. Before store submission, complete a USPTO search (classes 009, 038, 041, 042), domain check, App Store/Google Play exact and near-match search, and YouTube handle check. If clearance fails, the brand constants file and package scope are the only code changes required.

### ADR-014 · 2026-10-23 · Accepted

**Billing is a monthly subscription per team; prices are administratively configurable.**
Supersedes the per-season packaging implied in ADR-001/ADR-004 consequences (the team remains the subscriber, the club the buyer, and the 35% cost-plus rule still sets the numbers). Price points, included stream-hours, trial allowance, and overage rates are stored as admin-editable configuration, seeded with placeholders, and set for real after the app is complete and M01/M14 cost data exists. Overage structure is detailed once expected costs are known (M13).
_Consequences:_ COST_MODEL and SPEC §2/§15 are expressed per team-month; Stripe Products/Prices are generated from the config table, not hard-coded; a pricing admin UI is in M13 scope; seasonal churn (clubs pausing off-season) is expected and must not break stats or branding continuity.

### ADR-015 · 2026-10-23 · Accepted

**Next Match enforces a minimum separation when the next broadcast targets the same YouTube channel (default 5 min, configurable).**
_Why:_ ending one `liveBroadcast` and bringing the next to live is slower than the < 10 s overlay target, and reusable-stream rebinding behavior is unverified until M10.
_Consequences:_ the < 10 s target applies to "correct overlay in compositor output"; the YouTube transition completes inside the separation window; the operator sees a countdown and the camera connection stays up throughout.

### ADR-016 · 2026-10-23 · Accepted

**Scorer lease is time-limited: default 2 minutes, renewed by heartbeat while the device is active.**
If no heartbeat arrives within the TTL, another authorized device may acquire the lease without an explicit handoff; the takeover is recorded as a `ScorerHandoff` event. A device that keeps scoring offline past its expiry still stores events locally (I-8); on sync, events after the expiry are accepted only if no other device acquired the lease in between, otherwise they are held for review. Exact TTL and review UX are configurable and finalized at M05/M08.

### ADR-017 · 2026-10-23 · Accepted

**Realtime topology and renderer lifecycle optimize for cost within the invariants.**
One Durable Object per `sessionId` carries all subscribers of a streamed game (renderer, control room, public viewers); a per-`gameId` Durable Object exists only for games scored without a stream. Renderers remain one-per-session (I-1); M01 selects whichever render approach is cheapest per stream-hour while honoring that, benchmarked with fresh renderer instances per session, not a warm pool.

### ADR-018 · 2026-10-23 · Accepted

**Minors' privacy is handled in the subscription agreement; the club decides what appears on stream.**
The club warrants parent/guardian consent and chooses roster display levels; overlay components (lineup card, lower-thirds), YouTube titles, and public pages all read the same per-club privacy setting, which defaults to least exposure.

### ADR-019 · 2026-10-24 · Accepted (supersedes the "cloud only" part of ADR-002)

**Hybrid compositing: on-device composite + direct-to-YouTube is the default path for phone cameras; the cloud compositor is the path for external encoders and for clubs that want outage resilience.**
_Why:_ device-direct removes compositor compute and egress (the two largest variable costs) and is how the incumbents work; the cloud path is the only way to honor I-10 (branded slate during outages) and to add overlays to Mevo/GoPro/OBS sources. Which path a session uses is a per-session property (`composite_mode: 'device' | 'cloud'`).
_Consequences:_

- One overlay definition (`packages/overlay`) must render in three places: the phone's encode pipeline, the web preview, and the cloud worker. The render approach chosen in M01 must have an on-device equivalent, which favors HTML-free approaches (native 2D from a JSON layout) or a shared raster contract.
- M02 adds on-device compositing to its soak and measures the thermal cost and YouTube's tolerance of a disconnected contribution. M01 sizes the cloud path as the premium/external-encoder path, not the only path; its go/no-go gate becomes "is the cloud path priceable as an add-on", not "is the product viable".
- I-10 and the 15 s failover target apply only to `cloud` sessions. For `device` sessions the app shows the operator a clear "YouTube will show offline" state and reconnects as fast as possible.
- I-11 (preview = output) is satisfied on device by previewing the composited frame; in cloud mode by the return feed.
- I-1 through I-6 apply to the on-device renderer exactly as to the cloud renderer; the isolation harness runs against both.
- COST_MODEL gains a per-path cost line; pricing may differentiate the cloud path (ADR-014 keeps it admin-configurable).

---

## Pending decisions (resolve in the named milestone, then add an ADR)

| Topic                                                                                                     | Milestone       |
| --------------------------------------------------------------------------------------------------------- | --------------- |
| Overlay render approach (WPE vs rasterize-on-change vs native 2D), with an on-device equivalent (ADR-019) | M01 + M02       |
| Final hybrid split: which sessions default to device vs cloud; cloud path priced as add-on?               | after M01 + M02 |
| GPU host provider and region(s)                                                                           | M01             |
| Contribution codec default (H.264 vs HEVC) per platform                                                   | M02             |
| Mobile auth flow with Auth.js                                                                             | M03             |
| Volleyball rules preset values                                                                            | M04             |
| `playN` split handling, undo dependency semantics, stat edge cases (ask David as they arise)              | M04             |
| Scorer lease TTL final value and expired-lease review UX                                                  | M05 / M08       |
| Overage structure and included hours per team-month                                                       | M13             |
| Return-preview transport (WebRTC vs LL-HLS)                                                               | M07             |
| Per-team vs per-device reusable YouTube stream                                                            | M10             |
| Final price points (placeholders until app completion; admin-configurable)                                | post-M14        |
