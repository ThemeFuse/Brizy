---
created: "2026-09-21T20:32:14Z"
last_edited: "2026-09-21T20:32:14Z"
---
# Implementation Tracking: cookie-banner-rules

Build site: context/plans/build-site.md

| Task | Status | Notes |
|------|--------|-------|
| T-001 | DONE | `includeAllRules()` / `excludeAllRules()`; fixed rule ids (md5 of set name) so re-apply is true no-op (null id → random id breaks idempotency). Harness: R1 AC1-5, R2 AC1-5 PASS. Test: tests/unit/BrizyAdminBlocksCookieBannerRuleSetsTest.php |
| T-004 | DONE | `applyRules($postId, array $rules): bool` via `Brizy_Admin_Rules_Manager::setRules()` + `getRules()` read-back, order-independent, ignores ids, Exception → false. Harness: R3 AC1-9 PASS (failure via update/get_post_metadata filters). Cest: CookieBannerApplyRulesCest.php |
| T-006 | DONE | Verification only (no prod code). Render via `Brizy_Content_Placeholders_GlobalBlocks::getValue()`: post, page, archive template, single template; include → present, exclude → absent, switch w/o recompile. Real-query template resolution verified in isolated harness processes (static cache in Rules_Manager). AC5 proxy only (top slot absent); visual = T-015. Cest: CookieBannerRenderCest.php |
| T-015 | PENDING (human review) | Condition not met (same as T-014). Rules R4 AC5 visual placement awaits compiler support; automated proxy (absent from top slot, after page content) PASS in T-006. |
