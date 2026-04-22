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

export const timelinePropsSchema = z.object({
  // content
  enableText: onOff.optional(),
  verticalMode: onOff.optional(),
  timelineStyle: z.enum(["style-1", "style-2", "style-3"]).optional(),
  tabsCount: z.number().min(1).max(6).optional(),

  // typography
  typographyFontStyle: z.string().optional(),
  typographyFontSize: z.number().min(1).max(100).optional(),
  typographyFontWeight: z.number().min(100).max(900).optional(),
  typographyLineHeight: z.number().min(0.5).max(5).optional(),
  typographyLetterSpacing: z.number().min(-5).max(15).optional(),

  // label colors
  labelColorHex: hexColor,
  labelColorOpacity: opacity,
  labelColorPalette: colorPalette,

  // label background colors
  labelBgColorHex: hexColor,
  labelBgColorOpacity: opacity,
  labelBgColorPalette: colorPalette,

  // border colors
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette,

  // line border colors
  lineBorderColorHex: hexColor,
  lineBorderColorOpacity: opacity,
  lineBorderColorPalette: colorPalette,

  // layout
  width: z.number().min(0).max(1000).optional(),
  widthSuffix: z.enum(["px"]).optional(),
  spacing: z.number().min(0).max(100).optional(),
  spacingSuffix: z.enum(["px"]).optional(),
  verticalSpacing: z.number().min(0).max(200).optional(),
  verticalSpacingSuffix: z.enum(["px"]).optional(),

  // icon
  size: z.enum(["custom", "small", "medium", "large"]).optional(),
  customSize: z.number().min(14).max(180).optional(),
  iconPadding: z.number().min(0).max(180).optional(),
  iconBorderWidth: z.number().min(0).max(10).optional()
});

export type TimelineProps = z.infer<typeof timelinePropsSchema>;

export const withTimelineDefaults = withColorDefaults;

