# @rocketcast/config

Shared presets for every workspace, plus the **single brand constants file**.

| Export | Use |
|---|---|
| `@rocketcast/config/brand` | `BRAND.productName`, `BRAND.publisher`, `BRAND.bundleId` — the only hard-coded product name (ADR-013) |
| `@rocketcast/config/eslint` | `base`, `node`, `browser`, `pureEngine` flat-config fragments |
| `@rocketcast/config/prettier` | Prettier config |
| `@rocketcast/config/tailwind/preset.css` | Tailwind 4 `@theme` tokens for app chrome |
| `@rocketcast/config/tsconfig/*.json` | `base`, `library`, `node`, `nextjs`, `react-native`, `workers` |

## Renaming the product
Edit `src/brand.ts`. Then rename the `@rocketcast/*` package scope (search/replace in `package.json` files) and update `apps/mobile/app.json` bundle identifiers, which read from `brand.ts` via `app.config.ts`.
