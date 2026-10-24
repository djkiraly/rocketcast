// Hand-written equivalent of `wrangler types --include-runtime=false` output.
// Runtime types come from @cloudflare/workers-types (tsconfig "types"); this file only declares
// the bindings from wrangler.jsonc. Regenerate with `pnpm --filter @rocketcast/realtime cf-typegen`
// after changing bindings.
declare namespace Cloudflare {
  interface Env {
    SESSION: DurableObjectNamespace<import("./src/index").SessionDO>;
  }
}
interface Env extends Cloudflare.Env {}
