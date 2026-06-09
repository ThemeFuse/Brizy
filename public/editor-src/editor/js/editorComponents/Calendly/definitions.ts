import { z } from "zod";
import { withColorDefaults } from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  hexColor,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const calendlyPropsSchema = z.object({
  // content
  link: z.string().optional(),

  // sizing
  width: z.number().min(1).optional(),
  widthSuffix: z.enum(["%", "px"]).optional(),
  height: z.number().min(150).max(1000).optional(),

  // background color
  bgColorType: z.enum(["solid", "gradient"]).optional(),
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorPalette: colorPalette,

  // gradient
  gradientColorHex: hexColor,
  gradientColorOpacity: opacity,
  gradientColorPalette: colorPalette,
  gradientType: z.enum(["linear", "radial"]).optional(),
  gradientStartPointer: z.number().min(0).max(100).optional(),
  gradientFinishPointer: z.number().min(0).max(100).optional(),
  gradientLinearDegree: z.number().min(0).max(360).optional(),
  gradientRadialDegree: z.number().min(0).max(360).optional(),

  // border
  borderStyle: z
    .enum(["solid", "dashed", "dotted", "double", "none"])
    .optional(),
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette,
  borderWidth: z.number().min(0).optional(),

  // box shadow
  boxShadow: z.enum(["", "on"]).optional(),
  boxShadowColorHex: hexColor,
  boxShadowColorOpacity: opacity,
  boxShadowColorPalette: colorPalette,
  boxShadowBlur: z.number().min(0).optional(),
  boxShadowSpread: z.number().optional(),
  boxShadowVertical: z.number().optional(),
  boxShadowHorizontal: z.number().optional(),

  // padding
  calendlyPaddingType: z.enum(["grouped", "ungrouped"]).optional(),
  calendlyPadding: z.number().min(0).optional(),
  calendlyPaddingTop: z.number().min(0).optional(),
  calendlyPaddingRight: z.number().min(0).optional(),
  calendlyPaddingBottom: z.number().min(0).optional(),
  calendlyPaddingLeft: z.number().min(0).optional(),

  // hover
  hoverTransition: z.number().min(0).max(99).optional()
});

export type CalendlyProps = z.infer<typeof calendlyPropsSchema>;

type Props = Record<string, unknown>;

export function withCalendlyDefaults<T extends Props>(props: T): T {
  let result = withColorDefaults(props);

  // Auto-enable boxShadow when shadow props are provided
  if (
    !("boxShadow" in result) &&
    (("boxShadowBlur" in result && result.boxShadowBlur !== undefined) ||
      ("boxShadowSpread" in result && result.boxShadowSpread !== undefined) ||
      ("boxShadowVertical" in result &&
        result.boxShadowVertical !== undefined) ||
      ("boxShadowHorizontal" in result &&
        result.boxShadowHorizontal !== undefined))
  ) {
    result = { ...result, boxShadow: "on" };
  }

  // Auto-set bgColorType to gradient when gradient props are provided
  if (
    !("bgColorType" in result) &&
    (("gradientColorHex" in result && result.gradientColorHex !== undefined) ||
      ("gradientType" in result && result.gradientType !== undefined))
  ) {
    result = { ...result, bgColorType: "gradient" };
  }

  return result;
}

