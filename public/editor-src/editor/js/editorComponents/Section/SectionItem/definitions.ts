import { z } from "zod";
import { withColorDefaults } from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  hexColor,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type { UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const withSectionItemDefaults = withColorDefaults;

export const sectionPropsSchema = z.object({
  // style - background
  bgColorPalette: colorPalette,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgImageSrc: z.string().optional(),
  // style - padding
  paddingTop: z.number().min(0).optional(),
  paddingBottom: z.number().min(0).optional()
});

export type SectionProps = z.infer<typeof sectionPropsSchema>;

export const updateSectionItemDefinition: ToolDefinition = {
  name: "updateSectionItem",
  strict: true,
  description:
    "Update a SectionItem's properties (background, padding). IMPORTANT: For Section blocks, styling is on SectionItem (child of Section), NOT Section itself. Use getPageStructure to find the SectionItem ID inside the Section. For SectionHeader/SectionFooter, use updateSectionHeader/updateSectionFooter instead.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description:
          "ID of the SectionItem to update (NOT the Section ID - find the SectionItem child)"
      },
      bgColorHex: {
        type: "string",
        description: "Background color in hex"
      },
      bgColorOpacity: {
        type: "number",
        description: "Background color opacity (0-1)",
        minimum: 0,
        maximum: 1
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
      }
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
