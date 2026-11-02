---
created: "2026-09-21T20:32:14Z"
last_edited: "2026-09-21T20:32:14Z"
---
# Implementation Tracking: cookie-banner-setting

Build site: context/plans/build-site.md

| Task | Status | Notes |
|------|--------|-------|
| T-003 | DONE | `Brizy_Admin_Blocks_CookieBanner::isCookieBannerEnabled()` reader; `general_settings_submit()` stores `isset($_POST['cookie-banner-enabled'])` outside post-types error branch. Harness: R2 AC1-6 PASS. Cest: tests/functional/CookieBannerSettingPersistenceCest.php (not run; Codeception absent) |
| T-005 | DONE | `get_general_tab()` passes `cookieBannerEnabled`; new row in admin/views/settings/general.php (id/name `cookie-banner-enabled`, value 1). Harness: R1 AC1-5 PASS + regression PASS. Cest: tests/functional/CookieBannerSettingFieldCest.php |
| T-012 | DONE | `general_settings_submit()`: previous via `Brizy_Admin_Blocks_CookieBanner::isCookieBannerEnabled()`; off→on `enable()`, on→off `disable()`, unchanged → no call; outside post-types error branch. Lazy private `getCookieBanner()` + `@internal setCookieBanner()` test seam. Harness: R3 AC1-6 PASS (spy + real class). Cest: CookieBannerSettingTransitionCest.php |
| T-013 | DONE | false result → flag not written, `Brizy_Admin_Flash` error "Unable to update the cookie banner. Please try again."; other options still saved; retry works. `action_validate_form_submit()` unchanged (already skips "Settings saved." on ERROR). Harness: R4 AC1-11, R2 AC4/5 branch PASS. Cest: CookieBannerSettingFailureCest.php. Parent: PersistenceCest now injects stub banner + resets flash |
