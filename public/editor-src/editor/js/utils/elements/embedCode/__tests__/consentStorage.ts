import {
  getConsentStorageKey,
  readConsent,
  writeConsent
} from "../consentStorage";

describe("embed code consent storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Survives a reload
  it("round-trips an allowed decision", () => {
    writeConsent("page-1", true);

    expect(readConsent("page-1")).toBe(true);
  });

  it("round-trips a not-allowed decision", () => {
    writeConsent("page-1", true);
    writeConsent("page-1", false);

    expect(readConsent("page-1")).toBe(false);
  });

  // Per-page isolation
  it("does not leak a decision across pages", () => {
    writeConsent("page-1", true);

    expect(readConsent("page-2")).toBe(false);
  });

  // Opposite values held simultaneously
  it("holds opposite values for two pages without overwriting", () => {
    writeConsent("page-1", true);
    writeConsent("page-2", false);

    expect(readConsent("page-1")).toBe(true);
    expect(readConsent("page-2")).toBe(false);
  });

  it("scopes the storage key by page id", () => {
    expect(getConsentStorageKey("page-1")).not.toBe(
      getConsentStorageKey("page-2")
    );
  });

  // Absent value
  it("resolves an absent value to not allowed", () => {
    expect(readConsent("page-1")).toBe(false);
  });

  // Malformed values never read as permission
  it.each([
    ["true", "the string true"],
    ["yes", "an unrecognised word"],
    ["", "an empty string"],
    ["{}", "a JSON object"],
    ["[1,2,3]", "a JSON array"],
    ["\u0000\u0001", "control characters"],
    ["2", "an out-of-range numeric flag"]
  ])("resolves %s (%s) to not allowed", (stored) => {
    localStorage.setItem(getConsentStorageKey("page-1"), stored);

    expect(readConsent("page-1")).toBe(false);
  });

  // Storage unavailable
  it("resolves to not allowed when storage access throws", () => {
    const getItem = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("SecurityError");
      });

    expect(() => readConsent("page-1")).not.toThrow();
    expect(readConsent("page-1")).toBe(false);

    getItem.mockRestore();
  });

  it("does not throw when writing while storage is unavailable", () => {
    const setItem = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

    expect(() => writeConsent("page-1", true)).not.toThrow();

    setItem.mockRestore();
  });

  // An empty page id is not special-cased — it just produces the key
  // `brz-embed-code-consent:`. The editor always supplies `pageData.id`, so
  // this only documents the fallback rather than guarding against it.
  it("resolves to not allowed when the page id is empty and nothing is stored", () => {
    expect(readConsent("")).toBe(false);
  });

  // Recovery after a malformed read
  it("writes a well-formed value after recovering from a malformed one", () => {
    localStorage.setItem(getConsentStorageKey("page-1"), "garbage");

    expect(readConsent("page-1")).toBe(false);

    writeConsent("page-1", true);

    expect(readConsent("page-1")).toBe(true);
  });
});
