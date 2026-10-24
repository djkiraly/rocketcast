# RocketCast — Kickoff: how to hand this to Claude Code

## 1. Set up the repo

1. Git repo: `git init` at the first M00 commit; remote `https://github.com/djkiraly/rocketcast.git`.
2. Copy this bundle into it: `CLAUDE.md` at the root, `docs/` as-is.
3. Open Claude Code in the repo root.

## 2. First prompt (paste as-is)

```
You are the lead engineer on this project. Read CLAUDE.md, docs/SPEC.md,
docs/DECISIONS.md, and docs/COST_MODEL.md in full before doing anything.

Then:
1. Summarize back, in under 300 words, the product, the non-negotiable
   invariants (SPEC §6), and the business constraint that drives
   infrastructure choices. Flag anything in the spec that looks
   contradictory, risky, or underspecified.
2. List every [VERIFY] item and which milestone resolves it.
3. Do not write code yet. Wait for my go-ahead.
```

## 3. Per-milestone prompt (paste for each milestone, changing the file name)

```
Execute docs/milestones/M00-scaffold.md.

Follow CLAUDE.md "How to work": write docs/milestones/NOTES-M00.md with your
plan first, then implement. Stay inside this milestone's scope. If you hit a
decision the spec leaves open, add an ADR. When finished, check off each
acceptance criterion in NOTES-M00.md with evidence (test name, command, or
output), list anything deferred, and stop.
```

## 4. Milestone order

| #   | File                         | Type                 | Rough size*                      |
| --- | ---------------------------- | -------------------- | -------------------------------- |
| M00 | M00-scaffold.md              | Build                | 2–3 days                         |
| M01 | M01-spike-compositor-cost.md | **Spike — go/no-go** | 1–2 weeks                        |
| M02 | M02-spike-mobile-encoder.md  | **Spike — go/no-go** | 1–2 weeks                        |
| M03 | M03-data-auth-web-shell.md   | Build                | 1–2 weeks                        |
| M04 | M04-scoring-engine.md        | Build                | 1–2 weeks                        |
| M05 | M05-realtime.md              | Build                | 1 week                           |
| M06 | M06-overlay.md               | Build                | 1–2 weeks                        |
| M07 | M07-ingest-compositor.md     | Build                | 2–3 weeks                        |
| M08 | M08-mobile-scoring.md        | Build                | 2 weeks                          |
| M09 | M09-mobile-camera.md         | Build                | 2–3 weeks                        |
| M10 | M10-youtube.md               | Build                | 1–2 weeks (+ Google review time) |
| M11 | M11-branding-sponsors.md     | Build                | 2 weeks                          |
| M12 | M12-season-stats-public.md   | Build                | 1–2 weeks                        |
| M13 | M13-billing-metering.md      | Build                | 1 week                           |
| M14 | M14-hardening-beta.md        | Build                | 2 weeks + field testing          |

*Solo developer with Claude Code; real-device testing time is extra and is usually the long pole.

## 5. Things only you can do (start early)

- **Clear the RocketCast name** — USPTO search, rocketcast domain options, App Store/Google Play near-matches (an app called "Rocket Video Cast" exists), YouTube handle. Do this before logos, domains, or store listings (ADR-013).
- **Google OAuth verification** for YouTube scopes — submit during M03; review can take weeks.
- **Apple Developer / Google Play accounts** and test devices (one 3–4-year-old iPhone, one mid-range Android).
- **A GPU host account** for M01 benchmarking.
- **Volleyball rules presets** — confirm values (subs per set, caps, pool-play formats) for M04.
- **Beta club** — line up 2–3 teams to stream real matches before M14.
- **Field tests** — Claude Code can't hold a phone in a gym for three hours. Soak tests on real devices are yours.

## 6. Go/no-go gates

- **After M01 + M02 (ADR-019 hybrid):** device path must hold 1080p30 with overlay for 3 h; cloud path must be priceable as an add-on at 35% margin. If the cloud path fails, ship device-only and defer external encoders. If the device path fails, resolve before M09 (720p default, change library, or native camera shell).
