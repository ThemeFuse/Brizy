import { type ConsentCategories, parseConsent } from "../consent/model";
import initCookieBanner from "../export";

// `activateScripts` is module-private — it only runs through `initCookieBanner`
// when a granted consent cookie is already present on load. Tests below drive
// it exclusively through the exported default, mounting a minimal
// `.brz-cookie-banner` (the sub-elements it reads via `data-brz-cc` are all
// optional — `?.` — so an empty container is enough) plus gated `<script>`
// tags placed document-wide, matching production.

// Cookie helpers, matching consent/cookie.ts's `COOKIE_NAME` + verbatim
// (non-encoded) JSON value — same convention as consent/__tests__/blockerAsset.ts.
function setConsentCookie(c: {
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  other: boolean;
}): void {
  const value = JSON.stringify({ v: 1, ts: Date.now(), c });
  document.cookie = `brz-consent=${value}; path=/`;
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

beforeEach(() => {
  document.body.innerHTML = "";
  clearCookies();
});

describe("activateScripts — module type restoration", () => {
  test("a script neutralized as data-brz-orig-type=module is re-activated with type=module, and the marker is dropped", () => {
    setConsentCookie({
      preferences: false,
      statistics: true,
      marketing: false,
      other: false
    });
    document.body.innerHTML = `
      <div class="brz-cookie-banner"></div>
      <script type="text/plain" data-brz-consent="statistics" data-brz-orig-type="module" src="https://cdn.example.com/mod.js"></script>
    `;

    mount();

    const [original, activated] = getScripts();

    expect(original.getAttribute("data-brz-consent-activated")).toBe("true");
    expect(activated.getAttribute("type")).toBe("module");
    expect(activated.hasAttribute("data-brz-orig-type")).toBe(false);
  });
});

describe("activateScripts — normal gated scripts (no orig-type)", () => {
  test("a plain gated script is re-activated with no explicit type attribute", () => {
    setConsentCookie({
      preferences: false,
      statistics: true,
      marketing: false,
      other: false
    });
    document.body.innerHTML = `
      <div class="brz-cookie-banner"></div>
      <script type="text/plain" data-brz-consent="statistics" src="https://cdn.example.com/foo.js"></script>
    `;

    mount();

    const [, activated] = getScripts();

    expect(activated.hasAttribute("type")).toBe(false);
    expect(activated.hasAttribute("data-brz-orig-type")).toBe(false);
  });
});

describe("activateScripts — execution order (async)", () => {
  test("an activated script with a src gets async=false", () => {
    setConsentCookie({
      preferences: false,
      statistics: true,
      marketing: false,
      other: false
    });
    document.body.innerHTML = `
      <div class="brz-cookie-banner"></div>
      <script type="text/plain" data-brz-consent="statistics" src="https://cdn.example.com/foo.js"></script>
    `;

    mount();

    const [, activated] = getScripts();

    expect(activated.async).toBe(false);
  });

  test("an inline activated script (no src) is left with its default async value", () => {
    setConsentCookie({
      preferences: false,
      statistics: true,
      marketing: false,
      other: false
    });
    document.body.innerHTML = `
      <div class="brz-cookie-banner"></div>
      <script type="text/plain" data-brz-consent="statistics">window.foo = 1;</script>
    `;

    mount();

    const [, activated] = getScripts();

    expect(activated.hasAttribute("src")).toBe(false);
    expect(activated.text).toBe("window.foo = 1;");
    expect(activated.async).toBeUndefined();
  });
});

describe("activateScripts — the `other` category", () => {
  test("an other-labeled gated script is activated once `other` is granted", () => {
    setConsentCookie({
      preferences: false,
      statistics: false,
      marketing: false,
      other: true
    });
    document.body.innerHTML = `
      <div class="brz-cookie-banner"></div>
      <script type="text/plain" data-brz-consent="other" src="https://unknown-vendor.example/x.js"></script>
    `;

    mount();

    const [original, activated] = getScripts();

    expect(original.getAttribute("data-brz-consent-activated")).toBe("true");
    expect(activated.getAttribute("src")).toBe(
      "https://unknown-vendor.example/x.js"
    );
  });

  test("an other-labeled gated script stays inert while `other` is denied", () => {
    setConsentCookie({
      preferences: true,
      statistics: true,
      marketing: true,
      other: false
    });
    document.body.innerHTML = `
      <div class="brz-cookie-banner"></div>
      <script type="text/plain" data-brz-consent="other" src="https://unknown-vendor.example/x.js"></script>
    `;

    mount();

    const scripts = getScripts();

    expect(scripts).toHaveLength(1);
    expect(scripts[0].hasAttribute("data-brz-consent-activated")).toBe(false);
  });
});

describe("activateScripts — idempotency", () => {
  test("a second activation pass does not duplicate an already-activated script", () => {
    setConsentCookie({
      preferences: false,
      statistics: true,
      marketing: false,
      other: false
    });
    document.body.innerHTML = `
      <div class="brz-cookie-banner"></div>
      <script type="text/plain" data-brz-consent="statistics" data-brz-orig-type="module" src="https://cdn.example.com/mod.js"></script>
    `;

    mount();
    expect(getScripts()).toHaveLength(2);

    // Re-running init (e.g. accepting more categories later, another
    // `.brz-cookie-banner` on the page) must not re-activate the same
    // original a second time.
    mount();

    expect(getScripts()).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// UI wiring — the banner's own bar / badge / preferences dialog on the
// published page, driven through the same `initCookieBanner` entry point.
// The fixture mirrors `CookieBanner.renderForView` reduced to the hooks
// export.ts reads: only the bar starts visible, the badge and the dialog's
// backdrop start hidden. Hook attributes are written literally on purpose —
// they pin the wire format the component emits, independently of the helper
// that builds it.
// ---------------------------------------------------------------------------

const ALL_ON: ConsentCategories = {
  preferences: true,
  statistics: true,
  marketing: true,
  other: true
};

const ALL_OFF: ConsentCategories = {
  preferences: false,
  statistics: false,
  marketing: false,
  other: false
};

const STATISTICS_ONLY: ConsentCategories = { ...ALL_OFF, statistics: true };

const CATEGORY_KEYS: Array<keyof ConsentCategories> = [
  "preferences",
  "statistics",
  "marketing",
  "other"
];

function mountBanner(): void {
  mountBannerWith("");
}

// `pageMarkup` lands next to the banner, the way gated scripts sit
// document-wide on a published page.
function mountBannerWith(pageMarkup: string): void {
  document.body.innerHTML = `
    ${pageMarkup}
    <div class="brz-cookie-banner">
      <div data-brz-cc="banner">
        <button type="button" data-brz-cc="accept"></button>
        <button type="button" data-brz-cc="reject"></button>
        <button type="button" data-brz-cc="customize"></button>
      </div>
      <div class="brz-hidden" data-brz-cc="badge"></div>
      <div class="brz-hidden" data-brz-cc="backdrop">
        <div data-brz-cc="dialog">
          <input type="checkbox" data-brz-cc="category-toggle" data-brz-cc-category="necessary" checked disabled />
          <input type="checkbox" data-brz-cc="category-toggle" data-brz-cc-category="preferences" />
          <input type="checkbox" data-brz-cc="category-toggle" data-brz-cc-category="statistics" />
          <input type="checkbox" data-brz-cc="category-toggle" data-brz-cc-category="marketing" />
          <input type="checkbox" data-brz-cc="category-toggle" data-brz-cc-category="other" />
          <button type="button" data-brz-cc="accept"></button>
          <button type="button" data-brz-cc="save"></button>
        </div>
      </div>
    </div>
  `;

  mount();
}

// n-th element carrying a given `data-brz-cc` hook ("accept" exists twice:
// once in the bar, once in the dialog footer).
function hook(name: string, index = 0): HTMLElement {
  const el = document.querySelectorAll<HTMLElement>(`[data-brz-cc="${name}"]`)[
    index
  ];

  if (!el) {
    throw new Error(`fixture has no "${name}" hook at index ${index}`);
  }

  return el;
}

const isHidden = (name: string): boolean =>
  hook(name).classList.contains("brz-hidden");

function toggle(category: keyof ConsentCategories): HTMLInputElement {
  const el = document.querySelector<HTMLInputElement>(
    `[data-brz-cc="category-toggle"][data-brz-cc-category="${category}"]`
  );

  if (!el) {
    throw new Error(`fixture has no "${category}" toggle`);
  }

  return el;
}

function setToggles(c: ConsentCategories): void {
  CATEGORY_KEYS.forEach((key) => {
    toggle(key).checked = c[key];
  });
}

function readToggles(): ConsentCategories {
  return {
    preferences: toggle("preferences").checked,
    statistics: toggle("statistics").checked,
    marketing: toggle("marketing").checked,
    other: toggle("other").checked
  };
}

// The choice the page persisted, read back through the public parser —
// `undefined` when no `brz-consent` cookie was written.
function storedChoice(): ConsentCategories | undefined {
  const raw = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("brz-consent="))
    ?.slice("brz-consent=".length);

  return parseConsent(raw)?.c;
}

describe("UI wiring", () => {
  // jsdom >= 26 makes `window.location` unforgeable, so `reload` can no longer
  // be replaced with a mock. jsdom reports the unimplemented navigation on its
  // virtual console instead, which jest forwards to `console.error` — so count
  // those to see whether the banner reloaded the page.
  let consoleError: jest.SpyInstance;

  const reloadCount = (): number =>
    consoleError.mock.calls.filter((args) =>
      String(args[0]).includes("Not implemented: navigation")
    ).length;

  beforeEach(() => {
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();

    delete window.gtag;
  });

  describe("initial state", () => {
    it.each([
      {
        case: "no stored choice",
        cookie: undefined,
        barHidden: false,
        badgeHidden: true
      },
      {
        case: "a stored choice",
        cookie: STATISTICS_ONLY,
        barHidden: true,
        badgeHidden: false
      }
    ])(
      "with $case: bar hidden=$barHidden, badge hidden=$badgeHidden, dialog closed",
      ({ cookie, barHidden, badgeHidden }) => {
        if (cookie) {
          setConsentCookie(cookie);
        }

        mountBanner();

        expect(isHidden("banner")).toBe(barHidden);
        expect(isHidden("badge")).toBe(badgeHidden);
        expect(isHidden("backdrop")).toBe(true);
      }
    );
  });

  describe("one-click choices", () => {
    it.each([
      {
        case: "Accept all in the bar",
        name: "accept",
        index: 0,
        stored: ALL_ON
      },
      {
        case: "Accept all in the dialog",
        name: "accept",
        index: 1,
        stored: ALL_ON
      },
      { case: "Reject all", name: "reject", index: 0, stored: ALL_OFF }
    ])(
      "$case stores the choice, swaps the bar for the badge and closes the dialog",
      ({ name, index, stored }) => {
        mountBanner();

        hook(name, index).click();

        expect(storedChoice()).toEqual(stored);
        expect(isHidden("banner")).toBe(true);
        expect(isHidden("badge")).toBe(false);
        expect(isHidden("backdrop")).toBe(true);
        expect(reloadCount()).toBe(0);
      }
    );
  });

  describe("opening the preferences dialog", () => {
    it.each([
      {
        case: "Customize before any choice",
        cookie: undefined,
        opener: "customize",
        seeded: ALL_OFF
      },
      {
        case: "the badge after a stored choice",
        cookie: STATISTICS_ONLY,
        opener: "badge",
        seeded: STATISTICS_ONLY
      }
    ])(
      "$case opens the dialog seeded from the stored choice, without storing anything",
      ({ cookie, opener, seeded }) => {
        if (cookie) {
          setConsentCookie(cookie);
        }

        mountBanner();

        hook(opener).click();

        expect(isHidden("backdrop")).toBe(false);
        expect(readToggles()).toEqual(seeded);
        expect(storedChoice()).toEqual(cookie);
      }
    );
  });

  describe("Save preferences", () => {
    it.each([
      {
        case: "a first choice",
        cookie: undefined,
        chosen: { ...ALL_OFF, preferences: true, marketing: true }
      },
      {
        case: "granting more on top of a stored choice",
        cookie: STATISTICS_ONLY,
        chosen: { ...STATISTICS_ONLY, marketing: true }
      }
    ])(
      "$case stores exactly the toggles and closes everything but the badge, without a reload",
      ({ cookie, chosen }) => {
        if (cookie) {
          setConsentCookie(cookie);
        }

        mountBanner();

        hook("customize").click();
        setToggles(chosen);
        hook("save").click();

        expect(storedChoice()).toEqual(chosen);
        expect(isHidden("banner")).toBe(true);
        expect(isHidden("badge")).toBe(false);
        expect(isHidden("backdrop")).toBe(true);
        expect(reloadCount()).toBe(0);
      }
    );
  });

  describe("withdrawing consent", () => {
    it.each([
      {
        case: "Reject all after a stored choice",
        act: (): void => hook("reject").click()
      },
      {
        case: "unticking a granted category and saving",
        act: (): void => {
          hook("badge").click();
          setToggles(ALL_OFF);
          hook("save").click();
        }
      }
    ])(
      "$case persists the withdrawal first, then reloads the page",
      ({ act }) => {
        setConsentCookie(STATISTICS_ONLY);
        mountBanner();

        act();

        expect(storedChoice()).toEqual(ALL_OFF);
        expect(reloadCount()).toBe(1);
      }
    );
  });

  describe("closing the dialog without saving", () => {
    it.each([
      {
        case: "a click on the backdrop itself",
        target: "backdrop",
        closes: true
      },
      { case: "a click inside the dialog", target: "dialog", closes: false }
    ])(
      "$case: closes=$closes, and never stores a choice",
      ({ target, closes }) => {
        mountBanner();

        hook("customize").click();
        toggle("marketing").checked = true;
        hook(target).click();

        expect(isHidden("backdrop")).toBe(closes);
        expect(storedChoice()).toBeUndefined();
        expect(reloadCount()).toBe(0);
      }
    );

    test("reopening discards the unsaved toggles", () => {
      mountBanner();

      hook("customize").click();
      toggle("marketing").checked = true;
      hook("backdrop").click();
      hook("customize").click();

      expect(readToggles()).toEqual(ALL_OFF);
    });
  });

  describe("Google Consent Mode", () => {
    it.each([
      {
        case: "Accept all",
        act: (): void => hook("accept").click(),
        analytics: "granted"
      },
      {
        case: "Reject all",
        act: (): void => hook("reject").click(),
        analytics: "denied"
      },
      {
        case: "Save preferences",
        act: (): void => {
          hook("customize").click();
          setToggles(STATISTICS_ONLY);
          hook("save").click();
        },
        analytics: "granted"
      }
    ])(
      "$case sends exactly one consent update, analytics_storage=$analytics",
      ({ act, analytics }) => {
        const gtag = jest.fn();
        window.gtag = gtag;
        mountBanner();

        act();

        expect(gtag).toHaveBeenCalledTimes(1);
        expect(gtag).toHaveBeenCalledWith(
          "consent",
          "update",
          expect.objectContaining({ analytics_storage: analytics })
        );
      }
    );

    // Consent Mode keeps no memory between page loads, so a returning visitor's
    // stored choice has to be re-sent on every load.
    it.each([
      {
        case: "a stored choice",
        stored: STATISTICS_ONLY,
        calls: [
          [
            "consent",
            "update",
            expect.objectContaining({ analytics_storage: "granted" })
          ]
        ]
      },
      {
        case: "a stored reject-all",
        stored: ALL_OFF,
        calls: [
          [
            "consent",
            "update",
            expect.objectContaining({ analytics_storage: "denied" })
          ]
        ]
      },
      { case: "no stored choice", stored: undefined, calls: [] }
    ])(
      "a page load with $case sends $calls.length update(s)",
      ({ stored, calls }) => {
        const gtag = jest.fn();
        window.gtag = gtag;

        if (stored) {
          setConsentCookie(stored);
        }

        mountBanner();

        expect(gtag.mock.calls).toEqual(calls);
      }
    );

    test("the stored choice reaches Consent Mode before gated scripts run", () => {
      const activatedAtDispatch: number[] = [];
      window.gtag = jest.fn(() => {
        activatedAtDispatch.push(
          document.querySelectorAll("script[data-brz-consent-activated]").length
        );
      });
      setConsentCookie(STATISTICS_ONLY);

      mountBannerWith(
        `<script type="text/plain" data-brz-consent="statistics" src="https://www.googletagmanager.com/gtag/js"></script>`
      );

      expect(activatedAtDispatch).toEqual([0]);
      expect(
        document.querySelectorAll("script[data-brz-consent-activated]")
      ).toHaveLength(1);
    });
  });
});
