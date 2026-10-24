# M03 — Data model, auth, tenancy, and web shell

**Goal:** users can sign in, belong to multiple clubs and teams with roles, switch teams cleanly, and manage rosters, seasons, events, opponents, and schedules on the web. Mobile can authenticate against the same accounts.

**Read first:** SPEC §3, §7, §6 (I-6), §13, §16.

## Scope

- Drizzle schema + migrations for: users, organizations, org_memberships, teams, team_memberships, athletes, seasons, roster_entries, events, opponents, games (without scoring tables beyond `games`), assets (content-addressed), themes (stub).
- Auth.js on web (email magic link + Google). Users must confirm they are 18+.
- **Mobile auth:** design and implement a token exchange so the Expo app can sign in with the same accounts (short-lived access token + refresh token, revocable per device). Record as an ADR.
- Authorization layer: a single `can(user, action, resource)` module with role rules from SPEC §3.2, unit-tested.
- Web shell: org/team navigation, **global team switcher**, Game Day page (today's games across all my teams).
- CRUD: teams, memberships/invites, athletes (persist across seasons), seasons, roster entries, events (incl. `media_rights_status`), opponents (incl. optional USAV/AAU club code), games.
- Schedule import from CSV (documented column format).
- Asset upload endpoint that stores by sha256 and serves `/a/{sha256}.{ext}` with immutable cache headers (I-3).
- Client cache keys include `teamId`; switching team clears team-scoped caches (I-6).

## Acceptance criteria

- [ ] A user in two clubs and three teams sees only permitted data and can switch teams; a test proves no team-scoped query result survives a switch.
- [ ] Role matrix covered by unit tests for every action in SPEC §3.2.
- [ ] Mobile app signs in, refreshes tokens, and can call an authenticated API endpoint.
- [ ] Uploading the same image twice yields one asset; changing a logo yields a new URL.
- [ ] CSV schedule import creates games and reports row-level errors.
- [ ] Public-facing athlete display helper defaults to first name + last initial + jersey.

## Out of scope

Scoring, streaming, branding editor, billing.

## Reminder for David

Submit Google OAuth app verification for YouTube scopes now (see KICKOFF §5).
