import { z } from "zod";
import { withColorDefaults } from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  hexColor,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { log } from "visual/ai/utils/logger";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const withColumnDefaults = withColorDefaults;

export const columnPropsSchema = z.object({
  // layout
  width: z.number().min(5).max(95).optional(),
  // style - background
  bgColorPalette: colorPalette,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  // style - border
  borderColorPalette: colorPalette,
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderWidth: z.number().min(0).optional(),
  // style - padding
  paddingTop: z.number().min(0).optional(),
  paddingBottom: z.number().min(0).optional(),
  paddingLeft: z.number().min(0).optional(),
  paddingRight: z.number().min(0).optional()
});

export type ColumnProps = z.infer<typeof columnPropsSchema>;

const columnPropertyDefinitions = {
  width: {
    type: "number",
    description:
      "Column width in percentage (%), not pixels. Sibling columns auto-adjust to fill remaining space. Min 5%, max depends on number of siblings.",
    minimum: 5,
    maximum: 95
  },
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
  paddingLeft: {
    type: "number",
    description: "Left padding in pixels",
    minimum: 0
  },
  paddingRight: {
    type: "number",
    description: "Right padding in pixels",
    minimum: 0
  }
} as const;

export const addColumnDefinition: ToolDefinition = {
  name: "addColumn",
  strict: true,
  description:
    "Add a Column to an existing Row. Only for multi-column layouts in existing sections. For new sections use generateBlock.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description: "ID of the Row container"
      },
      insertIndex: {
        type: "number",
        description: "Position in row (0-indexed). Omit to add at end.",
        minimum: 0
      },
      ...columnPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateColumnDefinition: ToolDefinition = {
  name: "updateColumn",
  strict: true,
  description:
    "Update a Column element's properties. Width must be in percentage (%), not pixels. When width is changed, sibling columns in the same Row are automatically recalculated so all columns total 100%. Minimum width per column is 5%.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the column to update"
      },
      ...columnPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addColumnConfig: AddToolConfig = {
  kind: "add",
  definition: addColumnDefinition,
  elementType: ElementTypes.Column,
  schema: columnPropsSchema,
  defaults: withColumnDefaults
};

export const updateColumnConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateColumnDefinition,
  elementType: ElementTypes.Column,
  schema: columnPropsSchema,
  defaults: withColumnDefaults,
  updateMethod: "updateColumn",
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateColumn input %o", args);
    const { elementId, ...props } = args;

    const propsWithDefaults = withColumnDefaults(props);
    const parsed = columnPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const result = deps.pageRepository.updateColumn({
      elementId: elementId as string,
      elementType: ElementTypes.Column,
      changes: parsed.data
    });
    log.tools("updateColumn output %o", result);
    return result;
  }
};
