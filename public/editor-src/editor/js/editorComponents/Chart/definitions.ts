import { z } from "zod";
import {
  validateFonts,
  withColorDefaults,
  withFontFamilyNormalize
} from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  fontFamilyPropertyDefinition,
  fontFamilySchema,
  fontStyleEnum,
  hexColor,
  onOff,
  opacity,
  plainText
} from "visual/ai/adapters/schema-primitives";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { log } from "visual/ai/utils/logger";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";

const chartItemSchema = z.object({
  id: z.string(),
  title: z.string()
});

export const chartPropsSchema = z.object({
  // content
  titleText: plainText.optional(),
  /** Unified axis label: resolved in handler to barLabel or lineLabel based on chartType */
  label: plainText.optional(),
  /** Alias for label (some LLMs send "labels") */
  labels: plainText.optional(),
  barLabel: plainText.optional(),
  lineLabel: plainText.optional(),
  chartType: z.enum(["pie", "bar", "line"]).optional(),
  chartPieItems: z.array(chartItemSchema).optional(),
  chartBarItems: z.array(chartItemSchema).optional(),
  chartLineItems: z.array(chartItemSchema).optional(),

  // defaultValue has explicit keys for the 3 default items (google/facebook/twitter)
  chartPieItemsGoogleValue: z.number().optional(),
  chartPieItemsFacebookValue: z.number().optional(),
  chartPieItemsTwitterValue: z.number().optional(),
  chartBarItemsGoogleValue: plainText.optional(),
  chartBarItemsFacebookValue: plainText.optional(),
  chartBarItemsTwitterValue: plainText.optional(),
  chartLineItemsGoogleValue: plainText.optional(),
  chartLineItemsFacebookValue: plainText.optional(),
  chartLineItemsTwitterValue: plainText.optional(),

  // layout
  width: z.number().min(1).max(1200).optional(),
  widthSuffix: z.enum(["px", "%"]).optional(),

  // title typography (used by title toolbar typography control)
  fontStyle: z.union([z.literal(""), fontStyleEnum]).optional(),
  fontFamily: fontFamilySchema,
  fontFamilyType: z.enum(["google", "system", "upload", "adobe"]).optional(),
  fontSize: z.number().min(1).max(200).optional(),
  fontSizeSuffix: z.enum(["px", "em", "rem", "%"]).optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  lineHeight: z.number().min(0).max(10).optional(),
  letterSpacing: z.number().optional(),

  // title colors & shadow
  titleHorizontalAlign: z.enum(["left", "center", "right"]).optional(),
  titleColorHex: hexColor,
  titleColorOpacity: opacity,
  titleColorPalette: colorPalette,
  hoverTitleColorHex: hexColor,
  hoverTitleColorOpacity: opacity,
  hoverTitleColorPalette: colorPalette,

  titleTextShadow: z.string().optional(),
  titleTextShadowBlur: z.number().min(0).optional(),
  titleTextShadowColorHex: hexColor,
  titleTextShadowColorOpacity: opacity,
  titleTextShadowColorPalette: colorPalette,
  titleTextShadowHorizontal: z.number().optional(),
  titleTextShadowVertical: z.number().optional(),
  hoverTitleTextShadow: z.string().optional(),
  hoverTitleTextShadowBlur: z.number().min(0).optional(),
  hoverTitleTextShadowColorHex: hexColor,
  hoverTitleTextShadowColorOpacity: opacity,
  hoverTitleTextShadowColorPalette: colorPalette,
  hoverTitleTextShadowHorizontal: z.number().optional(),
  hoverTitleTextShadowVertical: z.number().optional(),

  // chart options (line/bar) — range matches toolbar slider (min: 1, max: 15)
  fill: onOff.optional(),
  borderSize: z.number().min(1).max(15).optional(),
  borderSizeSuffix: z.enum(["px"]).optional(),

  // border (pie)
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderWidthType: z.enum(["grouped", "ungrouped"]).optional(),
  borderWidth: z.number().min(0).max(50).optional(),
  borderTopWidth: z.number().min(0).max(50).optional(),
  borderRightWidth: z.number().min(0).max(50).optional(),
  borderBottomWidth: z.number().min(0).max(50).optional(),
  borderLeftWidth: z.number().min(0).max(50).optional(),
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette,

  // background
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorPalette: colorPalette,

  // misc
  className: z.string().optional(),
  hoverTransition: z.number().min(0).max(99).optional(),
  hoverTransitionSuffix: z.string().optional(),
  customCSS: z.string().optional(),

  // chart item colors (defaultValue's 3 default items)
  chartPieItemsGoogleColorHex: hexColor,
  chartPieItemsGoogleColorOpacity: opacity,
  chartPieItemsGoogleColorPalette: colorPalette,
  chartPieItemsFacebookColorHex: hexColor,
  chartPieItemsFacebookColorOpacity: opacity,
  chartPieItemsFacebookColorPalette: colorPalette,
  chartPieItemsTwitterColorHex: hexColor,
  chartPieItemsTwitterColorOpacity: opacity,
  chartPieItemsTwitterColorPalette: colorPalette,

  chartBarItemsGoogleColorHex: hexColor,
  chartBarItemsGoogleColorOpacity: opacity,
  chartBarItemsGoogleColorPalette: colorPalette,
  chartBarItemsFacebookColorHex: hexColor,
  chartBarItemsFacebookColorOpacity: opacity,
  chartBarItemsFacebookColorPalette: colorPalette,
  chartBarItemsTwitterColorHex: hexColor,
  chartBarItemsTwitterColorOpacity: opacity,
  chartBarItemsTwitterColorPalette: colorPalette,

  chartLineItemsGoogleColorHex: hexColor,
  chartLineItemsGoogleColorOpacity: opacity,
  chartLineItemsGoogleColorPalette: colorPalette,
  chartLineItemsFacebookColorHex: hexColor,
  chartLineItemsFacebookColorOpacity: opacity,
  chartLineItemsFacebookColorPalette: colorPalette,
  chartLineItemsTwitterColorHex: hexColor,
  chartLineItemsTwitterColorOpacity: opacity,
  chartLineItemsTwitterColorPalette: colorPalette,

  // data labels typography (Chart.js legend/axis)
  dataLabelTypographyFontStyle: z
    .union([z.literal(""), fontStyleEnum])
    .optional(),
  dataLabelTypographyFontFamily: fontFamilySchema,
  dataLabelTypographyFontFamilyType: z
    .enum(["google", "system", "upload", "adobe"])
    .optional(),
  dataLabelTypographyFontSize: z.number().min(1).max(200).optional(),
  dataLabelTypographyFontSizeSuffix: z
    .enum(["px", "em", "rem", "%"])
    .optional(),
  dataLabelTypographyFontWeight: z.number().min(100).max(900).optional(),
  dataLabelTypographyLetterSpacing: z.number().optional(),
  dataLabelTypographyLineHeight: z.number().min(0).max(10).optional(),
  dataLabelTypographyVariableFontWeight: z
    .number()
    .min(100)
    .max(900)
    .optional(),
  dataLabelTypographyFontWidth: z.number().min(1).max(1000).optional(),
  dataLabelTypographyFontSoftness: z.number().min(0).max(100).optional(),
  dataLabelTypographyBold: z.boolean().optional(),
  dataLabelTypographyItalic: z.boolean().optional(),
  dataLabelTypographyUnderline: z.boolean().optional(),
  dataLabelTypographyStrike: z.boolean().optional(),
  dataLabelTypographyUppercase: z.boolean().optional(),
  dataLabelTypographyLowercase: z.boolean().optional(),

  // typography families (as stored in defaultValue.json)
  families: z
    .object({
      fontFamily: z.string().optional(),
      dataLabelTypographyFontFamily: z.string().optional()
    })
    .optional(),

  // legacy typo keys present in defaultValue.json (kept for compatibility)
  chartPieItemsFacebookOpacity: opacity,
  chartPieItemsTwitterOpacity: opacity
});

