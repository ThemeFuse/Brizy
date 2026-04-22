import { z } from "zod";
import { onOff } from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const progressBarPropsSchema = z.object({
  text: z.string().optional(),
  percentage: z.number().min(0).max(100).optional(),
  showText: onOff.optional(),
  showPercentage: onOff.optional(),
  progressBarStyle: z.enum(["style1", "style2"]).optional()
});

export type ProgressBarProps = z.infer<typeof progressBarPropsSchema>;

const progressBarPropertyDefinitions = {
  text: {
    type: "string",
    description: "Label text (e.g., 'JavaScript', 'My skill')"
  },
  percentage: {
    type: "number",
    description: "Fill percentage (0-100)",
    minimum: 0,
    maximum: 100
  },
  showText: {
    type: "string",
    enum: ["on", "off"],
    description: "Show label text"
  },
  showPercentage: {
    type: "string",
    enum: ["on", "off"],
    description: "Show percentage number"
  },
  progressBarStyle: {
    type: "string",
    enum: ["style1", "style2"],
    description: "Bar style: style1 (thick) or style2 (thin)"
  }
} as const;

export const addProgressBarDefinition: ToolDefinition = {
  name: "addProgressBar",
  strict: true,
  description:
    "Add a ProgressBar to an EXISTING Section. For new sections use generateBlock.",
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
      ...progressBarPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateProgressBarDefinition: ToolDefinition = {
  name: "updateProgressBar",
  strict: true,
  description:
    "Update a ProgressBar element. Use searchElements({type:'ProgressBar'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the ProgressBar to update"
      },
      ...progressBarPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addProgressBarConfig: AddToolConfig = {
  kind: "add",
  definition: addProgressBarDefinition,
  elementType: ElementTypes.ProgressBar,
  schema: progressBarPropsSchema
};

export const updateProgressBarConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateProgressBarDefinition,
  elementType: ElementTypes.ProgressBar,
  schema: progressBarPropsSchema
};