const calendlyPropertyDefinitions = {
  // content
  link: {
    type: "string",
    description:
      "Calendly scheduling URL (e.g., 'https://calendly.com/user/event')"
  },

  // sizing
  width: {
    type: "number",
    description:
      "Width value (use with widthSuffix). Max 1000 for px, 100 for %.",
    minimum: 1
  },
  widthSuffix: {
    type: "string",
    enum: ["%", "px"],
    description: "Width unit: '%' (default) or 'px'"
  },
  height: {
    type: "number",
    description: "Height in pixels (150-1000, default 500)",
    minimum: 150,
    maximum: 1000
  },

  // background color
  bgColorType: {
    type: "string",
    enum: ["solid", "gradient"],
    description:
      "Background type: 'solid' for single color, 'gradient' for gradient. Auto-set to 'gradient' when gradient props are provided."
  },
  bgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  bgColorHex: {
    type: "string",
    description:
      "Background color hex (e.g., '#FF0000'). Palette is auto-cleared when hex is provided."
  },
  bgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // gradient
  gradientColorPalette: {
    type: "string",
    description:
      "Set to '' when using gradientColorHex. For palette colors use 'color1'-'color8'."
  },
  gradientColorHex: {
    type: "string",
    description:
      "Gradient end color hex. Palette is auto-cleared when hex is provided."
  },
  gradientColorOpacity: {
    type: "number",
    description: "Gradient end color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  gradientType: {
    type: "string",
    enum: ["linear", "radial"],
    description: "Gradient type: 'linear' or 'radial'"
  },
  gradientStartPointer: {
    type: "number",
    description: "Gradient start position (0-100)",
    minimum: 0,
    maximum: 100
  },
  gradientFinishPointer: {
    type: "number",
    description: "Gradient end position (0-100)",
    minimum: 0,
    maximum: 100
  },
  gradientLinearDegree: {
    type: "number",
    description: "Linear gradient angle in degrees (0-360)",
    minimum: 0,
    maximum: 360
  },
  gradientRadialDegree: {
    type: "number",
    description: "Radial gradient angle in degrees (0-360)",
    minimum: 0,
    maximum: 360
  },

  // border
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "double", "none"],
    description: "Border line style"
  },
  borderColorPalette: {
    type: "string",
    description:
      "Set to '' when using borderColorHex. For palette colors use 'color1'-'color8'."
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
  borderWidth: {
    type: "number",
    description: "Border width in pixels",
    minimum: 0
  },

  // box shadow
  boxShadow: {
    type: "string",
    enum: ["", "on"],
    description:
      "Enable box shadow. MUST be 'on' for shadow properties to render. '' disables shadow. Auto-enabled when shadow values are provided."
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
    description: "Shadow spread in pixels"
  },
  boxShadowVertical: {
    type: "number",
    description: "Shadow vertical offset in pixels (positive = down)"
  },
  boxShadowHorizontal: {
    type: "number",
    description: "Shadow horizontal offset in pixels (positive = right)"
  },

  // padding
  calendlyPaddingType: {
    type: "string",
    enum: ["grouped", "ungrouped"],
    description:
      "Padding mode: 'grouped' for uniform padding, 'ungrouped' for individual sides"
  },
  calendlyPadding: {
    type: "number",
    description:
      "Uniform padding in pixels (requires calendlyPaddingType: 'grouped')",
    minimum: 0
  },
  calendlyPaddingTop: {
    type: "number",
    description:
      "Top padding in pixels (requires calendlyPaddingType: 'ungrouped')",
    minimum: 0
  },
  calendlyPaddingRight: {
    type: "number",
    description:
      "Right padding in pixels (requires calendlyPaddingType: 'ungrouped')",
    minimum: 0
  },
  calendlyPaddingBottom: {
    type: "number",
    description:
      "Bottom padding in pixels (requires calendlyPaddingType: 'ungrouped')",
    minimum: 0
  },
  calendlyPaddingLeft: {
    type: "number",
    description:
      "Left padding in pixels (requires calendlyPaddingType: 'ungrouped')",
    minimum: 0
  },

  // hover
  hoverTransition: {
    type: "number",
    description: "Hover transition duration in tenths of a second (0-99)",
    minimum: 0,
    maximum: 99
  }
} as const;

export const addCalendlyDefinition: ToolDefinition = {
  name: "addCalendly",
  strict: true,
  description:
    "Add a Calendly scheduling widget to an EXISTING Section. Embeds an inline Calendly booking form. For new sections use generateBlock.",
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
      ...calendlyPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateCalendlyDefinition: ToolDefinition = {
  name: "updateCalendly",
  strict: true,
  description:
    "Update a Calendly widget's properties. Use searchElements({type:'Calendly'}) to find Calendly IDs first.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Calendly element to update"
      },
      ...calendlyPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addCalendlyConfig: AddToolConfig = {
  kind: "add",
  definition: addCalendlyDefinition,
  elementType: ElementTypes.Calendly,
  schema: calendlyPropsSchema,
  defaults: withCalendlyDefaults
};

export const updateCalendlyConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateCalendlyDefinition,
  elementType: ElementTypes.Calendly,
  schema: calendlyPropsSchema,
  defaults: withCalendlyDefaults
};
