import { setIn } from "timm";
import { z } from "zod";
import {
  validateFonts,
  withColorDefaults,
  withFontFamilyNormalize
} from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  fontFamilyPropertyDefinition,
  fontFamilySchema,
  fontFamilyTypeEnum,
  fontFamilyTypePropertyDefinition,
  fontStyleEnum,
  hexColor,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { log } from "visual/ai/utils/logger";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";

export const switcherPropsSchema = z.object({
  // content
  switcherStyle: z.enum(["style-1", "style-2"]).optional(),
  activeTab: z.number().min(0).optional(),
  spacing: z.number().min(0).max(100).optional(),
  navStyle1Width: z.number().min(0).max(1000).optional(),
  navStyle2Size: z.number().min(25).max(100).optional(),
  labelText1: z.string().optional(),
  labelText2: z.string().optional(),
  firstIconType: z.string().optional(),
  firstIconName: z.string().optional(),
  firstIconFilename: z.string().optional(),
  secondIconType: z.string().optional(),
  secondIconName: z.string().optional(),
  secondIconFilename: z.string().optional(),

  // typography
  typographyFontFamily: fontFamilySchema,
  typographyFontFamilyType: fontFamilyTypeEnum.optional(),
  typographyFontStyle: z.union([z.literal(""), fontStyleEnum]).optional(),
  typographyFontSize: z.number().min(8).max(200).optional(),
  typographyFontWeight: z.number().min(100).max(900).optional(),
  typographyLineHeight: z.number().min(0.5).max(5).optional(),
  typographyLetterSpacing: z.number().optional(),
  typographyBold: z.boolean().optional(),
  typographyItalic: z.boolean().optional(),
  typographyUnderline: z.boolean().optional(),
  typographyStrike: z.boolean().optional(),
  typographyUppercase: z.boolean().optional(),
  typographyLowercase: z.boolean().optional(),

  // icon style
  iconSize: z.enum(["small", "medium", "large", "custom"]).optional(),
  iconCustomSize: z.number().min(1).max(100).optional(),
  iconPosition: z.enum(["left", "right"]).optional(),
  iconSpacing: z.number().min(0).max(100).optional(),

  // text color
  colorPalette: colorPalette,
  colorHex: hexColor,
  colorOpacity: opacity,

  // active text color
  activeColorPalette: colorPalette,
  activeColorHex: hexColor,
  activeColorOpacity: opacity,

  // background color
  bgColorType: z.enum(["solid"]).optional(),
  bgColorPalette: colorPalette,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,

  // active background color
  activeBgColorPalette: colorPalette,
  activeBgColorHex: hexColor,
  activeBgColorOpacity: opacity,

  // border
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderWidth: z.number().min(0).optional(),
  borderRadius: z.number().min(0).optional(),
  borderColorPalette: colorPalette,
  borderColorHex: hexColor,
  borderColorOpacity: opacity,

  // box shadow
  boxShadow: z.enum(["none", "on"]).optional(),
  boxShadowColorHex: hexColor,
  boxShadowColorOpacity: opacity,
  boxShadowColorPalette: colorPalette,
  boxShadowBlur: z.number().min(0).optional(),
  boxShadowSpread: z.number().optional(),
  boxShadowVertical: z.number().optional(),
  boxShadowHorizontal: z.number().optional(),

  // padding
  paddingTop: z.number().min(0).optional(),
  paddingRight: z.number().min(0).optional(),
  paddingBottom: z.number().min(0).optional(),
  paddingLeft: z.number().min(0).optional()
});

export type SwitcherProps = z.infer<typeof switcherPropsSchema>;

type Props = Record<string, unknown>;

// custom typography (typographyFontSize, etc.) requires typographyFontStyle:"" to override preset
const CUSTOM_TYPOGRAPHY_KEYS = [
  "typographyFontSize",
  "typographyFontWeight",
  "typographyLineHeight",
  "typographyLetterSpacing"
];

