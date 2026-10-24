import { describe, expect, it } from "vitest";

import { ENGINE_VERSION, schemaVersion } from "./index";

describe("scoring-engine placeholder", () => {
  it("exposes a semver engine version", () => {
    expect(ENGINE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("exposes a positive integer schema version", () => {
    expect(Number.isInteger(schemaVersion)).toBe(true);
    expect(schemaVersion).toBeGreaterThan(0);
  });
});
