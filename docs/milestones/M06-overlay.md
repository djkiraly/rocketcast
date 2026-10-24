# M06 — Overlay package and theme snapshots

**Goal:** one overlay definition that renders identically in the compositor, the web preview, and an OBS browser source — driven only by an immutable theme snapshot and session-scoped state.

**Read first:** SPEC §6 (I-1, I-2, I-3, I-5), §9, M01 notes (chosen render approach), ADRs from M01.

## Scope

- `ThemeSnapshot` resolver: org theme + team override + active sponsors + layout options → resolved JSON with content hash; stored in `theme_snapshots` (immutable). Same inputs always produce the same hash.
- Theme tokens: primary/secondary/accent colors, text-on-color contrast (auto-checked, WCAG AA for scorebug text), logo asset hashes, abbreviation (≤ 4 chars), font from approved list, scorebug position/style options.
- Overlay components from SPEC §9.1, implemented in the format chosen in M01.
- `render(themeSnapshot, overlayState, layoutOptions)` entry point; 1920×1080 canvas, scales to 720p; animations optional.
- Renderer lifecycle (I-5): starts on a neutral slate; binds to one `sessionId`; renders only after a matching snapshot; tears down fully on session end.
- Sponsor rotation logic (weights, windows, placements) as a pure function of time + snapshot; exposure counters emitted as events.
- Web preview page and **OBS browser-source URL** (`/overlay/:sessionId?token=…`) using the same renderer.
- Visual regression: Playwright screenshots of each component × 3 sample themes (light colors, dark colors, low-contrast pair that must be auto-corrected).

## Acceptance criteria

- [ ] Changing a team logo mid-session does not change the live overlay until a new snapshot is explicitly pushed; then it changes within 2 s.
- [ ] Snapshot hash is stable for identical inputs (property test).
- [ ] Visual regression suite passes; compositor output frame matches web preview frame within a documented tolerance.
- [ ] Renderer given messages for a different session shows nothing from them (test).
- [ ] Sponsor rotation respects weights within ±5% over a simulated 2-hour session.

## Out of scope

Branding editor UI (M11), compositor production service (M07).
