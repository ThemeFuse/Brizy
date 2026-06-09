import { z } from "zod";
import { withColorDefaults } from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  fontStyleEnum,
  hexColor,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const breadcrumbsPropsSchema = z.object({
  textSpacing: z.number().min(0).optional(),
  textSpacingSuffix: z.enum(["px", "%"]).optional(),

  // Typography
  fontFamily: z.string().optional(),
  fontStyle: z.union([z.literal(""), fontStyleEnum]).optional(),
  fontFamilyType: z.enum(["google", "adobe", "custom", "group"]).optional(),
  fontSize: z.number().min(8).max(200).optional(),
  fontSizeSuffix: z.enum(["px", "em"]).optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  lineHeight: z.number().min(0.5).max(5).optional(),
  letterSpacing: z.number().optional(),
  variableFontWeight: z.number().min(100).max(900).optional(),
  fontWidth: z.number().min(0).max(200).optional(),
  fontSoftness: z.number().min(-100).max(100).optional(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strike: z.boolean().optional(),
  uppercase: z.boolean().optional(),
  lowercase: z.boolean().optional(),

  // Link/default color
  colorHex: hexColor,
  colorOpacity: opacity,
  colorPalette: colorPalette,

  // Active (current) item color
  activeColorHex: hexColor,
  activeColorOpacity: opacity,
  activeColorPalette: colorPalette,

  // Separator arrows color
  arrowsColorHex: hexColor,
  arrowsColorOpacity: opacity,
  arrowsColorPalette: colorPalette,

  // Hover color
  hoverColorHex: hexColor,
  hoverColorOpacity: opacity,
  hoverColorPalette: colorPalette
});

export type BreadcrumbsProps = z.infer<typeof breadcrumbsPropsSchema>;

export const withBreadcrumbsDefaults = withColorDefaults;

const breadcrumbsPropertyDefinitions = {
  textSpacing: {
    type: "number",
    description: "Spacing between items (e.g. 5)",
    minimum: 0
  },
  textSpacingSuffix: {
    type: "string",
    enum: ["px", "%"],
    description: "Unit for textSpacing (default px)"
  },

  // Typography
  fontFamily: {
    type: "string",
    description: "Font family key (e.g. 'lato')"
  },
  fontStyle: {
    type: "string",
    enum: [
      "",
      "paragraph",
      "subtitle",
      "abovetitle",
      "heading1",
      "heading2",
      "heading3",
      "heading4",
      "heading5",
      "heading6",
      "button"
    ],
    description: "Typography preset. Set to '' for custom typography."
  },
  fontFamilyType: {
    type: "string",
    enum: ["google", "adobe", "custom", "group"],
    description: "Font source type"
  },
  fontSize: {
    type: "number",
    description: "Font size (8-200)",
    minimum: 8,
    maximum: 200
  },
  fontSizeSuffix: {
    type: "string",
    enum: ["px", "em"],
    description: "Font size unit"
  },
  fontWeight: {
    type: "number",
    description: "Font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  lineHeight: {
    type: "number",
    description: "Line height (0.5-5)",
    minimum: 0.5,
    maximum: 5
  },
  letterSpacing: {
    type: "number",
    description: "Letter spacing"
  },
  variableFontWeight: {
    type: "number",
    description: "Variable font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  fontWidth: {
    type: "number",
    description: "Variable font width (0-200)",
    minimum: 0,
    maximum: 200
  },
  fontSoftness: {
    type: "number",
    description: "Variable font softness (-100 to 100)",
    minimum: -100,
    maximum: 100
  },
  bold: {
    type: "boolean",
    description: "Bold text"
  },
  italic: {
    type: "boolean",
    description: "Italic text"
  },
  underline: {
    type: "boolean",
    description: "Underline text"
  },
  strike: {
    type: "boolean",
    description: "Strikethrough text"
  },
  uppercase: {
    type: "boolean",
    description: "Transform text to uppercase"
  },
  lowercase: {
    type: "boolean",
    description: "Transform text to lowercase"
  },

  // Link/default color
  colorPalette: {
    type: "string",
    description: "Link color palette ('color1'-'color8' or '' for custom hex)"
  },
  colorHex: {
    type: "string",
    description:
      "Link color hex (e.g. '#ffffff'). Palette is auto-cleared when hex is provided."
  },
  colorOpacity: {
    type: "number",
    description: "Link color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // Active (current) item color
  activeColorPalette: {
    type: "string",
    description:
      "Active item color palette ('color1'-'color8' or '' for custom hex)"
  },
  activeColorHex: {
    type: "string",
    description:
      "Current/last breadcrumb item color hex. Palette is auto-cleared when hex is provided."
  },
  activeColorOpacity: {
    type: "number",
    description: "Active color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // Separator arrows color
  arrowsColorPalette: {
    type: "string",
    description: "Arrows color palette ('color1'-'color8' or '' for custom hex)"
  },
  arrowsColorHex: {
    type: "string",
    description:
      "Separator/arrows color hex. Palette is auto-cleared when hex is provided."
  },
  arrowsColorOpacity: {
    type: "number",
    description: "Arrows color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // Hover color
  hoverColorPalette: {
    type: "string",
    description: "Hover color palette ('color1'-'color8' or '' for custom hex)"
  },
  hoverColorHex: {
    type: "string",
    description:
      "Hover color hex for links. Palette is auto-cleared when hex is provided."
  },
  hoverColorOpacity: {
    type: "number",
    description: "Hover color opacity (0-1)",
    minimum: 0,
    maximum: 1
  }
} as const;

export const addBreadcrumbsDefinition: ToolDefinition = {
  name: "addBreadcrumbs",
  strict: true,
  description:
    "Add a Breadcrumbs (navigation path) element to an EXISTING Section or Column. Content is filled by dynamic content (e.g. page hierarchy). For new sections use generateBlock.",
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
      ...breadcrumbsPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateBreadcrumbsDefinition: ToolDefinition = {
  name: "updateBreadcrumbs",
  strict: true,
  description:
    "Update a Breadcrumbs element's typography and colors. Use searchElements({type:'Breadcrumbs'}) to find element IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Breadcrumbs element to update"
      },
      ...breadcrumbsPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addBreadcrumbsConfig: AddToolConfig = {
  kind: "add",
  definition: addBreadcrumbsDefinition,
  elementType: ElementTypes.Breadcrumbs,
  schema: breadcrumbsPropsSchema,
  defaults: withBreadcrumbsDefaults
};

export const updateBreadcrumbsConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateBreadcrumbsDefinition,
  elementType: ElementTypes.Breadcrumbs,
  schema: breadcrumbsPropsSchema,
  defaults: withBreadcrumbsDefaults
};
