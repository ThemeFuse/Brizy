import { formatNumber } from "../utils";

describe("Testing formatNumber function", () => {
  test("With 0, should return 0 as string", () => {
    expect(formatNumber(0, ",")).toBe("0");
  });

  test("With 10, should return 10 as string", () => {
    expect(formatNumber(10, "/")).toBe("10");
  });

  test("should format number with default separator", () => {
    expect(formatNumber(1000, ",")).toBe("1,000");
    expect(formatNumber(10000, ",")).toBe("10,000");
    expect(formatNumber(100000, ",")).toBe("100,000");
    expect(formatNumber(1000000, ",")).toBe("1,000,000");
  });

  test("should format number with custom separator", () => {
    expect(formatNumber(1000, "-")).toBe("1-000");
    expect(formatNumber(10000, "-")).toBe("10-000");
    expect(formatNumber(100000, "-")).toBe("100-000");
    expect(formatNumber(1000000, "-")).toBe("1-000-000");
  });

  test("should format number without separator", () => {
    expect(formatNumber(1000, "")).toBe("1000");
    expect(formatNumber(10000, "")).toBe("10000");
    expect(formatNumber(100000, "")).toBe("100000");
    expect(formatNumber(1000000, "")).toBe("1000000");
  });

  test("should handle negative numbers", () => {
    expect(formatNumber(-1000, ",")).toBe("-1,000");
    expect(formatNumber(-10000, ",")).toBe("-10,000");
    expect(formatNumber(-100000, ",")).toBe("-100,000");
    expect(formatNumber(-1000000, ",")).toBe("-1,000,000");
  });

  test("should handle decimal numbers by rounding", () => {
    expect(formatNumber(1000.456, ",")).toBe("1,000");
    expect(formatNumber(10000.567, ",")).toBe("10,001");
    expect(formatNumber(100000.789, ",")).toBe("100,001");
    expect(formatNumber(1000000.999, ",")).toBe("1,000,001");
  });
});
