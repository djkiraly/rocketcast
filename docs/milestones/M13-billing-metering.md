# M13 — Billing and usage metering

**Goal:** clubs pay per team per season on the web, with included stream-hours and transparent overage, at prices derived from measured cost + 35% margin.

**Read first:** SPEC §2, §15; ADR-004, ADR-005; docs/COST_MODEL.md.

## Scope
- Stripe Products/Prices generated from a config file whose values come from COST_MODEL (store the inputs, not just the outputs).
- Club checkout for N team-seasons; add a team mid-season (prorated or flat — ADR); club invoices.
- Included hours per team-season; usage from `usage_records`; overage billed monthly; in-app (web) usage meter per team and per club.
- Soft limits: warn club admins at 80% and 100% of included hours; **never cut a live stream mid-match** for billing reasons — cap applies to starting new sessions after a grace allowance.
- Trial: limited included hours (value from COST_MODEL).
- Stripe Customer Portal for payment methods and invoices; webhooks update `subscriptions`.
- Mobile apps: no purchase UI. Show plan status only, worded per current store rules — [VERIFY] Apple/Google US rules on linking to web purchase; document the exact allowed wording.

## Acceptance criteria
- [ ] Price recomputation from COST_MODEL inputs is a single command and produces the documented formula's result.
- [ ] Simulated season: usage → overage invoice amounts are correct (tests with fixtures).
- [ ] Live stream continues when a team crosses its included hours mid-match.
- [ ] Webhook replay is idempotent.
- [ ] Store-rule review recorded in NOTES-M13.md with sources.

## Out of scope
Viewer payments, sponsor payments.
