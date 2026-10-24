import { describe, expect, it } from "vitest";

import { createDb, schema } from "./index";

describe("@rocketcast/db", () => {
  it("exports a createDb factory", () => {
    expect(typeof createDb).toBe("function");
  });

  it("exports an (empty, for M00) schema namespace", () => {
    expect(typeof schema).toBe("object");
  });
});
