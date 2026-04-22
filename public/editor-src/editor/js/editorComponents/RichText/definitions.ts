import { omit } from "es-toolkit/compat";
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
  fontFamilyTypeEnum,
  fontFamilyTypePropertyDefinition,
  fontStyleEnum,
  hexColor,
  opacity,
  plainText,
  textAlignEnum
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

export const richTextPropsSchema = z.object({
  // content - plain text, handler wraps in Brizy HTML
  text: z.string().optional(),
  colorHex: hexColor,
  colorPalette: colorPalette,
  colorOpacity: opacity,
  // Typography
  fontFamily: fontFamilySchema,
  fontFamilyType: fontFamilyTypeEnum.optional(),
  fontStyle: z.union([z.literal(""), fontStyleEnum]).optional(),
  // Custom typography — requires fontStyle:"" to override preset (auto-cleared)
  fontSize: z.number().min(8).max(200).optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  lineHeight: z.number().min(0.5).max(5).optional(),
  textAlign: textAlignEnum.optional()
});

export type RichTextProps = z.infer<typeof richTextPropsSchema>;

export const textUpdateSchema = z.object({
  // Text replacement
  findText: plainText.optional(),
  replaceWith: plainText.optional(),

  // Color
  colorHex: hexColor,
  colorOpacity: opacity,

  // Typography
  fontFamily: fontFamilySchema,
  fontFamilyType: fontFamilyTypeEnum.optional(),
  fontStyle: z.union([z.literal(""), fontStyleEnum]).optional(),

  // Custom typography — requires fontStyle:"" to override preset (auto-cleared)
  fontSize: z.number().min(8).max(200).optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  lineHeight: z.number().min(0.5).max(5).optional(),
  textAlign: textAlignEnum.optional()
});

export type TextUpdateProps = z.infer<typeof textUpdateSchema>;

type Props = Record<string, unknown>;

const CUSTOM_TYPOGRAPHY_KEYS = [
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing"
];

const inferCustomFontStyle = <T extends Props>(props: T): T =>
  !("fontStyle" in props) &&
  CUSTOM_TYPOGRAPHY_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, fontStyle: "" }
    : props;

export const withTextDefaults = pipe(
  withColorDefaults,
  withFontFamilyNormalize,
  inferCustomFontStyle
);

const textPropertyDefinitions = {
  text: {
    type: "string",
    description:
      "Plain text content. NO HTML tags — styling is handled automatically."
  },
  colorHex: {
    type: "string",
    description:
      "Text color in hex (e.g., '#FF69B4'). Use this for colors, NOT HTML spans."
  },
  colorOpacity: {
    type: "number",
    description: "Text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  fontFamily: fontFamilyPropertyDefinition,
  fontFamilyType: fontFamilyTypePropertyDefinition,
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
      "Typography preset. When set, overrides fontSize/fontWeight/lineHeight. Set to '' (empty) to use custom values. Auto-cleared when custom typography values are provided."
  },
  fontSize: {
    type: "number",
    description:
      "Font size in pixels. Requires fontStyle to be '' (auto-cleared if not set).",
    minimum: 8,
    maximum: 200
  },
  fontWeight: {
    type: "number",
    description:
      "Font weight (100-900). Requires fontStyle to be '' (auto-cleared if not set).",
    minimum: 100,
    maximum: 900
  },
  lineHeight: {
    type: "number",
    description:
      "Line height multiplier (e.g., 1.5). Requires fontStyle to be '' (auto-cleared if not set).",
    minimum: 0.5,
    maximum: 5
  },
  textAlign: {
    type: "string",
    enum: ["left", "center", "right", "justify"],
    description: "Text alignment"
  }
} as const;

export const addTextDefinition: ToolDefinition = {
  name: "addText",
  strict: true,
  description:
    "Add Text to an EXISTING Section. Send plain text only, NO HTML. Use fontStyle for typography presets (heading1, paragraph, etc.) or individual properties (fontSize, fontWeight) for custom values. For new sections use generateBlock.",
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
      ...textPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateTextDefinition: ToolDefinition = {
  name: "updateText",
  strict: true,
  description:
    "Update a Text/RichText element. IMPORTANT: Send plain text only, NO HTML. Use fontStyle for predefined typography presets (heading1, paragraph, etc.) or individual properties (fontSize, fontWeight) for custom values. Use searchElements to find element IDs first.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the text element to update"
      },
      findText: {
        type: "string",
        description:
          "Plain text to find (use with replaceWith). If omitted, replaceWith replaces ALL text."
      },
      replaceWith: {
        type: "string",
        description:
          "Plain text replacement. NO HTML - use colorHex/fontStyle/fontSize for styling."
      },
      ...omit(textPropertyDefinitions, "text")
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addTextConfig: AddToolConfig = {
  kind: "add",
  definition: addTextDefinition,
  elementType: ElementTypes.RichText,
  schema: richTextPropsSchema,
  defaults: withTextDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addText input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const propsWithDefaults = withTextDefaults(props);
    const parsed = richTextPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    // RichText doesn't support initialProperties — all props must be
    // applied via updateRichText after element creation
    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.RichText,
      insertIndex: insertIndex as number | undefined
    });

    // Apply text content and styling via updateRichText
    if (result.success && result.data?.childElementId) {
      const { text, colorPalette: _colorPalette, ...styleProps } = parsed.data;

      const updateProps: Record<string, unknown> = {};

      // Set text content via replaceWith
      if (text) {
        updateProps.replaceWith = text;
      }

      // Add color and typography props (colorHex, colorOpacity, fontStyle, etc.)
      for (const [key, value] of Object.entries(styleProps)) {
        if (value !== undefined) {
          updateProps[key] = value;
        }
      }

      if (Object.keys(updateProps).length > 0) {
        deps.pageRepository.updateRichText({
          elementId: result.data.childElementId,
          ...updateProps
        });
      }
    }

    log.tools("addText output %o", result);
    return result;
  }
};

export const updateTextConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateTextDefinition,
  elementType: ElementTypes.RichText,
  schema: textUpdateSchema,
  defaults: withTextDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateText input %o", args);
    const { elementId, ...props } = args;

    const propsWithDefaults = withTextDefaults(props);
    const parsed = textUpdateSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    // RichText uses QuillJS and requires special handling
    // LLM sends plain text (findText/replaceWith), not HTML
    // fontStyle applies predefined typography presets
    const result = deps.pageRepository.updateRichText({
      elementId: elementId as string,
      ...parsed.data
    });
    log.tools("updateText output %o", result);
    return result;
  }
};
