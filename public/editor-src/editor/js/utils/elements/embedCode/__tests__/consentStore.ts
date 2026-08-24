import {
  getEmbedCodeConsent,
  initEmbedCodeConsent,
  resetEmbedCodeConsent,
  setEmbedCodeConsent,
  subscribeToEmbedCodeConsent,
  toggleEmbedCodeConsent
} from "../consentStore";

describe("embed code consent store", () => {
  beforeEach(() => {
    resetEmbedCodeConsent();
  });

  // Safe default
  it("defaults to not allowed", () => {
    expect(getEmbedCodeConsent()).toBe(false);
  });

  it("toggles from not allowed to allowed", () => {
    expect(toggleEmbedCodeConsent()).toBe(true);
    expect(getEmbedCodeConsent()).toBe(true);
  });

  it("toggles from allowed back to not allowed", () => {
    toggleEmbedCodeConsent();

    expect(toggleEmbedCodeConsent()).toBe(false);
    expect(getEmbedCodeConsent()).toBe(false);
  });

  // No drift, no stuck state
  it("alternates indefinitely without drift", () => {
    const seen: boolean[] = [];

    for (let i = 0; i < 10; i++) {
      seen.push(toggleEmbedCodeConsent());
    }

    expect(seen).toEqual([
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false
    ]);
    expect(getEmbedCodeConsent()).toBe(false);
  });

  // Observable by consumers in-session
  it("notifies subscribers on change", () => {
    const listener = jest.fn();

    subscribeToEmbedCodeConsent(listener);
    toggleEmbedCodeConsent();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not notify when the value is unchanged", () => {
    const listener = jest.fn();

    subscribeToEmbedCodeConsent(listener);
    setEmbedCodeConsent(false);

    expect(listener).not.toHaveBeenCalled();
  });

  it("stops notifying after unsubscribe", () => {
    const listener = jest.fn();

    const unsubscribe = subscribeToEmbedCodeConsent(listener);
    unsubscribe();
    toggleEmbedCodeConsent();

    expect(listener).not.toHaveBeenCalled();
  });

  it("notifies every subscriber", () => {
    const a = jest.fn();
    const b = jest.fn();

    subscribeToEmbedCodeConsent(a);
    subscribeToEmbedCodeConsent(b);
    toggleEmbedCodeConsent();

    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  // Persistence hook fires on every change
  describe("persistence hook", () => {
    it("persists each change after init", () => {
      const persist = jest.fn();

      initEmbedCodeConsent({ run: false, persist });
      toggleEmbedCodeConsent();
      toggleEmbedCodeConsent();

      expect(persist).toHaveBeenNthCalledWith(1, true);
      expect(persist).toHaveBeenNthCalledWith(2, false);
    });

    it("adopts the restored initial value and notifies", () => {
      const listener = jest.fn();

      subscribeToEmbedCodeConsent(listener);
      initEmbedCodeConsent({ run: true });

      expect(getEmbedCodeConsent()).toBe(true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("does not persist the restored initial value back to storage", () => {
      const persist = jest.fn();

      initEmbedCodeConsent({ run: true, persist });

      expect(persist).not.toHaveBeenCalled();
    });
  });
});
