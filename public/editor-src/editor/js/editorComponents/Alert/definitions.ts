import { z } from "zod";
import {
  withAllFontFamilyNormalize,
  withColorDefaults
} from "visual/ai/adapters/prop-defaults";
import {
  fontFamilyProperty,
  fontFamilyPropertyPair,
  fontFamilySchema,
  fontFamilySchemaPair,
  hexColor,
  onOff,
  opacity
} from "visual/ai/adapters/schema-primitives";
import { pipe } from "visual/utils/fp/pipe";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const withAlertDefaults = pipe(
  withColorDefaults,
  withAllFontFamilyNormalize
);

export const alertPropsSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  closeButtonState: onOff.optional(),
  descriptionState: onOff.optional(),
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  ...fontFamilySchemaPair("title"),
  ...fontFamilySchemaPair("description"),
  messageFontFamily: fontFamilySchema,
  numberFontFamily: fontFamilySchema
});

export type AlertProps = z.infer<typeof alertPropsSchema>;

const alertPropertyDefinitions = {
  title: {
    type: "string",
    description: "Alert heading text"
  },
  description: {
    type: "string",
    description: "Alert body text"
  },
  closeButtonState: {
    type: "string",
    enum: ["on", "off"],
    description: "Show/hide close button"
  },
  descriptionState: {
    type: "string",
    enum: ["on", "off"],
    description: "Show/hide description"
  },
  bgColorHex: {
    type: "string",
    description: "Background color hex"
  },
  bgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  ...fontFamilyPropertyPair(
    "title",
    "Font family for the alert heading/title text."
  ),
  ...fontFamilyPropertyPair(
    "description",
    "Font family for the alert body/description text."
  ),
  messageFontFamily: fontFamilyProperty(
    "Font family for the alert icon message text."
  ),
  numberFontFamily: fontFamilyProperty(
    "Font family for the alert icon number badge."
  )
} as const;

export const addAlertDefinition: ToolDefinition = {
  name: "addAlert",
  strict: true,
  description:
    "Add an Alert/notice banner to an EXISTING Section. For new sections use generateBlock.",
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
      ...alertPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateAlertDefinition: ToolDefinition = {
  name: "updateAlert",
  strict: true,
  description:
    "Update an Alert/notice element. Use searchElements({type:'Alert'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Alert to update"
      },
      ...alertPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addAlertConfig: AddToolConfig = {
  kind: "add",
  definition: addAlertDefinition,
  elementType: ElementTypes.Alert,
  schema: alertPropsSchema,
  defaults: withAlertDefaults
};

export const updateAlertConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateAlertDefinition,
  elementType: ElementTypes.Alert,
  schema: alertPropsSchema,
  defaults: withAlertDefaults
};