const timelinePropertyDefinitions = {
  enableText: {
    type: "string",
    enum: ["on", "off"],
    description: "Show titles/labels for timeline items"
  },
  verticalMode: {
    type: "string",
    enum: ["on", "off"],
    description:
      "Orientation: 'on' for vertical (top-to-bottom, typical timeline), 'off' for horizontal (left-to-right columns)"
  },
  timelineStyle: {
    type: "string",
    enum: ["style-1", "style-2", "style-3"],
    description:
      "Layout style: 'style-1' = all items aligned on one side, 'style-2' = items alternate left/right (first left, second right, etc.), 'style-3' = all items aligned on the opposite side"
  },
  tabsCount: {
    type: "number",
    description:
      "Number of columns in horizontal mode (1-6). Only applies when verticalMode is 'off'.",
    minimum: 1,
    maximum: 6
  },
  typographyFontStyle: {
    type: "string",
    description:
      "Font style preset: 'paragraph', 'subtitle', 'heading1'-'heading6', etc."
  },
  typographyFontSize: {
    type: "number",
    description: "Font size in pixels (1-100)",
    minimum: 1,
    maximum: 100
  },
  typographyFontWeight: {
    type: "number",
    description: "Font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  typographyLineHeight: {
    type: "number",
    description: "Line height multiplier (0.5-5)",
    minimum: 0.5,
    maximum: 5
  },
  typographyLetterSpacing: {
    type: "number",
    description: "Letter spacing in pixels (-5 to 15)",
    minimum: -5,
    maximum: 15
  },
  labelColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using labelColorHex. For palette colors use 'color1'-'color8'."
  },
  labelColorHex: {
    type: "string",
    description:
      "Label text color hex (e.g., '#73777F'). Palette is auto-cleared when hex is provided."
  },
  labelColorOpacity: {
    type: "number",
    description: "Label text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  labelBgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using labelBgColorHex. For palette colors use 'color1'-'color8'."
  },
  labelBgColorHex: {
    type: "string",
    description:
      "Label background color hex (e.g., '#FFFFFF'). Palette is auto-cleared when hex is provided."
  },
  labelBgColorOpacity: {
    type: "number",
    description: "Label background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  borderColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using borderColorHex. For palette colors use 'color1'-'color8'."
  },
  borderColorHex: {
    type: "string",
    description:
      "Icon border color hex (e.g., '#DCDEE1'). Palette is auto-cleared when hex is provided."
  },
  borderColorOpacity: {
    type: "number",
    description: "Icon border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  lineBorderColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using lineBorderColorHex. For palette colors use 'color1'-'color8'."
  },
  lineBorderColorHex: {
    type: "string",
    description:
      "Connecting line color hex (e.g., '#DCDEE1'). Palette is auto-cleared when hex is provided."
  },
  lineBorderColorOpacity: {
    type: "number",
    description: "Connecting line color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  width: {
    type: "number",
    description: "Width in pixels (0-1000)",
    minimum: 0,
    maximum: 1000
  },
  widthSuffix: {
    type: "string",
    enum: ["px"],
    description: "Width unit (always 'px')"
  },
  spacing: {
    type: "number",
    description: "Spacing between items in pixels (0-100)",
    minimum: 0,
    maximum: 100
  },
  spacingSuffix: {
    type: "string",
    enum: ["px"],
    description: "Spacing unit (always 'px')"
  },
  verticalSpacing: {
    type: "number",
    description:
      "Vertical spacing between items in pixels (0-200). Only applies in horizontal mode.",
    minimum: 0,
    maximum: 200
  },
  verticalSpacingSuffix: {
    type: "string",
    enum: ["px"],
    description: "Vertical spacing unit (always 'px')"
  },
  size: {
    type: "string",
    enum: ["custom", "small", "medium", "large"],
    description:
      "Icon size preset: 'small' (32px), 'medium' (48px), 'large' (64px), or 'custom'"
  },
  customSize: {
    type: "number",
    description:
      "Custom icon size in pixels (14-180). Only applies when size is 'custom'.",
    minimum: 14,
    maximum: 180
  },
  iconPadding: {
    type: "number",
    description: "Icon background padding in pixels (0-180)",
    minimum: 0,
    maximum: 180
  },
  iconBorderWidth: {
    type: "number",
    description: "Icon border width in pixels (0-10)",
    minimum: 0,
    maximum: 10
  }
} as const;

