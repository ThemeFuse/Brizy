import { _apply, set, setter2 } from "visual/utils/model";
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
import { _setWidthEdge, toggleStyle, toggleWidth } from "./utils";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import { mApply } from "visual/utils/value";
import { Value } from "./entities/Value";

export const getStyle = <V extends { style: Style.Style }>(m: V): V["style"] =>
  m.style;

export const setStyle = setter2(getStyle, (v, m) =>
  _apply(
    [
      [set, "tempStyle", mApply(Style.noEmpty, m.style)],
      [set, "style", v],
      [toggleColor, v !== Style.empty],
      [toggleWidth, v !== Style.empty]
    ],
    m
  )
);

export const setHex = (v: Hex.Hex, m: Value): Value => {
  if (Hex.fromString(v) === undefined || getHex(m) === v) {
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

export const setOpacity = setter2(getOpacity, (v, m) => {
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

export const setPalette = setter2(getPalette, (v, m) => {
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

export const getWidthType = <V extends { widthType: WidthType.WidthType }>(
  m: V
): V["widthType"] => m.widthType;

export const setWidthType = setter2(getWidthType, (v, m) =>
  set("widthType", v, m)
);

export const getWidth = <V extends { width: Width.Width }>(m: V): V["width"] =>
  m.width;

export const setWidth = setter2<Width.Width, Value>(getWidth, (v, m) => {
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

export const getTopWidth = <V extends { topWidth: Width.Width }>(
  m: V
): V["topWidth"] => m.topWidth;

export const setTopWidth = (v: Width.Width, m: Value): Value =>
  _setWidthEdge("topWidth", v, m);

export const getRightWidth = <V extends { rightWidth: Width.Width }>(
  m: V
): V["rightWidth"] => m.rightWidth;

/**
 * Set border right width
 *
 * @param {number} v
 * @param {Border} m
 * @return {Border}
 */
export const setRightWidth = (v: Width.Width, m: Value): Value =>
  _setWidthEdge("rightWidth", v, m);

/**
 * Return border bottom width
 *
 * @param {number} orElse
 * @param {Border} m
 * @return {number}
 */
export const getBottomWidth = <V extends { bottomWidth: Width.Width }>(
  m: V
): V["bottomWidth"] => m.bottomWidth;
/**
 * Set border bottom width
 *
 * @param {number} v
 * @param {Border} m
 * @return {Border}
 */
export const setBottomWidth = (v: Width.Width, m: Value): Value =>
  _setWidthEdge("bottomWidth", v, m);

/**
 * Return border left width
 *
 * @param {number} orElse
 * @param {Border} m
 * @return {number}
 */
export const getLeftWidth = <V extends { leftWidth: Width.Width }>(
  m: V
): V["leftWidth"] => m.leftWidth;

/**
 * Set border left width
 *
 * @param {number} v
 * @param {Border} m
 * @return {Border}
 */
export const setLeftWidth = (v: Width.Width, m: Value): Value =>
  _setWidthEdge("leftWidth", v, m);

export { getHex, getOpacity, getPalette };
