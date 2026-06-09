import { z } from "zod";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const mapPropsSchema = z.object({
  // content
  address: z.string().optional(),
  zoom: z.number().min(1).max(21).optional()
});

export type MapProps = z.infer<typeof mapPropsSchema>;

export const addMapDefinition: ToolDefinition = {
  name: "addMap",
  strict: true,
  description:
    "Add a Map to an EXISTING Section. For new sections use generateBlock.",
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
      address: {
        type: "string",
        description: "Address or location to display on the map"
      },
      zoom: {
        type: "number",
        description: "Map zoom level (1-21, default 15)",
        minimum: 1,
        maximum: 21
      }
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateMapDefinition: ToolDefinition = {
  name: "updateMap",
  strict: true,
  description:
    "Update a Map element. Use searchElements({type:'Map'}) to find map IDs first.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the map to update"
      },
      address: {
        type: "string",
        description: "Address or location to display on the map"
      },
      zoom: {
        type: "number",
        description: "Map zoom level (1-21)",
        minimum: 1,
        maximum: 21
      }
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addMapConfig: AddToolConfig = {
  kind: "add",
  definition: addMapDefinition,
  elementType: ElementTypes.Map,
  schema: mapPropsSchema
};

export const updateMapConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateMapDefinition,
  elementType: ElementTypes.Map,
  schema: mapPropsSchema
};
