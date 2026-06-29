import { z } from "zod";
import {
  inferBgColorType,
  withAnimatedGradientDefaults,
  withColorDefaults
} from "visual/ai/adapters/prop-defaults";
import {
  activeStopIndexSchema,
  bgColorTypeContainer,
  borderPropertyDefinitions,
  borderSchemaFields,
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
import type { UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";

export const withSectionFooterDefaults = pipe(
  withColorDefaults,
  inferBgColorType,
  withAnimatedGradientDefaults
);

export const sectionPropsSchema = z.object({
  // style - background
  bgColorPalette: colorPalette,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorType: bgColorTypeContainer,
  bgImageSrc: z.string().optional(),
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
  ...borderSchemaFields,
  // style - padding
  paddingTop: z.number().min(0).optional(),
  paddingBottom: z.number().min(0).optional()
});

export type SectionProps = z.infer<typeof sectionPropsSchema>;

const sectionFooterPropertyDefinitions = {
  bgColorHex: {
    type: "string",
    description: "Background color in hex. Palette is auto-cleared."
  },
  bgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  bgColorPalette: {
    type: "string",
    description:
      "Set to '' when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  bgImageSrc: {
    type: "string",
    description: "Background image URL"
  },
  paddingTop: {
    type: "number",
    description: "Top padding in pixels",
    minimum: 0
  },
  paddingBottom: {
    type: "number",
    description: "Bottom padding in pixels",
    minimum: 0
  },
  ...borderPropertyDefinitions,
  ...containerOverlayAndBorderPropertyDefinitions
} as const;

export const updateSectionFooterDefinition: ToolDefinition = {
  name: "updateSectionFooter",
  strict: true,
  description:
    "Update a SectionFooter block's properties (background, border, gradient, animated gradient, hover, padding). Supports solid, gradient, and animated-gradient backgrounds as well as hover overlay and hover border. Use this for footer sections.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the SectionFooter to update"
      },
      ...sectionFooterPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const updateSectionFooterConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateSectionFooterDefinition,
  elementType: ElementTypes.SectionFooter,
  schema: sectionPropsSchema,
  defaults: withSectionFooterDefaults,
  validateType: {
    expectedType: ElementTypes.SectionFooter,
    errorMessage:
      "updateSectionFooter can only be used on SectionFooter elements, not ${type}. Use updateSectionItem for regular Section blocks."
  }
};
