import { z } from "zod";
import type { UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const cloneablePropsSchema = z.object({
  width: z.number().min(5).max(100).optional(),
  horizontalAlign: z.enum(["left", "center", "right"]).optional(),
  marginTop: z.number().min(0).optional(),
  marginBottom: z.number().min(0).optional(),
  itemPaddingTop: z.number().min(0).optional(),
  itemPaddingRight: z.number().min(0).optional(),
  itemPaddingBottom: z.number().min(0).optional(),
  itemPaddingLeft: z.number().min(0).optional()
});

export type CloneableProps = z.infer<typeof cloneablePropsSchema>;

export const updateCloneableDefinition: ToolDefinition = {
  name: "updateCloneable",
  strict: true,
  description:
    "Update a Cloneable container's layout properties. Cloneable wraps multiple cloneable items (e.g. buttons, icons). Use searchElements({type:'Cloneable'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Cloneable to update"
      },
      width: {
        type: "number",
        description: "Container width in percentage (5-100)",
        minimum: 5,
        maximum: 100
      },
      horizontalAlign: {
        type: "string",
        enum: ["left", "center", "right"],
        description: "Horizontal alignment of child items"
      },
      marginTop: {
        type: "number",
        description: "Top margin in pixels",
        minimum: 0
      },
      marginBottom: {
        type: "number",
        description: "Bottom margin in pixels",
        minimum: 0
      },
      itemPaddingTop: {
        type: "number",
        description: "Top padding between cloned items in pixels",
        minimum: 0
      },
      itemPaddingRight: {
        type: "number",
        description: "Right padding between cloned items in pixels",
        minimum: 0
      },
      itemPaddingBottom: {
        type: "number",
        description: "Bottom padding between cloned items in pixels",
        minimum: 0
      },
      itemPaddingLeft: {
        type: "number",
        description: "Left padding between cloned items in pixels",
        minimum: 0
      }
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const updateCloneableConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateCloneableDefinition,
  elementType: ElementTypes.Cloneable,
  schema: cloneablePropsSchema
};
