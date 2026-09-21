---
created: "2026-09-21T20:04:16Z"
last_edited: "2026-09-21T20:12:00Z"
---

# Cavekit: Cookie Banner Block

## Scope

The lifecycle of the Cookie Banner global block:
- its identity
- creating it with the default payload
- restoring it
- the enable and disable operations
- the recompilation trigger on first creation

What goes into the rule sets, and how they are written, belongs to cookie-banner-rules. cookie-banner-setting calls the enable and disable operations and decides when to call them.

## Requirements

### R1: Unique Identity
**Description:** The banner block's uid is fixed for each site: `brz-cookie-banner-{siteId}`. `siteId` is the id of the current WordPress site (blog). On single-site installs it is `1`; on multisite, each site uses its own id. A site never has more than one banner block. The banner block is a standard global block.
**Acceptance Criteria:**
- [ ] On a single-site install, the banner block's uid is `brz-cookie-banner-1`
- [ ] On a multisite install, the banner block created on the site with id N has uid `brz-cookie-banner-N`
- [ ] After any number of enable/disable toggles on a site, that site has at most one block with uid `brz-cookie-banner-{siteId}`, across all statuses (publish, draft, trash)
- [ ] A trashed banner block counts as existing: while one is in the trash, enable never creates a second block with the same uid
- [ ] After enable, the banner block appears in the global-block list delivered to the editor
**Dependencies:** None

### R2: Enable Creates the Block When None Exists
**Description:** If no banner block exists when enable runs, exactly one global block is created from the Default Payload (see the Data Contract section below). Its rule set ends as include-all.
**Acceptance Criteria:**
- [ ] Enabling when no block with uid `brz-cookie-banner-{siteId}` exists leaves exactly one global block with that uid
- [ ] The created block's title is `Cookie Banner`
- [ ] The created block's status is `publish`
- [ ] The created block's position equals `{ "align": "bottom", "top": 0, "bottom": 0 }`
- [ ] The created block's dependencies are an empty list
- [ ] The created block's meta equals `{ "type": "overlay", "subtype": "cookieBanner", "extraFontStyles": [] }`
- [ ] The created block's editor data equals the `data` object of the Default Payload, with `<siteId>` replaced by the current site id
- [ ] After enable, the created block's rule set equals the include-all rule set (cookie-banner-rules R1)
- [ ] The Default Payload's `rules` entry is realized only by applying the include-all rule set (cookie-banner-rules R3); no other path writes the block's rules during creation
- [ ] Enable reports success when creation and rule application both succeed
**Dependencies:** R1; cookie-banner-rules R1, R3

### R3: Enable When the Block Already Exists
**Description:** If a banner block already exists when enable runs, no new block is created. A non-published block is restored to `publish`. The user's edits to the block are kept. The rule set ends as include-all.
**Acceptance Criteria:**
- [ ] Enabling when a block with uid `brz-cookie-banner-{siteId}` exists creates no new block (the count of blocks with that uid stays 1)
- [ ] If the existing block's status is `trash`, its status is `publish` after enable
- [ ] If the existing block's status is `draft`, its status is `publish` after enable
- [ ] If the existing block's status is any other non-published status (for example `pending` or `private`), its status is `publish` after enable
- [ ] If the existing block's status is `publish`, it stays `publish` after enable
- [ ] The existing block's title is the same before and after enable
- [ ] The existing block's editor data is the same before and after enable
- [ ] The existing block's meta is the same before and after enable
- [ ] The existing block's position is the same before and after enable
- [ ] After enable, the existing block's rule set equals the include-all rule set (cookie-banner-rules R1)
**Dependencies:** R1; cookie-banner-rules R1, R3

### R4: Disable
**Description:** If the banner block exists, disable changes its rule set to exclude-all. Nothing else about the block changes, and the block is not deleted. If no block exists, disable does nothing and reports success.
**Acceptance Criteria:**
- [ ] Disabling when the block exists leaves its rule set equal to the exclude-all rule set (cookie-banner-rules R2)
- [ ] The block still exists after disable (it is not deleted)
- [ ] The block's status is the same before and after disable
- [ ] The block's title, editor data, meta, and position are the same before and after disable
- [ ] Disabling when no block with uid `brz-cookie-banner-{siteId}` exists creates no block
- [ ] Disabling when no block with uid `brz-cookie-banner-{siteId}` exists reports success
**Dependencies:** R1; cookie-banner-rules R2, R3

