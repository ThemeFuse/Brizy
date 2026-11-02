import { menuPropsSchema } from "@brizy/ai-tools";
import { z } from "zod";
import { flattenDefaultValue } from "visual/editorComponents/EditorComponent/utils";
import menuDefaultValue from "visual/editorComponents/Menu/defaultValue.json";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import {
  defaultValueKey,
  parseDefaultValueKey
} from "visual/utils/onChange/device";
import type { ResponsiveMode } from "visual/utils/responsiveMode";
import * as Responsive from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";
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
/** `horizontalAlign` and its tablet and mobile twins. */
const ALIGN_KEYS = Responsive.types.map((device) =>
  defaultValueKey({ key: "horizontalAlign", device, state: NORMAL })
);

/** The switch between the bar of links and the hamburger drawer. */
const drawerModeKey = (device: ResponsiveMode): string =>
  defaultValueKey({ key: "mMenu", device, state: NORMAL });

const onOffSchema = z.enum(["on", "off"]);
const storedSchema = z.record(z.unknown());

const menuDefaults = flattenDefaultValue(menuDefaultValue);

/**
 * Whether the menu is a hamburger drawer on this device once the patch lands.
 *
 * Read the way the component reads it — the device's own `mMenu`, which the
 * Menu ships as "on" for tablet and mobile — with the patch winning, so a
 * call that switches the mode and styles the result in one go is judged by
 * the mode it is switching to.
 */
const isDrawerOn = (
  device: ResponsiveMode,
  stored: Record<string, unknown>,
  changes: Record<string, unknown>
): boolean => {
  const key = drawerModeKey(device);
  const mode = onOffSchema.safeParse(
    changes[key] ?? stored[key] ?? menuDefaults[key]
  );
  return mode.success && mode.data === "on";
};

/**
 * Which of the two menus a device key styles, if either.
 *
 * The toolbar swaps wholesale on tablet and mobile: with the drawer on it
 * offers the drawer's options, with it off the bar-of-links ones
 * (`Menu/toolbarExtend.js` picks `getItemsMMenu` or `getItemsSimple` by that
 * device's `mMenu`). The drawer's are the `mMenu*` and `close*` keys plus the
 * picture behind it; the mode switch itself, the layout and the page alignment
 * belong to neither.
 */
const DRAWER_ONLY = [
  "bgPositionX",
  "bgPositionY",
  "brightness",
  "contrast",
  "saturation",
  "hue"
];
const NEITHER = ["mMenu", "horizontalAlign", "verticalMode"];

const menuPartOf = (bareKey: string): "drawer" | "bar" | undefined => {
  if (NEITHER.includes(bareKey)) return undefined;
  if (/^(mMenu|close)/.test(bareKey) || DRAWER_ONLY.includes(bareKey)) {
    return "drawer";
  }
  return "bar";
};

/**
 * Refuse a tablet or mobile value for the menu that device does not show.
 *
 * A device paints either the bar of links or the hamburger drawer, never
 * both, so a tablet link colour sent while tablet is a drawer is stored and
 * changes nothing. Nothing in the catalog can know which one a given menu
 * shows on a given device — that is stored state — so the call is turned back
 * here with the way out, rather than reported as applied.
 */
const menuPrecondition = (
  deps: HandlerDeps,
  elementId: string,
  changes: Record<string, unknown>
): BrizyToolResult | undefined => {
  const sent = Object.keys(changes).filter((key) => changes[key] !== undefined);
  if (
    sent.every((key) => parseDefaultValueKey(key).device === Responsive.DESKTOP)
  ) {
    return undefined;
  }

  const el = deps.pageRepository.getElementById(elementId);
  const stored = storedSchema.safeParse(
    el.success ? el.data?.value : undefined
  );
  if (!stored.success) return undefined;

  for (const device of Responsive.mobileModes()) {
    const drawer = isDrawerOn(device, stored.data, changes);
    const hidden = drawer ? "bar" : "drawer";
    const mismatched = sent.filter((key) => {
      const parsed = parseDefaultValueKey(key);
      return parsed.device === device && menuPartOf(parsed.key) === hidden;
    });

    if (mismatched.length === 0) continue;

    const modeKey = drawerModeKey(device);
    return {
      success: false,
      error: drawer
        ? `On ${device} this menu is a hamburger drawer (${modeKey} is "on"), so its bar of links is not shown there and ${mismatched.join(", ")} would change nothing. Style the drawer with the updateMenuDrawer* ${device} tools, or set ${modeKey} to "off" first to show the bar of links on ${device}.`
        : `On ${device} this menu is a bar of links (${modeKey} is "off"), so its hamburger drawer is not shown there and ${mismatched.join(", ")} would change nothing. Style the links with the other updateMenu* ${device} tools, or set ${modeKey} to "on" first to collapse it into a drawer on ${device}.`
    };
  }

  return undefined;
};

/**
 * Menu pre-update hook. Reads the element's stored value once, then:
 *
 * 1. Strips `horizontalAlign` and its tablet and mobile twins — the Menu has
 *    no page-align prop of its own (alignment lives on the Wrapper addMenu
 *    creates). Agents reliably reach for updateMenu when asked to "align the
 *    menu", so menuAfterUpdate writes it to the parent instead of forcing a
 *    cross-tool updateWrapper hop. `mMenuItemHorizontalAlign` (drawer
 *    contents) is untouched.
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
  const hasAlign = ALIGN_KEYS.some((key) => changes[key] !== undefined);
  const hasHex = Object.keys(changes).some((k) => k.endsWith("Hex"));
  if (!hasAlign && !hasHex) {
    return changes;
  }

  const el = deps.pageRepository.getElementById(elementId);
  const stored = storedSchema.safeParse(
    el.success ? el.data?.value : undefined
  );

  // The alignment belongs to the parent Wrapper, not to the Menu — strip it
  // here and let menuAfterUpdate write it once the Menu update has landed.
  const result = Object.fromEntries(
    Object.entries(changes).filter(([key]) => !ALIGN_KEYS.includes(key))
  );

  return stored.success ? restoreColorOpacity(stored.data, result) : result;
};

/**
 * A Menu has no page-alignment prop; the alignment lives on its parent Wrapper,
 * per device like any other Wrapper value. Runs after the Menu update so a
 * rejected update leaves the Wrapper untouched.
 */
const menuAfterUpdate = (
  deps: HandlerDeps,
  elementId: string,
  parsed: Record<string, unknown>
): BrizyToolResult | undefined => {
  const alignment = Object.fromEntries(
    ALIGN_KEYS.filter((key) => parsed[key] !== undefined).map((key) => [
      key,
      parsed[key]
    ])
  );
  if (Object.keys(alignment).length === 0) {
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
    changes: alignment
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
  precondition: menuPrecondition,
  beforeUpdate: menuBeforeUpdate,
  afterUpdate: menuAfterUpdate
};
