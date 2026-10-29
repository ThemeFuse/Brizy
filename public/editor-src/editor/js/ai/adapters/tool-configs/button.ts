import {
  buttonPropsSchema,
  containerIdSchema,
  elementIdSchema,
  inferDeviceStoredFlags,
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
// borderRadius requires borderRadiusType:"custom" to render
const inferBorderRadiusType = <T extends Props>(props: T): T =>
  "borderRadius" in props &&
  props.borderRadius !== undefined &&
  !("borderRadiusType" in props)
    ? { ...props, borderRadiusType: "custom" }
    : props;
// custom padding requires size:"custom" to take effect
const inferCustomSize = <T extends Props>(props: T): T =>
  !("size" in props) &&
  (("paddingTop" in props && props.paddingTop !== undefined) ||
    ("paddingRight" in props && props.paddingRight !== undefined) ||
    ("paddingBottom" in props && props.paddingBottom !== undefined) ||
    ("paddingLeft" in props && props.paddingLeft !== undefined))
    ? { ...props, size: "custom" }
    : props;
// custom typography (fontSize, fontWeight, etc.) requires fontStyle:"" to override preset
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
const inferFillType = <T extends Props>(props: T): T =>
  !("fillType" in props) &&
  ((typeof props.bgColorHex === "string" && props.bgColorHex !== "") ||
    (typeof props.bgColorPalette === "string" && props.bgColorPalette !== ""))
    ? { ...props, fillType: "filled" }
    : props;
export const withButtonDefaults = pipe(
  withColorDefaults,
  withFontFamilyNormalize,
  inferBorderRadiusType,
  inferCustomSize,
  inferCustomFontStyle,
  inferFillType
);
export const addButtonConfig: AddToolConfig = {
  kind: "add",
  alias: "addButton",
  elementType: ElementTypes.Button,
  schema: buttonPropsSchema,
  defaults: withButtonDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addButton input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const containerIdParsed = containerIdSchema.safeParse(containerId);
    if (!containerIdParsed.success) {
      return { success: false, error: containerIdParsed.error.message };
    }

    const insertIndexParsed = insertIndexSchema.safeParse(insertIndex);
    if (!insertIndexParsed.success) {
      return { success: false, error: insertIndexParsed.error.message };
    }

    const propsWithDefaults = withButtonDefaults(props);
    const parsed = buttonPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.Button,
      insertIndex: insertIndexParsed.data,
      initialProperties: parsed.data
    });
    log.tools("addButton output %o", result);
    return result;
  }
};
export const updateButtonConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateButton",
  elementType: ElementTypes.Button,
  schema: buttonPropsSchema,
  defaults: withButtonDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateButton input %o", args);
    const { elementId, ...props } = args;

    const elementIdParsed = elementIdSchema.safeParse(elementId);
    if (!elementIdParsed.success) {
      return { success: false, error: elementIdParsed.error.message };
    }

    // This handler keeps its own desktop inference, so the shared flag pass
    // never runs here; the tablet and mobile half of it still has to.
    const propsWithDefaults = withButtonDefaults(
      inferDeviceStoredFlags(buttonPropsSchema, props)
    );
    const parsed = buttonPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.updateElement({
      elementId: elementIdParsed.data,
      elementType: ElementTypes.Button,
      changes: parsed.data
    });
    log.tools("updateButton output %o", result);
    return result;
  }
};
