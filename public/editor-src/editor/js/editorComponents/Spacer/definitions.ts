import { z } from "zod";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const spacerPropsSchema = z.object({
  // style
  height: z.number().min(0).optional()
});

export type SpacerProps = z.infer<typeof spacerPropsSchema>;

export const addSpacerDefinition: ToolDefinition = {
  name: "addSpacer",
  strict: true,
  description:
    "Add a Spacer to an EXISTING Section for vertical spacing. For new sections use generateBlock.",
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
      height: {
        type: "number",
        description: "Spacer height in pixels",
        minimum: 0
      }
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateSpacerDefinition: ToolDefinition = {
  name: "updateSpacer",
  strict: true,
  description:
    "Update a Spacer element's height. Use searchElements({type:'Spacer'}) to find spacer IDs first.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the spacer to update"
      },
      height: {
        type: "number",
        description: "Spacer height in pixels",
        minimum: 0
      }
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addSpacerConfig: AddToolConfig = {
  kind: "add",
  definition: addSpacerDefinition,
  elementType: ElementTypes.Spacer,
  schema: spacerPropsSchema
};

export const updateSpacerConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateSpacerDefinition,
  elementType: ElementTypes.Spacer,
  schema: spacerPropsSchema
};
