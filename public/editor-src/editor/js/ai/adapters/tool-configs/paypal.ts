import {
  containerIdSchema,
  elementIdSchema,
  insertIndexSchema,
  paypalPropsSchema
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
const inferBorderWidthType = <T extends Props>(props: T): T => {
  const hasUngrouped =
    ("borderTopWidth" in props && props.borderTopWidth !== undefined) ||
    ("borderRightWidth" in props && props.borderRightWidth !== undefined) ||
    ("borderBottomWidth" in props && props.borderBottomWidth !== undefined) ||
    ("borderLeftWidth" in props && props.borderLeftWidth !== undefined);

  if (hasUngrouped && !("borderWidthType" in props)) {
    return { ...props, borderWidthType: "ungrouped" };
  }
  if (
    "borderWidth" in props &&
    props.borderWidth !== undefined &&
    !("borderWidthType" in props)
  ) {
    return { ...props, borderWidthType: "grouped" };
  }
  return props;
};
const inferBorderStyle = <T extends Props>(props: T): T => {
  const hasBorderWidth =
    ("borderWidth" in props && props.borderWidth !== undefined) ||
    ("borderTopWidth" in props && props.borderTopWidth !== undefined) ||
    ("borderRightWidth" in props && props.borderRightWidth !== undefined) ||
    ("borderBottomWidth" in props && props.borderBottomWidth !== undefined) ||
    ("borderLeftWidth" in props && props.borderLeftWidth !== undefined);

  const hasBorderColor =
    ("borderColorHex" in props && props.borderColorHex !== undefined) ||
    ("borderColorPalette" in props && props.borderColorPalette !== undefined);

  // If border is being configured but style isn't specified, default to solid.
  return (hasBorderWidth || hasBorderColor) && !("borderStyle" in props)
    ? { ...props, borderStyle: "solid" }
    : props;
};
const inferBorderRadiusType = <T extends Props>(props: T): T => {
  const hasUngrouped =
    ("borderTopLeftRadius" in props &&
      props.borderTopLeftRadius !== undefined) ||
    ("borderTopRightRadius" in props &&
      props.borderTopRightRadius !== undefined) ||
    ("borderBottomRightRadius" in props &&
      props.borderBottomRightRadius !== undefined) ||
    ("borderBottomLeftRadius" in props &&
      props.borderBottomLeftRadius !== undefined);

  if (hasUngrouped && !("borderRadiusType" in props)) {
    return { ...props, borderRadiusType: "ungrouped" };
  }
  if (
    "borderRadius" in props &&
    props.borderRadius !== undefined &&
    !("borderRadiusType" in props)
  ) {
    return { ...props, borderRadiusType: "grouped" };
  }
  return props;
};
const inferBoxShadowEnabled = <T extends Props>(props: T): T => {
  const hasBoxShadowFields = [
    "boxShadowColorHex",
    "boxShadowColorOpacity",
    "boxShadowColorPalette",
    "boxShadowBlur",
    "boxShadowSpread",
    "boxShadowVertical",
    "boxShadowHorizontal"
  ].some((k) => k in props && props[k] !== undefined);

  return hasBoxShadowFields && !("boxShadow" in props)
    ? { ...props, boxShadow: "on" }
    : props;
};
const inferPaddingType = <T extends Props>(props: T): T => {
  const hasUngrouped =
    ("paddingTop" in props && props.paddingTop !== undefined) ||
    ("paddingRight" in props && props.paddingRight !== undefined) ||
    ("paddingBottom" in props && props.paddingBottom !== undefined) ||
    ("paddingLeft" in props && props.paddingLeft !== undefined);

  if (hasUngrouped && !("paddingType" in props)) {
    return { ...props, paddingType: "ungrouped" };
  }
  if (
    "padding" in props &&
    props.padding !== undefined &&
    !("paddingType" in props)
  ) {
    return { ...props, paddingType: "grouped" };
  }
  return props;
};
const inferSizeSuffixes = <T extends Props>(props: T): T => {
  const next = { ...props } as Record<string, unknown>;

  if ("width" in next && next.width !== undefined && !("widthSuffix" in next)) {
    next.widthSuffix = "px";
  }
  if (
    "height" in next &&
    next.height !== undefined &&
    !("heightSuffix" in next)
  ) {
    next.heightSuffix = "px";
  }
  if (
    (("padding" in next && next.padding !== undefined) ||
      ("paddingTop" in next && next.paddingTop !== undefined) ||
      ("paddingRight" in next && next.paddingRight !== undefined) ||
      ("paddingBottom" in next && next.paddingBottom !== undefined) ||
      ("paddingLeft" in next && next.paddingLeft !== undefined)) &&
    !("paddingSuffix" in next)
  ) {
    next.paddingSuffix = "px";
    next.paddingTopSuffix ??= "px";
    next.paddingRightSuffix ??= "px";
    next.paddingBottomSuffix ??= "px";
    next.paddingLeftSuffix ??= "px";
  }

  return next as T;
};
/** Border/boxShadow/color are applied only on :hover in Paypal; style2 reads hover* keys. */
const mirrorBorderToHover = <T extends Props>(props: T): T => {
  const borderToHover: Array<[string, string]> = [
    ["borderStyle", "hoverBorderStyle"],
    ["borderWidthType", "hoverBorderWidthType"],
    ["borderWidth", "hoverBorderWidth"],
    ["borderTopWidth", "hoverBorderTopWidth"],
    ["borderRightWidth", "hoverBorderRightWidth"],
    ["borderBottomWidth", "hoverBorderBottomWidth"],
    ["borderLeftWidth", "hoverBorderLeftWidth"],
    ["borderColorHex", "hoverBorderColorHex"],
    ["borderColorOpacity", "hoverBorderColorOpacity"],
    ["borderColorPalette", "hoverBorderColorPalette"]
  ];
  let next = props as Record<string, unknown>;
  for (const [borderKey, hoverKey] of borderToHover) {
    if (
      borderKey in next &&
      next[borderKey] !== undefined &&
      !(hoverKey in next)
    ) {
      next = { ...next, [hoverKey]: next[borderKey] };
    }
  }
  return next as T;
};
/** When border color is set, ensure opacity is visible (default is 0 in Paypal). */
const inferBorderColorOpacity = <T extends Props>(props: T): T => {
  const hasBorderColor =
    ("borderColorHex" in props && props.borderColorHex !== undefined) ||
    ("borderColorPalette" in props && props.borderColorPalette !== undefined);
  if (hasBorderColor && !("borderColorOpacity" in props)) {
    return { ...props, borderColorOpacity: 1 };
  }
  return props;
};
const withTypographyFontFamily = <T extends Props>(props: T): T =>
  withFontFamilyNormalize(props, "typography");
export const withPaypalDefaults = pipe(
  withColorDefaults,
  withTypographyFontFamily,
  inferBorderWidthType,
  inferBorderStyle,
  inferBorderColorOpacity,
  inferBorderRadiusType,
  inferBoxShadowEnabled,
  inferPaddingType,
  inferSizeSuffixes,
  mirrorBorderToHover
);
export const addPaypalConfig: AddToolConfig = {
  kind: "add",
  alias: "addPaypal",
  elementType: ElementTypes.Paypal,
  schema: paypalPropsSchema,
  defaults: withPaypalDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addPaypal input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const containerIdParsed = containerIdSchema.safeParse(containerId);
    if (!containerIdParsed.success) {
      return { success: false, error: containerIdParsed.error.message };
    }

    const insertIndexParsed = insertIndexSchema.safeParse(insertIndex);
    if (!insertIndexParsed.success) {
      return { success: false, error: insertIndexParsed.error.message };
    }

    const propsWithDefaults = withPaypalDefaults(props);
    const parsed = paypalPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.Paypal,
      insertIndex: insertIndexParsed.data,
      initialProperties: parsed.data
    });
    log.tools("addPaypal output %o", result);
    return result;
  }
};
export const updatePaypalConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updatePaypal",
  elementType: ElementTypes.Paypal,
  schema: paypalPropsSchema,
  defaults: withPaypalDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updatePaypal input %o", args);
    const { elementId, ...props } = args;

    const elementIdParsed = elementIdSchema.safeParse(elementId);
    if (!elementIdParsed.success) {
      return { success: false, error: elementIdParsed.error.message };
    }

    const propsWithDefaults = withPaypalDefaults(props);
    const parsed = paypalPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.updateElement({
      elementId: elementIdParsed.data,
      elementType: ElementTypes.Paypal,
      changes: parsed.data
    });
    log.tools("updatePaypal output %o", result);
    return result;
  }
};