const inferCustomFontStyle = <T extends Props>(props: T): T =>
  !("typographyFontStyle" in props) &&
  CUSTOM_TYPOGRAPHY_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, typographyFontStyle: "" }
    : props;

const withTypographyFontFamily = <T extends Props>(props: T): T =>
  withFontFamilyNormalize(props, "typography");

export const withSwitcherDefaults = pipe(
  withColorDefaults,
  withTypographyFontFamily,
  inferCustomFontStyle
);

/**
 * Sync labelText1/labelText2 to SwitcherTab items.
 *
 * The Switcher has two label systems:
 * - Style-1 (default): each SwitcherTab reads its own `labelText`
 * - Style-2: the parent Switcher reads `labelText1`/`labelText2`
 *
 * This function propagates parent-level labels into the items array
 * so both styles stay in sync via a single updateElement call.
 */
export function withSwitcherLabelSync(
  currentItems: unknown[] | undefined,
  changes: Record<string, unknown>
): Record<string, unknown> {
  const { labelText1, labelText2 } = changes as {
    labelText1?: string;
    labelText2?: string;
  };

  if (labelText1 === undefined && labelText2 === undefined) {
    return changes;
  }

  if (!Array.isArray(currentItems)) {
    return changes;
  }

  const items = currentItems.map((item: unknown, index: number): unknown => {
    const el = item as { value?: Record<string, unknown> };
    if (!el?.value) return item;

    if (index === 0 && labelText1 !== undefined) {
      return setIn(el, ["value", "labelText"], labelText1);
    }
    if (index === 1 && labelText2 !== undefined) {
      return setIn(el, ["value", "labelText"], labelText2);
    }
    return item;
  });

  return { ...changes, items };
}

