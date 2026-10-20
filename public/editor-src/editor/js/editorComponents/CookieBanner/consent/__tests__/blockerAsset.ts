/**
 * The blocker's first-party heuristic reads `location.hostname`, so the page
 * host matters: jsdom's default `localhost` would make every fixture host
 * below third-party by accident. Pinning it here gives the suite a realistic
 * page identity (own host + subdomains) to gate against. The sibling-subdomain
 * and parent-domain legs of the heuristic need a *different* page host, so
 * they live in `__tests__/blockerAsset.firstParty.ts` (one URL per jsdom env).
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.site.com/"}
 */
import { getConsentBlockerScript, VENDOR_MAP } from "../blockerAsset";

// The blocker script is executed as if it were the raw first inline
// <script> of a published page: build a real DOM, seed `document.cookie`,
// then run the generated source with `new Function`. No source module is
// imported here for the runtime behavior — we're validating the *string*
// Brizy inlines into pages, exactly as a browser would run it.
function runBlocker(): void {
  // eslint-disable-next-line no-new-func
  new Function(getConsentBlockerScript())();
}

// jsdom does not execute <script> elements on insertion, and it does not
// implement the "already started" spec flag either — so these tests only
// ever assert attribute state (type / data-brz-consent), never that a
// script actually ran or didn't. The MutationObserver callback fires as a
// microtask, so DOM insertions made after `runBlocker()` need a flush.
function flush(): Promise<void> {
  return Promise.resolve();
}

// The single <script> a fixture rendered into the body.
function onlyScript(): HTMLScriptElement {
  const script = document.querySelector("script");

  if (!script) {
    throw new Error("fixture rendered no script");
  }

  return script;
}

// Cookie helpers. `readConsentCookie` in blockerAsset.ts reads
// `document.cookie` verbatim (no decodeURIComponent), and
// `writeConsentCookie` in cookie.ts writes it verbatim too (no
// encodeURIComponent) — so tests set the raw JSON string as the cookie
// value, matching production exactly.
function setConsentCookie(value: string): void {
  document.cookie = `brz-consent=${value}; path=/`;
}

function clearCookies(): void {
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0]?.trim();
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

// Unlisted categories default to denied — the parse is strict (4 booleans),
// so the cookie is always written whole.
function grantedCookie(c: {
  preferences?: boolean;
  statistics?: boolean;
  marketing?: boolean;
  other?: boolean;
}): string {
  return JSON.stringify({
    v: 1,
    ts: 123,
    c: {
      preferences: false,
      statistics: false,
      marketing: false,
      other: false,
      ...c
    }
  });
}

// Captured once, before any test patches it, so each test can start from
// jsdom's pristine implementation (runBlocker's createElement gate wraps
// whatever document.createElement currently is, so leaving a previous
// test's wrapper in place would layer wrappers across tests).
const nativeDocumentCreateElement = document.createElement.bind(document);

let consoleInfo: jest.SpyInstance<void, Parameters<Console["info"]>>;

