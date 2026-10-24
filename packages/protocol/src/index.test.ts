import { describe, expect, it } from "vitest";

import { EnvelopeSchema, type Envelope } from "./index";

const valid: Envelope = {
  v: 1,
  sessionId: "01J9ZK3Q8R2W7X5V4T6Y8N0M1P",
  gameId: "01J9ZK3Q8R2W7X5V4T6Y8N0M2Q",
  teamId: "01J9ZK3Q8R2W7X5V4T6Y8N0M3R",
  seq: 0,
  ts: "2026-10-24T18:30:00.000Z",
  type: "snapshot",
  payload: { sets: [] },
};

describe("EnvelopeSchema (SPEC §14)", () => {
  it("parses a valid envelope", () => {
    const result = EnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(valid);
    }
  });

  it("rejects a wrong protocol version", () => {
    expect(EnvelopeSchema.safeParse({ ...valid, v: 2 }).success).toBe(false);
  });

  it("rejects a negative or fractional seq", () => {
    expect(EnvelopeSchema.safeParse({ ...valid, seq: -1 }).success).toBe(false);
    expect(EnvelopeSchema.safeParse({ ...valid, seq: 1.5 }).success).toBe(false);
  });

  it("rejects an unknown type and a non-ISO timestamp", () => {
    expect(EnvelopeSchema.safeParse({ ...valid, type: "ping" }).success).toBe(false);
    expect(EnvelopeSchema.safeParse({ ...valid, ts: "yesterday" }).success).toBe(false);
  });
});
