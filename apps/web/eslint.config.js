// Flat ESLint config for @rocketcast/web.
// `base` already registers typescript-eslint's recommended rules + Prettier compatibility, so we
// only add eslint-config-next's core-web-vitals set (React, react-hooks, jsx-a11y, import, @next/next)
// and NOT `eslint-config-next/typescript`, which would re-add the same typescript-eslint set.
import { base, browser } from "@rocketcast/config/eslint";
import nextVitals from "eslint-config-next/core-web-vitals";
import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  ...base,
  ...browser,
  ...nextVitals,
  {
    ignores: [".next/**", "out/**", "next-env.d.ts"],
  },
]);

export default eslintConfig;
