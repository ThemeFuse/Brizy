import { capByPrefix } from "visual/utils/string";
import { _apply, get, set } from "visual/utils/model";
import * as Hex from "visual/utils/color/isHex";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import * as Width from "./entities/width";
import * as WidthType from "./entities/widthType";
import * as Style from "./entities/style";
import {
  getBottomWidth,
  getLeftWidth,
  getRightWidth,
  getStyle,
  getTopWidth,
  getWidth,
  getWidthType,
  setStyle
} from "./model";
import { toObject } from "visual/utils/object";
import { toggleColor } from "visual/component/Options/types/dev/ColorPicker/utils";
import { mApply } from "visual/utils/value";
import * as BorderStyle from "visual/component/Options/types/dev/Border/entities/style";
import { t } from "visual/utils/i18n";

/**
 * Check if all border widths are empty
 *
 * @param {Border} m
 * @return {boolean}
 */
export const isEmptyWidth = m => {
  if (getWidthType(m, WidthType.empty) === WidthType.GROUPED) {
    return getWidth(m, Width.empty) === Width.empty;
  }

  return [getTopWidth, getRightWidth, getBottomWidth, getLeftWidth].reduce(
    (v, f) => v && f(m, Width.empty) === Width.empty,
    true
  );
};

const widthTemp = k => capByPrefix("temp", k);

const isFlat = m =>
  [m.topWidth, m.rightWidth, m.bottomWidth, m.leftWidth].every(
    (v, _, vs) => v === vs[0]
  );

/**
 * An general function predefined to get border width
 *
 * @param {string} key
 * @param {number} orElse
 * @param {Border} m
 * @return {number}
 * @private
 */
export const _getWidth = (key, m, orElse = undefined) =>
  Width.read(get(key, m)) ?? orElse;

/**
 * An general function predefined to get border width
 *
 * @param {string} key
 * @param {number} v
 * @param {Border} m
 * @return {Border}
 * @private
 */
