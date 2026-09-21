---
created: "2026-09-21T20:04:16Z"
last_edited: "2026-09-21T20:12:00Z"
---

# Cavekit: Cookie Banner Rules

## Scope

The two standard display rule sets for the Cookie Banner global block (include-all and exclude-all), and what happens when one of them is applied to the block. This kit defines WHAT the rule sets are and what applying one does. It does NOT decide WHEN a rule set is applied. That decision belongs to cookie-banner-block.

## Requirements

### R1: Include-All Rule Set
**Description:** There is one include-all rule set. When it is applied, the banner block can show on every frontend page that Brizy renders (see R4).
**Acceptance Criteria:**
- [ ] The include-all rule set contains exactly one rule
- [ ] That rule has `type` equal to `1` (include)
- [ ] That rule has `appliedFor` equal to `null`
- [ ] That rule has `entityType` equal to `""` (empty string)
- [ ] That rule has `entityValues` equal to `[]` (empty list)
**Dependencies:** None

### R2: Exclude-All Rule Set
**Description:** There is one exclude-all rule set. When it is applied, the banner block shows on no frontend page.
**Acceptance Criteria:**
- [ ] The exclude-all rule set contains exactly one rule
- [ ] That rule has `type` equal to `2` (exclude)
- [ ] That rule has `appliedFor` equal to `null`
- [ ] That rule has `entityType` equal to `""` (empty string)
- [ ] That rule has `entityValues` equal to `[]` (empty list)
**Dependencies:** None

### R3: Apply Is a Full Replacement
**Description:** Applying a rule set replaces ALL of the banner block's rules. Any rules that were there before are removed, including custom rules added in the editor.
**Acceptance Criteria:**
- [ ] After a rule set is applied, reading the banner block's rules returns exactly one rule
- [ ] That rule matches the applied rule set's rule in every field (`type`, `appliedFor`, `entityType`, `entityValues`)
- [ ] Custom rules that were on the block before (for example, rules added in the editor) are gone after a rule set is applied
- [ ] After a switch from include-all to exclude-all, the block has exactly one rule and its `type` is `2`
- [ ] After a switch from exclude-all to include-all, the block has exactly one rule and its `type` is `1`
- [ ] Applying the same rule set twice in a row leaves the block's rules the same as applying it once (idempotent)
- [ ] Apply reports success exactly when the block's rules, read back after the write, equal the applied rule set (equality means the same number of rules, and each rule matches on `type`, `appliedFor`, `entityType`, and `entityValues`)
- [ ] Applying a rule set the block already has reports success (an unchanged value is not a failure)
- [ ] Apply reports failure when the rules read back after the write do not equal the applied rule set
**Dependencies:** R1, R2

### R4: Effect on Frontend Rendering
**Description:** The applied rule set decides which Brizy-rendered frontend pages the banner block matches. A Brizy-rendered page is a page built with Brizy, or a page (including archives) rendered through a Brizy template. Global blocks only render inside Brizy-rendered output. The banner shows only when it matches AND has compiled content. A change of rule set takes effect on the next page view, with no recompilation.
**Acceptance Criteria:**
- [ ] With include-all applied and compiled content present, the banner block is in the rendered output of a single post built with Brizy
- [ ] With include-all applied and compiled content present, the banner block is in the rendered output of a single page built with Brizy
- [ ] With include-all applied and compiled content present, the banner block is in the rendered output of an archive page rendered through a Brizy template
- [ ] With include-all applied and compiled content present, the banner block is in the rendered output of a single post or page rendered through a Brizy template
- [ ] With include-all applied, the rendered banner is placed at the block's bottom position (align `bottom`) (human review)
- [ ] With exclude-all applied, the banner block is not in the rendered output of any Brizy-rendered page listed above
- [ ] After a switch between include-all and exclude-all, the next frontend page view shows the new rule set's effect, with no content recompilation
**Dependencies:** R1, R2, R3

## Implementation Constraints (user-mandated)

- Rule management (reading and replacing the banner block's rules) MUST use `Brizy_Admin_Rules_Manager`.

## Out of Scope

- Deciding when a rule set is applied (belongs to cookie-banner-block)
- Any rule validation UI
- Rules for any block other than the Cookie Banner block
- Custom per-page targeting for the banner
- Keeping custom rules added in the editor (they are removed on purpose; see R3)
- Showing the banner on frontend pages that Brizy does not render (plain theme posts, pages, or archives with no Brizy content or Brizy template)

## Cross-References

- See also: cavekit-cookie-banner-block.md. It uses this kit: it applies include-all on enable (block R2, R3) and exclude-all on disable (block R4).
- See also: cavekit-overview.md

## Changelog

- 2026-09-21T20:04:16Z: First draft, written from the approved design.
- 2026-09-21T20:12:00Z: Review fixes. R4 limited to Brizy-rendered pages (global blocks render only inside Brizy output); R3 defines when apply succeeds or fails (read-back equality, no-op counts as success); out-of-scope line added for non-Brizy pages.
