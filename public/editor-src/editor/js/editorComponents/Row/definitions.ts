import { z } from "zod";
import {
  inferBgColorType,
  withAnimatedGradientDefaults,
  withColorDefaults
} from "visual/ai/adapters/prop-defaults";
import {
  activeStopIndexSchema,
  bgColorTypeContainer,
  colorPalette,
  containerOverlayAndBorderPropertyDefinitions,
  gradientLinearDegree,
  gradientPointer,
  gradientRadialDegree,
  gradientSpeed,
  gradientStopsSchema,
  gradientType,
  hexColor,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";

export const withRowDefaults = pipe(
  withColorDefaults,
  inferBgColorType,
  withAnimatedGradientDefaults
);

export const rowPropsSchema = z.object({
  // style - background
  bgColorPalette: colorPalette,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorType: bgColorTypeContainer,
  // gradient
  gradientType: gradientType,
  gradientColorPalette: colorPalette,
  gradientColorHex: hexColor,
  gradientColorOpacity: opacity,
  gradientLinearDegree: gradientLinearDegree,
  gradientRadialDegree: gradientRadialDegree,
  gradientStartPointer: gradientPointer,
  gradientFinishPointer: gradientPointer,
  gradientSpeed: gradientSpeed,
  gradientStops: gradientStopsSchema,
  activeStopIndex: activeStopIndexSchema,
  // style - border
  borderColorPalette: colorPalette,
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderWidth: z.number().min(0).optional(),
  // hover - overlay
  hoverBgColorPalette: colorPalette,
  hoverBgColorHex: hexColor,
  hoverBgColorOpacity: opacity,
  hoverBgColorType: bgColorTypeContainer,
  hoverGradientType: gradientType,
  hoverGradientColorPalette: colorPalette,
  hoverGradientColorHex: hexColor,
  hoverGradientColorOpacity: opacity,
  hoverGradientLinearDegree: gradientLinearDegree,
  hoverGradientRadialDegree: gradientRadialDegree,
  hoverGradientStartPointer: gradientPointer,
  hoverGradientFinishPointer: gradientPointer,
  hoverGradientSpeed: gradientSpeed,
  hoverGradientStops: gradientStopsSchema,
  hoverActiveStopIndex: activeStopIndexSchema,
  // hover - border
  hoverBorderColorPalette: colorPalette,
  hoverBorderColorHex: hexColor,
  hoverBorderColorOpacity: opacity,
  hoverBorderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  hoverBorderWidth: z.number().min(0).optional(),
  // hover - box shadow
  hoverBoxShadow: z.enum(["none", "inset", "outset"]).optional(),
  hoverBoxShadowColorHex: hexColor,
  hoverBoxShadowColorOpacity: opacity,
  hoverBoxShadowColorPalette: colorPalette,
  hoverBoxShadowBlur: z.number().min(0).optional(),
  hoverBoxShadowSpread: z.number().optional(),
  hoverBoxShadowVertical: z.number().optional(),
  hoverBoxShadowHorizontal: z.number().optional()
});

export type RowProps = z.infer<typeof rowPropsSchema>;

const rowPropertyDefinitions = {
  bgColorPalette: {
    type: "string",
    description:
      "REQUIRED for custom background colors. Set to '' (empty string) when using bgColorHex."
  },
  bgColorHex: {
    type: "string",
    description:
      "Background color hex. MUST be paired with bgColorPalette: '' to work."
  },
  bgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  borderColorPalette: {
    type: "string",
    description:
      "REQUIRED for custom border colors. Set to '' (empty string) when using borderColorHex."
  },
  borderColorHex: {
    type: "string",
    description:
      "Border color hex. MUST be paired with borderColorPalette: '' to work."
  },
  borderColorOpacity: {
    type: "number",
    description: "Border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
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
  ...containerOverlayAndBorderPropertyDefinitions,
  // hover - box shadow
  hoverBoxShadow: {
    type: "string",
    enum: ["none", "inset", "outset"],
    description: "Box shadow type on hover. 'outset' = outer shadow, 'inset' = inner shadow, 'none' = disabled."
  },
  hoverBoxShadowColorHex: {
    type: "string",
    description: "Hover box shadow color hex. Palette is auto-cleared."
  },
  hoverBoxShadowColorOpacity: {
    type: "number",
    description: "Hover box shadow color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  hoverBoxShadowColorPalette: {
    type: "string",
    description: "Set to '' when using hoverBoxShadowColorHex. For palette colors use 'color1'-'color8'."
  },
  hoverBoxShadowBlur: {
    type: "number",
    description: "Hover box shadow blur radius in pixels",
    minimum: 0
  },
  hoverBoxShadowSpread: {
    type: "number",
    description: "Hover box shadow spread in pixels (positive = expand, negative = shrink)"
  },
  hoverBoxShadowVertical: {
    type: "number",
    description: "Hover box shadow vertical offset in pixels"
  },
  hoverBoxShadowHorizontal: {
    type: "number",
    description: "Hover box shadow horizontal offset in pixels"
  }
} as const;

export const addRowDefinition: ToolDefinition = {
  name: "addRow",
  strict: true,
  description:
    "Add a Row to an EXISTING Section for multi-column layout. Supports gradient, animated-gradient, hover background/border, and hover box shadow. Only needed for side-by-side content. For new sections use generateBlock.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description:
          "ID of the Section, SectionHeader, or SectionFooter container"
      },
      insertIndex: {
        type: "number",
        description: "Position in container (0-indexed). Omit to add at end.",
        minimum: 0
      },
      ...rowPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateRowDefinition: ToolDefinition = {
  name: "updateRow",
  strict: true,
  description:
    "Update a Row element's properties. Supports gradient, animated-gradient, hover background, hover border, and hover box shadow.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the row to update"
      },
      ...rowPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addRowConfig: AddToolConfig = {
  kind: "add",
  definition: addRowDefinition,
  elementType: ElementTypes.Row,
  schema: rowPropsSchema,
  defaults: withRowDefaults
};

export const updateRowConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateRowDefinition,
  elementType: ElementTypes.Row,
  schema: rowPropsSchema,
  defaults: withRowDefaults
};
