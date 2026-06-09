import { z } from "zod";
import { withColorDefaults } from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  hexColor,
  onOff,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const tableOfContentsPropsSchema = z.object({
  // content
  title: z.string().optional(),
  selectedElements: z.string().optional(),

  // title typography
  fontStyle: z.string().optional(),
  fontSize: z.number().min(1).max(100).optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  lineHeight: z.number().min(0.5).max(5).optional(),
  letterSpacing: z.number().min(-5).max(15).optional(),

  // body typography
  bodyFontStyle: z.string().optional(),
  bodyFontSize: z.number().min(1).max(100).optional(),
  bodyFontWeight: z.number().min(100).max(900).optional(),
  bodyLineHeight: z.number().min(0.5).max(5).optional(),
  bodyLetterSpacing: z.number().min(-5).max(15).optional(),

  // title colors
  titleColorHex: hexColor,
  titleColorOpacity: opacity,
  titleColorPalette: colorPalette,

  // title background colors
  titleBgColorHex: hexColor,
  titleBgColorOpacity: opacity,
  titleBgColorPalette: colorPalette,

  // marker colors
  markerColorHex: hexColor,
  markerColorOpacity: opacity,
  markerColorPalette: colorPalette,

  // body text colors
  bodyColorHex: hexColor,
  bodyColorOpacity: opacity,
  bodyColorPalette: colorPalette,

  // body background colors
  bodyBgColorHex: hexColor,
  bodyBgColorOpacity: opacity,
  bodyBgColorPalette: colorPalette,

  // layout
  markerType: z.enum(["numbers", "circle"]).optional(),
  wordWrap: onOff.optional(),
  minimized: onOff.optional(),
  navIcon: z.string().optional(),
  textUnderline: onOff.optional(),
  animDuration: z.number().min(0).max(2).optional()
});

export type TableOfContentsProps = z.infer<typeof tableOfContentsPropsSchema>;

export const withTableOfContentsDefaults = withColorDefaults;

const tableOfContentsPropertyDefinitions = {
  title: {
    type: "string",
    description: "Title text displayed at the top of the table of contents"
  },
  selectedElements: {
    type: "string",
    description:
      'JSON array of heading selectors to include, e.g. \'["h1","h2","h3"]\'. Valid values: h1, h2, h3, h4, h5, h6.'
  },
  fontStyle: {
    type: "string",
    description:
      "Title font style preset: 'paragraph', 'subtitle', 'heading1'-'heading6', etc."
  },
  fontSize: {
    type: "number",
    description: "Title font size in pixels (1-100)",
    minimum: 1,
    maximum: 100
  },
  fontWeight: {
    type: "number",
    description: "Title font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  lineHeight: {
    type: "number",
    description: "Title line height multiplier (0.5-5)",
    minimum: 0.5,
    maximum: 5
  },
  letterSpacing: {
    type: "number",
    description: "Title letter spacing in pixels (-5 to 15)",
    minimum: -5,
    maximum: 15
  },
  bodyFontStyle: {
    type: "string",
    description:
      "Body font style preset: 'paragraph', 'subtitle', 'heading1'-'heading6', etc."
  },
  bodyFontSize: {
    type: "number",
    description: "Body font size in pixels (1-100)",
    minimum: 1,
    maximum: 100
  },
  bodyFontWeight: {
    type: "number",
    description: "Body font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  bodyLineHeight: {
    type: "number",
    description: "Body line height multiplier (0.5-5)",
    minimum: 0.5,
    maximum: 5
  },
  bodyLetterSpacing: {
    type: "number",
    description: "Body letter spacing in pixels (-5 to 15)",
    minimum: -5,
    maximum: 15
  },
  titleColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using titleColorHex. For palette colors use 'color1'-'color8'."
  },
  titleColorHex: {
    type: "string",
    description:
      "Title text color hex (e.g., '#FF0000'). Palette is auto-cleared when hex is provided."
  },
  titleColorOpacity: {
    type: "number",
    description: "Title text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  titleBgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using titleBgColorHex. For palette colors use 'color1'-'color8'."
  },
  titleBgColorHex: {
    type: "string",
    description:
      "Title background color hex (e.g., '#FF0000'). Palette is auto-cleared when hex is provided."
  },
  titleBgColorOpacity: {
    type: "number",
    description: "Title background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  markerColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using markerColorHex. For palette colors use 'color1'-'color8'."
  },
  markerColorHex: {
    type: "string",
    description:
      "Marker color hex (e.g., '#FF0000'). Palette is auto-cleared when hex is provided."
  },
  markerColorOpacity: {
    type: "number",
    description: "Marker color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  bodyColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using bodyColorHex. For palette colors use 'color1'-'color8'."
  },
  bodyColorHex: {
    type: "string",
    description:
      "Body text color hex (e.g., '#FF0000'). Palette is auto-cleared when hex is provided."
  },
  bodyColorOpacity: {
    type: "number",
    description: "Body text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  bodyBgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using bodyBgColorHex. For palette colors use 'color1'-'color8'."
  },
  bodyBgColorHex: {
    type: "string",
    description:
      "Body background color hex (e.g., '#FF0000'). Palette is auto-cleared when hex is provided."
  },
  bodyBgColorOpacity: {
    type: "number",
    description: "Body background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  markerType: {
    type: "string",
    enum: ["numbers", "circle"],
    description: "Marker type: 'numbers' (default) or 'circle'"
  },
  wordWrap: {
    type: "string",
    enum: ["on", "off"],
    description: "Enable word wrapping for long headings"
  },
  minimized: {
    type: "string",
    enum: ["on", "off"],
    description: "Start in minimized/collapsed state"
  },
  navIcon: {
    type: "string",
    enum: ["none", "thin", "heavy", "tail", "filled", "outline"],
    description: "Collapse/expand arrow icon style ('none' to hide)"
  },
  textUnderline: {
    type: "string",
    enum: ["on", "off"],
    description: "Underline links in the table of contents"
  },
  animDuration: {
    type: "number",
    description: "Expand/collapse animation duration in seconds (0-2)",
    minimum: 0,
    maximum: 2
  }
} as const;

export const addTableOfContentsDefinition: ToolDefinition = {
  name: "addTableOfContents",
  strict: true,
  description:
    "Add a Table of Contents to an EXISTING Section. Automatically generates a navigable list of headings from the page. For new sections use generateBlock.",
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
      ...tableOfContentsPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateTableOfContentsDefinition: ToolDefinition = {
  name: "updateTableOfContents",
  strict: true,
  description:
    "Update a TableOfContents element's properties. Use searchElements({type:'TableOfContents'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the TableOfContents to update"
      },
      ...tableOfContentsPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addTableOfContentsConfig: AddToolConfig = {
  kind: "add",
  definition: addTableOfContentsDefinition,
  elementType: ElementTypes.TableOfContents,
  schema: tableOfContentsPropsSchema,
  defaults: withTableOfContentsDefaults
};

export const updateTableOfContentsConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateTableOfContentsDefinition,
  elementType: ElementTypes.TableOfContents,
  schema: tableOfContentsPropsSchema,
  defaults: withTableOfContentsDefaults
};
