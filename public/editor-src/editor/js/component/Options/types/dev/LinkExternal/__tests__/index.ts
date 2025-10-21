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

  test("should preserve full URLs (http:// and https://)", () => {
    expect(formatLink("https://example.com")).toBe("https://example.com");
    expect(formatLink("http://example.com")).toBe("http://example.com");
    expect(formatLink("https://www.example.com/path?query=value")).toBe(
      "https://www.example.com/path?query=value"
    );
    expect(formatLink("http://subdomain.example.com:8080/path")).toBe(
      "http://subdomain.example.com:8080/path"
    );
    expect(formatLink("https://example.com#section")).toBe(
      "https://example.com#section"
    );
    expect(formatLink("https://www.tiktok.com/@chaos.rooms0")).toBe(
      "https://www.tiktok.com/@chaos.rooms0"
    );
    expect(formatLink("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
    expect(formatLink("https://www.instagram.com/p/dQw4w9WgXcQ/")).toBe(
      "https://www.instagram.com/p/dQw4w9WgXcQ/"
    );
  });

  test("should preserve URLs with different cases", () => {
    expect(formatLink("HTTPS://EXAMPLE.COM")).toBe("HTTPS://EXAMPLE.COM");
    expect(formatLink("HTTP://EXAMPLE.COM")).toBe("HTTP://EXAMPLE.COM");
  });

  test("should return original for non-email/non-phone/non-URL strings", () => {
    expect(formatLink("Hello World")).toBe("Hello World");
    expect(formatLink("example.com")).toBe("example.com");
    expect(formatLink("www.example.com")).toBe("www.example.com");
  });

  test("should handle empty string", () => {
    expect(formatLink("")).toBe("");
    expect(formatLink("   ")).toBe("");
  });
});
