import { z } from "zod";
import {
  restoreColorOpacity,
  withColorDefaults
} from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  fontStyleEnum,
  hexColor,
  onOff,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type {
  AddNoPropsToolConfig,
  HandlerDeps,
  UpdateToolConfig
} from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import { MMenuAnimationTypes } from "./types";

export const addMenuDefinition: ToolDefinition = {
  name: "addMenu",
  strict: true,
  description:
    "Add a navigation Menu (nav bar) into an existing Section, header, or Column. ALWAYS call getAvailableMenus FIRST and branch on its count: 0 menus → do NOT add (a Menu without a CMS menu renders empty — ONLY in this zero-menus case build navigation from Text/Button links instead and tell the user to create a menu in the CMS); exactly 1 → add, then use its id; 2+ → ask the user which menu to use (name them) before adding. Never invent a menu id. After adding, call updateMenu with elementId set to the `childElementId` from this tool's response and menuSelected set to the chosen id.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description: "ID of the Section or Column container"
      },
      insertIndex: {
        type: "number",
        description: "Position in container (0-indexed). Omit to add at end.",
        minimum: 0
      }
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const addMenuConfig: AddNoPropsToolConfig = {
  kind: "addNoProps",
  definition: addMenuDefinition,
  elementType: ElementTypes.Menu
};

// ===========================================
// updateMenu — menu-level styling & layout only.
// Does NOT switch the CMS menu (menuSelected) or edit menu items.
// ===========================================

const alignEnum = z.enum(["left", "center", "right"]);
const menuAnimationValues = Object.values(MMenuAnimationTypes);

export const menuPropsSchema = z.object({
  // Content — which CMS menu to render (foreign key into config.menuData)
  menuSelected: z.string().optional(),

  // Layout / behavior
  verticalMode: z.enum(["horizontal", "vertical"]).optional(),
  mMenu: onOff.optional(),
  tabletMMenu: onOff.optional(),
  mobileMMenu: onOff.optional(),
  mMenuPosition: z.enum(["left", "right", "top", "bottom"]).optional(),
  mMenuAnimation: z.nativeEnum(MMenuAnimationTypes).optional(),
  mMenuSize: z.number().min(0).max(100).optional(),
  mMenuItemHorizontalAlign: alignEnum.optional(),
  // Page alignment of the whole menu / hamburger icon. Routed to the parent
  // Wrapper by beforeUpdate — the Menu element itself has no page-align prop.
  horizontalAlign: alignEnum.optional(),
  iconPosition: z.enum(["left", "right"]).optional(),

  // Spacing / size
  menuSize: z.number().min(10).max(100).optional(),
  itemPadding: z.number().min(0).max(100).optional(),
  iconSpacing: z.number().min(0).max(100).optional(),
  iconSize: z.number().min(0).max(100).optional(),

  // Text color
  colorPalette: colorPalette,
  colorHex: hexColor,
  colorOpacity: opacity,
  hoverColorPalette: colorPalette,
  hoverColorHex: hexColor,
  hoverColorOpacity: opacity,

  // Menu background color
  menuBgColorPalette: colorPalette,
  menuBgColorHex: hexColor,
  menuBgColorOpacity: opacity,
  hoverMenuBgColorPalette: colorPalette,
  hoverMenuBgColorHex: hexColor,
  hoverMenuBgColorOpacity: opacity,

  // Menu border
  menuBorderColorPalette: colorPalette,
  menuBorderColorHex: hexColor,
  menuBorderColorOpacity: opacity,
  menuBorderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  menuBorderWidth: z.number().min(0).max(50).optional(),

  // Typography (numeric only — fontFamily omitted, needs font validation).
  // fontStyle must be "" for custom values to override the global preset.
  fontStyle: z.union([z.literal(""), fontStyleEnum]).optional(),
  fontSize: z.number().min(1).max(200).optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  letterSpacing: z.number().optional(),
  lineHeight: z.number().min(0.5).max(5).optional(),

  // Accessibility
  accessibleMenu: z.boolean().optional(),
  ariaLabelHamburger: z.string().optional()
});

export type MenuProps = z.infer<typeof menuPropsSchema>;

