/**
 * Dynamic Expo config. The product name, bundle ID and URL scheme come from the single
 * brand constants file (packages/config/src/brand.ts, ADR-013) so a rename touches one file.
 *
 * Why a package import instead of a relative path: `@rocketcast/config/brand` is the one
 * documented entrypoint for brand constants (package.json `exports`), and it is what apps/web
 * imports too. Expo evaluates this file with @expo/require-utils (TypeScript transpile of the
 * config itself); the nested import of the `.ts` brand file is resolved by Node's own
 * type stripping, which is on by default in Node >= 22.18 / 24 / 26 (`.nvmrc` pins 26).
 * The workspace symlink resolves to packages/config (not node_modules), so Node allows it.
 * If a future Node/Expo version breaks that, switch the import below to the relative path
 * `../../packages/config/src/brand`; do not copy the constants into this file.
 */
import type { ExpoConfig } from "expo/config";

import { BRAND } from "@rocketcast/config/brand";

const config: ExpoConfig = {
  name: BRAND.productName,
  slug: "rocketcast",
  scheme: BRAND.urlScheme,
  version: "0.0.1",
  orientation: "default",
  // No icon/splash yet (M00): omitted rather than pointing at missing asset files.
  ios: {
    bundleIdentifier: BRAND.bundleId,
    supportsTablet: false,
  },
  android: {
    package: BRAND.bundleId,
  },
  plugins: ["expo-dev-client", "expo-sqlite"],
};

export default config;
