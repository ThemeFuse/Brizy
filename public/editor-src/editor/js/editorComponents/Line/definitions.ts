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

export const withLineDefaults = withColorDefaults;

export const linePropsSchema = z.object({
  // style
  borderColorPalette: colorPalette,
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  width: z.number().min(1).max(100).optional(),
  lineStyle: z.enum(["solid", "dashed", "dotted"]).optional()
});

export type LineProps = z.infer<typeof linePropsSchema>;

const linePropertyDefinitions = {
  borderColorPalette: {
    type: "string",
    description:
      "REQUIRED for custom line colors. Set to '' (empty string) when using borderColorHex. For palette colors use 'color1'-'color8'."
  },
  borderColorHex: {
    type: "string",
    description:
      "Line color hex. MUST be paired with borderColorPalette: '' to work. Example: borderColorPalette: '', borderColorHex: '#CCCCCC'"
  },
  borderColorOpacity: {
    type: "number",
    description: "Line color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  width: {
    type: "number",
    description: "Line width as percentage (1-100)",
    minimum: 1,
    maximum: 100
  },
  lineStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted"],
    description: "Line style"
  }
} as const;

export const addLineDefinition: ToolDefinition = {
  name: "addLine",
  strict: true,
  description:
    "Add a Line/divider to an EXISTING Section. For new sections use generateBlock.",
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
      ...linePropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateLineDefinition: ToolDefinition = {
  name: "updateLine",
  strict: true,
  description:
    "Update a Line/divider element. Use searchElements({type:'Line'}) to find line IDs first.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the line to update"
      },
      ...linePropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addLineConfig: AddToolConfig = {
  kind: "add",
  definition: addLineDefinition,
  elementType: ElementTypes.Line,
  schema: linePropsSchema,
  defaults: withLineDefaults
};

export const updateLineConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateLineDefinition,
  elementType: ElementTypes.Line,
  schema: linePropsSchema,
  defaults: withLineDefaults
};
