import { z } from "zod";
import {
  inferBgColorType,
  inferBorderRadiusType,
  inferPaddingType,
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

export const withSectionItemDefaults = pipe(
  withColorDefaults,
  inferBgColorType,
  withAnimatedGradientDefaults,
  inferPaddingType,
  inferBorderRadiusType
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
  paddingType: z.enum(["grouped", "ungrouped"]).optional(),
  paddingTop: z.number().min(0).optional(),
  paddingRight: z.number().min(0).optional(),
  paddingBottom: z.number().min(0).optional(),
  paddingLeft: z.number().min(0).optional(),
  // style - border radius
  borderRadiusType: z.enum(["grouped", "ungrouped"]).optional(),
  borderRadius: z.number().min(0).optional(),
  borderTopLeftRadius: z.number().min(0).optional(),
  borderTopRightRadius: z.number().min(0).optional(),
  borderBottomRightRadius: z.number().min(0).optional(),
  borderBottomLeftRadius: z.number().min(0).optional()
});

export type SectionProps = z.infer<typeof sectionPropsSchema>;

const sectionItemPropertyDefinitions = {
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
  ...borderPropertyDefinitions,
  paddingType: {
    type: "string",
    enum: ["grouped", "ungrouped"],
    description:
      "'grouped' = all sides equal (use paddingTop), 'ungrouped' = sides set individually. Auto-inferred when padding sides are provided."
  },
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
  ...containerOverlayAndBorderPropertyDefinitions,
  paddingLeft: {
    type: "number",
    description: "Left padding in pixels",
    minimum: 0
  },
  borderRadiusType: {
    type: "string",
    enum: ["grouped", "ungrouped"],
    description:
      "'grouped' = all corners equal (use borderRadius), 'ungrouped' = corners set individually. Auto-inferred when radius values are provided."
  },
  borderRadius: {
    type: "number",
    description:
      "Border radius for all corners in pixels. Auto-sets borderRadiusType to 'grouped'.",
    minimum: 0
  },
  borderTopLeftRadius: {
    type: "number",
    description:
      "Top-left corner radius in pixels. Auto-sets borderRadiusType to 'ungrouped'.",
    minimum: 0
  },
  borderTopRightRadius: {
    type: "number",
    description:
      "Top-right corner radius in pixels. Auto-sets borderRadiusType to 'ungrouped'.",
    minimum: 0
  },
  borderBottomRightRadius: {
    type: "number",
    description:
      "Bottom-right corner radius in pixels. Auto-sets borderRadiusType to 'ungrouped'.",
    minimum: 0
  },
  borderBottomLeftRadius: {
    type: "number",
    description:
      "Bottom-left corner radius in pixels. Auto-sets borderRadiusType to 'ungrouped'.",
    minimum: 0
  }
} as const;

export const updateSectionItemDefinition: ToolDefinition = {
  name: "updateSectionItem",
  strict: true,
  description:
    "Update a SectionItem's properties (background, border, gradient, animated gradient, hover, padding, border radius). Supports solid, gradient, and animated-gradient backgrounds as well as hover overlay and hover border. IMPORTANT: For Section blocks, styling is on SectionItem (child of Section), NOT Section itself. Use getPageStructure to find the SectionItem ID inside the Section. For SectionHeader, use updateSectionHeaderItem/updateSectionHeaderStickyItem. For SectionFooter, use updateSectionFooter.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description:
          "ID of the SectionItem to update (NOT the Section ID - find the SectionItem child)"
      },
      ...sectionItemPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const updateSectionItemConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateSectionItemDefinition,
  elementType: ElementTypes.SectionItem,
  schema: sectionPropsSchema,
  defaults: withSectionItemDefaults,
  validateType: {
    expectedType: ElementTypes.SectionItem,
    errorMessage:
      "Background and padding properties can only be applied to SectionItem, not ${type}. For Section blocks, find the SectionItem child element inside the Section using getPageStructure and use its ID instead."
  }
};