// Custom typography (fontSize, fontWeight, etc.) only renders when fontStyle is
// "" — otherwise the global preset (default "button") wins. Auto-clear it.
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

export const withMenuDefaults = pipe(withColorDefaults, inferCustomFontStyle);

const menuPropertyDefinitions = {
  // Content
  menuSelected: {
    type: "string",
    description:
      "ID of the CMS menu to render. Use an exact `id` from getAvailableMenus — never invent one (an invalid id renders an empty menu)."
  },

  // Layout / behavior
  verticalMode: {
    type: "string",
    enum: ["horizontal", "vertical"],
    description: "Menu orientation on desktop."
  },
  mMenu: {
    type: "string",
    enum: ["on", "off"],
    description:
      "Hamburger (off-canvas drawer) mode on desktop. 'on' = collapse into a hamburger."
  },
  tabletMMenu: {
    type: "string",
    enum: ["on", "off"],
    description: "Hamburger mode on tablet (default 'on')."
  },
  mobileMMenu: {
    type: "string",
    enum: ["on", "off"],
    description: "Hamburger mode on mobile (default 'on')."
  },
  mMenuPosition: {
    type: "string",
    enum: ["left", "right", "top", "bottom"],
    description: "Side the hamburger drawer slides in from."
  },
  mMenuAnimation: {
    type: "string",
    enum: menuAnimationValues,
    description: "Hamburger icon animation."
  },
  mMenuSize: {
    type: "number",
    description: "Hamburger icon size in pixels.",
    minimum: 0,
    maximum: 100
  },
  mMenuItemHorizontalAlign: {
    type: "string",
    enum: ["left", "center", "right"],
    description:
      "Alignment of links INSIDE the opened hamburger/off-canvas drawer ONLY. Does NOT move the menu or the hamburger icon on the page — for that use horizontalAlign."
  },
  horizontalAlign: {
    type: "string",
    enum: ["left", "center", "right"],
    description:
      "Align the whole menu (or the hamburger icon) horizontally on the page. This is what you want for requests like 'align the menu left/right'. Applies to both a normal menu and the collapsed hamburger icon."
  },
  iconPosition: {
    type: "string",
    enum: ["left", "right"],
    description: "Position of item icons relative to the label."
  },

  // Spacing / size
  menuSize: {
    type: "number",
    description:
      "Menu width as a percentage (10-100). Applies when verticalMode is 'vertical'; a horizontal menu sizes to its content and ignores this.",
    minimum: 10,
    maximum: 100
  },
  itemPadding: {
    type: "number",
    description: "Spacing between menu items in pixels.",
    minimum: 0,
    maximum: 100
  },
  iconSpacing: {
    type: "number",
    description: "Gap between an item's icon and its label in pixels.",
    minimum: 0,
    maximum: 100
  },
  iconSize: {
    type: "number",
    description: "Item icon size in pixels.",
    minimum: 0,
    maximum: 100
  },

  // Text color
  colorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using colorHex. For palette colors use 'color1'-'color8'."
  },
  colorHex: {
    type: "string",
    description:
      "Menu item text color hex (e.g. '#222222'). Palette is auto-cleared when hex is provided."
  },
  colorOpacity: {
    type: "number",
    description: "Text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  hoverColorPalette: {
    type: "string",
    description:
      "Set to '' when using hoverColorHex. Otherwise 'color1'-'color8'."
  },
  hoverColorHex: {
    type: "string",
    description: "Item text color on hover (hex). Palette is auto-cleared."
  },
  hoverColorOpacity: {
    type: "number",
    description: "Hover text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // Menu background color
  menuBgColorPalette: {
    type: "string",
    description:
      "Set to '' when using menuBgColorHex. Otherwise 'color1'-'color8'."
  },
  menuBgColorHex: {
    type: "string",
    description: "Menu item background color hex. Palette is auto-cleared."
  },
  menuBgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  hoverMenuBgColorPalette: {
    type: "string",
    description:
      "Set to '' when using hoverMenuBgColorHex. Otherwise 'color1'-'color8'."
  },
  hoverMenuBgColorHex: {
    type: "string",
    description:
      "Item background color on hover (hex). Palette is auto-cleared."
  },
  hoverMenuBgColorOpacity: {
    type: "number",
    description: "Hover background opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // Menu border
  menuBorderColorPalette: {
    type: "string",
    description:
      "Set to '' when using menuBorderColorHex. Otherwise 'color1'-'color8'."
  },
  menuBorderColorHex: {
    type: "string",
    description: "Item border color hex. Palette is auto-cleared."
  },
  menuBorderColorOpacity: {
    type: "number",
    description: "Border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  menuBorderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description: "Item border line style."
  },
  menuBorderWidth: {
    type: "number",
    description: "Item border width in pixels.",
    minimum: 0,
    maximum: 50
  },

  // Typography
  fontStyle: {
    type: "string",
    enum: [
      "",
      "paragraph",
      "subtitle",
      "abovetitle",
      "heading1",
      "heading2",
      "heading3",
      "heading4",
      "heading5",
      "heading6",
      "button"
    ],
    description:
      "Global font-style preset. Optional — to use a custom fontSize/fontWeight/lineHeight/letterSpacing, send those directly; it is cleared automatically so they apply."
  },
  fontSize: {
    type: "number",
    description:
      "Item font size in pixels.",
    minimum: 1,
    maximum: 200
  },
  fontWeight: {
    type: "number",
    description:
      "Item font weight (100=thin, 400=normal, 700=bold, 900=black).",
    minimum: 100,
    maximum: 900
  },
  letterSpacing: {
    type: "number",
    description:
      "Item letter spacing in pixels (positive spreads, negative tightens)."
  },
  lineHeight: {
    type: "number",
    description:
      "Item line height (unitless multiplier, e.g. 1.5).",
    minimum: 0.5,
    maximum: 5
  },

  // Accessibility
  accessibleMenu: {
    type: "boolean",
    description: "Enable accessible (keyboard/ARIA) menu behavior."
  },
  ariaLabelHamburger: {
    type: "string",
    description: "ARIA label for the hamburger toggle button."
  }
} as const;

export const updateMenuDefinition: ToolDefinition = {
  name: "updateMenu",
  strict: true,
  description:
    "Update a Menu element: which CMS menu is shown (menuSelected), colors, spacing, typography, hamburger/mobile behavior, orientation, and page alignment (horizontalAlign). Send ONLY the properties the user asked to change — never fill in others. Find the menu's ID via searchElements({type:'Menu'}), or use the `childElementId` returned by addMenu. To change menuSelected you MUST first call getAvailableMenus and use an exact id. NOTE: this does NOT edit individual menu items (links) — those come from the CMS. To align/position the whole menu or hamburger icon on the page, set horizontalAlign here (it is applied to the parent Wrapper for you).",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Menu to update"
      },
      ...menuPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

/**
 * Menu pre-update hook. Reads the element's stored value once, then:
 *
 * 1. Routes `horizontalAlign` to the parent Wrapper — the Menu has no page-align
 *    prop of its own (alignment lives on the Wrapper addMenu creates). Agents
 *    reliably reach for updateMenu when asked to "align the menu", so we handle
 *    it here instead of forcing a cross-tool updateWrapper hop.
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
    el.success && el.data ? (el.data.value as Record<string, unknown>) : undefined;

  let result = changes;

  if (hasAlign) {
    const { horizontalAlign, ...menuChanges } = result;
    if (el.success && el.data?.parentId && el.data.parentType) {
      deps.pageRepository.updateElement({
        elementId: el.data.parentId,
        elementType: el.data.parentType,
        changes: { horizontalAlign }
      });
    }
    // ponytail: if no parent is found (menu not wrapped — shouldn't happen),
    // the align is silently dropped; add an error return if it ever appears.
    result = menuChanges;
  }

  if (stored) {
    result = restoreColorOpacity(stored, result);
  }

  return result;
};

export const updateMenuConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateMenuDefinition,
  elementType: ElementTypes.Menu,
  schema: menuPropsSchema,
  defaults: withMenuDefaults,
  beforeUpdate: menuBeforeUpdate
};
