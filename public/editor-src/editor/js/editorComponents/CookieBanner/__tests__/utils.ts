import { z } from "zod";
import { buildConsentModeSignal } from "../consent/consentMode";
import { ConsentCategories } from "../consent/model";
import { dispatchConsentModeUpdate } from "../utils";

// A dataLayer item is typed as a union; the dispatcher pushes an `arguments`
// object, which this schema narrows to without an assertion.
const argumentsSchema = z.custom<IArguments>(
  (value) => Object.prototype.toString.call(value) === "[object Arguments]"
);

// `dispatchConsentModeUpdate` has two dispatch paths, both owned by the site
// owner's Google snippet, neither of which we create: a global `window.gtag`
// (gtag.js installs) and, failing that, the `window.dataLayer` queue
// (GTM-only installs). The queue path is shape-sensitive — see the
// `[object Arguments]` assertions below.

const CATEGORIES: ConsentCategories = {
  preferences: true,
  statistics: false,
  marketing: true,
  other: false
};

const SIGNAL = buildConsentModeSignal(CATEGORIES);

afterEach(() => {
  delete window.gtag;
  delete window.dataLayer;
});

describe("dispatchConsentModeUpdate — window.gtag path", () => {
  test("calls the global gtag once with ('consent', 'update', signal)", () => {
    const gtag = jest.fn();
    window.gtag = gtag;

    dispatchConsentModeUpdate(CATEGORIES);

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("consent", "update", SIGNAL);
  });

  test("prefers gtag and leaves the dataLayer queue untouched", () => {
    const gtag = jest.fn();
    window.gtag = gtag;
    window.dataLayer = [];

    dispatchConsentModeUpdate(CATEGORIES);

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(window.dataLayer).toHaveLength(0);
  });
});

describe("dispatchConsentModeUpdate — window.dataLayer fallback", () => {
  test("pushes an `arguments` object, never a real Array", () => {
    window.dataLayer = [];

    dispatchConsentModeUpdate(CATEGORIES);

    expect(window.dataLayer).toHaveLength(1);

    const pushed = window.dataLayer[0];

    // Load-bearing: gtag.js / gtm.js route a queue item through
    // `Array.isArray` BEFORE the `[object Arguments]` check. A real Array is
    // interpreted as a legacy "call global method by dotted path" directive
    // (`consent.update(...)`), fails to resolve, and is silently dropped — the
    // consent update would never reach the command table.
    expect(Object.prototype.toString.call(pushed)).toBe("[object Arguments]");
    expect(Array.isArray(pushed)).toBe(false);
  });

  test("the pushed `arguments` carries ('consent', 'update', signal)", () => {
    window.dataLayer = [];

    dispatchConsentModeUpdate(CATEGORIES);

    // `toEqual` treats an Arguments object and an Array as different classes,
    // so the contents are compared through `Array.from`.
    expect(Array.from(argumentsSchema.parse(window.dataLayer[0]))).toEqual([
      "consent",
      "update",
      {
        analytics_storage: "denied",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        personalization_storage: "granted",
        functionality_storage: "granted",
        security_storage: "granted"
      }
    ]);
  });

  test("appends to an existing queue instead of replacing it", () => {
    const existing = { event: "some_pre_existing_event" };
    window.dataLayer = [existing];

    dispatchConsentModeUpdate(CATEGORIES);

    expect(window.dataLayer).toHaveLength(2);
    expect(window.dataLayer[0]).toBe(existing);
    expect(Object.prototype.toString.call(window.dataLayer[1])).toBe(
      "[object Arguments]"
    );
  });
});

describe("dispatchConsentModeUpdate — no Google tag installed", () => {
  test("no-ops (and never throws) when neither gtag nor dataLayer exists", () => {
    expect(() => dispatchConsentModeUpdate(CATEGORIES)).not.toThrow();
    expect(window.dataLayer).toBeUndefined();
  });

  test("does not create a dataLayer when one is absent", () => {
    dispatchConsentModeUpdate(CATEGORIES);

    expect("dataLayer" in window).toBe(false);
  });

  test("swallows a throwing gtag rather than breaking the consent flow", () => {
    window.gtag = jest.fn(() => {
      throw new Error("boom");
    });

    expect(() => dispatchConsentModeUpdate(CATEGORIES)).not.toThrow();
  });
});
