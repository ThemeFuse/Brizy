import {
  animatedHeadlinePropsSchema,
  containerIdSchema,
  elementIdSchema,
  insertIndexSchema
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
// Static text: custom typography requires staticFontStyle:""
const STATIC_TYPOGRAPHY_KEYS = [
  "staticFontSize",
  "staticFontWeight",
  "staticLineHeight",
  "staticLetterSpacing"
];
const inferStaticFontStyle = <T extends Props>(props: T): T =>
  !("staticFontStyle" in props) &&
  STATIC_TYPOGRAPHY_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, staticFontStyle: "" }
    : props;
// Animated text: custom typography requires animatedFontStyle:""
const ANIMATED_TYPOGRAPHY_KEYS = [
  "animatedFontSize",
  "animatedFontWeight",
  "animatedLineHeight",
  "animatedLetterSpacing"
];
const inferAnimatedFontStyle = <T extends Props>(props: T): T =>
  !("animatedFontStyle" in props) &&
  ANIMATED_TYPOGRAPHY_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, animatedFontStyle: "" }
    : props;
const withStaticFontFamily = <T extends Props>(props: T): T =>
  withFontFamilyNormalize(props, "static");
const withAnimatedFontFamily = <T extends Props>(props: T): T =>
  withFontFamilyNormalize(props, "animated");
export const withAnimatedHeadlineDefaults = pipe(
  withColorDefaults,
  withStaticFontFamily,
  withAnimatedFontFamily,
  inferStaticFontStyle,
  inferAnimatedFontStyle
);
export const addAnimatedHeadlineConfig: AddToolConfig = {
  kind: "add",
  alias: "addAnimatedHeadline",
  elementType: ElementTypes.AnimatedHeadline,
  schema: animatedHeadlinePropsSchema,
  defaults: withAnimatedHeadlineDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addAnimatedHeadline input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const containerIdParsed = containerIdSchema.safeParse(containerId);
    if (!containerIdParsed.success) {
      return { success: false, error: containerIdParsed.error.message };
    }

    const insertIndexParsed = insertIndexSchema.safeParse(insertIndex);
    if (!insertIndexParsed.success) {
      return { success: false, error: insertIndexParsed.error.message };
    }

    const propsWithDefaults = withAnimatedHeadlineDefaults(props);
    const parsed = animatedHeadlinePropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.AnimatedHeadline,
      insertIndex: insertIndexParsed.data,
      initialProperties: parsed.data
    });
    log.tools("addAnimatedHeadline output %o", result);
    return result;
  }
};
export const updateAnimatedHeadlineConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateAnimatedHeadline",
  elementType: ElementTypes.AnimatedHeadline,
  schema: animatedHeadlinePropsSchema,
  defaults: withAnimatedHeadlineDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateAnimatedHeadline input %o", args);
    const { elementId, ...props } = args;

    const elementIdParsed = elementIdSchema.safeParse(elementId);
    if (!elementIdParsed.success) {
      return { success: false, error: elementIdParsed.error.message };
    }

    const propsWithDefaults = withAnimatedHeadlineDefaults(props);
    const parsed = animatedHeadlinePropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.updateElement({
      elementId: elementIdParsed.data,
      elementType: ElementTypes.AnimatedHeadline,
      changes: parsed.data
    });
    log.tools("updateAnimatedHeadline output %o", result);
    return result;
  }
};
