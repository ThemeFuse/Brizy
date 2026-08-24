import UIEvents, { UIEventType } from "visual/global/UIEvents";

// Per-page, per-session record of whether the user has allowed embed code to
// run inside the editor. Changes broadcast on the editor's UIEvents bus, so the
// More-menu entry and every EmbedCode element stay in sync without knowing
// about each other.
//
// The safe default is `false` — embed code never runs until the user has
// positively allowed it.

type Listener = (consent: boolean) => void;

let state = false;
let persist: ((consent: boolean) => void) | undefined;

const notify = (): void => {
  UIEvents.emit(UIEventType.EmbedCodeConsentChange, state);
};

export const getEmbedCodeConsent = (): boolean => state;

// Thin wrapper over UIEvents so consumers get an unsubscribe to hand to
// useSyncExternalStore / componentWillUnmount without repeating the event name.
export const subscribeToEmbedCodeConsent = (
  listener: Listener
): VoidFunction => {
  UIEvents.on(UIEventType.EmbedCodeConsentChange, listener);

  return () => {
    UIEvents.off(UIEventType.EmbedCodeConsentChange, listener);
  };
};

export const setEmbedCodeConsent = (next: boolean): void => {
  if (state === next) {
    return;
  }

  state = next;
  persist?.(next);
  notify();
};

// Returns the value consent settled on, so the caller can tell which way the
// transition went without re-reading the store.
export const toggleEmbedCodeConsent = (): boolean => {
  setEmbedCodeConsent(!state);

  return state;
};

interface InitOptions {
  run: boolean;
  persist?: (consent: boolean) => void;
}

export const initEmbedCodeConsent = ({
  run: newState,
  persist: _persist
}: InitOptions): void => {
  persist = _persist;

  if (state !== newState) {
    state = newState;
    notify();
  }
};

// Test seam — drops listeners and persistence so suites do not leak into
// each other.
export const resetEmbedCodeConsent = (): void => {
  state = false;
  persist = undefined;
  UIEvents.removeAllListeners(UIEventType.EmbedCodeConsentChange);
};
