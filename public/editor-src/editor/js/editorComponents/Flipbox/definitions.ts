import { z } from "zod";
import { withColorDefaults } from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  hexColor,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const withFlipboxDefaults = withColorDefaults;

export const flipboxPropsSchema = z.object({
  transition: z
    .enum(["flip", "slide", "push", "zoomIn", "zoomOut", "fade"])
    .optional(),
  direction: z.enum(["left", "right", "up", "down"]).optional(),
  trigger: z.enum(["hover", "click"]).optional(),
  speed: z.number().min(100).max(1000).optional(),
  heightStyle: z.enum(["auto", "custom"]).optional(),
  height: z.number().min(200).max(999).optional(),
  verticalAlign: z.enum(["top", "center", "bottom", "between"]).optional(),
  backVerticalAlign: z.enum(["top", "center", "bottom", "between"]).optional(),
  // Front background
  bgImageSrc: z.string().optional(),
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorPalette: colorPalette,
  // Back background
  backBgImageSrc: z.string().optional(),
  backBgColorHex: hexColor,
  backBgColorOpacity: opacity,
  backBgColorPalette: colorPalette
});

export type FlipboxProps = z.infer<typeof flipboxPropsSchema>;

const flipboxPropertyDefinitions = {
  transition: {
    type: "string",
    enum: ["flip", "slide", "push", "zoomIn", "zoomOut", "fade"],
    description: "Animation type when switching between front and back sides"
  },
  direction: {
    type: "string",
    enum: ["left", "right", "up", "down"],
    description:
      "Animation direction (applies to flip, slide, push transitions; ignored for zoomIn, zoomOut, fade)"
  },
  trigger: {
    type: "string",
    enum: ["hover", "click"],
    description: "Interaction that triggers the flip animation"
  },
  speed: {
    type: "number",
    description: "Animation speed in milliseconds (100-1000)",
    minimum: 100,
    maximum: 1000
  },
  heightStyle: {
    type: "string",
    enum: ["auto", "custom"],
    description: "Height mode: 'auto' to fit content, 'custom' for fixed height"
  },
  height: {
    type: "number",
    description:
      "Custom height in pixels (200-999, only used when heightStyle='custom')",
    minimum: 200,
    maximum: 999
  },
  verticalAlign: {
    type: "string",
    enum: ["top", "center", "bottom", "between"],
    description: "Vertical alignment of front side content"
  },
  backVerticalAlign: {
    type: "string",
    enum: ["top", "center", "bottom", "between"],
    description: "Vertical alignment of back side content"
  },
  bgImageSrc: {
    type: "string",
    description: "Front side background image URL"
  },
  bgColorHex: {
    type: "string",
    description: "Front side background color in hex (e.g. '#FF0000')"
  },
  bgColorOpacity: {
    type: "number",
    description: "Front side background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  backBgImageSrc: {
    type: "string",
    description: "Back side background image URL"
  },
  backBgColorHex: {
    type: "string",
    description: "Back side background color in hex (e.g. '#0000FF')"
  },
  backBgColorOpacity: {
    type: "number",
    description: "Back side background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  }
} as const;

export const addFlipboxDefinition: ToolDefinition = {
  name: "addFlipbox",
  strict: true,
  description:
    "Add a Flipbox to an EXISTING Section. A two-sided element with front and back that flips on hover or click. For new sections use generateBlock.",
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
      ...flipboxPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateFlipboxDefinition: ToolDefinition = {
  name: "updateFlipbox",
  strict: true,
  description:
    "Update a Flipbox element's properties. Use searchElements({type:'Flipbox'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Flipbox to update"
      },
      ...flipboxPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addFlipboxConfig: AddToolConfig = {
  kind: "add",
  definition: addFlipboxDefinition,
  elementType: ElementTypes.Flipbox,
  schema: flipboxPropsSchema,
  defaults: withFlipboxDefaults
};

export const updateFlipboxConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateFlipboxDefinition,
  elementType: ElementTypes.Flipbox,
  schema: flipboxPropsSchema,
  defaults: withFlipboxDefaults
};
