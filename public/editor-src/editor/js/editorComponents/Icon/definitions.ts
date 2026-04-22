import { z } from "zod";
import { withColorDefaults } from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  hexColor,
  linkTypes,
  onOff,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";

const iconTypes = z.enum(["outline", "glyph", "fa"]);

export const iconPropsSchema = z.object({
  // content
  name: z.string().optional(),
  type: iconTypes.optional(),

  // sizing
  size: z.enum(["small", "medium", "large", "custom"]).optional(),
  customSize: z.number().min(14).max(180).optional(),
  fillType: z.enum(["filled", "outline", "default"]).optional(),
  padding: z.number().min(0).max(180).optional(),

  // icon color
  colorPalette: colorPalette,
  colorHex: hexColor,
  colorOpacity: opacity,

  // hover icon color
  hoverColorPalette: colorPalette,
  hoverColorHex: hexColor,
  hoverColorOpacity: opacity,

  // background color
  bgColorType: z.enum(["solid", "gradient"]).optional(),
  bgColorPalette: colorPalette,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,

  // hover background color
  hoverBgColorPalette: colorPalette,
  hoverBgColorHex: hexColor,
  hoverBgColorOpacity: opacity,

  // gradient
  gradientType: z.enum(["linear", "radial"]).optional(),
  gradientColorHex: hexColor,
  gradientColorOpacity: opacity,
  gradientColorPalette: colorPalette,
  gradientLinearDegree: z.number().min(0).max(360).optional(),
  gradientStartPointer: z.number().min(0).max(100).optional(),
  gradientFinishPointer: z.number().min(0).max(100).optional(),

  // border
  borderStyle: z.enum(["solid", "dashed", "dotted", "double"]).optional(),
  borderWidth: z.number().min(0).max(50).optional(),
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette,
  borderRadiusType: z.enum(["square", "rounded", "custom"]).optional(),
  borderRadius: z.number().min(0).max(500).optional(),

  // box shadow
  boxShadow: z.enum(["on", "none"]).optional(),
  boxShadowColorHex: hexColor,
  boxShadowColorOpacity: opacity,
  boxShadowColorPalette: colorPalette,
  boxShadowBlur: z.number().min(0).optional(),
  boxShadowSpread: z.number().optional(),
  boxShadowVertical: z.number().optional(),
  boxShadowHorizontal: z.number().optional(),

  // link
  linkType: linkTypes.optional(),
  linkExternal: z.string().optional(),
  linkExternalBlank: onOff.optional(),
  linkExternalRel: onOff.optional(),

  // hover
  hoverTransition: z.number().min(0).max(99).optional()
});

export type IconProps = z.infer<typeof iconPropsSchema>;

type Props = Record<string, unknown>;

// borderRadius requires borderRadiusType:"custom" to render
const inferBorderRadiusType = <T extends Props>(props: T): T =>
  "borderRadius" in props &&
  props.borderRadius !== undefined &&
  !("borderRadiusType" in props)
    ? { ...props, borderRadiusType: "custom" }
    : props;

// boxShadow properties require boxShadow:"on" to render
const BOX_SHADOW_KEYS = [
  "boxShadowColorHex",
  "boxShadowColorOpacity",
  "boxShadowBlur",
  "boxShadowSpread",
  "boxShadowVertical",
  "boxShadowHorizontal"
];

const inferBoxShadowOn = <T extends Props>(props: T): T =>
  !("boxShadow" in props) &&
  BOX_SHADOW_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, boxShadow: "on" }
    : props;

// borderWidth requires borderStyle to be set
const inferBorderStyle = <T extends Props>(props: T): T =>
  "borderWidth" in props &&
  props.borderWidth !== undefined &&
  !("borderStyle" in props)
    ? { ...props, borderStyle: "solid" }
    : props;

// customSize requires size:"custom" to take effect
const inferCustomSize = <T extends Props>(props: T): T =>
  "customSize" in props && props.customSize !== undefined && !("size" in props)
    ? { ...props, size: "custom" }
    : props;

export const withIconDefaults = pipe(
  withColorDefaults,
  inferBorderRadiusType,
  inferBoxShadowOn,
  inferBorderStyle,
  inferCustomSize
);

