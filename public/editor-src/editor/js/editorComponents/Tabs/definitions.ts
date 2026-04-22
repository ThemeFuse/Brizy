import { z } from "zod";
import { onOff } from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const tabsPropsSchema = z.object({
  navStyle: z.enum(["style-1", "style-2", "style-3"]).optional(),
  action: z.enum(["click", "hover"]).optional(),
  verticalMode: onOff.optional()
});

export type TabsProps = z.infer<typeof tabsPropsSchema>;

const tabsPropertyDefinitions = {
  navStyle: {
    type: "string",
    enum: ["style-1", "style-2", "style-3"],
    description:
      "Tab navigation style. Appearance differs based on verticalMode: horizontal has underline/boxed/pill styles, vertical has side-aligned variants."
  },
  action: {
    type: "string",
    enum: ["click", "hover"],
    description: "Switch tabs on click or hover"
  },
  verticalMode: {
    type: "string",
    enum: ["on", "off"],
    description:
      "Layout direction. 'off' = horizontal tabs, 'on' = vertical (side) tabs. Changing this affects how navStyle renders."
  }
} as const;

export const addTabsDefinition: ToolDefinition = {
  name: "addTabs",
  strict: true,
  description:
    "Add Tabs (tabbed content panels) to an EXISTING Section. Creates 2 default tabs with content. For new sections use generateBlock.",
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
      ...tabsPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateTabsDefinition: ToolDefinition = {
  name: "updateTabs",
  strict: true,
  description:
    "Update a Tabs element's properties. Use searchElements({type:'Tabs'}) to find IDs. navStyle appearance depends on verticalMode: horizontal (off) and vertical (on) render different visual styles for the same style values.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Tabs to update"
      },
      ...tabsPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addTabsConfig: AddToolConfig = {
  kind: "add",
  definition: addTabsDefinition,
  elementType: ElementTypes.Tabs,
  schema: tabsPropsSchema
};

export const updateTabsConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateTabsDefinition,
  elementType: ElementTypes.Tabs,
  schema: tabsPropsSchema
};
