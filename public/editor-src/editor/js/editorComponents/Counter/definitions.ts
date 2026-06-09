import { z } from "zod";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const counterPropsSchema = z.object({
  start: z.number().optional(),
  end: z.number().optional(),
  duration: z.number().min(0).optional(),
  prefixLabel: z.string().optional(),
  suffixLabel: z.string().optional(),
  separator: z.string().optional()
});

export type CounterProps = z.infer<typeof counterPropsSchema>;

const counterPropertyDefinitions = {
  start: {
    type: "number",
    description: "Start value for counting animation"
  },
  end: {
    type: "number",
    description: "End value for counting animation"
  },
  duration: {
    type: "number",
    description: "Animation duration in seconds",
    minimum: 0
  },
  prefixLabel: {
    type: "string",
    description: "Text before the number (e.g., '$')"
  },
  suffixLabel: {
    type: "string",
    description: "Text after the number (e.g., '+', '%')"
  },
  separator: {
    type: "string",
    description: "Thousands separator (e.g., ',')"
  }
} as const;

export const addCounterDefinition: ToolDefinition = {
  name: "addCounter",
  strict: true,
  description:
    "Add an animated Counter to an EXISTING Section. Counts from start to end with animation. For new sections use generateBlock.",
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
      ...counterPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateCounterDefinition: ToolDefinition = {
  name: "updateCounter",
  strict: true,
  description:
    "Update a Counter element. Use searchElements({type:'Counter'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Counter to update"
      },
      ...counterPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addCounterConfig: AddToolConfig = {
  kind: "add",
  definition: addCounterDefinition,
  elementType: ElementTypes.Counter,
  schema: counterPropsSchema
};

export const updateCounterConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateCounterDefinition,
  elementType: ElementTypes.Counter,
  schema: counterPropsSchema
};
