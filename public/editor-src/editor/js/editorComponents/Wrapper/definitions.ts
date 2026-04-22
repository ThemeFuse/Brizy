import { z } from "zod";
import type { UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const wrapperPropsSchema = z.object({
  width: z.number().min(5).max(100).optional(),
  horizontalAlign: z.enum(["left", "center", "right"]).optional(),
  marginTop: z.number().min(0).optional(),
  marginBottom: z.number().min(0).optional()
});

export type WrapperProps = z.infer<typeof wrapperPropsSchema>;

export const updateWrapperDefinition: ToolDefinition = {
  name: "updateWrapper",
  strict: true,
  description:
    "Update a Wrapper element's layout properties. Wrapper wraps a single child element and controls its width, alignment, and margins. Use searchElements({type:'Wrapper'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Wrapper to update"
      },
      width: {
        type: "number",
        description: "Wrapper width in percentage (5-100)",
        minimum: 5,
        maximum: 100
      },
      horizontalAlign: {
        type: "string",
        enum: ["left", "center", "right"],
        description: "Horizontal alignment of the wrapped element"
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
      }
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const updateWrapperConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateWrapperDefinition,
  elementType: ElementTypes.Wrapper,
  schema: wrapperPropsSchema
};
