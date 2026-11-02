import { iconPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import { withColorDefaults } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

type Props = Record<string, unknown>;
// borderRadius requires borderRadiusType:"custom" to render
const inferBorderRadiusType = <T extends Props>(props: T): T =>
  "borderRadius" in props &&
  props.borderRadius !== undefined &&
  !("borderRadiusType" in props)
    ? { ...props, borderRadiusType: "custom" }
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
// customSize requires size:"custom" to take effect
const inferCustomSize = <T extends Props>(props: T): T =>
  "customSize" in props && props.customSize !== undefined && !("size" in props)
    ? { ...props, size: "custom" }
    : props;
export const withIconDefaults = pipe(
  withColorDefaults,
  inferBorderRadiusType,
  inferBoxShadowOn,
  inferBorderStyle,
  inferCustomSize
);
export const addIconConfig: AddToolConfig = {
  kind: "add",
  alias: "addIcon",
  elementType: ElementTypes.Icon,
  schema: iconPropsSchema,
  defaults: withIconDefaults
};
export const updateIconConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateIcon",
  elementType: ElementTypes.Icon,
  schema: iconPropsSchema,
  defaults: withIconDefaults
};
