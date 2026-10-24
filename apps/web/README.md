# @rocketcast/web

Next.js (App Router) web app: admin, team branding, sponsors, season stats, public pages and the
HTTP API. Styled with Tailwind 4 and shadcn/ui.

## Run

From the repo root (after a single `pnpm install` at the root):

```sh
pnpm --filter @rocketcast/web dev        # http://localhost:3000
pnpm --filter @rocketcast/web build
pnpm --filter @rocketcast/web lint
pnpm --filter @rocketcast/web typecheck
pnpm --filter @rocketcast/web test
```

Copy `.env.example` to `.env.local` and fill in values before running anything that touches the
database or auth.

## Where the product name comes from

The product name, publisher, tagline and bundle ID are hard-coded in exactly one place:
`packages/config/src/brand.ts`, consumed here as `@rocketcast/config/brand` (see `app/layout.tsx`
and `app/page.tsx`). Never type "RocketCast" or "RocketCore" into this app directly. Because that
file ships as TypeScript source, `next.config.ts` lists `@rocketcast/config` in `transpilePackages`.

## Styling

- `app/globals.css` imports Tailwind, then the shared preset `@rocketcast/config/tailwind/preset.css`
  (fonts, `brand-*` colors, `radius-card`), then the shadcn/ui token block (`:root` / `.dark` /
  `@theme inline`). These are app-chrome tokens only; team colors come from `ThemeSnapshot` at
  runtime, never from CSS.
- Add shadcn/ui components from this directory:

  ```sh
  cd apps/web
  pnpm dlx shadcn@latest add <component>
  ```

  `components.json` (style `new-york`, base color `neutral`, CSS variables) tells the CLI where to
  put files: `components/ui/*`, `lib/utils.ts` (`cn()`), alias `@/*` -> `./*`.

## Tests

Vitest + jsdom + Testing Library. Test files live next to the code they test (`*.test.ts(x)`).
Page components meant to be unit-tested should stay synchronous (no `async` server components) so
they can be rendered directly; move data loading into child components or route handlers.
