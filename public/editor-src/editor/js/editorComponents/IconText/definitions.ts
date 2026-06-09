import { z } from "zod";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const iconTextPropsSchema = z.object({
  iconPosition: z.enum(["left", "right", "top", "bottom"]).optional(),
  iconSpacing: z.number().min(0).optional()
});

export type IconTextProps = z.infer<typeof iconTextPropsSchema>;

const iconTextPropertyDefinitions = {
  iconPosition: {
    type: "string",
    enum: ["left", "right", "top", "bottom"],
    description: "Icon placement relative to text"
  },
  iconSpacing: {
    type: "number",
    description: "Gap between icon and text in pixels",
    minimum: 0
  }
} as const;

export const addIconTextDefinition: ToolDefinition = {
  name: "addIconText",
  strict: true,
  description:
    "Add an IconText combo (icon + text + optional button) to an EXISTING Section. Great for feature cards. For new sections use generateBlock.",
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
      ...iconTextPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateIconTextDefinition: ToolDefinition = {
  name: "updateIconText",
  strict: true,
  description:
    "Update an IconText element's layout. To change the icon or text content, find the child Icon/RichText elements and update them directly.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the IconText to update"
      },
      ...iconTextPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addIconTextConfig: AddToolConfig = {
  kind: "add",
  definition: addIconTextDefinition,
  elementType: ElementTypes.IconText,
  schema: iconTextPropsSchema
};

export const updateIconTextConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateIconTextDefinition,
  elementType: ElementTypes.IconText,
  schema: iconTextPropsSchema
};
