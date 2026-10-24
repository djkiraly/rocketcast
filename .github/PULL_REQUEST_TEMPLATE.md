## Summary

<!-- One or two sentences: what changed and why. Link the milestone file, e.g. docs/milestones/M05-realtime.md -->

Milestone: M__

## Checklist

- [ ] Title is a conventional commit (`feat(scoring): ...`, `fix(realtime): ...`, `docs: ...`)
- [ ] Scope stays inside the referenced milestone (nothing from the next one)
- [ ] Tests added or updated for new behavior; `pnpm lint && pnpm typecheck && pnpm test` pass
- [ ] Docs updated where relevant (`SPEC.md`, `DECISIONS.md` ADR, `COST_MODEL.md`, `NOTES-Mxx.md`)
- [ ] Invariants touched? (SPEC §6 I-1..I-11) If yes, list them and the invariant test that covers each:
  -
- [ ] No secrets, no mutable asset URLs, no mobile IAP code, minors' data kept to least exposure
