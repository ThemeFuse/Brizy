import { applyConsentGating } from "../consentGating";

const SRC_SCRIPT = '<script src="https://example.com/a.js"></script>';

describe("applyConsentGating", () => {
  it.each([
    {
      case: "'auto'",
      html: '<div>text</div><script src="https://example.com/a.js"></script><script>var x=1;</script>',
      category: "auto"
    },
    { case: "a missing value", html: SRC_SCRIPT, category: undefined },
    { case: "an unknown value", html: SRC_SCRIPT, category: "typo" },
    { case: "a legacy value", html: SRC_SCRIPT, category: "none" },
    {
      case: "an inline script under an explicit category",
      html: "<script>console.log('hi')</script>",
      category: "marketing"
    },
    {
      case: "a script already carrying data-brz-consent",
      html: '<script src="https://example.com/a.js" data-brz-consent="marketing"></script>',
      category: "statistics"
    },
    {
      case: "non-script markup",
      html: '<div><p>hello</p><img src="a.png"></div>',
      category: "preferences"
    },
    { case: "an empty string", html: "", category: "statistics" }
  ])("leaves the code untouched for $case", ({ html, category }) => {
    expect(applyConsentGating(html, category)).toBe(html);
  });

  it.each(["preferences", "statistics", "marketing", "other"])(
    "labels a src script for %s, without making it inert",
    (category) => {
      expect(applyConsentGating(SRC_SCRIPT, category)).toBe(
        `<script src="https://example.com/a.js" data-brz-consent="${category}"></script>`
      );
    }
  );

  test("labels multiple src scripts while preserving surrounding markup", () => {
    const html =
      '<div>text</div><script src="a.js"></script><p>more</p><script>var x=1;</script><script src="b.js"></script>';

    expect(applyConsentGating(html, "statistics")).toBe(
      '<div>text</div><script src="a.js" data-brz-consent="statistics"></script><p>more</p><script>var x=1;</script><script src="b.js" data-brz-consent="statistics"></script>'
    );
  });
});
