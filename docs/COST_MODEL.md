# Cost Model

Filled in during M01 (measured) and kept current. Prices in `SPEC.md §2` are derived from this file.

## Formula
```
cost_per_team_month = H * C_hr + F_team
price_per_team_month = (cost_per_team_month + stripe_fixed) / (0.65 - stripe_pct)   # ADR-014: monthly, admin-configurable
overage_price_per_hour = C_hr / (0.65 - stripe_pct)
```

## Inputs

Two session paths (ADR-019). `device` sessions have C_compute = C_egress = C_ingest ≈ 0; only F_team applies. `cloud` sessions use the full C_hr below. Expected mix of device vs cloud hours is an input to be set from beta data.

| Symbol | Meaning | Value | Source / date |
|---|---|---|---|
| share_cloud | Fraction of stream-hours on the cloud path | TBD (assume 20% until beta) | Assumption |

| Symbol | Meaning | Value | Source / date |
|---|---|---|---|
| H | Stream-hours per team per month (volleyball) | ~7.5 (assumption: ~45 matches × ~1 h over ~6 months; higher in tournament months) | Assumption — replace with beta data |
| C_compute | Compositor compute per stream-hour | TBD | M01 benchmark |
| C_egress | Egress per stream-hour: YouTube leg ≈2.7 GB at 6 Mbps, return preview ≈0.23 GB at 0.5 Mbps, plus any ingest→compositor hop if not co-located | TBD | Host pricing |
| C_ingest | Ingest/relay per stream-hour | TBD | M01 |
| C_hr | C_compute + C_egress + C_ingest | TBD | |
| F_team | Fixed allocation per team-month (DB, realtime, web hosting, monitoring, dev accounts, support time) | TBD | |
| stripe_pct / stripe_fixed | Payment fees | TBD | Stripe pricing at M13 |

## M01 benchmark record
| Render approach | Streams per host | Host $/hr | Compute $/stream-hr | Notes (CPU/GPU %, memory, latency, fidelity) |
|---|---|---|---|---|
| A: WPE WebKit | | | | |
| B: Rasterize-on-change (Chromium) | | | | |
| C: Native 2D (Skia) | | | | |

## Viability check
Target: monthly price per team lands at or below SidelineHD's paid-tier range ($3–$21/mo), compared month to month.
If not achievable, record findings here and raise a superseding ADR to ADR-002 before continuing past M01.