export const _setWidthEdge = (key, v, m) => {
  if (Width.read(v) === undefined || _getWidth(key, m) === v) {
    return m;
  }

  const flatten = ["topWidth", "rightWidth", "bottomWidth", "leftWidth"].reduce(
    (m, k) => {
      const value = _getWidth(k, m) ?? Width.empty;
      return set(capByPrefix("temp", k), value, m);
    },
    toObject(m)
  );

  const tk = widthTemp(key);

  const model = _apply(
    [
      [set, capByPrefix("temp", key), v],
      [set, key, v],
      [_m => set(tk, isFlat(_m) ? m[key] : _m[key], _m)],
      [m => (v > 0 && isFlat(m) ? set("width", v, m) : m)]
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
 * Disable or enable border style value.
 *  - On enable, if value is empty, it takes the temp value
 *  - On disable, value is set to empty
 *  - On disable, if value is not empty, temp takes current value
 *
 * @param {boolean} enable
 * @param {Border} m
 * @return {Border}
 */
export const toggleStyle = (enable, m) => {
  const style = enable
    ? mApply(Style.noEmpty, getStyle(m)) ?? Style.read(m?.tempStyle)
    : Style.empty;
  return _apply([[setStyle, style]], m);
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
export const toggleWidth = (enable, m) => {
  return ["width", "topWidth", "rightWidth", "bottomWidth", "leftWidth"].reduce(
    (m, k) => {
      const t = capByPrefix("temp", k);
      const w = _getWidth(k, m);
      const tW = _getWidth(t, m, Width.empty);

      return _apply(
        [
          [set, t, !enable && w !== Width.empty ? w : undefined],
          [set, k, enable ? Width.append(w, tW) : Width.empty]
        ],
        m
      );
    },
    m
  );
};

/**
 * Creates a Border model from element model
 *
 * @param {function(k:string):string|number} get
 * @return {Border}
 */
export const fromElementModel = get => {
  const partial = {
    style: Style.mRead(get("style")),
    opacity: Opacity.mRead(get("colorOpacity")),
    widthType: WidthType.mRead(get("widthType")),
    width: Width.mRead(get("width")),
    topWidth: Width.mRead(get("topWidth")),
    rightWidth: Width.mRead(get("rightWidth")),
    bottomWidth: Width.mRead(get("bottomWidth")),
    leftWidth: Width.mRead(get("leftWidth"))
  };
  const isEmpty =
    partial.style === Style.empty ||
    partial.opacity === Opacity.empty ||
    isEmptyWidth(partial);

  return {
    style: isEmpty ? Style.empty : partial.style,
    tempStyle: Style.read(get("tempStyle")) ?? Style.SOLID,
    hex: Hex.read(get("colorHex")) ?? "#000000",
    opacity: isEmpty ? Opacity.empty : partial.opacity,
    tempOpacity: Opacity.read(get("tempColorOpacity")) ?? 1,
    palette: isEmpty ? Palette.empty : Palette.mRead(get("colorPalette")),
    tempPalette: Palette.mRead(get("tempColorPalette")),
    widthType: WidthType.mRead(get("widthType")),
    width: isEmpty ? Width.empty : partial.width,
    tempWidth: Width.read(get("tempWidth")) ?? 1,
    topWidth: isEmpty ? Width.empty : partial.topWidth,
    tempTopWidth: Width.read(get("tempTopWidth")) ?? 1,
    rightWidth: isEmpty ? Width.empty : partial.rightWidth,
    tempRightWidth: Width.read(get("tempRightWidth")) ?? 1,
    bottomWidth: isEmpty ? Width.empty : partial.bottomWidth,
    tempBottomWidth: Width.read(get("tempBottomWidth")) ?? 1,
    leftWidth: isEmpty ? Width.empty : partial.leftWidth,
    tempLeftWidth: Width.read(get("tempLeftWidth")) ?? 1
  };
};

/**
 *
 * @param {Border} m
 * @return {{
 *  leftWidth: number,
 *  tempColorOpacity: number,
 *  bottomWidth: number,
 *  topWidth: number,
 *  tempWidth: number,
 *  tempLeftWidth: number,
 *  widthType: BorderWidthType,
 *  tempBottomWidth: number,
 *  tempRightWidth: number,
 *  width: number,
 *  style: BorderStyle,
 *  tempStyle: BorderStyle,
 *  colorHex: string,
 *  colorPalette: Palette,
 *  tempTopWidth: number,
 *  colorOpacity: number,
 *  tempColorPalette: Palette,
 *  rightWidth: number
 * }}
 */
export const toElementModel = m => {
  return {
    style: Style.mRead(m.style),
    tempStyle: Style.read(m.tempStyle) ?? Style.SOLID,
    colorHex: Hex.read(m.hex) ?? "",
    colorOpacity: Opacity.mRead(m.opacity),
    tempColorOpacity: Opacity.read(m.tempOpacity) ?? 1,
    colorPalette: Palette.mRead(m.palette),
    tempColorPalette: Palette.mRead(m.tempPalette),
    widthType: WidthType.mRead(m.widthType),
    width: Width.mRead(m.width),
    tempWidth: Width.read(m.tempWidth) ?? 1,
    topWidth: Width.mRead(m.topWidth),
    tempTopWidth: Width.read(m.tempTopWidth) ?? 1,
    rightWidth: Width.mRead(m.rightWidth),
    tempRightWidth: Width.read(m.tempRightWidth) ?? 1,
    bottomWidth: Width.mRead(m.bottomWidth),
    tempBottomWidth: Width.read(m.tempBottomWidth) ?? 1,
    leftWidth: Width.mRead(m.leftWidth),
    tempLeftWidth: Width.read(m.tempLeftWidth) ?? 1
  };
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
export const getStyleObject = style => {
  switch (style) {
    case "none":
      return { id: BorderStyle.NONE, title: t("None") };
    case "solid":
      return { id: BorderStyle.SOLID, icon: "nc-solid" };
    case "dashed":
      return { id: BorderStyle.DASHED, icon: "nc-dashed" };
    case "dotted":
      return { id: BorderStyle.DOTTED, icon: "nc-dotted" };
    default:
      return undefined;
  }
};
