import { z } from "zod";
import { onOff } from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const accordionPropsSchema = z.object({
  collapsible: onOff.optional(),
  animDuration: z.number().min(0).max(5).optional(),
  navIcon: z.string().optional()
});

export type AccordionProps = z.infer<typeof accordionPropsSchema>;

const accordionPropertyDefinitions = {
  collapsible: {
    type: "string",
    enum: ["on", "off"],
    description: "Whether items collapse when another opens"
  },
  animDuration: {
    type: "number",
    description: "Expand/collapse animation duration in seconds (0-5)",
    minimum: 0,
    maximum: 5
  },
  navIcon: {
    type: "string",
    enum: ["none", "thin", "heavy", "tail", "filled", "outline"],
    description: "Collapse arrow style ('none' to hide)"
  }
} as const;

export const addAccordionDefinition: ToolDefinition = {
  name: "addAccordion",
  strict: true,
  description:
    "Add an Accordion (collapsible FAQ/content) to an EXISTING Section. Creates 2 default items with content. For new sections use generateBlock.",
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
      ...accordionPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateAccordionDefinition: ToolDefinition = {
  name: "updateAccordion",
  strict: true,
  description:
    "Update an Accordion element's properties. Use searchElements({type:'Accordion'}) to find IDs. To change item titles, find the AccordionItem children and use updateElement on them.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Accordion to update"
      },
      ...accordionPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addAccordionConfig: AddToolConfig = {
  kind: "add",
  definition: addAccordionDefinition,
  elementType: ElementTypes.Accordion,
  schema: accordionPropsSchema
};

export const updateAccordionConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateAccordionDefinition,
  elementType: ElementTypes.Accordion,
  schema: accordionPropsSchema
};