export type ChartProps = z.infer<typeof chartPropsSchema>;

type Props = Record<string, unknown>;

const TITLE_CUSTOM_TYPOGRAPHY_KEYS = [
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing"
];

const DATA_LABEL_CUSTOM_TYPOGRAPHY_KEYS = [
  "dataLabelTypographyFontSize",
  "dataLabelTypographyFontWeight",
  "dataLabelTypographyLineHeight",
  "dataLabelTypographyLetterSpacing"
];

const inferCustomTypographyPresets = <T extends Props>(props: T): T => {
  const next = { ...props } as Record<string, unknown>;

  if (
    !("fontStyle" in next) &&
    TITLE_CUSTOM_TYPOGRAPHY_KEYS.some((k) => k in next && next[k] !== undefined)
  ) {
    next.fontStyle = "";
  }

  if (
    !("dataLabelTypographyFontStyle" in next) &&
    DATA_LABEL_CUSTOM_TYPOGRAPHY_KEYS.some(
      (k) => k in next && next[k] !== undefined
    )
  ) {
    next.dataLabelTypographyFontStyle = "";
  }

  return next as T;
};

/** Slider option reads both borderSize and borderSizeSuffix; ensure suffix is set when borderSize is provided. */
const inferBorderSizeSuffix = <T extends Props>(props: T): T =>
  "borderSize" in props &&
  props.borderSize !== undefined &&
  !("borderSizeSuffix" in props)
    ? { ...props, borderSizeSuffix: "px" }
    : props;

