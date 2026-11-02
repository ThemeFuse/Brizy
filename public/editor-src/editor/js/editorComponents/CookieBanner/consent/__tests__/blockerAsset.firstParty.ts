/**
 * The two legs of the first-party heuristic that need the page itself to sit
 * on a subdomain: the accepted sibling-subdomain limitation, and the
 * "page is a subdomain of the script's host" direction. A jsdom environment
 * has exactly one URL, so they cannot live in `__tests__/blockerAsset.ts` (page
 * `https://www.site.com/`).
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://shop.site.com/"}
 */
import { getConsentBlockerScript } from "../blockerAsset";

function runBlocker(): void {
  // eslint-disable-next-line no-new-func
  new Function(getConsentBlockerScript())();
}

// The gated category of a script, or null when the blocker left it alone.
function categoryOf(src: string): string | null {
  document.body.innerHTML = `<script src="${src}"></script>`;
  const script = document.querySelector("script");

  if (!script) {
    throw new Error("fixture rendered no script");
  }

  runBlocker();

  return script.getAttribute("type") === "text/plain"
    ? script.getAttribute("data-brz-consent")
    : null;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

// Page host for this file: https://shop.site.com/ (see the docblock).
describe("consent blocker — first-party heuristic on a subdomain page", () => {
  test("the page's own host is not gated", () => {
    expect(categoryOf("https://shop.site.com/js/app.js")).toBeNull();
  });

  test("a subdomain of the page's host is not gated", () => {
    expect(categoryOf("https://cdn.shop.site.com/js/app.js")).toBeNull();
  });

  test("the page's parent domain is not gated (page is a subdomain of it)", () => {
    expect(categoryOf("https://site.com/js/app.js")).toBeNull();
    expect(categoryOf("https://www.site.com/js/app.js")).toBeNull();
  });

  test("a sibling subdomain IS gated as other (accepted heuristic limitation)", () => {
    // No public-suffix list: `cdn.site.com` is neither the page host, nor a
    // subdomain of it, nor a parent of it. Over-gating is the safe direction.
    expect(categoryOf("https://cdn.site.com/js/app.js")).toBe("other");
  });
});
