import {
  getFromStorage,
  setToStorage
} from "visual/utils/storage/localStorage";

// Browser-local record of the embed-code consent decision, scoped per page so
// allowing embed code on one page never allows it on another.
//
// This is a convenience record, not a security boundary — the value is
// user-editable and carries no authority.

const KEY_PREFIX = "brz-embed-code-consent";

// Only a positively-stored "1" counts as consent. Every other shape — absent,
// empty, "true", "0", JSON, garbage — resolves to "not allowed", so a corrupt
// value can never be read as permission.
const ALLOWED = "1";
const NOT_ALLOWED = "0";

export const getConsentStorageKey = (pageId: string): string =>
  `${KEY_PREFIX}:${pageId}`;

export const readConsent = (pageId: string): boolean => {
  return getFromStorage(getConsentStorageKey(pageId)) === ALLOWED;
};

export const writeConsent = (pageId: string, isRun: boolean): void => {
  setToStorage(getConsentStorageKey(pageId), isRun ? ALLOWED : NOT_ALLOWED);
};
