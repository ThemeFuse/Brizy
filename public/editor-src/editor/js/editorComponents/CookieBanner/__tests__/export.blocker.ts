/**
 * The activator (`export.ts`) as it runs on a *published* page — i.e. with the
 * runtime consent blocker (`consent/blockerAsset.ts`) already installed, so
 * `document.createElement` is instrumented and every `src` set on a
 * freshly created script is classified at set time. That gate is what makes
 * the attribute order of the activator's clone load-bearing, so these cases
 * cannot be reproduced by `__tests__/export.ts` (which runs without the blocker).
 *
 * The page host matters here as well: the blocker's first-party heuristic
 * reads `location.hostname`, and the fixtures below need a third-party,
 * unmapped script host (→ "other").
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.site.com/"}
 */
import { getConsentBlockerScript } from "../consent/blockerAsset";
import initCookieBanner from "../export";

// The blocker is executed as if it were the raw first inline <script> of the
// published page — same harness as consent/__tests__/blockerAsset.ts.
function runBlocker(): void {
  // eslint-disable-next-line no-new-func
  new Function(getConsentBlockerScript())();
}

// Cookie value written verbatim (no encoding), matching consent/cookie.ts.
function setConsentCookie(c: {
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  other: boolean;
}): void {
  document.cookie = `brz-consent=${JSON.stringify({
    v: 1,
    ts: Date.now(),
    c
  })}; path=/`;
}

function clearCookies(): void {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

function mount(): void {
  initCookieBanner(document.body);
}

function getScripts(): HTMLScriptElement[] {
  return Array.from(document.querySelectorAll("script"));
}

// The blocker's MutationObserver callback runs as a microtask, so the clone
// the activator inserts is only fully processed after a flush.
function flush(): Promise<void> {
  return Promise.resolve();
}

// Captured before any test installs the blocker's createElement wrapper, so
// wrappers never stack across tests.
const nativeDocumentCreateElement = document.createElement.bind(document);

beforeEach(() => {
  document.body.innerHTML = "";
  clearCookies();
  document.createElement = nativeDocumentCreateElement;
});

// Partial consent: "statistics" granted, "other" denied — the combination
// that makes a mis-classified clone fall back into the gate.
const STATISTICS_ONLY = {
  preferences: false,
  statistics: true,
  marketing: false,
  other: false
};

describe("activateScripts under the runtime blocker — attribute order", () => {
  test("a gated script whose src attribute comes BEFORE data-brz-consent is still activated", async () => {
    // Production markup shape: the server-side gating (EmbedCode/cheerio)
    // appends data-brz-consent after the attributes the owner wrote, so `src`
    // comes first — and so does a manually labeled external script.
    setConsentCookie(STATISTICS_ONLY);
    document.body.innerHTML = `
      <div class="brz-cookie-banner"></div>
      <script src="https://unknown-cdn.example/probe.js" type="text/plain" data-brz-consent="statistics"></script>
    `;

    runBlocker();
    mount();
    await flush();

    const [original, activated] = getScripts();

    expect(original.getAttribute("data-brz-consent-activated")).toBe("true");
    // The clone must be executable: if `src` lands on it before the label,
    // the createElement gate classifies it by host (unknown → "other"),
    // and with "other" denied it is re-neutralized back to text/plain.
    expect(activated.getAttribute("type")).not.toBe("text/plain");
    expect(activated.getAttribute("data-brz-consent")).toBe("statistics");
    expect(activated.getAttribute("src")).toBe(
      "https://unknown-cdn.example/probe.js"
    );
  });

  test("the mirror case — data-brz-consent before src — is activated too", async () => {
    setConsentCookie(STATISTICS_ONLY);
    document.body.innerHTML = `
      <div class="brz-cookie-banner"></div>
      <script type="text/plain" data-brz-consent="statistics" src="https://unknown-cdn.example/probe.js"></script>
    `;

    runBlocker();
    mount();
    await flush();

    const [original, activated] = getScripts();

    expect(original.getAttribute("data-brz-consent-activated")).toBe("true");
    expect(activated.getAttribute("type")).not.toBe("text/plain");
    expect(activated.getAttribute("data-brz-consent")).toBe("statistics");
    expect(activated.getAttribute("src")).toBe(
      "https://unknown-cdn.example/probe.js"
    );
  });

  test("a src-first module script keeps its restored type=module", async () => {
    setConsentCookie(STATISTICS_ONLY);
    document.body.innerHTML = `
      <div class="brz-cookie-banner"></div>
      <script src="https://unknown-cdn.example/mod.js" type="text/plain" data-brz-orig-type="module" data-brz-consent="statistics"></script>
    `;

    runBlocker();
    mount();
    await flush();

    const [, activated] = getScripts();

    expect(activated.getAttribute("type")).toBe("module");
    expect(activated.hasAttribute("data-brz-orig-type")).toBe(false);
  });
});
