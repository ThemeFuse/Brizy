---
created: "2026-09-21T20:04:16Z"
last_edited: "2026-09-21T20:12:00Z"
---

# Cavekit Overview

## Project

Brizy WordPress plugin: Cookie Banner toggle feature. An "Enable Cookie Banner" option on the General settings tab. Turning it on creates or restores a site-wide Cookie Banner global block and makes it show on every frontend page that Brizy renders (pages built with Brizy, or rendered through a Brizy template). Turning it off hides the block on all of them.

## Domain Index

| Domain | File | Requirements | Acceptance Criteria | Status | Description |
|---|---|---|---|---|---|
| cookie-banner-rules | [cavekit-cookie-banner-rules.md](cavekit-cookie-banner-rules.md) | 4 | 26 | DRAFT | The include-all and exclude-all rule sets for the banner block, applied as a full replacement |
| cookie-banner-block | [cavekit-cookie-banner-block.md](cavekit-cookie-banner-block.md) | 6 | 43 | DRAFT | Banner global block lifecycle: identity, creation with default payload, restore, enable/disable, recompile on first creation |
| cookie-banner-setting | [cavekit-cookie-banner-setting.md](cavekit-cookie-banner-setting.md) | 4 | 28 | DRAFT | "Enable Cookie Banner" checkbox on the General tab: rendering, persistence, change detection, failure handling |

## Cross-Reference Map

| From | To | Interaction |
|---|---|---|
| cookie-banner-setting | cookie-banner-block | Calls enable (block R2, R3) or disable (block R4) when the value changes; receives success or failure (block R6) |
| cookie-banner-block | cookie-banner-rules | Applies include-all on enable (rules R1) and exclude-all on disable (rules R2), both as full replacement (rules R3) |

## Dependency Graph

```
cookie-banner-setting  -->  cookie-banner-block  -->  cookie-banner-rules
```

No circular dependencies.

## Implementation Order

1. cookie-banner-rules: no dependencies
2. cookie-banner-block: depends on cookie-banner-rules
3. cookie-banner-setting: depends on cookie-banner-block

## Coverage Summary

- Kits: 3
- Total requirements: 14
- Total acceptance criteria: 97
- Acceptance criteria flagged "(human review)": 2 (cookie-banner-rules R4, visual bottom placement; cookie-banner-block R5, banner in rendered output after first creation, which depends on compiler support for the CookieBanner element)

## Architect Notes

These are codebase facts found during review. They are not requirements.
- WordPress queries with `post_status => 'any'` exclude `trash`. The existing global-block lookup and its duplicate-uid check both use `'any'`, so they will not see a trashed banner. Block R1 and R3 need a lookup that includes `trash`, and each needs its own task and test. This fits the mandate to use `Brizy_Admin_Blocks_Manager`: `getEntities($args)` merges `$args` over its defaults, so passing an explicit `post_status` list that includes `trash`, plus the `brizy_post_uid` meta key and value, finds a trashed banner.
- `Brizy_Admin_Rules_Manager::saveRules` returns nothing, and the metadata update underneath it returns false when the value is unchanged. Rules R3 defines success by reading the rules back, not by that return value.
- Global blocks render only through the Brizy global-blocks placeholder inside Brizy-rendered output. Do not plan a site-wide injection.

## Changelog

- 2026-09-21T20:04:16Z: First draft, written from the approved design.
- 2026-09-21T20:12:00Z: Review fixes. Scope wording limited to Brizy-rendered pages; counts updated; Architect Notes added.
