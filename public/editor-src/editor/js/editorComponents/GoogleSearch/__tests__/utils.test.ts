import { clearGoogleSearchParams, isValidEngineId } from "../utils";

describe("GoogleSearch utils - isValidEngineId", () => {
  test("accepts typical Google CSE engine ids", () => {
    expect(isValidEngineId("139f44bdc32d14236")).toBe(true);
    expect(isValidEngineId("012345678901234567890:abcdefghij")).toBe(true);
    expect(isValidEngineId("custom_engine-id_123")).toBe(true);
  });

  test("rejects empty or missing values", () => {
    expect(isValidEngineId("")).toBe(false);
    expect(isValidEngineId("   ")).toBe(false);
    expect(isValidEngineId(undefined)).toBe(false);
    expect(isValidEngineId(null)).toBe(false);
  });

  test("rejects too short ids", () => {
    expect(isValidEngineId("a1234")).toBe(false); // only 5 chars
  });

  test("rejects ids with invalid characters", () => {
    expect(isValidEngineId("abc$def")).toBe(false);
    expect(isValidEngineId(":startsWithColon")).toBe(false);
  });
});

describe("GoogleSearch utils - clearGoogleSearchParams", () => {
  const originalLocation = window.location;
  const originalHistory = window.history;

  beforeEach(() => {
    // JSDOM's location is read-only; redefine it for our tests.
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        href: "",
        hash: "",
      },
    });

    Object.defineProperty(window, "history", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        replaceState: jest.fn(),
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: originalLocation,
    });

    Object.defineProperty(window, "history", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: originalHistory,
    });
  });

  test("removes gsc.* params from query and hash", () => {
    const url =
      "http://brizy.local/asd/?preview_id=847&preview_nonce=39bbd08915&preview=true#gsc.tab=0&gsc.q=aa&gsc.sort=";

    (window.location as any).href = url;
    (window.location as any).hash =
      "#gsc.tab=0&gsc.q=aa&gsc.sort=";

    const replaceState = jest.spyOn(window.history, "replaceState");

    clearGoogleSearchParams();

    expect(replaceState).toHaveBeenCalledTimes(1);
    const [, , newUrl] = replaceState.mock.calls[0];

    expect(newUrl).toBe(
      "http://brizy.local/asd/?preview_id=847&preview_nonce=39bbd08915&preview=true"
    );
  });

  test("preserves non-gsc hash segments while removing gsc.*", () => {
    const url =
      "http://brizy.local/asd/?preview_id=847&preview_nonce=39bbd08915&preview=true#section=1&gsc.q=aa";

    (window.location as any).href = url;
    (window.location as any).hash = "#section=1&gsc.q=aa";

    const replaceState = jest.spyOn(window.history, "replaceState");

    clearGoogleSearchParams();

    expect(replaceState).toHaveBeenCalledTimes(1);
    const [, , newUrl] = replaceState.mock.calls[0];

    expect(newUrl).toBe(
      "http://brizy.local/asd/?preview_id=847&preview_nonce=39bbd08915&preview=true#section=1"
    );
  });

  test("does nothing when there are no gsc.* params", () => {
    const url =
      "http://brizy.local/asd/?preview_id=847&preview_nonce=39bbd08915&preview=true#section=1";

    (window.location as any).href = url;
    (window.location as any).hash = "#section=1";

    const replaceState = jest.spyOn(window.history, "replaceState");

    clearGoogleSearchParams();

    expect(replaceState).not.toHaveBeenCalled();
  });
});
