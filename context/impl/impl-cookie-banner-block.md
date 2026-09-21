---
created: "2026-09-21T20:32:14Z"
last_edited: "2026-09-21T20:32:14Z"
---
# Implementation Tracking: cookie-banner-block

Build site: context/plans/build-site.md

| Task | Status | Notes |
|------|--------|-------|
| T-002 | DONE | `Brizy_Admin_Blocks_CookieBanner` (admin/blocks/cookie-banner.php): DI ctor (Blocks/Rules managers), `getUid()` = `brz-cookie-banner-{blog_id}`, trash-aware `findBlock()` via `getEntities()` explicit status list. Also static `isCookieBannerEnabled()` reader (user: follow Svg_Main pattern). Harness: block R1 AC1, AC2, AC4-lookup PASS. Cest: CookieBannerIdentityCest.php |
| T-007 | DONE | `enable(): bool` create path: trash-aware `findBlock()` → private `createBlock()` from private `getDefaultPayload()` (title, publish, position, deps, meta, data w/ siteId), `save()`, then include-all via `applyRules()` (single brizy-rules write). Harness: R2 AC1-10, R1 AC5 PASS. Cest: CookieBannerEnableCreateCest.php |
| T-009 | DONE | Existing path: private `publishBlock()` restores trash (untrash then publish), draft/pending/private/future → publish (future: date moved to now, cron cleared); content untouched; include-all. Harness: R3 AC1-10 ×6 statuses, R1 AC4 PASS. Cest: CookieBannerEnableExistingCest.php |
| T-008 | DONE | `disable(): bool`: exclude-all when block exists; no block → true, nothing created; status/content untouched. Harness: R4 AC1-6 PASS. Cest: CookieBannerDisableCest.php |
| T-010 | DONE | `markAllForCompilation()` right after `save()`, before rule write; only in create path. Harness: R5 AC1, AC2, AC4-6 PASS (AC3 human review → T-014). Cest: CookieBannerRecompileCest.php |
| T-011 | DONE | enable/disable catch Throwable → false; failure paths (create, restore, rule write) → false; convergence + repair of half-created block. Harness: R6 AC1-6, R1 AC3 PASS; 10/10 mutants caught. Cest: CookieBannerOutcomeCest.php |
| T-014 | PENDING (human review) | Condition not met: no CookieBanner element support in plugin editor build or local `bb-compiler` container. Block R5 AC3 awaits compiler support. Does not block other tasks. |
