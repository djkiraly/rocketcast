import { describe, expect, it } from "vitest";

import { BRAND } from "./brand";

describe("brand constants", () => {
  it("bundle id is reverse-DNS of publisher + product", () => {
    expect(BRAND.bundleId).toBe(
      `com.${BRAND.publisher.toLowerCase()}.${BRAND.productName.toLowerCase()}`,
    );
  });

  it("package scope matches the product name", () => {
    expect(BRAND.packageScope).toBe(`@${BRAND.productName.toLowerCase()}`);
  });
});
