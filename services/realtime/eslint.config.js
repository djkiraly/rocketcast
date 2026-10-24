import { base, node } from "@rocketcast/config/eslint";

export default [
  ...base,
  // Worker source runs on workerd (globals come from @cloudflare/workers-types);
  // only config files and tests use Node globals.
  ...node.map((cfg) => ({
    ...cfg,
    files: ["*.config.js", "*.config.ts", "src/**/*.test.ts"],
  })),
];
