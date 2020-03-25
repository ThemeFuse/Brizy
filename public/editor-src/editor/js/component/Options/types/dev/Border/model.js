/**
 * @typedef {"none"|"solid"|"dashed"|"dotted"} BorderStyle
 * @typedef {"grouped"|"ungrouped"} BorderWidthType
 * @typedef {{
 *   style: BorderStyle,
 *   tempStyle: BorderStyle,
 *   hex: string,
 *   opacity: number,
 *   tempOpacity: number,
 *   palette: Palette,
 *   tempPalette: Palette,
 *   widthType: BorderWidthType,
 *   width: number,
 *   tempWidth: number,
 *   topWidth: number,
 *   tempTopWidth: number,
 *   rightWidth: number,
 *   tempRightWidth: number,
 *   bottomWidth: number,
 *   tempBottomWidth: number,
 *   leftWidth: number,
 *   tempLeftWidth: number,
 * }} Border
 **/

import { _apply, get, set, setter } from "visual/utils/model";
import * as Style from "./entities/style";
import * as WidthType from "./entities/widthType";
import * as Width from "./entities/width";
import { toggleColor } from "visual/component/Options/types/dev/ColorPicker/utils";
import {
  getOpacity,
  getPalette,
  getHex
} from "visual/component/Options/types/dev/ColorPicker/model";
import * as ColorPicker from "visual/component/Options/types/dev/ColorPicker/model";
import { _getWidth, _setWidthEdge, toggleStyle, toggleWidth } from "./utils";
import * as Hex from "visual/utils/color/isHex";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import { mApply } from "visual/utils/value";

/**
 * Return border model style
 *  - if the border model style is not a valid BorderStyle, return orElse
 *
 * @param {BorderStyle} orElse
 * @param {Border} m
 * @return {BorderStyle}
 */
export const getStyle = (m, orElse = undefined) =>
  Style.read(get("style", m)) ?? orElse;

/**
 * Set border style
 *
 * @param {BorderStyle} v
 * @param {Border} m
 * @return {Border}
 */
export const setStyle = setter(Style.read, getStyle, (v, m) =>
  _apply(
    [
      [set, "tempStyle", mApply(Style.noEmpty, getStyle(m))],
      [set, "style", v],
      [toggleColor, v !== Style.empty],
      [toggleWidth, v !== Style.empty]
    ],
    m
  )
);

/**
 * Set box shadow hex
 *
 * @param {string} v
 * @param {object} m
 * @return {object}
 */
export const setHex = (v, m) => {
  if (Hex.toHex(undefined, v) === undefined || getHex(m) === v) {
    return m;
  }

  const enable = v !== "";
  return _apply(
    [
      [ColorPicker.setHex, v],
      [toggleStyle, enable],
      [toggleWidth, enable]
    ],
    m
  );
};

/**
 * Set box shadow opacity
 *
 * @param {number} v
 * @param {object} m
 * @return {object}
 */
export const setOpacity = setter(Opacity.toOpacity, getOpacity, (v, m) => {
  const enable = v !== Opacity.empty;
  return _apply(
    [
      [ColorPicker.setOpacity, v],
      [toggleStyle, enable],
      [toggleWidth, enable]
    ],
    m
  );
});

/**
 * Set box shadow palette
 *
 * @param {string} v
 * @param {object} m
 * @return {object}
 */
export const setPalette = setter(Palette.toPalette, getPalette, (v, m) => {
  const enable = v !== Palette.empty;

  return _apply(
    [
      [ColorPicker.setPalette, v],
      [toggleStyle, enable],
      [toggleWidth, enable]
    ],
    m
  );
});

/**
 * Return border model width type
 *  - if the border model width type is not a valid width type, return orElse
 *
 * @param {BorderWidthType} orElse
 * @param {Border} m
 * @return {BorderWidthType}
 */
export const getWidthType = (m, orElse) =>
  WidthType.read(get("widthType", m)) ?? orElse;

/**
 * Set border width type
 *
 * @param {BorderWidthType} v
 * @param {Border} m
 * @return {Border}
 */
export const setWidthType = setter(WidthType.read, getWidthType, (v, m) =>
  set("widthType", v, m)
);

/**
 * Return border width
 *
 * @param {number} orElse
 * @param {Border} m
 * @return {number}
 */
export const getWidth = (m, orElse = undefined) =>
  _getWidth("width", m, orElse);

/**
 * Set border width
 *
 * @param {number} v
 * @param {Border} m
 * @return {Border}
 */
export const setWidth = setter(Width.read, getWidth, (v, m) => {
  return _apply(
    [
      [set, "width", v],
      [set, "tempWidth", v > 0 ? v : undefined],
      [set, "topWidth", v > 0 ? v : undefined],
      [set, "rightWidth", v > 0 ? v : undefined],
      [set, "bottomWidth", v > 0 ? v : undefined],
      [set, "leftWidth", v > 0 ? v : undefined],
      [toggleStyle, v > 0],
      [toggleColor, v > 0]
    ],
    m
  );
});

/**
 * Return border top width
 *
 * @param {number} orElse
 * @param {Border} m
 * @return {number}
 */
export const getTopWidth = (m, orElse = undefined) =>
  _getWidth("topWidth", m, orElse);

/**
 * Set border top width
 *
 * @param {number} v
 * @param {Border} m
 * @return {Border}
 */
export const setTopWidth = (v, m) => _setWidthEdge("topWidth", v, m);

/**
 * Return border right width
 *
 * @param {number} orElse
 * @param {Border} m
 * @return {number}
 */
export const getRightWidth = (m, orElse = undefined) =>
  _getWidth("rightWidth", m, orElse);

/**
 * Set border right width
 *
 * @param {number} v
 * @param {Border} m
 * @return {Border}
 */
export const setRightWidth = (v, m) => _setWidthEdge("rightWidth", v, m);

/**
 * Return border bottom width
 *
 * @param {number} orElse
 * @param {Border} m
 * @return {number}
 */
export const getBottomWidth = (m, orElse = undefined) =>
  _getWidth("bottomWidth", m, orElse);

/**
 * Set border bottom width
 *
 * @param {number} v
 * @param {Border} m
 * @return {Border}
 */
export const setBottomWidth = (v, m) => _setWidthEdge("bottomWidth", v, m);

/**
 * Return border left width
 *
 * @param {number} orElse
 * @param {Border} m
 * @return {number}
 */
export const getLeftWidth = (m, orElse = undefined) =>
  _getWidth("leftWidth", m, orElse);

/**
 * Set border left width
 *
 * @param {number} v
 * @param {Border} m
 * @return {Border}
 */
export const setLeftWidth = (v, m) => _setWidthEdge("leftWidth", v, m);

export { getHex, getOpacity, getPalette };
