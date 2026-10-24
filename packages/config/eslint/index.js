// Shared ESLint flat config for every workspace.
// Usage in a workspace's eslint.config.js:
//   import { base, node, react } from "@rocketcast/config/eslint";
//   export default [...base, ...node];
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

/** Paths every workspace ignores. */
export const ignores = {
  ignores: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.next/**",
    "**/.turbo/**",
    "**/.expo/**",
    "**/.wrangler/**",
    "**/coverage/**",
    "**/*.d.ts",
  ],
};

/** Base: JS recommended + TypeScript recommended + Prettier compatibility. */
export const base = tseslint.config(
  ignores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  prettier,
);

/** Node runtime globals (services, tools, config files). */
export const node = [
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];

/** Browser globals (web app, overlay preview). */
export const browser = [
  {
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
];

/**
 * Purity guard for packages/scoring-engine (CLAUDE.md hard rule):
 * no I/O, clocks, or randomness. Applied only to engine source files.
 */
export const pureEngine = [
  {
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "Date", message: "Engine is clock-free; timestamps arrive on events." },
        { name: "setTimeout", message: "Engine has no I/O or timers." },
        { name: "setInterval", message: "Engine has no I/O or timers." },
        { name: "fetch", message: "Engine has no I/O." },
        { name: "console", message: "Engine has no I/O." },
        { name: "process", message: "Engine has no environment access." },
        { name: "crypto", message: "Engine has no randomness." },
      ],
      "no-restricted-properties": [
        "error",
        { object: "Math", property: "random", message: "Engine has no randomness." },
        { object: "Date", property: "now", message: "Engine is clock-free." },
        { object: "performance", property: "now", message: "Engine is clock-free." },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["node:*", "fs", "path", "os", "crypto", "http", "https", "child_process"], message: "Engine has zero runtime dependencies and no I/O." },
          ],
        },
      ],
    },
  },
];

export default base;
