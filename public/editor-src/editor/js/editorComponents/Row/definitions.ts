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

export const withRowDefaults = withColorDefaults;

export const rowPropsSchema = z.object({
  // style - background
  bgColorPalette: colorPalette,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  // style - border
  borderColorPalette: colorPalette,
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderWidth: z.number().min(0).optional()
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
  }
} as const;

export const addRowDefinition: ToolDefinition = {
  name: "addRow",
  strict: true,
  description:
    "Add a Row to an EXISTING Section for multi-column layout. Only needed for side-by-side content. For new sections use generateBlock.",
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
  description: "Update a Row element's properties.",
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
