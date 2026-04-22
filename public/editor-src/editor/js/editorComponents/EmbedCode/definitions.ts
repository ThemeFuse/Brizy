import { z } from "zod";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const embedCodePropsSchema = z.object({
  code: z.string().optional()
});

export type EmbedCodeProps = z.infer<typeof embedCodePropsSchema>;

const embedCodePropertyDefinitions = {
  code: {
    type: "string",
    description:
      "HTML/embed code to inject (e.g., iframe, script, or custom HTML)"
  }
} as const;

export const addEmbedCodeDefinition: ToolDefinition = {
  name: "addEmbedCode",
  strict: true,
  description:
    "Add an EmbedCode element to an EXISTING Section for embedding custom HTML, iframes, or widgets. For new sections use generateBlock.",
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
      ...embedCodePropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateEmbedCodeDefinition: ToolDefinition = {
  name: "updateEmbedCode",
  strict: true,
  description:
    "Update an EmbedCode element. Use searchElements({type:'EmbedCode'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the EmbedCode to update"
      },
      ...embedCodePropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addEmbedCodeConfig: AddToolConfig = {
  kind: "add",
  definition: addEmbedCodeDefinition,
  elementType: ElementTypes.EmbedCode,
  schema: embedCodePropsSchema
};

export const updateEmbedCodeConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateEmbedCodeDefinition,
  elementType: ElementTypes.EmbedCode,
  schema: embedCodePropsSchema
};
