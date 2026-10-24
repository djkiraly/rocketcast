import { BRAND } from "@rocketcast/config/brand";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import HomePage from "./page";

afterEach(cleanup);

describe("HomePage", () => {
  it("renders the product name and publisher from the brand constants", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1, name: BRAND.productName })).toBeTruthy();
    expect(screen.getByText(BRAND.tagline)).toBeTruthy();
    expect(screen.getByText(`by ${BRAND.publisher}`)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Get started" })).toBeTruthy();
  });
});
