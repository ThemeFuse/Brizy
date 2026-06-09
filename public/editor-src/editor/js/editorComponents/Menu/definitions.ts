import type { AddNoPropsToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const addMenuDefinition: ToolDefinition = {
  name: "addMenu",
  strict: true,
  description:
    "Add a navigation Menu to an EXISTING Section. NOTE: The menu will be empty until a CMS menu is assigned via the editor UI. For new sections use generateBlock.",
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

export const addMenuConfig: AddNoPropsToolConfig = {
  kind: "addNoProps",
  definition: addMenuDefinition,
  elementType: ElementTypes.Menu
};