export const addTimelineDefinition: ToolDefinition = {
  name: "addTimeline",
  strict: true,
  description:
    "Add a Timeline to an EXISTING Section. Creates a timeline with 2 default TimelineTab items: the first tab contains an Icon, the second contains a Button. If more items are needed, use addTimelineItem to add them. Use searchElements({type:'TimelineTab'}) to find all tabs and update their labels, icons, and child content. CRITICAL: To set icons on TimelineTab items, you MUST first call getAvailableIcons to get valid icon names — NEVER guess or invent icon names. For new sections use generateBlock.",
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
      ...timelinePropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const timelineTabPropsSchema = z.object({
  // content
  labelText: z.string().optional(),

  // icon
  name: z.string().optional(),
  type: z.enum(["outline", "glyph", "fa"]).optional(),

  // icon colors
  colorHex: hexColor,
  colorOpacity: opacity,
  colorPalette: colorPalette,

  // background colors
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorPalette: colorPalette,

  // border colors
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette
});

export type TimelineTabProps = z.infer<typeof timelineTabPropsSchema>;

export const withTimelineTabDefaults = withColorDefaults;

const timelineTabPropertyDefinitions = {
  labelText: {
    type: "string",
    description: "Label text displayed on the timeline item"
  },
  name: {
    type: "string",
    description:
      "CRITICAL: You MUST call getAvailableIcons FIRST and use an EXACT icon name from the results. NEVER guess, invent, or fabricate icon names — only names returned by getAvailableIcons are valid. Copy the name exactly as returned (e.g., 'favourite-31'). Using a non-existent name will break the UI."
  },
  type: {
    type: "string",
    enum: ["outline", "glyph", "fa"],
    description:
      "CRITICAL: MUST match the exact type returned by getAvailableIcons for the chosen icon. NEVER guess — use the type from the getAvailableIcons response."
  },
  colorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using colorHex. For palette colors use 'color1'-'color8'."
  },
  colorHex: {
    type: "string",
    description:
      "Icon color hex (e.g., '#73777F'). Palette is auto-cleared when hex is provided."
  },
  colorOpacity: {
    type: "number",
    description: "Icon color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  bgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  bgColorHex: {
    type: "string",
    description:
      "Icon background color hex (e.g., '#FFFFFF'). Palette is auto-cleared when hex is provided."
  },
  bgColorOpacity: {
    type: "number",
    description: "Icon background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  borderColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using borderColorHex. For palette colors use 'color1'-'color8'."
  },
  borderColorHex: {
    type: "string",
    description:
      "Icon border color hex (e.g., '#E5E5E5'). Palette is auto-cleared when hex is provided."
  },
  borderColorOpacity: {
    type: "number",
    description: "Icon border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  }
} as const;

export const addTimelineItemDefinition: ToolDefinition = {
  name: "addTimelineItem",
  strict: true,
  description:
    "Add a new item (TimelineTab) to an existing Timeline. CRITICAL: containerId MUST be the Timeline element's ID (type:'Timeline'), NOT a Wrapper or any other parent. TimelineTab can ONLY be added inside a Timeline. Use searchElements({type:'Timeline'}) to find the correct ID. Each item has a labelText (small label), an icon, and acts as a container that can hold any elements (Text, Image, Button, Row, etc.) just like a Column. After adding, use addText/addImage/addButton etc. to populate its content. CRITICAL: To set an icon, you MUST first call getAvailableIcons — NEVER guess or invent icon names. Use the exact 'name' and 'type' values returned.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description:
          "ID of the Timeline element (type:'Timeline'). MUST NOT be a Wrapper or other parent — use searchElements({type:'Timeline'}) to get the correct ID."
      },
      insertIndex: {
        type: "number",
        description:
          "Position in the timeline (0-indexed). Omit to add at end.",
        minimum: 0
      },
      ...timelineTabPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateTimelineItemDefinition: ToolDefinition = {
  name: "updateTimelineItem",
  strict: true,
  description:
    "Update a TimelineTab (timeline item) properties like labelText, icon, and colors. Each TimelineTab is a container (like Column) that holds child elements (Text, Image, Button, etc.). Use searchElements to find child elements inside a TimelineTab and update them with their respective update tools (updateText, updateImage, etc.). To update ALL items in a timeline, you MUST iterate over every TimelineTab and update each one. CRITICAL: To change the icon, you MUST first call getAvailableIcons — NEVER guess or invent icon names. Use the exact 'name' and 'type' values returned.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the TimelineTab to update"
      },
      ...timelineTabPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const updateTimelineDefinition: ToolDefinition = {
  name: "updateTimeline",
  strict: true,
  description:
    "Update a Timeline element's global properties (style, layout, typography, colors). To update individual items: use searchElements({type:'TimelineTab'}) to find ALL TimelineTab children, then updateTimelineItem for each tab's label/icon, and use searchElements to find child elements inside each tab and update them with their respective tools. You MUST update every item, not just the first one.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Timeline to update"
      },
      ...timelinePropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addTimelineConfig: AddToolConfig = {
  kind: "add",
  definition: addTimelineDefinition,
  elementType: ElementTypes.Timeline,
  schema: timelinePropsSchema,
  defaults: withTimelineDefaults
};

export const updateTimelineConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateTimelineDefinition,
  elementType: ElementTypes.Timeline,
  schema: timelinePropsSchema,
  defaults: withTimelineDefaults
};

export const addTimelineItemConfig: AddToolConfig = {
  kind: "add",
  definition: addTimelineItemDefinition,
  elementType: ElementTypes.TimelineTab,
  schema: timelineTabPropsSchema,
  defaults: withTimelineTabDefaults
};

export const updateTimelineItemConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateTimelineItemDefinition,
  elementType: ElementTypes.TimelineTab,
  schema: timelineTabPropsSchema,
  defaults: withTimelineTabDefaults
};