export const withChartDefaults = pipe(
  withColorDefaults,
  withFontFamilyNormalize,
  (p) => withFontFamilyNormalize(p, "dataLabelTypography"),
  inferCustomTypographyPresets,
  inferBorderSizeSuffix
);

const chartPropertyDefinitions = {
  titleText: {
    type: "string",
    description: "Chart title text (plain text only)"
  },
  fontFamily: fontFamilyPropertyDefinition,
  chartType: {
    type: "string",
    enum: ["pie", "bar", "line"],
    description: "Chart type"
  },
  label: {
    type: "string",
    description:
      "Axis labels: use this when user says 'update label', 'change labels', or 'set labels'. Comma-separated (e.g. 'Jan, Feb, Mar'). Applied to bar or line chart automatically."
  },
  labels: {
    type: "string",
    description:
      "Same as 'label'. Axis labels for bar/line chart (comma-separated). Use label or labels."
  },
  barLabel: {
    type: "string",
    description:
      "Bar chart axis labels only. Prefer using 'label' when updating; it is resolved automatically by chart type."
  },
  lineLabel: {
    type: "string",
    description:
      "Line chart axis labels only. Prefer using 'label' when updating; it is resolved automatically by chart type."
  },
  chartPieItems: {
    type: "array",
    description:
      "Pie chart items as array of {id,title}. Updating items may require also updating per-item value/color keys.",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" }
      },
      required: ["id", "title"],
      additionalProperties: false
    }
  },
  chartBarItems: {
    type: "array",
    description:
      "Bar chart items as array of {id,title}. Values are stored in per-item *Value keys as comma-separated numbers.",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" }
      },
      required: ["id", "title"],
      additionalProperties: false
    }
  },
  chartLineItems: {
    type: "array",
    description:
      "Line chart items as array of {id,title}. Values are stored in per-item *Value keys as comma-separated numbers.",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" }
      },
      required: ["id", "title"],
      additionalProperties: false
    }
  },

  chartPieItemsGoogleValue: {
    type: "number",
    description: "Pie: value for item with id 'google'"
  },
  chartPieItemsFacebookValue: {
    type: "number",
    description: "Pie: value for item with id 'facebook'"
  },
  chartPieItemsTwitterValue: {
    type: "number",
    description: "Pie: value for item with id 'twitter'"
  },
  chartBarItemsGoogleValue: {
    type: "string",
    description:
      "Bar: values for item with id 'google' (comma+space separated, e.g. '10, 20, 30')"
  },
  chartBarItemsFacebookValue: {
    type: "string",
    description:
      "Bar: values for item with id 'facebook' (comma+space separated)"
  },
  chartBarItemsTwitterValue: {
    type: "string",
    description:
      "Bar: values for item with id 'twitter' (comma+space separated)"
  },
  chartLineItemsGoogleValue: {
    type: "string",
    description:
      "Line: values for item with id 'google' (comma+space separated)"
  },
  chartLineItemsFacebookValue: {
    type: "string",
    description:
      "Line: values for item with id 'facebook' (comma+space separated)"
  },
  chartLineItemsTwitterValue: {
    type: "string",
    description:
      "Line: values for item with id 'twitter' (comma+space separated)"
  },

  width: {
    type: "number",
    description: "Chart width (1-1200 for px, 1-100 for %)",
    minimum: 1,
    maximum: 1200
  },
  widthSuffix: {
    type: "string",
    enum: ["px", "%"],
    description: "Width unit"
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
    description:
      "Title typography preset. Set to '' (empty) for custom fontSize/fontWeight/lineHeight/letterSpacing."
  },
  fontFamilyType: {
    type: "string",
    enum: ["google", "system", "upload", "adobe"],
    description: "Title font source type"
  },
  fontSize: {
    type: "number",
    description: "Title font size (px)",
    minimum: 1,
    maximum: 200
  },
  fontSizeSuffix: {
    type: "string",
    enum: ["px", "em", "rem", "%"],
    description: "Title font size unit"
  },
  fontWeight: {
    type: "number",
    description: "Title font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  lineHeight: {
    type: "number",
    description: "Title line height",
    minimum: 0,
    maximum: 10
  },
  letterSpacing: {
    type: "number",
    description: "Title letter spacing"
  },
  titleHorizontalAlign: {
    type: "string",
    enum: ["left", "center", "right"],
    description: "Title alignment"
  },

  titleColorHex: {
    type: "string",
    description:
      "Title text color hex. Palette is auto-cleared when hex is provided."
  },
  titleColorOpacity: {
    type: "number",
    description: "Title text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  titleColorPalette: {
    type: "string",
    description:
      "Title text color palette ('color1'-'color8') or '' for custom hex."
  },
  hoverTitleColorHex: {
    type: "string",
    description: "Title text hover color hex. Palette is auto-cleared."
  },
  hoverTitleColorOpacity: {
    type: "number",
    description: "Title hover opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  hoverTitleColorPalette: {
    type: "string",
    description: "Title hover palette or '' for custom hex."
  },

  titleTextShadow: {
    type: "string",
    description: "Title text shadow preset value"
  },
  titleTextShadowBlur: {
    type: "number",
    description: "Title shadow blur radius",
    minimum: 0
  },
  titleTextShadowColorHex: {
    type: "string",
    description: "Title shadow color hex. Palette is auto-cleared."
  },
  titleTextShadowColorOpacity: {
    type: "number",
    description: "Title shadow opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  titleTextShadowColorPalette: {
    type: "string",
    description: "Title shadow palette or '' for custom hex."
  },
  titleTextShadowHorizontal: {
    type: "number",
    description: "Title shadow horizontal offset"
  },
  titleTextShadowVertical: {
    type: "number",
    description: "Title shadow vertical offset"
  },
  hoverTitleTextShadow: {
    type: "string",
    description: "Title hover text shadow preset value"
  },
  hoverTitleTextShadowBlur: {
    type: "number",
    description: "Title hover shadow blur radius",
    minimum: 0
  },
  hoverTitleTextShadowColorHex: {
    type: "string",
    description: "Title hover shadow color hex. Palette is auto-cleared."
  },
  hoverTitleTextShadowColorOpacity: {
    type: "number",
    description: "Title hover shadow opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  hoverTitleTextShadowColorPalette: {
    type: "string",
    description: "Title hover shadow palette or '' for custom hex."
  },
  hoverTitleTextShadowHorizontal: {
    type: "number",
    description: "Title hover shadow horizontal offset"
  },
  hoverTitleTextShadowVertical: {
    type: "number",
    description: "Title hover shadow vertical offset"
  },

  fill: {
    type: "string",
    enum: ["on", "off"],
    description: "Line chart fill under the line"
  },
  borderSize: {
    type: "number",
    description:
      "Border width for bar chart and line chart in px (1-15). When user asks to 'update border width' of a bar/line chart, set this property. Ignored for pie chart (for pie, use borderWidth/borderStyle/borderColorHex instead).",
    minimum: 1,
    maximum: 15
  },
  borderSizeSuffix: {
    type: "string",
    enum: ["px"],
    description:
      "Unit for borderSize (always 'px'). Set automatically when borderSize is provided."
  },

  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description:
      "Border style. When user says things like '2px solid green' on a pie chart, set borderStyle to 'solid' (or the requested style) together with borderWidth and borderColorHex."
  },
  borderWidthType: {
    type: "string",
    enum: ["grouped", "ungrouped"],
    description:
      "Border width mode. For a uniform border (e.g. '2px solid green' on a pie chart) set this to 'grouped' and use borderWidth. For per-side control use 'ungrouped' with the directional *Width properties."
  },
  borderWidth: {
    type: "number",
    description:
      "Border width (grouped). For a request like 'change border to 2px solid green' on a pie chart, set borderWidth to 2, borderWidthType to 'grouped', borderStyle to 'solid', and borderColorHex to the requested color.",
    minimum: 0,
    maximum: 50
  },
  borderTopWidth: {
    type: "number",
    description: "Border top width",
    minimum: 0,
    maximum: 50
  },
  borderRightWidth: {
    type: "number",
    description: "Border right width",
    minimum: 0,
    maximum: 50
  },
  borderBottomWidth: {
    type: "number",
    description: "Border bottom width",
    minimum: 0,
    maximum: 50
  },
  borderLeftWidth: {
    type: "number",
    description: "Border left width",
    minimum: 0,
    maximum: 50
  },
  borderColorHex: {
    type: "string",
    description:
      "Border color hex. Palette is auto-cleared. For a request like '2px solid green', convert the color to hex (e.g. '#00ff00') and set borderColorHex to that value, borderColorOpacity to 1, and borderColorPalette to ''."
  },
  borderColorOpacity: {
    type: "number",
    description:
      "Border color opacity (0-1). When explicitly setting borderColorHex from natural language (e.g. 'green'), also set borderColorOpacity to 1 unless the user requested transparency.",
    minimum: 0,
    maximum: 1
  },
  borderColorPalette: {
    type: "string",
    description:
      "Border color palette or '' for custom hex. When setting a custom borderColorHex (e.g. from 'green'), set this to ''."
  },

  bgColorHex: {
    type: "string",
    description: "Background color hex. Palette is auto-cleared."
  },
  bgColorOpacity: {
    type: "number",
    description: "Background opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  bgColorPalette: {
    type: "string",
    description: "Background palette or '' for custom hex."
  },

  className: {
    type: "string",
    description: "Extra CSS class name"
  },
  hoverTransition: {
    type: "number",
    description: "Hover transition (ms, 0-99)",
    minimum: 0,
    maximum: 99
  },
  hoverTransitionSuffix: {
    type: "string",
    description: "Hover transition unit suffix (usually 'ms')"
  },
  customCSS: {
    type: "string",
    description: "Custom CSS for this element"
  },

  chartPieItemsGoogleColorHex: {
    type: "string",
    description: "Pie item 'google' color hex. Palette auto-cleared."
  },
  chartPieItemsGoogleColorOpacity: {
    type: "number",
    description: "Pie item 'google' color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  chartPieItemsGoogleColorPalette: {
    type: "string",
    description: "Pie item 'google' palette or '' for custom hex."
  },
  chartPieItemsFacebookColorHex: {
    type: "string",
    description: "Pie item 'facebook' color hex. Palette auto-cleared."
  },
  chartPieItemsFacebookColorOpacity: {
    type: "number",
    description: "Pie item 'facebook' color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  chartPieItemsFacebookOpacity: {
    type: "number",
    description:
      "LEGACY (typo) key from defaultValue.json. Use chartPieItemsFacebookColorOpacity instead.",
    minimum: 0,
    maximum: 1
  },
  chartPieItemsFacebookColorPalette: {
    type: "string",
    description: "Pie item 'facebook' palette or '' for custom hex."
  },
  chartPieItemsTwitterColorHex: {
    type: "string",
    description: "Pie item 'twitter' color hex. Palette auto-cleared."
  },
  chartPieItemsTwitterColorOpacity: {
    type: "number",
    description: "Pie item 'twitter' color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  chartPieItemsTwitterOpacity: {
    type: "number",
    description:
      "LEGACY (typo) key from defaultValue.json. Use chartPieItemsTwitterColorOpacity instead.",
    minimum: 0,
    maximum: 1
  },
  chartPieItemsTwitterColorPalette: {
    type: "string",
    description: "Pie item 'twitter' palette or '' for custom hex."
  },

  chartBarItemsGoogleColorHex: {
    type: "string",
    description: "Bar item 'google' color hex. Palette auto-cleared."
  },
  chartBarItemsGoogleColorOpacity: {
    type: "number",
    description: "Bar item 'google' color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  chartBarItemsGoogleColorPalette: {
    type: "string",
    description: "Bar item 'google' palette or '' for custom hex."
  },
  chartBarItemsFacebookColorHex: {
    type: "string",
    description: "Bar item 'facebook' color hex. Palette auto-cleared."
  },
  chartBarItemsFacebookColorOpacity: {
    type: "number",
    description: "Bar item 'facebook' color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  chartBarItemsFacebookColorPalette: {
    type: "string",
    description: "Bar item 'facebook' palette or '' for custom hex."
  },
  chartBarItemsTwitterColorHex: {
    type: "string",
    description: "Bar item 'twitter' color hex. Palette auto-cleared."
  },
  chartBarItemsTwitterColorOpacity: {
    type: "number",
    description: "Bar item 'twitter' color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  chartBarItemsTwitterColorPalette: {
    type: "string",
    description: "Bar item 'twitter' palette or '' for custom hex."
  },

  chartLineItemsGoogleColorHex: {
    type: "string",
    description: "Line item 'google' color hex. Palette auto-cleared."
  },
  chartLineItemsGoogleColorOpacity: {
    type: "number",
    description: "Line item 'google' color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  chartLineItemsGoogleColorPalette: {
    type: "string",
    description: "Line item 'google' palette or '' for custom hex."
  },
  chartLineItemsFacebookColorHex: {
    type: "string",
    description: "Line item 'facebook' color hex. Palette auto-cleared."
  },
  chartLineItemsFacebookColorOpacity: {
    type: "number",
    description: "Line item 'facebook' color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  chartLineItemsFacebookColorPalette: {
    type: "string",
    description: "Line item 'facebook' palette or '' for custom hex."
  },
  chartLineItemsTwitterColorHex: {
    type: "string",
    description: "Line item 'twitter' color hex. Palette auto-cleared."
  },
  chartLineItemsTwitterColorOpacity: {
    type: "number",
    description: "Line item 'twitter' color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  chartLineItemsTwitterColorPalette: {
    type: "string",
    description: "Line item 'twitter' palette or '' for custom hex."
  },

  dataLabelTypographyFontStyle: {
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
    description:
      "Data labels typography preset. Set to '' (empty) for custom values."
  },
  dataLabelTypographyFontFamilyType: {
    type: "string",
    enum: ["google", "system", "upload", "adobe"],
    description: "Data labels font source type"
  },
  dataLabelTypographyFontFamily: {
    ...fontFamilyPropertyDefinition,
    description:
      "Data labels font family. Use getProjectFonts to see available fonts. (Will be normalized to builder format automatically.)"
  },
  dataLabelTypographyFontSize: {
    type: "number",
    description: "Data labels font size",
    minimum: 1,
    maximum: 200
  },
  dataLabelTypographyFontSizeSuffix: {
    type: "string",
    enum: ["px", "em", "rem", "%"],
    description: "Data labels font size unit"
  },
  dataLabelTypographyFontWeight: {
    type: "number",
    description: "Data labels font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  dataLabelTypographyLetterSpacing: {
    type: "number",
    description: "Data labels letter spacing"
  },
  dataLabelTypographyLineHeight: {
    type: "number",
    description: "Data labels line height",
    minimum: 0,
    maximum: 10
  },
  dataLabelTypographyVariableFontWeight: {
    type: "number",
    description: "Data labels variable font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  dataLabelTypographyFontWidth: {
    type: "number",
    description: "Data labels font width",
    minimum: 1,
    maximum: 1000
  },
  dataLabelTypographyFontSoftness: {
    type: "number",
    description: "Data labels font softness",
    minimum: 0,
    maximum: 100
  },
  dataLabelTypographyBold: {
    type: "boolean",
    description: "Data labels bold"
  },
  dataLabelTypographyItalic: {
    type: "boolean",
    description: "Data labels italic"
  },
  dataLabelTypographyUnderline: {
    type: "boolean",
    description: "Data labels underline"
  },
  dataLabelTypographyStrike: {
    type: "boolean",
    description: "Data labels strikethrough"
  },
  dataLabelTypographyUppercase: {
    type: "boolean",
    description: "Data labels uppercase"
  },
  dataLabelTypographyLowercase: {
    type: "boolean",
    description: "Data labels lowercase"
  },

  families: {
    type: "object",
    description:
      "Typography families (font faces). Supports {fontFamily, dataLabelTypographyFontFamily}.",
    properties: {
      fontFamily: { type: "string" },
      dataLabelTypographyFontFamily: { type: "string" }
    },
    additionalProperties: false
  }
} as const;

