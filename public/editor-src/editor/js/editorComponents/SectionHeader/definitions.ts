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

export const withSectionHeaderDefaults = withColorDefaults;

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

export const updateSectionHeaderDefinition: ToolDefinition = {
  name: "updateSectionHeader",
  strict: true,
  description:
    "Update a SectionHeader block's properties (background, padding). Use this for header sections.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the SectionHeader to update"
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

export const updateSectionHeaderConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateSectionHeaderDefinition,
  elementType: ElementTypes.SectionHeader,
  schema: sectionPropsSchema,
  defaults: withSectionHeaderDefaults,
  validateType: {
    expectedType: ElementTypes.SectionHeader,
    errorMessage:
      "updateSectionHeader can only be used on SectionHeader elements, not ${type}. Use updateSectionItem for regular Section blocks."
  }
};
