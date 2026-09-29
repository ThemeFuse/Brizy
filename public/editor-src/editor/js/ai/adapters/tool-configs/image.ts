import { imagePropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import { inferBorderRadiusType, withColorDefaults } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

type Props = Record<string, unknown>;
// custom width/height requires sizeType:"custom" to take effect
const inferCustomSizeType = <T extends Props>(props: T): T =>
  !("sizeType" in props) &&
  (("width" in props && props.width !== undefined) ||
    ("height" in props && props.height !== undefined))
    ? { ...props, sizeType: "custom" }
    : props;
// boxShadow properties require boxShadow:"on" to render
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
// borderWidth requires borderStyle to be set
const inferBorderStyle = <T extends Props>(props: T): T =>
  "borderWidth" in props &&
  props.borderWidth !== undefined &&
  !("borderStyle" in props)
    ? { ...props, borderStyle: "solid" }
    : props;
// imageType: "external" is required for external URLs to work
const inferExternalImageType = <T extends Props>(props: T): T =>
  "imageSrc" in props && props.imageSrc !== undefined
    ? { ...props, imageType: "external" }
    : props;
export const withImageDefaults = pipe(
  withColorDefaults,
  inferBorderRadiusType,
  inferCustomSizeType,
  inferBoxShadowOn,
  inferBorderStyle,
  inferExternalImageType
);
export const addImageConfig: AddToolConfig = {
  kind: "add",
  alias: "addImage",
  elementType: ElementTypes.Image,
  schema: imagePropsSchema,
  defaults: withImageDefaults
};
export const updateImageConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateImage",
  elementType: ElementTypes.Image,
  schema: imagePropsSchema,
  defaults: withImageDefaults
};
