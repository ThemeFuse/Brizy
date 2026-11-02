import {
  containerIdSchema,
  elementIdSchema,
  insertIndexSchema,
  richTextPropsSchema,
  textUpdateSchema
} from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import { log } from "../../utils/logger";
import {
  validateFonts,
  withColorDefaults,
  withFontFamilyNormalize
} from "../prop-defaults";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "../types";

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
export const addTextConfig: AddToolConfig = {
  kind: "add",
  alias: "addText",
  elementType: ElementTypes.RichText,
  schema: richTextPropsSchema,
  defaults: withTextDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addText input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const containerIdParsed = containerIdSchema.safeParse(containerId);
    if (!containerIdParsed.success) {
      return { success: false, error: containerIdParsed.error.message };
    }

    const insertIndexParsed = insertIndexSchema.safeParse(insertIndex);
    if (!insertIndexParsed.success) {
      return { success: false, error: insertIndexParsed.error.message };
    }

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
      insertIndex: insertIndexParsed.data
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
  alias: "updateText",
  elementType: ElementTypes.RichText,
  schema: textUpdateSchema,
  defaults: withTextDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateText input %o", args);
    const { elementId, ...props } = args;

    const elementIdParsed = elementIdSchema.safeParse(elementId);
    if (!elementIdParsed.success) {
      return { success: false, error: elementIdParsed.error.message };
    }

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
      elementId: elementIdParsed.data,
      ...parsed.data
    });
    log.tools("updateText output %o", result);
    return result;
  }
};
