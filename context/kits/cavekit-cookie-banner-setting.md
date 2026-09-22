---
created: "2026-09-21T20:04:16Z"
last_edited: "2026-09-21T20:04:16Z"
---

# Cavekit: Cookie Banner Setting

## Scope

The "Enable Cookie Banner" option on the plugin's General settings tab. This kit covers:
- rendering the option
- its default value
- saving it
- detecting when its value changes
- calling the banner enable or disable operation
- handling failures reported by those operations

This kit contains no block logic and no rule logic. Those belong to cookie-banner-block and cookie-banner-rules.

## Requirements

### R1: Field on the General Tab
**Description:** The General settings tab shows a checkbox labelled "Enable Cookie Banner" next to the existing General options. The checkbox is checked only when the stored value is true.
**Acceptance Criteria:**
- [ ] The General tab of the plugin settings page contains a checkbox labelled `Enable Cookie Banner`
- [ ] The checkbox is in the same form as the existing General options and is submitted by the same save action
- [ ] The checkbox is checked when the stored value is `true`
- [ ] The checkbox is unchecked when the stored value is `false`
- [ ] The checkbox is unchecked when no value has ever been stored
**Dependencies:** R2

### R2: Persistence
**Description:** The option is stored as a boolean under the key `cookie-banner-enabled`, in the same settings store as the other General options. If it has never been set, it reads as false.
**Acceptance Criteria:**
- [ ] The value is stored under the key `cookie-banner-enabled`
- [ ] The stored value is a boolean (`true` or `false`), not a string or number
- [ ] The value is in the same settings store as the other General options
- [ ] Submitting the General form with the checkbox checked stores `true`, unless R4 applies
- [ ] Submitting the General form with the checkbox unchecked (field missing from the submission) stores `false`, unless R4 applies
- [ ] If `cookie-banner-enabled` has never been set, reading it returns `false`
**Dependencies:** None

### R3: Transition Detection
**Description:** A save calls banner enable or disable only when the stored value actually changes. Saving the General tab without changing the value never touches the banner.
**Acceptance Criteria:**
- [ ] If the previous value is `false` or unset and the submitted value is `true`, banner enable is called exactly once
- [ ] If the previous value is `true` and the submitted value is `false`, banner disable is called exactly once
- [ ] If the previous value is `true` and the submitted value is `true`, neither banner enable nor banner disable is called
- [ ] If the previous value is `false` or unset and the submitted value is `false`, neither banner enable nor banner disable is called
- [ ] Saving the General tab with the checkbox unchecked on a site where the banner was never enabled creates no banner block
- [ ] Saving the General tab without changing the value leaves the existing banner block's status, rules, and content the same
**Dependencies:** R2; cookie-banner-block R2, R3, R4

### R4: Failure Handling
**Description:** If banner enable or disable reports failure, the new value is not saved and an error notice is shown instead of the success notice. The other General options are still saved. Because the stored value keeps its old value, submitting the same checkbox state again retries the operation. The post-type save and the banner processing do not block each other.
**Acceptance Criteria:**
- [ ] If banner enable reports failure, `cookie-banner-enabled` keeps its previous value (`false` or unset)
- [ ] If banner disable reports failure, `cookie-banner-enabled` keeps its previous value (`true`)
- [ ] If banner enable or disable reports failure, the settings page shows an error notice
- [ ] If banner enable or disable reports failure, the settings page does not show the `Settings saved.` success notice
- [ ] If banner enable or disable reports failure, the post types submitted in the same save are still saved
- [ ] If banner enable or disable reports failure, the SVG uploads option submitted in the same save is still saved
- [ ] If banner enable or disable reports failure, the JSON uploads option submitted in the same save is still saved
- [ ] If banner enable or disable reports failure, the Getting Started video option submitted in the same save is still saved
- [ ] A post-type validation error in the same save does not stop banner enable or disable from being called when the checkbox value changes
- [ ] After a failed enable, submitting the General form with the checkbox checked again calls banner enable again
- [ ] After a failed disable, submitting the General form with the checkbox unchecked again calls banner disable again
**Dependencies:** R2, R3; cookie-banner-block R6

## Implementation Constraints (user-mandated)

- The setting MUST work the same way as the existing General tab settings: the same form, the same save flow, and the same common settings storage.
- Banner enable and disable MUST be called through `Brizy_Admin_Blocks_CookieBanner`, the class required by cavekit-cookie-banner-block.md.

## Out of Scope

- Network admin settings
- Other settings tabs (Roles, Maintenance)
- Editor UI
- Frontend consent logic
- Block creation, restore, and identity (belongs to cookie-banner-block)
- Rule set contents and writing (belongs to cookie-banner-rules)

## Cross-References

- See also: cavekit-cookie-banner-block.md. This kit calls its enable (block R2, R3) and disable (block R4) operations, and receives success or failure from them (block R6).
- See also: cavekit-overview.md

## Changelog

- 2026-09-21T20:04:16Z: First draft, written from the approved design.
