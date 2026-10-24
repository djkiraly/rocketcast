import { describe, expect, it } from "vitest";

import { matchSessionPath } from "./router";

describe("matchSessionPath", () => {
  it("extracts the id from /session/:id", () => {
    expect(matchSessionPath("/session/abc")).toBe("abc");
    expect(matchSessionPath("/session/01J9ZK4Q2W8X3Y5V7N6M1R0T9S")).toBe(
      "01J9ZK4Q2W8X3Y5V7N6M1R0T9S",
    );
  });

  it("tolerates a trailing slash", () => {
    expect(matchSessionPath("/session/abc/")).toBe("abc");
  });

  it("returns null for non-session paths", () => {
    expect(matchSessionPath("/")).toBeNull();
    expect(matchSessionPath("/health")).toBeNull();
    expect(matchSessionPath("/session")).toBeNull();
    expect(matchSessionPath("/session/")).toBeNull();
    expect(matchSessionPath("/sessions/abc")).toBeNull();
  });

  it("rejects nested paths and unsafe characters", () => {
    expect(matchSessionPath("/session/abc/events")).toBeNull();
    expect(matchSessionPath("/session/a b")).toBeNull();
    expect(matchSessionPath("/session/a%2Fb")).toBeNull();
    expect(matchSessionPath("/session/" + "x".repeat(129))).toBeNull();
  });
});
