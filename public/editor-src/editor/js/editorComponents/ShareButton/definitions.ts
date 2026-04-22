import type { AddNoPropsToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const addShareButtonDefinition: ToolDefinition = {
  name: "addShareButton",
  strict: true,
  description:
    "Add social ShareButtons to an EXISTING Section. Creates share buttons with default social networks. For new sections use generateBlock.",
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

export const addShareButtonConfig: AddNoPropsToolConfig = {
  kind: "addNoProps",
  definition: addShareButtonDefinition,
  elementType: ElementTypes.ShareButton
};
