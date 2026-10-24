import { Radio } from "lucide-react";
import { BRAND } from "@rocketcast/config/brand";
import { Button } from "@/components/ui/button";

/**
 * Placeholder home page (M00). Kept synchronous and side-effect free so it can be rendered
 * directly in unit tests.
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-card bg-brand-100 text-brand-600">
        <Radio className="size-7" aria-hidden="true" />
      </span>
      <h1 className="text-5xl font-bold tracking-tight">{BRAND.productName}</h1>
      <p className="max-w-xl text-lg text-muted-foreground">{BRAND.tagline}</p>
      <Button type="button">Get started</Button>
      <p className="text-sm text-muted-foreground">by {BRAND.publisher}</p>
    </main>
  );
}
