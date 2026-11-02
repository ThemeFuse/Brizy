// document.cookie access is confined to this module so ./model.ts stays pure
// and unit-testable without jsdom. Follows the repo's cookie-read idiom
// (SectionPopup2/popupsPlugin.js `_getCookie`) and the try/catch idiom used
// for storage access (utils/storage/localStorage.ts).

// keep in sync with consent/blockerAsset.ts (published-page duplicate of the
// cookie name + parseConsent semantics, used before this module is loaded)
const COOKIE_NAME = "brz-consent";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // ~12 months

export function readConsentCookie(): string | undefined {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${COOKIE_NAME}=`);

    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }

    return undefined;
  } catch (_) {
    return undefined;
  }
}

export function writeConsentCookie(value: string): void {
  try {
    // biome-ignore lint/suspicious/noDocumentCookie: CookieStore, the API this rule asks for, is unsupported in Safari, which the preview browserlist targets from 14
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
  } catch (_) {
    // Cookie access can throw in restricted contexts (e.g. sandboxed
    // iframes with strict cookie policies) — degrade silently, the banner
    // simply reappears on the next load.
  }
}
