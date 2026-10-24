// CommonJS on purpose: Expo CLI loads this file with require().
// Expo SDK 58's getDefaultConfig already detects the pnpm workspace root (via
// pnpm-workspace.yaml) and fills watchFolders / nodeModulesPaths; the explicit values below
// make the monorepo wiring visible and survive a future change to that heuristic.
const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch every workspace so edits in packages/* hot-reload here.
config.watchFolders = [workspaceRoot];

// With .npmrc node-linker=hoisted most deps live in the root node_modules.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Package `exports` resolution (used by @rocketcast/config's "./brand" -> src/brand.ts) is
// default-on in the Metro bundled with SDK 58 (metro 0.87.1 ships
// unstable_enablePackageExports: true), so it is deliberately not set here.

module.exports = config;