export const addChartDefinition: ToolDefinition = {
  name: "addChart",
  strict: true,
  description:
    "Add a Chart element to an EXISTING Section or Column. Supports pie, bar, and line charts. Bar/line border width is set via borderSize (1-15 px). For new sections use generateBlock.",
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
      ...chartPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateChartDefinition: ToolDefinition = {
  name: "updateChart",
  strict: true,
  description:
    "Update a Chart element. Use searchElements({type:'Chart'}) to find elementId. To update axis labels (when user says 'update label', 'change labels', 'set labels'): pass the label parameter with comma-separated values (e.g. label: 'Jan, Feb, Mar'). It is applied to bar or line chart automatically. For border width use borderSize (1-15).",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Chart element to update"
      },
      ...chartPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

type ChartType = "pie" | "bar" | "line";

function resolveAxisLabelChanges(
  chartType: ChartType | undefined,
  labelValue: unknown
): Record<string, unknown> {
  if (typeof labelValue !== "string") return {};

  if (chartType === "bar") return { barLabel: labelValue };
  if (chartType === "line") return { lineLabel: labelValue };

  // If chartType is unknown or pie, keep both labels in sync so switching type later still has labels.
  return { barLabel: labelValue, lineLabel: labelValue };
}

function resolveFamiliesChanges(parsed: Record<string, unknown>): {
  families?: Record<string, unknown>;
} {
  const nextFamilies: Record<string, unknown> = {};

  if (typeof parsed.fontFamily === "string") {
    nextFamilies.fontFamily = parsed.fontFamily;
  }

  if (typeof parsed.dataLabelTypographyFontFamily === "string") {
    nextFamilies.dataLabelTypographyFontFamily = parsed.dataLabelTypographyFontFamily;
  }

  return Object.keys(nextFamilies).length > 0 ? { families: nextFamilies } : {};
}

function inferChartTypeForUpdate(
  deps: HandlerDeps,
  elementId: string,
  explicitChartType?: unknown
): ChartType | undefined {
  if (
    explicitChartType === "pie" ||
    explicitChartType === "bar" ||
    explicitChartType === "line"
  ) {
    return explicitChartType;
  }

  const details = deps.pageRepository.getElementById(elementId);
  if (!details.success) return undefined;

  const value = details.data?.value ?? {};
  const t = (value as Record<string, unknown>).chartType;
  return t === "pie" || t === "bar" || t === "line" ? t : undefined;
}

export const addChartConfig: AddToolConfig = {
  kind: "add",
  definition: addChartDefinition,
  elementType: ElementTypes.Chart,
  schema: chartPropsSchema,
  defaults: withChartDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addChart input %o", args);
    const { containerId, insertIndex, ...rawProps } = args;

    const propsWithDefaults = withChartDefaults(rawProps);
    const parsed = chartPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const labelValue = parsed.data.label ?? parsed.data.labels;
    const labelChanges = resolveAxisLabelChanges(
      parsed.data.chartType as ChartType | undefined,
      labelValue
    );

    const familiesChanges = resolveFamiliesChanges(parsed.data);

    const initialProperties = {
      ...parsed.data,
      ...labelChanges,
      ...familiesChanges
    };

    // Avoid storing the alias keys (label/labels) on the element.
    delete (initialProperties as Record<string, unknown>).label;
    delete (initialProperties as Record<string, unknown>).labels;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.Chart,
      insertIndex: insertIndex as number | undefined,
      initialProperties
    });

    log.tools("addChart output %o", result);
    return result;
  }
};

export const updateChartConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateChartDefinition,
  elementType: ElementTypes.Chart,
  schema: chartPropsSchema,
  defaults: withChartDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateChart input %o", args);
    const { elementId, ...rawProps } = args;

    const propsWithDefaults = withChartDefaults(rawProps);
    const parsed = chartPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const chartType = inferChartTypeForUpdate(
      deps,
      elementId as string,
      parsed.data.chartType
    );
    const labelValue = parsed.data.label ?? parsed.data.labels;
    const labelChanges = resolveAxisLabelChanges(chartType, labelValue);

    const familiesChanges = resolveFamiliesChanges(parsed.data);

    const changes = {
      ...parsed.data,
      ...labelChanges,
      ...familiesChanges
    };

    delete (changes as Record<string, unknown>).label;
    delete (changes as Record<string, unknown>).labels;

    const result = deps.pageRepository.updateElement({
      elementId: elementId as string,
      elementType: ElementTypes.Chart,
      changes
    });

    log.tools("updateChart output %o", result);
    return result;
  }
};
