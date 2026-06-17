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

export const withSectionHeaderItemDefaults = pipe(
  withColorDefaults,
  inferBgColorType,
  withAnimatedGradientDefaults,
  inferPaddingType,
  inferBorderRadiusType
);

export const sectionHeaderItemPropsSchema = z.object({
  bgColorPalette: colorPalette,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorType: bgColorTypeContainer,
  bgImageSrc: z.string().optional(),
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
  paddingType: z.enum(["grouped", "ungrouped"]).optional(),
  paddingTop: z.number().min(0).optional(),
  paddingRight: z.number().min(0).optional(),
  paddingBottom: z.number().min(0).optional(),
  paddingLeft: z.number().min(0).optional(),
  borderRadiusType: z.enum(["grouped", "ungrouped"]).optional(),
  borderRadius: z.number().min(0).optional(),
  borderTopLeftRadius: z.number().min(0).optional(),
  borderTopRightRadius: z.number().min(0).optional(),
  borderBottomRightRadius: z.number().min(0).optional(),
  borderBottomLeftRadius: z.number().min(0).optional()
});

export type SectionHeaderItemProps = z.infer<
  typeof sectionHeaderItemPropsSchema
>;

const sectionHeaderItemPropertyDefinitions = {
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

export const updateSectionHeaderItemDefinition: ToolDefinition = {
  name: "updateSectionHeaderItem",
  strict: true,
  description:
    "Update a SectionHeaderItem's properties (background, border, gradient, animated gradient, hover, padding, border radius). Supports solid, gradient, and animated-gradient backgrounds as well as hover overlay and hover border. IMPORTANT: For SectionHeader blocks, styling is on SectionHeaderItem (first child of SectionHeader), NOT SectionHeader itself. Use getPageStructure to find the SectionHeaderItem ID inside the SectionHeader.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description:
          "ID of the SectionHeaderItem to update (NOT the SectionHeader ID - find the SectionHeaderItem child)"
      },
      ...sectionHeaderItemPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const updateSectionHeaderItemConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateSectionHeaderItemDefinition,
  elementType: ElementTypes.SectionHeaderItem,
  schema: sectionHeaderItemPropsSchema,
  defaults: withSectionHeaderItemDefaults,
  validateType: {
    expectedType: ElementTypes.SectionHeaderItem,
    errorMessage:
      "Background and styling properties can only be applied to SectionHeaderItem, not ${type}. For SectionHeader blocks, find the SectionHeaderItem child using getPageStructure and use its ID instead."
  }
};

export const updateSectionHeaderStickyItemDefinition: ToolDefinition = {
  name: "updateSectionHeaderStickyItem",
  strict: true,
  description:
    "Update a SectionHeaderStickyItem's properties (background, border, gradient, animated gradient, hover, padding, border radius). Supports solid, gradient, and animated-gradient backgrounds as well as hover overlay and hover border. Use this for the sticky header variant (second child of SectionHeader). Use getPageStructure to find the SectionHeaderStickyItem ID inside the SectionHeader.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description:
          "ID of the SectionHeaderStickyItem to update (second child of SectionHeader, used when sticky header is enabled)"
      },
      ...sectionHeaderItemPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const updateSectionHeaderStickyItemConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateSectionHeaderStickyItemDefinition,
  elementType: ElementTypes.SectionHeaderStickyItem,
  schema: sectionHeaderItemPropsSchema,
  defaults: withSectionHeaderItemDefaults,
  validateType: {
    expectedType: ElementTypes.SectionHeaderStickyItem,
    errorMessage:
      "Background and styling properties can only be applied to SectionHeaderStickyItem, not ${type}. For sticky header styling, find the SectionHeaderStickyItem child using getPageStructure and use its ID instead."
  }
};
