import { describe, expect, it } from "vitest";

import { OVERLAY_CANVAS } from "./index";

describe("overlay placeholder", () => {
  it("renders to a 1080p 16:9 canvas", () => {
    expect(OVERLAY_CANVAS).toEqual({ width: 1920, height: 1080 });
    expect(OVERLAY_CANVAS.width / OVERLAY_CANVAS.height).toBeCloseTo(16 / 9);
  });
});
