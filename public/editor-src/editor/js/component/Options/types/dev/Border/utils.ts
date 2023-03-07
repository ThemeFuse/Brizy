import { capByPrefix } from "visual/utils/string";
import { _apply, set } from "visual/utils/model";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Width from "./entities/width";
import * as Style from "./entities/style";
import { getStyle, setStyle, setOpacity } from "./model";
import { toggleColor } from "visual/component/Options/types/dev/ColorPicker/utils";
import { mApply } from "visual/utils/value";
import * as BorderStyle from "visual/component/Options/types/dev/Border/entities/style";
import { t } from "visual/utils/i18n";
import { Value } from "./entities/Value";
import * as ColorUtils from "visual/component/Options/types/dev/ColorPicker/utils";
import { StyleObject } from "visual/component/Controls/Border";
import { isEmptyWidth } from "./converters";

const widthTemp = (k: string): string => capByPrefix("temp", k);

const isFlat = (m: Value): boolean =>
  [m.topWidth, m.rightWidth, m.bottomWidth, m.leftWidth].every(
    (v, _, vs) => v === vs[0]
  );

export interface WithWidth {
  width: Width.Width;
  tempWidth: Width.Width;
  topWidth: Width.Width;
  tempTopWidth: Width.Width;
  rightWidth: Width.Width;
  tempRightWidth: Width.Width;
  bottomWidth: Width.Width;
  tempBottomWidth: Width.Width;
  leftWidth: Width.Width;
  tempLeftWidth: Width.Width;
}
export const _getWidth = <V extends WithWidth>(
  key: keyof WithWidth,
  m: V
): Width.Width => m[key];

/**
 * Disable or enable border style value.
 *  - On enable, if value is empty, it takes the temp value
 *  - On disable, value is set to empty
 *  - On disable, if value is not empty, temp takes current value
 *
 * @param {boolean} enable
 * @param {Border} m
 * @return {Border}
 */
export const toggleStyle = (enable: boolean, m: Value): Value => {
  const style = enable
    ? mApply(Style.noEmpty, getStyle(m)) ?? Style.read(m?.tempStyle)
    : Style.empty;
  return _apply([[setStyle, style]], m);
};

/**
 * An general function predefined to get border width
 *
 * @param {string} key
 * @param {number} v
 * @param {Border} m
 * @return {Border}
 * @private
 */
export const _setWidthEdge = (
  key: Exclude<keyof WithWidth, "width" | "tempWidth">,
  v: Width.Width,
  m: Value
): Value => {
  if (_getWidth(key, m) === v) {
    return m;
  }

  const flatten = ([
    "topWidth",
    "rightWidth",
    "bottomWidth",
    "leftWidth"
  ] as (keyof WithWidth)[]).reduce((m, k) => {
    const value = _getWidth(k, m) ?? Width.empty;
    return set(capByPrefix("temp", k) as keyof WithWidth, value, m);
  }, m);

  const tk = widthTemp(key) as keyof WithWidth;

  const model = _apply(
    [
      [set, capByPrefix("temp", key), v],
      [set, key, v],
      [(_m: Value): Value => set(tk, isFlat(_m) ? m[key] : _m[key], _m)],
      [(m: Value): Value => (v > 0 && isFlat(m) ? set("width", v, m) : m)]
    ],
    flatten
  );
  const enable = !isEmptyWidth(model);

  return _apply(
    [
      [toggleStyle, enable],
      [toggleColor, enable]
    ],
    model
  );
};

/**
 * Disable or enable border width values.
 *  - On enable, if value is empty, it takes the temp value
 *  - On disable, value is set to empty
 *  - On disable, if value is not empty, temp takes current value
 *
 * @param {boolean} enable
 * @param {Border} m
 * @return {Border}
 */
export const toggleWidth = (enable: boolean, m: Value): Value => {
  return ([
    "width",
    "topWidth",
    "rightWidth",
    "bottomWidth",
    "leftWidth"
  ] as Array<keyof WithWidth>).reduce((m, k) => {
    const t = capByPrefix("temp", k) as keyof WithWidth;
    const w = _getWidth(k, m);
    const tW = _getWidth(t, m);

    return _apply(
      [
        [set, t, !enable && w !== Width.empty ? w : undefined],
        [set, k, enable ? Width.append(w, tW) : Width.empty]
      ],
      m
    );
  }, m);
};

/**
 * @param {BorderStyle} style
 *
 * @return {{
 *  id: BorderStyle,
 *  icon?: string,
 *  title?: string
 *  }}
 */
export const getStyleObject = (style: Style.Style): StyleObject => {
  switch (style) {
    case "none":
      return { id: BorderStyle.NONE, title: t("None") };
    case "solid":
      return { id: BorderStyle.SOLID, icon: "nc-solid" };
    case "dashed":
      return { id: BorderStyle.DASHED, icon: "nc-dashed" };
    case "dotted":
      return { id: BorderStyle.DOTTED, icon: "nc-dotted" };
    case "double":
      return { id: BorderStyle.DOUBLE, icon: "nc-double" };
    case "groove":
      return { id: BorderStyle.GROOVE, icon: "nc-groove" };
    case "ridge":
      return { id: BorderStyle.RIDGE, icon: "nc-ridge" };
    case "inset":
      return { id: BorderStyle.INSET, icon: "nc-inset" };
    case "outset":
      return { id: BorderStyle.OUTSET, icon: "nc-outset" };
  }
};

export const _setOpacity = (v: Opacity.Opacity, m: Value, f: boolean): Value =>
  ColorUtils.setOpacity(setOpacity, v, m, f);
