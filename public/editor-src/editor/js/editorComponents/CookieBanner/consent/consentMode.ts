import type { ConsentCategories } from "./model";

export type ConsentModeStatus = "granted" | "denied";

// Google Consent Mode v2 signal shape. Kept as a plain object
// so the caller (export.ts) decides how to dispatch it (gtag / dataLayer /
// no-op) — this module has no window/DOM access.
export interface ConsentModeSignal {
  analytics_storage: ConsentModeStatus;
  ad_storage: ConsentModeStatus;
  ad_user_data: ConsentModeStatus;
  ad_personalization: ConsentModeStatus;
  personalization_storage: ConsentModeStatus;
  functionality_storage: ConsentModeStatus;
  security_storage: ConsentModeStatus;
}

const status = (granted: boolean): ConsentModeStatus =>
  granted ? "granted" : "denied";

export function buildConsentModeSignal(
  c: ConsentCategories
): ConsentModeSignal {
  return {
    analytics_storage: status(c.statistics),
    ad_storage: status(c.marketing),
    ad_user_data: status(c.marketing),
    ad_personalization: status(c.marketing),
    personalization_storage: status(c.preferences),
    functionality_storage: "granted",
    security_storage: "granted"
  };
}
