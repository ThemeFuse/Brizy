import { formatLink } from "../utils";

describe("formatLink", () => {
  test("should return tel: for numbers", () => {
    expect(formatLink("1234567890")).toBe("tel:1234567890");
    expect(formatLink("+9876543210")).toBe("tel:+9876543210");
  });

  test("should return mailto: for emails", () => {
    expect(formatLink("test@example.com")).toBe("mailto:test@example.com");
    expect(formatLink('"user_name"@example.com')).toBe(
      'mailto:"user_name"@example.com'
    );
  });

  test("should not double-prefix if already has tel: or mailto:", () => {
    expect(formatLink("tel:1234567890")).toBe("tel:1234567890");
    expect(formatLink("mailto:test@example.com")).toBe(
      "mailto:test@example.com"
    );
  });

  test("should trim input", () => {
    expect(formatLink("  1234567890  ")).toBe("tel:1234567890");
    expect(formatLink("  test@example.com  ")).toBe("mailto:test@example.com");
  });

  test("should return original for non-email/non-phone strings", () => {
    expect(formatLink("https://example.com")).toBe("https://example.com");
    expect(formatLink("Hello World")).toBe("Hello World");
  });

  test("should handle empty string", () => {
    expect(formatLink("")).toBe("");
    expect(formatLink("   ")).toBe("");
  });
});
