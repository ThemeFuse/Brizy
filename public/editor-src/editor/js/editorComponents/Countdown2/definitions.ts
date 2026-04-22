import { z } from "zod";
import { onOff } from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const countdown2PropsSchema = z.object({
  date: z.string().optional(),
  hours: z.string().optional(),
  minutes: z.number().min(0).max(59).optional(),
  actions: z.enum(["none", "showMessage", "redirect"]).optional(),
  messageText: z.string().optional(),
  showDays: onOff.optional(),
  showHours: onOff.optional(),
  showMinutes: onOff.optional(),
  showSeconds: onOff.optional()
});

export type Countdown2Props = z.infer<typeof countdown2PropsSchema>;

const countdownPropertyDefinitions = {
  date: {
    type: "string",
    description: "Target date (e.g., '12/31/2025')"
  },
  hours: {
    type: "string",
    description: "Target time (e.g., '10 am', '11 pm')"
  },
  minutes: {
    type: "number",
    description: "Target minutes (0-59)",
    minimum: 0,
    maximum: 59
  },
  actions: {
    type: "string",
    enum: ["none", "showMessage", "redirect"],
    description: "Action when countdown ends"
  },
  messageText: {
    type: "string",
    description:
      "Message shown when countdown ends (when actions='showMessage')"
  },
  showDays: {
    type: "string",
    enum: ["on", "off"],
    description: "Show days counter"
  },
  showHours: {
    type: "string",
    enum: ["on", "off"],
    description: "Show hours counter"
  },
  showMinutes: {
    type: "string",
    enum: ["on", "off"],
    description: "Show minutes counter"
  },
  showSeconds: {
    type: "string",
    enum: ["on", "off"],
    description: "Show seconds counter"
  }
} as const;

export const addCountdownDefinition: ToolDefinition = {
  name: "addCountdown",
  strict: true,
  description:
    "Add a Countdown timer to an EXISTING Section. For new sections use generateBlock.",
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
      ...countdownPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateCountdownDefinition: ToolDefinition = {
  name: "updateCountdown",
  strict: true,
  description:
    "Update a Countdown timer element. Use searchElements({type:'Countdown2'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Countdown to update"
      },
      ...countdownPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addCountdownConfig: AddToolConfig = {
  kind: "add",
  definition: addCountdownDefinition,
  elementType: ElementTypes.Countdown2,
  schema: countdown2PropsSchema
};

export const updateCountdownConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateCountdownDefinition,
  elementType: ElementTypes.Countdown2,
  schema: countdown2PropsSchema
};
