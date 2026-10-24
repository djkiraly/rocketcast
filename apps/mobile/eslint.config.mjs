// .mjs because this package has no "type": "module" (Metro/Babel configs stay CommonJS).
import { base, node } from "@rocketcast/config/eslint";

export default [
  {
    ignores: [".expo/**", "ios/**", "android/**", "web-build/**", "expo-env.d.ts"],
  },
  ...base,
  {
    // App source: React Native globals. typescript-eslint already disables no-undef for TS,
    // but declare __DEV__ so any JS helper or future rule sees it too.
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: { __DEV__: "readonly" },
    },
  },
  {
    // Node-side config files (Metro, Babel, this file) are CommonJS/ESM run by Node.
    files: ["*.js", "*.cjs", "*.mjs"],
    ...node[0],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