// Shared icon property definitions for tool parameters
const iconPropertyDefinitions = {
  // Content
  name: {
    type: "string",
    description:
      "EXACT icon name from getAvailableIcons. You MUST copy the name exactly as returned — do NOT modify, shorten, or rephrase it. Example: if getAvailableIcons returns 'favourite-31', use 'favourite-31' exactly."
  },
  type: {
    type: "string",
    enum: ["outline", "glyph", "fa"],
    description:
      "EXACT icon type from getAvailableIcons. Must match the type returned for the chosen icon — do NOT change it."
  },

  // Sizing
  size: {
    type: "string",
    enum: ["small", "medium", "large", "custom"],
    description:
      "Size preset. Set to 'custom' to use customSize value. Auto-set when customSize provided."
  },
  customSize: {
    type: "number",
    description:
      "Icon size in pixels. Requires size: 'custom' (auto-set when customSize provided).",
    minimum: 14,
    maximum: 180
  },
  fillType: {
    type: "string",
    enum: ["filled", "outline", "default"],
    description:
      "Background fill style. 'filled' = solid background, 'outline' = border only, 'default' = no background."
  },
  padding: {
    type: "number",
    description:
      "Padding around icon in pixels (requires fillType: 'filled' or 'outline')",
    minimum: 0,
    maximum: 180
  },

  // Icon color
  colorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using colorHex. For palette colors use 'color1'-'color8'."
  },
  colorHex: {
    type: "string",
    description:
      "Icon color hex (e.g., '#FF6600'). Palette is auto-cleared when hex is provided."
  },
  colorOpacity: {
    type: "number",
    description: "Icon color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // Hover icon color
  hoverColorHex: {
    type: "string",
    description: "Icon color on hover (hex). Palette is auto-cleared."
  },
  hoverColorOpacity: {
    type: "number",
    description: "Icon hover color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // Background color
  bgColorType: {
    type: "string",
    enum: ["solid", "gradient"],
    description:
      "Background type. Set to 'gradient' for gradient properties to render. Requires fillType: 'filled'."
  },
  bgColorPalette: {
    type: "string",
    description:
      "Set to '' when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  bgColorHex: {
    type: "string",
    description:
      "Background color hex. Palette is auto-cleared when hex is provided. Requires fillType: 'filled'."
  },
  bgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // Hover background color
  hoverBgColorHex: {
    type: "string",
    description:
      "Background color on hover (hex). Palette is auto-cleared. Requires fillType: 'filled'."
  },
  hoverBgColorOpacity: {
    type: "number",
    description: "Hover background opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // Gradient
  gradientType: {
    type: "string",
    enum: ["linear", "radial"],
    description:
      "Gradient direction type (requires bgColorType: 'gradient' and fillType: 'filled')"
  },
  gradientColorHex: {
    type: "string",
    description:
      "Gradient end color hex (start color is bgColorHex). Palette is auto-cleared."
  },
  gradientColorOpacity: {
    type: "number",
    description: "Gradient end color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  gradientLinearDegree: {
    type: "number",
    description: "Linear gradient angle in degrees (0=up, 90=right, 180=down)",
    minimum: 0,
    maximum: 360
  },
  gradientStartPointer: {
    type: "number",
    description: "Gradient start position as percentage (0-100)",
    minimum: 0,
    maximum: 100
  },
  gradientFinishPointer: {
    type: "number",
    description: "Gradient end position as percentage (0-100)",
    minimum: 0,
    maximum: 100
  },

  // Border
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "double"],
    description:
      "Border line style. Auto-set to 'solid' when borderWidth is provided. Requires fillType: 'outline' or 'filled'."
  },
  borderWidth: {
    type: "number",
    description: "Border width in pixels",
    minimum: 0,
    maximum: 50
  },
  borderColorHex: {
    type: "string",
    description:
      "Border color hex. Palette is auto-cleared when hex is provided."
  },
  borderColorOpacity: {
    type: "number",
    description: "Border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  borderColorPalette: {
    type: "string",
    description:
      "Set to '' when using borderColorHex. For palette colors use 'color1'-'color8'."
  },
  borderRadiusType: {
    type: "string",
    enum: ["square", "rounded", "custom"],
    description:
      "Corner style. 'square' = no rounding, 'rounded' = fully rounded, 'custom' = use borderRadius value."
  },
  borderRadius: {
    type: "number",
    description:
      "Border radius in pixels. Auto-sets borderRadiusType to 'custom' if not specified.",
    minimum: 0,
    maximum: 500
  },

  // Box shadow
  boxShadow: {
    type: "string",
    enum: ["on", "none"],
    description:
      "Enable box shadow. MUST be 'on' for shadow properties to render. Auto-set when shadow properties provided."
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

  // Link
  linkType: {
    type: "string",
    enum: ["external"],
    description: "Type of link behavior"
  },
  linkExternal: {
    type: "string",
    description: "URL for external links (e.g., 'https://example.com')"
  },
  linkExternalBlank: {
    type: "string",
    enum: ["on", "off"],
    description: "Open link in new tab ('on') or same tab ('off')"
  },
  linkExternalRel: {
    type: "string",
    enum: ["on", "off"],
    description: "Add nofollow rel attribute to link"
  },

  // Hover
  hoverTransition: {
    type: "number",
    description: "Hover transition duration in tenths of a second (0-99)",
    minimum: 0,
    maximum: 99
  }
} as const;

export const addIconDefinition: ToolDefinition = {
  name: "addIcon",
  strict: true,
  description:
    "Add an Icon to an EXISTING Section. IMPORTANT: You MUST first call getAvailableIcons to get valid icon names, then use an exact 'name' value from the results. Do NOT guess or invent icon names. For new sections use generateBlock.",
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
      ...iconPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateIconDefinition: ToolDefinition = {
  name: "updateIcon",
  strict: true,
  description:
    "Update an Icon element. Use searchElements({type:'Icon'}) to find icon IDs. IMPORTANT: To change the icon, you MUST first call getAvailableIcons to get valid icon names, then use an exact 'name' value from the results. Do NOT guess or invent icon names.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the icon to update"
      },
      ...iconPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addIconConfig: AddToolConfig = {
  kind: "add",
  definition: addIconDefinition,
  elementType: ElementTypes.Icon,
  schema: iconPropsSchema,
  defaults: withIconDefaults
};

export const updateIconConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateIconDefinition,
  elementType: ElementTypes.Icon,
  schema: iconPropsSchema,
  defaults: withIconDefaults
};
