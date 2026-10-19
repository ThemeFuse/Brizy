import { buildConsentModeSignal } from "../consentMode";
import { ConsentCategories } from "../model";

describe("buildConsentModeSignal", () => {
  test("all categories granted", () => {
    const c: ConsentCategories = {
      preferences: true,
      statistics: true,
      marketing: true,
      other: true
    };

    expect(buildConsentModeSignal(c)).toEqual({
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      personalization_storage: "granted",
      functionality_storage: "granted",
      security_storage: "granted"
    });
  });

  test("all categories denied", () => {
    const c: ConsentCategories = {
      preferences: false,
      statistics: false,
      marketing: false,
      other: false
    };

    expect(buildConsentModeSignal(c)).toEqual({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      personalization_storage: "denied",
      functionality_storage: "granted",
      security_storage: "granted"
    });
  });

  test("mixed categories map independently", () => {
    const c: ConsentCategories = {
      preferences: true,
      statistics: false,
      marketing: true,
      other: false
    };

    expect(buildConsentModeSignal(c)).toEqual({
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      personalization_storage: "granted",
      functionality_storage: "granted",
      security_storage: "granted"
    });
  });

  test("`other` maps to no gtag field — the signal is identical either way", () => {
    const base = {
      preferences: true,
      statistics: false,
      marketing: true
    };

    expect(buildConsentModeSignal({ ...base, other: true })).toEqual(
      buildConsentModeSignal({ ...base, other: false })
    );
  });
});
