import { base, node, pureEngine } from "@rocketcast/config/eslint";

export default [
  ...base,
  // Config files and tests may use normal Node globals.
  ...node.map((cfg) => ({
    ...cfg,
    files: ["*.config.js", "*.config.ts", "src/**/*.test.ts"],
  })),
  // CLAUDE.md hard rule: engine source is pure (no I/O, clocks, randomness, Node imports).
  ...pureEngine.map((cfg) => ({
    ...cfg,
    files: ["src/**/*.ts"],
    ignores: ["src/**/*.test.ts"],
  })),
];
