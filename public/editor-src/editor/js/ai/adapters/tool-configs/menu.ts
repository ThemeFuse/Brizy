import { menuPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import type { BrizyToolResult } from "../../entities/models";
import {
  restoreColorOpacity,
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type {
  AddNoPropsToolConfig,
  HandlerDeps,
  UpdateToolConfig
} from "../types";

export const addMenuConfig: AddNoPropsToolConfig = {
  kind: "addNoProps",
  alias: "addMenu",
  elementType: ElementTypes.Menu
};
// Custom typography (fontSize, fontWeight, etc.) only renders when fontStyle is
// "" — otherwise the global preset (default "button") wins. Auto-clear it.
// The drawer and the dropdown carry their own presets under mMenu*/subMenu*,
// which inferStoredFlags clears from the matching prefixed sizes.
const CUSTOM_TYPOGRAPHY_KEYS = [
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing"
];
const inferCustomFontStyle = <T extends Record<string, unknown>>(
  props: T
): T =>
  !("fontStyle" in props) &&
  CUSTOM_TYPOGRAPHY_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, fontStyle: "" }
    : props;
// The bar, the drawer and the dropdown each take a fontFamily, so the names
// have to be normalised to builder format before the font check runs.
export const withMenuDefaults = pipe(
  withColorDefaults,
  withAllFontFamilyNormalize,
  inferCustomFontStyle
);
/**
 * Menu pre-update hook. Reads the element's stored value once, then:
 *
 * 1. Strips `horizontalAlign` — the Menu has no page-align prop of its own
 *    (alignment lives on the Wrapper addMenu creates). Agents reliably reach
 *    for updateMenu when asked to "align the menu", so menuAfterUpdate writes
 *    it to the parent instead of forcing a cross-tool updateWrapper hop.
 *    `mMenuItemHorizontalAlign` (drawer contents) is untouched.
 *
 * 2. Restores color opacity when a hex lands on a stored transparent color
 *    (e.g. menuBgColor defaults to opacity 0), so the change is actually visible.
 *
 * ponytail: (2) is Menu-only for now, but the same latent bug exists on many
 * components whose *ColorOpacity defaults to 0 (Column, Image, Icon, Calendly…).
 * If it recurs elsewhere, lift restoreColorOpacity into handler-factory's update
 * handler (gated on a *ColorHex being present) so every update tool gets it.
 */
const menuBeforeUpdate = (
  deps: HandlerDeps,
  elementId: string,
  changes: Record<string, unknown>
): Record<string, unknown> => {
  const hasAlign = changes.horizontalAlign !== undefined;
  const hasHex = Object.keys(changes).some((k) => k.endsWith("Hex"));
  if (!hasAlign && !hasHex) {
    return changes;
  }

  const el = deps.pageRepository.getElementById(elementId);
  const stored =
    el.success && el.data
      ? (el.data.value as Record<string, unknown>)
      : undefined;

  // horizontalAlign belongs to the parent Wrapper, not to the Menu — strip it
  // here and let menuAfterUpdate write it once the Menu update has landed.
  const { horizontalAlign: _align, ...withoutAlign } = changes;
  const result = hasAlign ? withoutAlign : changes;

  return stored ? restoreColorOpacity(stored, result) : result;
};

/**
 * A Menu has no page-alignment prop; the alignment lives on its parent Wrapper.
 * Runs after the Menu update so a rejected update leaves the Wrapper untouched.
 */
const menuAfterUpdate = (
  deps: HandlerDeps,
  elementId: string,
  parsed: Record<string, unknown>
): BrizyToolResult | undefined => {
  const horizontalAlign = parsed.horizontalAlign;
  if (horizontalAlign === undefined) {
    return undefined;
  }

  const el = deps.pageRepository.getElementById(elementId);

  if (!el.success || !el.data?.parentId || !el.data.parentType) {
    return {
      success: false,
      error: `Menu "${elementId}" has no parent container, so its page alignment could not be set. Every other requested change was applied.`
    };
  }

  const parentResult = deps.pageRepository.updateElement({
    elementId: el.data.parentId,
    elementType: el.data.parentType,
    changes: { horizontalAlign }
  });

  // The Menu update already landed; report the alignment failure rather than
  // claiming the whole request applied.
  return parentResult.success
    ? undefined
    : {
        success: false,
        error: `Menu updated, but its page alignment could not be applied to the parent ${el.data.parentType}: ${parentResult.error}`
      };
};
export const updateMenuConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateMenu",
  elementType: ElementTypes.Menu,
  schema: menuPropsSchema,
  defaults: withMenuDefaults,
  beforeUpdate: menuBeforeUpdate,
  afterUpdate: menuAfterUpdate
};