const switcherPropertyDefinitions = {
  // content
  switcherStyle: {
    type: "string",
    enum: ["style-1", "style-2"],
    description:
      "Layout style: 'style-1' for horizontal tabs, 'style-2' for circle buttons"
  },
  activeTab: {
    type: "number",
    description: "Index of the initially active tab (0-indexed)",
    minimum: 0
  },
  spacing: {
    type: "number",
    description: "Spacing between elements in pixels (0-100)",
    minimum: 0,
    maximum: 100
  },
  navStyle1Width: {
    type: "number",
    description:
      "Tab width in pixels (0-1000, only used when switcherStyle='style-1')",
    minimum: 0,
    maximum: 1000
  },
  navStyle2Size: {
    type: "number",
    description:
      "Button size in pixels (25-100, only used when switcherStyle='style-2')",
    minimum: 25,
    maximum: 100
  },
  labelText1: {
    type: "string",
    description: "Label text for the first tab"
  },
  labelText2: {
    type: "string",
    description: "Label text for the second tab"
  },
  firstIconType: {
    type: "string",
    description: "Icon type for the first tab (e.g., 'fa' for Font Awesome)"
  },
  firstIconName: {
    type: "string",
    description: "Icon name for the first tab"
  },
  firstIconFilename: {
    type: "string",
    description: "Icon filename for the first tab (for uploaded icons)"
  },
  secondIconType: {
    type: "string",
    description: "Icon type for the second tab (e.g., 'fa' for Font Awesome)"
  },
  secondIconName: {
    type: "string",
    description: "Icon name for the second tab"
  },
  secondIconFilename: {
    type: "string",
    description: "Icon filename for the second tab (for uploaded icons)"
  },
  // Typography
  typographyFontFamily: fontFamilyPropertyDefinition,
  typographyFontFamilyType: fontFamilyTypePropertyDefinition,
  typographyFontStyle: {
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
      "Typography preset. When set, overrides fontSize/fontWeight/lineHeight/letterSpacing. Set to '' (empty) to use custom values. Auto-cleared when custom typography values are provided."
  },
  typographyFontSize: {
    type: "number",
    description:
      "Font size in pixels. Requires typographyFontStyle to be '' (auto-cleared if not set).",
    minimum: 8,
    maximum: 200
  },
  typographyFontWeight: {
    type: "number",
    description:
      "Font weight (100=thin, 400=normal, 700=bold, 900=black). Requires typographyFontStyle to be '' (auto-cleared if not set).",
    minimum: 100,
    maximum: 900
  },
  typographyLineHeight: {
    type: "number",
    description:
      "Line height multiplier (e.g., 1.5). Requires typographyFontStyle to be '' (auto-cleared if not set).",
    minimum: 0.5,
    maximum: 5
  },
  typographyLetterSpacing: {
    type: "number",
    description:
      "Letter spacing in pixels. Positive spreads, negative tightens. Requires typographyFontStyle to be '' (auto-cleared if not set)."
  },
  typographyBold: {
    type: "boolean",
    description: "Bold text"
  },
  typographyItalic: {
    type: "boolean",
    description: "Italic text"
  },
  typographyUnderline: {
    type: "boolean",
    description: "Underline text"
  },
  typographyStrike: {
    type: "boolean",
    description: "Strikethrough text"
  },
  typographyUppercase: {
    type: "boolean",
    description: "Transform text to uppercase"
  },
  typographyLowercase: {
    type: "boolean",
    description: "Transform text to lowercase"
  },
  // Icon style
  iconSize: {
    type: "string",
    enum: ["small", "medium", "large", "custom"],
    description:
      "Icon size preset. Set to 'custom' to use iconCustomSize value."
  },
  iconCustomSize: {
    type: "number",
    description: "Icon size in pixels (requires iconSize: 'custom')",
    minimum: 1,
    maximum: 100
  },
  iconPosition: {
    type: "string",
    enum: ["left", "right"],
    description: "Icon placement relative to tab label"
  },
  iconSpacing: {
    type: "number",
    description: "Gap between icon and label in pixels",
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
      "Tab text color hex (e.g., '#3c4b71'). Palette is auto-cleared when hex is provided."
  },
  colorOpacity: {
    type: "number",
    description: "Tab text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Active text color
  activeColorPalette: {
    type: "string",
    description:
      "Set to '' when using activeColorHex. For palette colors use 'color1'-'color8'."
  },
  activeColorHex: {
    type: "string",
    description:
      "Active tab text color hex (e.g., '#ffffff'). Palette is auto-cleared when hex is provided."
  },
  activeColorOpacity: {
    type: "number",
    description: "Active tab text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Background color
  bgColorType: {
    type: "string",
    enum: ["solid"],
    description: "Background type"
  },
  bgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  bgColorHex: {
    type: "string",
    description:
      "Tab background color hex (e.g., '#f7f7fb'). Palette is auto-cleared when hex is provided."
  },
  bgColorOpacity: {
    type: "number",
    description: "Tab background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Active background color
  activeBgColorPalette: {
    type: "string",
    description:
      "Set to '' when using activeBgColorHex. For palette colors use 'color1'-'color8'."
  },
  activeBgColorHex: {
    type: "string",
    description:
      "Active tab background color hex (e.g., '#617be5'). Palette is auto-cleared when hex is provided."
  },
  activeBgColorOpacity: {
    type: "number",
    description: "Active tab background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Border
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description: "Border line style"
  },
  borderWidth: {
    type: "number",
    description: "Border width in pixels",
    minimum: 0
  },
  borderRadius: {
    type: "number",
    description: "Border radius in pixels",
    minimum: 0
  },
  borderColorPalette: {
    type: "string",
    description:
      "Set to '' when using borderColorHex. For palette colors use 'color1'-'color8'."
  },
  borderColorHex: {
    type: "string",
    description:
      "Border color hex (e.g., '#e5e5e5'). Palette is auto-cleared when hex is provided."
  },
  borderColorOpacity: {
    type: "number",
    description: "Border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Box shadow
  boxShadow: {
    type: "string",
    enum: ["none", "on"],
    description:
      "Enable box shadow. MUST be 'on' for shadow properties to render. 'none' disables shadow."
  },
  boxShadowColorHex: {
    type: "string",
    description: "Shadow color hex. Palette is auto-cleared."
  },
  boxShadowColorOpacity: {
    type: "number",
    description: "Shadow color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  boxShadowBlur: {
    type: "number",
    description: "Shadow blur radius in pixels",
    minimum: 0
  },
  boxShadowSpread: {
    type: "number",
    description: "Shadow spread in pixels (negative for inset shrink)"
  },
  boxShadowVertical: {
    type: "number",
    description: "Shadow vertical offset in pixels (positive = down)"
  },
  boxShadowHorizontal: {
    type: "number",
    description: "Shadow horizontal offset in pixels (positive = right)"
  },
  // Padding
  paddingTop: {
    type: "number",
    description: "Top padding in pixels",
    minimum: 0
  },
  paddingRight: {
    type: "number",
    description: "Right padding in pixels",
    minimum: 0
  },
  paddingBottom: {
    type: "number",
    description: "Bottom padding in pixels",
    minimum: 0
  },
  paddingLeft: {
    type: "number",
    description: "Left padding in pixels",
    minimum: 0
  }
} as const;

export const addSwitcherDefinition: ToolDefinition = {
  name: "addSwitcher",
  strict: true,
  description:
    "Add a Switcher (content toggle) to an EXISTING Section. Displays tabbed content that users can switch between. For new sections use generateBlock.",
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
      },
      ...switcherPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateSwitcherDefinition: ToolDefinition = {
  name: "updateSwitcher",
  strict: true,
  description:
    "Update a Switcher element's properties. Use searchElements({type:'Switcher'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Switcher to update"
      },
      ...switcherPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addSwitcherConfig: AddToolConfig = {
  kind: "add",
  definition: addSwitcherDefinition,
  elementType: ElementTypes.Switcher,
  schema: switcherPropsSchema,
  defaults: withSwitcherDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addSwitcher input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const propsWithDefaults = withSwitcherDefaults(props);
    const parsed = switcherPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.Switcher,
      insertIndex: insertIndex as number | undefined,
      initialProperties: parsed.data
    });

    // Sync labelText1/labelText2 into SwitcherTab items after creation
    const { labelText1, labelText2 } = parsed.data;
    if (
      result.success &&
      result.data?.childElementId &&
      (labelText1 !== undefined || labelText2 !== undefined)
    ) {
      const elResult = deps.pageRepository.getElementById(
        result.data.childElementId
      );
      if (elResult.success && elResult.data) {
        const currentItems = elResult.data.value?.items as
          | unknown[]
          | undefined;
        const changes = withSwitcherLabelSync(currentItems, parsed.data);
        deps.pageRepository.updateElement({
          elementId: result.data.childElementId,
          elementType: ElementTypes.Switcher,
          changes
        });
      }
    }

    log.tools("addSwitcher output %o", result);
    return result;
  }
};

export const updateSwitcherConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateSwitcherDefinition,
  elementType: ElementTypes.Switcher,
  schema: switcherPropsSchema,
  defaults: withSwitcherDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateSwitcher input %o", args);
    const { elementId, ...props } = args;

    const propsWithDefaults = withSwitcherDefaults(props);
    const parsed = switcherPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    // Sync labelText1/labelText2 into SwitcherTab items
    const elResult = deps.pageRepository.getElementById(elementId as string);
    const currentItems = elResult.success
      ? (elResult.data?.value?.items as unknown[] | undefined)
      : undefined;
    const changes = withSwitcherLabelSync(currentItems, parsed.data);

    const result = deps.pageRepository.updateElement({
      elementId: elementId as string,
      elementType: ElementTypes.Switcher,
      changes
    });
    log.tools("updateSwitcher output %o", result);
    return result;
  }
};
