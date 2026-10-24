# M11 — Branding editor and sponsor manager

**Goal:** a club admin sets club branding once, teams override where they need to, and sponsors run across all of the club's streams with reports the club can hand to sponsors.

**Read first:** SPEC §9, §6 (I-2, I-3), §7 (themes, sponsors, sponsor_exposures); M06.

## Scope

### Branding

- Club theme editor with **live preview** (M06 renderer) of every overlay component.
- Team overrides: any token can be overridden; "reset to club" per token.
- Logo upload with background-removal guidance, size/format validation, automatic dark/light variant check.
- Contrast checker (WCAG AA) with auto-suggested fixes.
- Abbreviation and opponent display rules (opponent logo optional; neutral styling when missing).
- Publishing a theme change shows which live sessions are affected and pushes new snapshots only on explicit confirm (I-2).

### Sponsors

- Club-wide and team-specific sponsors; placements (bug, slate, pre-match); weights; date windows; per-sponsor caps.
- Inventory view: which sponsors show on which teams' streams this season.
- Exposure accounting from M06 counters + viewer estimates (M10) → `sponsor_exposures`.
- **Sponsor report:** per sponsor, per month: streams, on-screen minutes, estimated views, sample frame captures; export PDF + CSV. Plain, proof-first presentation — numbers and screenshots, no hype.

## Acceptance criteria

- [ ] Club theme change applies to all teams without overrides on their **next** session; live sessions change only after confirm.
- [ ] Team override + reset-to-club works per token.
- [ ] Sponsor report totals reconcile with raw exposure records.
- [ ] Low-contrast color pair is flagged and a compliant alternative is suggested.
- [ ] Visual regression suite extended with editor-produced themes.

## Out of scope

Selling sponsorships, payments from sponsors.