beforeEach(() => {
  document.body.innerHTML = "";
  clearCookies();
  document.createElement = nativeDocumentCreateElement;
  // Every gating logs a breadcrumb (asserted in its own describe at the
  // bottom); mocked per test so the rest of the suite's output stays
  // readable — and so each test starts from a clean call list.
  consoleInfo = jest.spyOn(console, "info").mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getConsentBlockerScript", () => {
  test("never contains a literal </script> sequence", () => {
    expect(getConsentBlockerScript()).not.toContain("</script>");
  });

  test("embeds every VENDOR_MAP entry", () => {
    const source = getConsentBlockerScript();

    for (const [, category] of VENDOR_MAP) {
      expect(source).toContain(category);
    }
  });

  test("wires a MutationObserver on documentElement and reads the cookie per batch", () => {
    const source = getConsentBlockerScript();

    expect(source).toContain("new MutationObserver");
    expect(source).toContain("observer.observe(document.documentElement");
    expect(source).toContain("childList: true");
    expect(source).toContain("subtree: true");
    // Parsed once at startup, and again inside the observer callback.
    expect(
      source.split("parseConsent(readConsentCookie())").length - 1
    ).toBeGreaterThanOrEqual(2);
  });

  test("falls back to other, never to marketing, for an unmatched src", () => {
    // An unmatched third-party host resolves to "other" and a hostless one to
    // null (first-party) — never to "marketing".
    const source = getConsentBlockerScript();
    const resolveCategoryBody = source.slice(
      source.indexOf("function resolveCategory"),
      source.indexOf("function neutralize")
    );

    expect(resolveCategoryBody).toContain("return null;");
    expect(resolveCategoryBody).toContain('return "other";');
    expect(resolveCategoryBody).not.toContain('return "marketing"');
  });

  test("running on a page with zero scripts does not throw", () => {
    expect(() => runBlocker()).not.toThrow();
  });

  test("the emitted ECWID_CDN regex source is a valid single-backslash regex, not a truncated comment", () => {
    // Regression guard: a single `\/` inside the template literal collapses
    // to `/`, and `//` starts a line comment there, silently truncating the
    // blocker. The doubled backslashes in the TS source must collapse to
    // single backslashes in the emitted output.
    const source = getConsentBlockerScript();

    expect(source).toContain("states\\.js(?:[?#]|$)");
    expect(source).toContain("var ECWID_CDN =");
    // If the regex literal had been truncated by an accidental `//`
    // comment, the rest of the IIFE (in particular resolveCategory) would
    // never appear in the emitted source.
    expect(source).toContain("function resolveCategory");
  });
});

