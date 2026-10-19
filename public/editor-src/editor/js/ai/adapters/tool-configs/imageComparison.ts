import { imageComparisonPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import { withColorDefaults } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

type Props = Record<string, unknown>;
const BORDER_RADIUS_KEYS = [
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius"
];
const inferBorderRadiusType = <T extends Props>(props: T): T =>
  !("borderRadiusType" in props) &&
  BORDER_RADIUS_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, borderRadiusType: "custom" }
    : props;
const inferCustomSizeType = <T extends Props>(props: T): T =>
  !("sizeType" in props) &&
  (("width" in props && props.width !== undefined) ||
    ("height" in props && props.height !== undefined))
    ? { ...props, sizeType: "custom" }
    : props;
const BOX_SHADOW_KEYS = [
  "boxShadowColorHex",
  "boxShadowColorOpacity",
  "boxShadowBlur",
  "boxShadowSpread",
  "boxShadowVertical",
  "boxShadowHorizontal"
];
const inferBoxShadowOn = <T extends Props>(props: T): T =>
  !("boxShadow" in props) &&
  BOX_SHADOW_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, boxShadow: "on" }
    : props;
const PER_SIDE_BORDER_WIDTH_KEYS = [
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth"
];
const inferBorderWidthType = <T extends Props>(props: T): T =>
  !("borderWidthType" in props) &&
  PER_SIDE_BORDER_WIDTH_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, borderWidthType: "ungrouped" }
    : props;
const inferBorderStyle = <T extends Props>(props: T): T => {
  if ("borderStyle" in props) return props;
  const hasBorderWidth =
    ("borderWidth" in props && props.borderWidth !== undefined) ||
    PER_SIDE_BORDER_WIDTH_KEYS.some(
      (k) => k in props && props[k] !== undefined
    );
  return hasBorderWidth ? { ...props, borderStyle: "solid" } : props;
};
const inferExternalImageType = <T extends Props>(props: T): T =>
  ("imageSrc" in props && props.imageSrc !== undefined) ||
  ("hoverImageSrc" in props && props.hoverImageSrc !== undefined)
    ? { ...props, imageType: "external" }
    : props;
export const withImageComparisonDefaults = pipe(
  withColorDefaults,
  inferBorderRadiusType,
  inferCustomSizeType,
  inferBoxShadowOn,
  inferBorderWidthType,
  inferBorderStyle,
  inferExternalImageType
);
export const addImageComparisonConfig: AddToolConfig = {
  kind: "add",
  alias: "addImageComparison",
  elementType: ElementTypes.ImageComparison,
  schema: imageComparisonPropsSchema,
  defaults: withImageComparisonDefaults
};
export const updateImageComparisonConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateImageComparison",
  elementType: ElementTypes.ImageComparison,
  schema: imageComparisonPropsSchema,
  defaults: withImageComparisonDefaults
};
