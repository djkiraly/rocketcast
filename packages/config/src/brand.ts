/**
 * The ONLY place the product and publisher names are hard-coded (CLAUDE.md, ADR-013).
 * If name clearance fails, change these values and the package scope; nothing else.
 */
export const BRAND = {
  /** Product name shown to users. */
  productName: "RocketCast",
  /** Legal publisher / developer name. */
  publisher: "RocketCore",
  /** Reverse-DNS bundle / application ID for iOS and Android. */
  bundleId: "com.rocketcore.rocketcast",
  /** URL scheme for deep links in the mobile app. */
  urlScheme: "rocketcast",
  /** npm workspace scope (informational; package.json files repeat it by necessity). */
  packageScope: "@rocketcast",
  /** Short tagline used in placeholders and metadata. */
  tagline: "Your games. Your channel. Always the right overlay.",
} as const;

export type Brand = typeof BRAND;
