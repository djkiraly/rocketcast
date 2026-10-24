import { describe, expect, it } from "vitest";

import { formatTeamLabel } from "./format";

describe("formatTeamLabel", () => {
  it("appends an upper-cased abbreviation in parentheses", () => {
    expect(formatTeamLabel("Rockets 14U", "rkt")).toBe("Rockets 14U (RKT)");
  });

  it("returns only the name when the abbreviation is missing or blank", () => {
    expect(formatTeamLabel("Rockets 14U")).toBe("Rockets 14U");
    expect(formatTeamLabel("Rockets 14U", "   ")).toBe("Rockets 14U");
  });

  it("trims surrounding whitespace", () => {
    expect(formatTeamLabel("  Rockets 14U ", " rkt ")).toBe("Rockets 14U (RKT)");
  });
});