describe("consent blocker — processScript gating", () => {
  test("labeled necessary is left untouched", () => {
    document.body.innerHTML = `<script data-brz-consent="necessary" src="https://cdn.example.com/foo.js"></script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBe("necessary");
  });

  test("labeled marketing, no consent cookie, is neutralized", () => {
    document.body.innerHTML = `<script data-brz-consent="marketing" src="https://cdn.example.com/foo.js"></script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("marketing");
  });

  test("labeled statistics, consent grants statistics, is left untouched", () => {
    setConsentCookie(
      grantedCookie({ preferences: false, statistics: true, marketing: false })
    );
    document.body.innerHTML = `<script data-brz-consent="statistics" src="https://cdn.example.com/foo.js"></script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
  });

  test("known-vendor src (googletagmanager), no consent, is neutralized and stamped", () => {
    document.body.innerHTML = `<script src="https://www.googletagmanager.com/gtag/js?id=X"></script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
  });

  test("known-vendor src, category granted, is left untouched", () => {
    setConsentCookie(
      grantedCookie({ preferences: false, statistics: true, marketing: false })
    );
    document.body.innerHTML = `<script src="https://www.googletagmanager.com/gtag/js?id=X"></script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("unknown external src is neutralized and stamped other", () => {
    document.body.innerHTML = `<script src="https://unknown-vendor.example/x.js"></script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("other");
  });

  test("unknown external src, other granted, is left untouched", () => {
    setConsentCookie(grantedCookie({ other: true }));
    document.body.innerHTML = `<script src="https://unknown-vendor.example/x.js"></script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("labeled other, no consent cookie, is neutralized", () => {
    document.body.innerHTML = `<script data-brz-consent="other" src="https://unknown-vendor.example/x.js"></script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("other");
  });

  test("an unsupported label value is left alone", () => {
    document.body.innerHTML = `<script data-brz-consent="statisticz" src="https://unknown-vendor.example/x.js"></script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBe("statisticz");
  });

  test("unmarked inline script (no src) is left untouched", () => {
    document.body.innerHTML = `<script>window.foo = 1;</script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("type=application/json is left untouched", () => {
    document.body.innerHTML = `<script type="application/json">{"a":1}</script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBe("application/json");
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("type=module vendor script is neutralized and its original type preserved", () => {
    document.body.innerHTML = `<script type="module" src="https://www.googletagmanager.com/gtag/js?id=X"></script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
    expect(script.getAttribute("data-brz-orig-type")).toBe("module");
  });

  test("idempotency: re-processing an already-gated node changes nothing", () => {
    document.body.innerHTML = `<script src="https://www.googletagmanager.com/gtag/js?id=X"></script>`;
    const script = onlyScript();

    runBlocker();
    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");

    // A second pass (e.g. a later mutation batch touching the same node)
    // must be a no-op, not re-stamp or re-wrap the listener oddly.
    runBlocker();

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
  });
});

// Brizy's own runtime (preview.min.js, the libs, this blocker) is stamped
// with the `brz-script` class by makeScripts.ts; it carries no
// data-brz-consent attribute, so the class is what keeps it out of the gate.
// The token match is exact: a class that merely starts with, or is a
// hyphenated relative of, `brz-script` is gated like any other third party.
describe("consent blocker — Brizy's own scripts are recognised by class", () => {
  // Third party by host (page is www.site.com) and absent from VENDOR_MAP,
  // so without the class rule it resolves to "other".
  const thirdParty = "https://cdn.example-assets.com/preview.min.js";

  it.each([
    {
      case: "the brz-script token is present",
      className: "brz-script brz-script-preview",
      type: undefined,
      consent: undefined
    },
    {
      case: "the class only starts with the token",
      className: "brz-scriptfoo",
      type: "text/plain",
      consent: "other"
    },
    {
      case: "only a hyphenated relative of the token is present",
      className: "brz-script-preview",
      type: "text/plain",
      consent: "other"
    }
  ])("initial script, $case", ({ className, type, consent }) => {
    document.body.innerHTML =
      `<script class="${className}" src="${thirdParty}"></scr` + `ipt>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type") ?? undefined).toBe(type);
    expect(script.getAttribute("data-brz-consent") ?? undefined).toBe(consent);
  });

  // popup.js's _appendScript sets className before src, which is what makes
  // the class visible to the src gate.
  it.each([
    {
      case: "the class is set before the src",
      className: "brz-script brz-script-preview-lib",
      type: undefined,
      consent: undefined
    },
    {
      case: "no class is set at all",
      className: "",
      type: "text/plain",
      consent: "other"
    }
  ])("createElement script, $case", ({ className, type, consent }) => {
    runBlocker();

    const script = document.createElement("script");

    if (className) {
      script.className = className;
    }

    script.src = thirdParty;

    expect(script.getAttribute("type") ?? undefined).toBe(type);
    expect(script.getAttribute("data-brz-consent") ?? undefined).toBe(consent);
  });
});

describe("consent blocker — MutationObserver leg (dynamically-inserted scripts)", () => {
  test("a vendor script inserted after the blocker ran is neutralized", async () => {
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";
    document.body.appendChild(script);

    await flush();

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
  });

  test("a script labeled with a category granted after insertion is left untouched (fresh per-batch cookie read)", async () => {
    runBlocker();

    setConsentCookie(
      grantedCookie({ preferences: false, statistics: true, marketing: false })
    );

    const script = document.createElement("script");
    script.setAttribute("data-brz-consent", "statistics");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";
    document.body.appendChild(script);

    await flush();

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
  });
});

describe("consent blocker — createElement gate (dynamically-created scripts)", () => {
  test("createElement('div') is left untouched (no own src descriptor)", () => {
    runBlocker();

    const div = document.createElement("div");

    expect(Object.getOwnPropertyDescriptor(div, "src")).toBeUndefined();
  });

  test("dynamic vendor script gated via property assignment, before insertion", () => {
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
    expect(script.src).toBe("https://www.googletagmanager.com/gtag/js?id=X");
  });

  test("dynamic vendor script gated via setAttribute('src', ...), before insertion", () => {
    runBlocker();

    const script = document.createElement("script");
    script.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=X");

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
  });

  test("unknown src is gated as other at set-time", () => {
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://unknown-vendor.example/x.js";

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("other");
  });

  test("unknown src passes through once other is granted", () => {
    runBlocker();

    setConsentCookie(grantedCookie({ other: true }));

    const script = document.createElement("script");
    script.src = "https://unknown-vendor.example/x.js";

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("first-party src is never gated at set-time", () => {
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://cdn.site.com/app.js";

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("a host mapped as necessary is never gated at set-time", () => {
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/recaptcha/api.js";

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("self-unblock defense holds for an other-gated script", () => {
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://unknown-vendor.example/x.js";
    expect(script.getAttribute("type")).toBe("text/plain");

    script.type = "text/javascript";
    expect(script.getAttribute("type")).toBe("text/plain");

    script.setAttribute("type", "application/javascript");
    expect(script.getAttribute("type")).toBe("text/plain");

    script.removeAttribute("type");
    expect(script.getAttribute("type")).toBe("text/plain");

    // Granting the category makes the very same writes legitimate again.
    setConsentCookie(grantedCookie({ other: true }));
    script.type = "text/javascript";
    expect(script.getAttribute("type")).toBe("text/javascript");
  });

  test("data-brz-consent=necessary set before src is left untouched", () => {
    runBlocker();

    const script = document.createElement("script");
    script.setAttribute("data-brz-consent", "necessary");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBe("necessary");
  });

  test("granted category (cookie set before src assignment) is left untouched", () => {
    runBlocker();

    setConsentCookie(
      grantedCookie({ preferences: false, statistics: true, marketing: false })
    );

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("self-unblock defense: type flip stays gated without consent, passes through once granted", () => {
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";
    expect(script.getAttribute("type")).toBe("text/plain");

    // A tracker trying to self-unblock by rewriting its own type is
    // defeated while its category is still unconsented.
    script.setAttribute("type", "text/javascript");
    expect(script.getAttribute("type")).toBe("text/plain");

    // The same write, once the category is granted, is a legitimate
    // restoration (e.g. the activator) and must pass through unchanged.
    setConsentCookie(
      grantedCookie({ preferences: false, statistics: true, marketing: false })
    );
    script.setAttribute("type", "text/javascript");
    expect(script.getAttribute("type")).toBe("text/javascript");
  });

  test("foreign wrapper coexistence: composes with a pre-existing document.createElement wrapper", () => {
    const spy = jest
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string) =>
        nativeDocumentCreateElement(tagName)
      );

    runBlocker();

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";

    expect(spy).toHaveBeenCalledWith("script");
    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
  });

  test("activator-clone simulation: granted cookie + explicit label survives creation", () => {
    setConsentCookie(
      grantedCookie({ preferences: false, statistics: true, marketing: false })
    );

    runBlocker();

    const script = document.createElement("script");
    script.setAttribute("data-brz-consent", "statistics");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
  });

  test("self-unblock defense: the type IDL property is coerced back while unconsented", () => {
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";
    expect(script.getAttribute("type")).toBe("text/plain");

    // The property setter bypasses setAttribute entirely, so without its own
    // accessor a gated script could flip itself back to executable.
    script.type = "text/javascript";

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.type).toBe("text/plain");
  });

  test("self-unblock defense: removeAttribute('type') is refused while unconsented", () => {
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";
    expect(script.getAttribute("type")).toBe("text/plain");

    // Dropping the attribute would make the script classic/executable again.
    script.removeAttribute("type");

    expect(script.getAttribute("type")).toBe("text/plain");
  });

  test("the type IDL property passes through once the category is granted", () => {
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";
    expect(script.getAttribute("type")).toBe("text/plain");

    setConsentCookie(
      grantedCookie({ preferences: false, statistics: true, marketing: false })
    );
    script.type = "text/javascript";

    expect(script.getAttribute("type")).toBe("text/javascript");
  });

  test("removeAttribute('type') passes through once the category is granted", () => {
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";
    expect(script.getAttribute("type")).toBe("text/plain");

    setConsentCookie(
      grantedCookie({ preferences: false, statistics: true, marketing: false })
    );
    script.removeAttribute("type");

    expect(script.getAttribute("type")).toBeNull();
  });

  test("a fresh, non-gated clone can set any type (activator path)", () => {
    runBlocker();

    // The activator builds its clone with document.createElement, copies the
    // label with setAttribute and then restores the original type through
    // the property. The clone is not gated (no text/plain type of its own),
    // so the write must pass through untouched.
    const script = document.createElement("script");
    script.setAttribute("data-brz-consent", "statistics");
    script.type = "module";

    expect(script.getAttribute("type")).toBe("module");
  });
});

describe("consent blocker — vendor matching is host-scoped", () => {
  function gateInitial(src: string): HTMLScriptElement {
    document.body.innerHTML = `<script src="${src}"></script>`;
    const script = onlyScript();

    runBlocker();

    return script;
  }

  test("first-party src merely mentioning a vendor host in the query is untouched", () => {
    const script = gateInitial(
      "https://www.site.com/page.js?ref=connect.facebook.net"
    );

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("first-party src with a vendor host as a path segment is untouched", () => {
    const script = gateInitial(
      "https://www.site.com/libs/googletagmanager.com/loader.js"
    );

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("a third-party src mentioning a vendor host in its path falls back to other, not that vendor's category", () => {
    const script = gateInitial(
      "https://unknown-vendor.example/libs/googletagmanager.com/loader.js"
    );

    expect(script.getAttribute("data-brz-consent")).toBe("other");
  });

  test("a real vendor host is still gated", () => {
    const script = gateInitial("https://www.googletagmanager.com/gtag/js?id=X");

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
  });

  test("a protocol-relative vendor src is gated", () => {
    const script = gateInitial("//connect.facebook.net/en_US/fbevents.js");

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("marketing");
  });

  test("a relative src has no host and is never gated", () => {
    const script = gateInitial("/js/app.js");

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("host matching is case-insensitive", () => {
    const script = gateInitial("HTTPS://WWW.GOOGLETAGMANAGER.COM/gtag/js");

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
  });
});

// Page host for this file: https://www.site.com/ (see the docblock).
describe("consent blocker — first-party heuristic", () => {
  function gateInitial(src: string): HTMLScriptElement {
    document.body.innerHTML = `<script src="${src}"></script>`;
    const script = onlyScript();

    runBlocker();

    return script;
  }

  function expectUntouched(src: string): void {
    const script = gateInitial(src);

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  }

  test("the page's own host is not gated", () => {
    expectUntouched("https://www.site.com/js/app.js");
  });

  test("the page's www-stripped host is not gated", () => {
    expectUntouched("https://site.com/js/app.js");
  });

  test("a subdomain of the page's host is not gated", () => {
    expectUntouched("https://cdn.site.com/js/app.js");
  });

  test("a first-party host with a port is not gated (port stripped first)", () => {
    expectUntouched("https://cdn.site.com:8443/js/app.js");
  });

  test("a relative src is not gated", () => {
    expectUntouched("/js/app.js");
  });

  test("a protocol-relative first-party src is not gated", () => {
    expectUntouched("//cdn.site.com/js/app.js");
  });

  test("a third-party host with a port is still gated (port stripped first)", () => {
    const script = gateInitial("https://unknown-vendor.example:8080/x.js");

    expect(script.getAttribute("type")).toBe("text/plain");
    expect(script.getAttribute("data-brz-consent")).toBe("other");
  });

  test("a vendor host with a port still resolves to its category", () => {
    const script = gateInitial("https://www.googletagmanager.com:443/gtag/js");

    expect(script.getAttribute("data-brz-consent")).toBe("statistics");
  });

  test("a lookalike of the page host is gated (suffix match is dot-anchored)", () => {
    const script = gateInitial("https://evilsite.com/x.js");

    expect(script.getAttribute("data-brz-consent")).toBe("other");
  });
});

describe("consent blocker — VENDOR_MAP patterns are host-anchored", () => {
  // The gated category of a script, or null when the blocker left it alone
  // (first-party, or a host the map classifies as "necessary" — the cookie
  // never carries "necessary", it is implied granted).
  function categoryOf(src: string): string | null {
    document.body.innerHTML = `<script src="${src}"></script>`;
    const script = onlyScript();

    runBlocker();

    return script.getAttribute("type") === "text/plain"
      ? script.getAttribute("data-brz-consent")
      : null;
  }

  test("a lookalike host does not inherit a vendor category", () => {
    // Unanchored substring matching would have left this ungated as
    // "necessary" — a full gating bypass.
    expect(categoryOf("https://app.ecwid.com.evil.com/x.js")).toBe("other");
    expect(
      categoryOf("https://d34ikvsdm2rlij.cloudfront.net.evil.com/x.js")
    ).toBe("other");
    expect(categoryOf("https://googletagmanager.com.evil.com/x.js")).toBe(
      "other"
    );
    expect(categoryOf("https://business.shop.evil.com/x.js")).toBe("other");
  });

  test("real vendor hosts and their subdomains still match", () => {
    expect(categoryOf("https://connect.facebook.net/en_US/sdk.js")).toBe(
      "marketing"
    );
    expect(categoryOf("https://www.youtube.com/iframe_api")).toBe("marketing");
  });

  test("integration sub-loads resolve to their parent's stamped category", () => {
    // Sub-loads carry no stamp of their own — without a map entry they would
    // fall into "other" and break the integration after its grant.
    expect(categoryOf("https://s.ytimg.com/yts/jsbin/www-widgetapi.js")).toBe(
      "marketing"
    );
    expect(
      categoryOf("https://c.disquscdn.com/next/embed/lounge.load.js")
    ).toBe("marketing");
    expect(categoryOf("https://assets.calendly.com/widget.js")).toBe(
      "preferences"
    );
  });

  test("hosts mapped as necessary are left alone, not gated", () => {
    // reCAPTCHA's chain and the Ecwid storefront must work pre-consent.
    expect(categoryOf("https://www.gstatic.com/recaptcha/api.js")).toBeNull();
    expect(categoryOf("https://www.googleapis.com/x.js")).toBeNull();
    expect(categoryOf("https://www.google.com/recaptcha/api.js")).toBeNull();
    expect(categoryOf("https://app.ecwid.com/script.js")).toBeNull();
    // The three known Ecwid distros are listed as hosts too (belt and
    // braces), so even a non-"/storefront/" path they serve stays ungated.
    // The storefront chain itself is covered by the URL rule below.
    expect(categoryOf("https://d34ikvsdm2rlij.cloudfront.net/x.js")).toBeNull();
    expect(categoryOf("https://d3fi9i0jj23cau.cloudfront.net/x.js")).toBeNull();
    expect(categoryOf("https://d3dq8sxcny4hg.cloudfront.net/x.js")).toBeNull();
  });

  test("business.shop (Ecwid/Lightspeed Instant Site domain) is left alone, not gated", () => {
    // app.business.shop serves the store config (data.js). Any subdomain,
    // and the apex itself, must be covered.
    expect(
      categoryOf("https://app.business.shop/data.js?ownerid=123&token=abc")
    ).toBeNull();
    expect(categoryOf("https://store.business.shop/x.js")).toBeNull();
    expect(categoryOf("https://business.shop/x.js")).toBeNull();
  });

  test("a necessary host is not even stamped", () => {
    document.body.innerHTML = `<script src="https://www.gstatic.com/recaptcha/api.js"></script>`;
    const script = onlyScript();

    runBlocker();

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });

  test("the specific Google subdomains win over the broad google.com entry", () => {
    expect(categoryOf("https://cse.google.com/cse.js")).toBe("preferences");
    expect(categoryOf("https://analytics.google.com/g/collect")).toBe(
      "statistics"
    );
  });
});

describe("consent blocker — Ecwid CloudFront URL signature", () => {
  // Same helper as above: the gated category, or null when left alone.
  function categoryOf(src: string): string | null {
    document.body.innerHTML = `<script src="${src}"></script>`;
    const script = onlyScript();

    runBlocker();

    return script.getAttribute("type") === "text/plain"
      ? script.getAttribute("data-brz-consent")
      : null;
  }

  test("the storefront chain on a known distro is left alone", () => {
    expect(
      categoryOf(
        "https://d34ikvsdm2rlij.cloudfront.net/storefront/static/2026/all/ecommerce-x.js"
      )
    ).toBeNull();
  });

  test("the storefront chain on a never-seen distro is left alone (rotation-proof)", () => {
    // The whole point of the rule: enumerating distro hosts is a losing game.
    expect(
      categoryOf("https://d99zzz.cloudfront.net/storefront/static/2026/x.js")
    ).toBeNull();
  });

  test("the app-widget and instant-site prefixes are left alone too", () => {
    // Ecwid serves more than the core chain off CloudFront: its own app
    // widgets under /apps/ecwid-…, the instant site under /startersite/.
    expect(
      categoryOf(
        "https://djqizrxa6f10j.cloudfront.net/apps/ecwid-shop-at-app/widget.js"
      )
    ).toBeNull();
    expect(
      categoryOf(
        "https://dxyz.cloudfront.net/startersite/static/2026/js/store.bundle.js"
      )
    ).toBeNull();
  });

  test("states.js at the path root is left alone, even on a never-seen distro", () => {
    // The checkout country/region JSONP. Covered both by VENDOR_MAP (the
    // known distro) and by the URL signature alone (any distro).
    expect(
      categoryOf(
        "https://d3dq8sxcny4hg.cloudfront.net/states.js?version=25.1.0&callback=cb"
      )
    ).toBeNull();
    expect(
      categoryOf("https://d99zzz.cloudfront.net/states.js?callback=cb")
    ).toBeNull();
  });

  test("states.js must be the first path segment, not merely present in the path", () => {
    expect(categoryOf("https://d99zzz.cloudfront.net/foo/states.js")).toBe(
      "other"
    );
  });

  test("an unlisted path on a CloudFront host still falls back to other", () => {
    // CloudFront fronts trackers too — the rule must not whitelist the CDN.
    expect(categoryOf("https://d99zzz.cloudfront.net/tracker.js")).toBe(
      "other"
    );
    // A foreign app under /apps/ must not ride in on the Ecwid prefix.
    expect(
      categoryOf("https://d99zzz.cloudfront.net/apps/evil-thing/widget.js")
    ).toBe("other");
    // Ecwid's own analytics-adjacent bundle is deliberately left gated.
    expect(
      categoryOf("https://d1tqsoh7s4xjz9.cloudfront.net/v2/i.min.js")
    ).toBe("other");
  });

  test("a matching path on a non-CloudFront host is gated", () => {
    // The path alone is not a free pass; the host half of the signature is.
    expect(categoryOf("https://evil.com/storefront/static/x.js")).toBe("other");
    expect(
      categoryOf("https://cloudfront.net.evil.com/startersite/static/x.js")
    ).toBe("other");
  });

  test("the dynamic gate applies the same rule at src-set time", () => {
    // resolveCategory is shared with gateSrc, so a createElement-injected
    // storefront script must pass through untouched as well.
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://d99zzz.cloudfront.net/storefront/static/2026/x.js";

    expect(script.getAttribute("type")).toBeNull();
    expect(script.getAttribute("data-brz-consent")).toBeNull();
  });
});

describe("consent blocker — console breadcrumb", () => {
  // Mocked in the root beforeEach, fresh for every test.
  const info = () => consoleInfo;

  test("logs the src and the category of a gated script", () => {
    document.body.innerHTML = `<script src="https://unknown-vendor.example/x.js"></script>`;

    runBlocker();

    expect(info()).toHaveBeenCalledWith(
      "[Brz Consent] blocked pre-consent:",
      "https://unknown-vendor.example/x.js",
      "->",
      "other"
    );
  });

  test("logs the src of a script gated at set-time by the createElement gate", () => {
    // There the node is gated before the src lands on it, so the breadcrumb
    // has to read the incoming value rather than the (still absent) attribute.
    runBlocker();

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=X";

    expect(info()).toHaveBeenCalledWith(
      "[Brz Consent] blocked pre-consent:",
      "https://www.googletagmanager.com/gtag/js?id=X",
      "->",
      "statistics"
    );
  });

  test("stays silent for allowed scripts (necessary, first-party, granted)", () => {
    setConsentCookie(grantedCookie({ marketing: true }));
    document.body.innerHTML = `
      <script src="https://www.gstatic.com/recaptcha/api.js"></script>
      <script src="https://d34ikvsdm2rlij.cloudfront.net/storefront/static/x.js"></script>
      <script src="/js/app.js"></script>
      <script src="https://connect.facebook.net/en_US/sdk.js"></script>
    `;

    runBlocker();

    expect(info()).not.toHaveBeenCalled();
  });

  test("logs once per script, not again on a re-scan", () => {
    document.body.innerHTML = `<script src="https://unknown-vendor.example/x.js"></script>`;

    runBlocker();
    runBlocker();

    expect(info()).toHaveBeenCalledTimes(1);
  });
});
