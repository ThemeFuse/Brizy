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
  // jsdom >= 26 makes `window.location` unforgeable, so it can no longer be
  // replaced with a stub; drive the real URL through `history.replaceState`
  // instead. That pins the origin to jsdom's default — a cross-origin
  // replaceState throws — so the URLs below are localhost rather than a site.
  const setUrl = (url: string): void =>
    window.history.replaceState(null, "", url);

  afterEach(() => {
    jest.restoreAllMocks();
    setUrl("/");
  });

  test("removes gsc.* params from query and hash", () => {
    const url =
      "http://localhost/asd/?preview_id=847&preview_nonce=39bbd08915&preview=true#gsc.tab=0&gsc.q=aa&gsc.sort=";

    setUrl(url);

    const replaceState = jest.spyOn(window.history, "replaceState");

    clearGoogleSearchParams();

    expect(replaceState).toHaveBeenCalledTimes(1);
    const [, , newUrl] = replaceState.mock.calls[0];

    expect(newUrl).toBe(
      "http://localhost/asd/?preview_id=847&preview_nonce=39bbd08915&preview=true"
    );
  });

  test("preserves non-gsc hash segments while removing gsc.*", () => {
    const url =
      "http://localhost/asd/?preview_id=847&preview_nonce=39bbd08915&preview=true#section=1&gsc.q=aa";

    setUrl(url);

    const replaceState = jest.spyOn(window.history, "replaceState");

    clearGoogleSearchParams();

    expect(replaceState).toHaveBeenCalledTimes(1);
    const [, , newUrl] = replaceState.mock.calls[0];

    expect(newUrl).toBe(
      "http://localhost/asd/?preview_id=847&preview_nonce=39bbd08915&preview=true#section=1"
    );
  });

  test("does nothing when there are no gsc.* params", () => {
    const url =
      "http://localhost/asd/?preview_id=847&preview_nonce=39bbd08915&preview=true#section=1";

    setUrl(url);

    const replaceState = jest.spyOn(window.history, "replaceState");

    clearGoogleSearchParams();

    expect(replaceState).not.toHaveBeenCalled();
  });
});
