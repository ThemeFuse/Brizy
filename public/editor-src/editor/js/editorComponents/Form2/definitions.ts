import type { AddNoPropsToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const addFormDefinition: ToolDefinition = {
  name: "addForm",
  strict: true,
  description:
    "Add a Form to an EXISTING Section. For new sections use generateBlock.",
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
      }
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const addFormConfig: AddNoPropsToolConfig = {
  kind: "addNoProps",
  definition: addFormDefinition,
  elementType: ElementTypes.Form2
};
