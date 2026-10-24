import { describe, expect, it } from "vitest";

import pkg from "../package.json";

// CLAUDE.md hard rule: packages/scoring-engine has zero runtime dependencies.
describe("scoring-engine purity", () => {
  it("package.json declares no runtime dependencies", () => {
    expect(Object.keys(pkg)).not.toContain("dependencies");
    expect(Object.keys(pkg)).not.toContain("peerDependencies");
    expect(Object.keys(pkg)).not.toContain("optionalDependencies");
  });
});
