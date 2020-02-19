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
    (v, f) => v && f(m, Width.empty) === true
  );
};

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
  Width.toWidth(get(key, m), orElse);

/**
 * An general function predefined to get border width
 *
 * @param {string} key
 * @param {number} v
 * @param {Border} m
 * @return {Border}
 * @private
 */
export const _setWidth = (key, v, m) => {
  const i = undefined;
  if (Width.toWidth(v, i) === i || _getWidth(key, m) === v) {
    return m;
  }

  const flatten = [
    "width",
    "topWidth",
    "rightWidth",
    "bottomWidth",
    "leftWidth"
  ].reduce((m, k) => {
    const value = _getWidth(k, m, Width.empty);
    return set(capByPrefix("temp", k), value, m);
  }, toObject(m));

  const model = _apply(
    [
      [set, capByPrefix("temp", key), v],
      [set, key, v]
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
  const style = Style.onEmpty(getStyle(m), get("tempStyle", m));
  return _apply([[setStyle, enable ? style : Style.empty]], m);
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
          [set, k, enable ? Width.onEmpty(w, tW) : Width.empty]
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
  return {
    style: Style.toStyle(get("style"), Style.empty),
    tempStyle: Style.toStyle(get("tempStyle"), Style.SOLID),
    hex: Hex.toHex("", get("colorHex")),
    opacity: Opacity.toOpacity(get("colorOpacity"), Opacity.empty),
    tempOpacity: Opacity.toOpacity(get("tempColorOpacity"), 1),
    palette: Palette.toPalette(get("colorPalette"), Palette.empty),
    tempPalette: Palette.toPalette(get("tempColorPalette"), Palette.empty),
    widthType: WidthType.toType(get("widthType"), WidthType.empty),
    width: Width.toWidth(get("width"), Width.empty),
    tempWidth: Width.toWidth(get("tempWidth"), 1),
    topWidth: Width.toWidth(get("topWidth"), Width.empty),
    tempTopWidth: Width.toWidth(get("tempTopWidth"), 1),
    rightWidth: Width.toWidth(get("rightWidth"), Width.empty),
    tempRightWidth: Width.toWidth(get("tempRightWidth"), 1),
    bottomWidth: Width.toWidth(get("bottomWidth"), Width.empty),
    tempBottomWidth: Width.toWidth(get("tempBottomWidth"), 1),
    leftWidth: Width.toWidth(get("leftWidth"), Width.empty),
    tempLeftWidth: Width.toWidth(get("tempLeftWidth"), 1)
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
    style: Style.toStyle(m.style, Style.empty),
    tempStyle: Style.toStyle(m.tempStyle, Style.SOLID),
    colorHex: Hex.toHex("", m.hex),
    colorOpacity: Opacity.toOpacity(m.opacity, Opacity.empty),
    tempColorOpacity: Opacity.toOpacity(m.tempOpacity, 1),
    colorPalette: Palette.toPalette(m.palette, Palette.empty),
    tempColorPalette: Palette.toPalette(m.tempPalette, Palette.empty),
    widthType: WidthType.toType(m.widthType, WidthType.empty),
    width: Width.toWidth(m.width, Width.empty),
    tempWidth: Width.toWidth(m.tempWidth, 1),
    topWidth: Width.toWidth(m.topWidth, Width.empty),
    tempTopWidth: Width.toWidth(m.tempTopWidth, 1),
    rightWidth: Width.toWidth(m.rightWidth, Width.empty),
    tempRightWidth: Width.toWidth(m.tempRightWidth, 1),
    bottomWidth: Width.toWidth(m.bottomWidth, Width.empty),
    tempBottomWidth: Width.toWidth(m.tempBottomWidth, 1),
    leftWidth: Width.toWidth(m.leftWidth, Width.empty),
    tempLeftWidth: Width.toWidth(m.tempLeftWidth, 1)
  };
};