### R5: Recompile on First Creation Only
**Description:** Right after the banner block is created, all Brizy content is flagged for recompilation. This lets the banner compile and show on the next page view. Restoring, re-enabling, and disabling do NOT trigger recompilation.
**Acceptance Criteria:**
- [ ] Right after an enable that creates the block, all Brizy content is flagged for recompilation
- [ ] The recompilation flag is set as soon as the block is created, even if the rule write that follows fails
- [ ] After an enable that created the block, the rendered output of the next frontend view of a Brizy-rendered page contains the banner (human review; requires compiler support for the CookieBanner element, which is out of scope)
- [ ] An enable that restores a non-published block does not flag any content for recompilation
- [ ] An enable on an existing `publish` block does not flag any content for recompilation
- [ ] A disable does not flag any content for recompilation
**Dependencies:** R2, R3, R4

### R6: Outcome Reporting and Convergence
**Description:** Enable and disable always report success or failure to the caller. A failure is never silently ignored. Running enable again always reaches the same end state. If an earlier enable only partly succeeded, the next enable repairs it.
**Acceptance Criteria:**
- [ ] Every enable call reports either success or failure to its caller
- [ ] Every disable call reports either success or failure to its caller
- [ ] If any step of enable fails (block creation, status restore, or rule application as defined in cookie-banner-rules R3), enable reports failure
- [ ] If rule application during disable fails (as defined in cookie-banner-rules R3), disable reports failure
- [ ] Running enable two or more times in a row leaves exactly one block with uid `brz-cookie-banner-{siteId}`, with status `publish` and the include-all rule set
- [ ] If an earlier enable created the block but failed to write its rules, the next enable leaves exactly one block with that uid, with status `publish` and the include-all rule set, and reports success
**Dependencies:** R1, R2, R3, R4; cookie-banner-rules R3

## Data Contract: Default Payload

This is the payload for a newly created banner block (R2). Replace `<siteId>` with the current site id (R1).

```json
{
  "uid": "brz-cookie-banner-<siteId>",
  "title": "Cookie Banner",
  "status": "publish",
  "position": { "align": "bottom", "top": 0, "bottom": 0 },
  "dependencies": [],
  "rules": [
    { "type": 1, "appliedFor": null, "entityType": "", "entityValues": [] }
  ],
  "meta": {
    "type": "overlay",
    "subtype": "cookieBanner",
    "extraFontStyles": []
  },
  "data": {
    "type": "CookieBanner",
    "blockId": "CookieBanner",
    "value": {
      "_id": "brz-cookie-banner-<siteId>",
      "items": [
        {
          "type": "RichText",
          "value": {
            "_id": "brz-cookie-banner-<siteId>-text",
            "_styles": ["richText"],
            "_version": 3,
            "text": "<p class='brz-tp-paragraph'><span class='brz-cp-color7'>We use cookies to improve your experience.</span></p>",
            "colorHex": "",
            "colorPalette": "color7"
          }
        }
      ]
    }
  }
}
```

## Implementation Constraints (user-mandated)

- The block lifecycle (create / include / exclude) MUST be implemented in a new class `Brizy_Admin_Blocks_CookieBanner`, in the file `admin/blocks/cookie-banner.php`.
- `Brizy_Admin_Blocks_CookieBanner` MUST use `Brizy_Admin_Blocks_Manager` (global block type) to get, create, and update the block.
- The banner block MUST be a `Brizy_Editor_Block` global block.
- `siteId` MUST come from `get_current_blog_id()`.
- Rule sets MUST be applied through cookie-banner-rules, which uses `Brizy_Admin_Rules_Manager`.

## Out of Scope

- Editor support for the CookieBanner element
- Consent behavior (accepting or rejecting cookies, storing consent)
- Banner styling beyond the Default Payload
- Deleting the banner block
- Migrating existing sites
- What the rule sets contain and how they are written (belongs to cookie-banner-rules)
- Deciding when enable or disable runs (belongs to cookie-banner-setting)

## Known Limitations

- If an enable creates the block but its rule write fails, and every Brizy-rendered page is recompiled before the next enable repairs the rules, the banner may have no compiled content until a later recompilation. This is accepted: recompilation is flagged only on first creation (R5), and the rule write failing is very unlikely.

## Cross-References

- See also: cavekit-cookie-banner-setting.md. It calls enable (R2, R3) and disable (R4), and uses the reported success or failure (R6).
- See also: cavekit-cookie-banner-rules.md. Enable applies include-all (rules R1); disable applies exclude-all (rules R2); both use full replacement (rules R3).
- See also: cavekit-overview.md

## Changelog

- 2026-09-21T20:04:16Z: First draft, written from the approved design.
- 2026-09-21T20:12:00Z: Review fixes. R1: trashed block counts as existing, editor-list AC scoped to after enable. R2: payload rules realized only through rules R3. R3: all non-published statuses restored. R5: render AC marked human review (depends on out-of-scope compiler support); recompile flag set on creation even if the rule write fails. R6: failure defined by rules R3. Known Limitations section added.
