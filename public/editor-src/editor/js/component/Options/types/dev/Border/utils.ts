import { capByPrefix } from "visual/utils/string";
import { _apply, set } from "visual/utils/model";
import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import * as Hex from "visual/utils/color/Hex";
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
  setStyle,
  setOpacity
} from "./model";
import { toggleColor } from "visual/component/Options/types/dev/ColorPicker/utils";
import { mApply } from "visual/utils/value";
import * as BorderStyle from "visual/component/Options/types/dev/Border/entities/style";
import { t } from "visual/utils/i18n";
import { mPipe } from "visual/utils/fp";
import { Value } from "./entities/Value";
import * as ColorUtils from "visual/component/Options/types/dev/ColorPicker/utils";
import { Black } from "visual/utils/color/Hex";
import { StyleObject } from "visual/component/Controls/Border";
import { GetElementModel, GetModel } from "visual/component/Options/Type";

export const DEFAULT_VALUE: Value = {
  style: Style.empty,
  tempStyle: Style.SOLID,
  hex: Black,
  opacity: Opacity.empty,
  tempOpacity: Opacity.unsafe(1),
  palette: Palette.empty,
  tempPalette: Palette.empty,
  widthType: WidthType.empty,
  width: Width.empty,
  tempWidth: Width.unsafe(1),
  topWidth: Width.empty,
  tempTopWidth: Width.unsafe(1),
  rightWidth: Width.empty,
  tempRightWidth: Width.unsafe(1),
  bottomWidth: Width.empty,
  tempBottomWidth: Width.unsafe(1),
  leftWidth: Width.empty,
  tempLeftWidth: Width.unsafe(1)
};

/**
 * Check if all border widths are empty
 *
 * @param {Border} m
 * @return {boolean}
 */
export const isEmptyWidth = (
  m: Pick<
    Value,
    | "widthType"
    | "width"
    | "topWidth"
    | "rightWidth"
    | "bottomWidth"
    | "leftWidth"
  >
): boolean => {
  if (getWidthType(m) === WidthType.GROUPED) {
    return getWidth(m) === Width.empty;
  }

  return (
    getTopWidth(m) === Width.empty &&
    getRightWidth(m) === Width.empty &&
    getBottomWidth(m) === Width.empty &&
    getLeftWidth(m) === Width.empty
  );
};

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
 * Creates a Border model from element model
 *
 * @param {function(k:string):string|number} get
 * @return {Border}
 */
export const fromElementModel: GetModel<Value> = get => {
  const partial = {
    style:
      mPipe(() => get("style"), Str.read, Style.fromString)() ??
      DEFAULT_VALUE.style,
    opacity:
      mPipe(() => get("colorOpacity"), Num.read, Opacity.fromNumber)() ??
      DEFAULT_VALUE.opacity,
    widthType:
      mPipe(() => get("widthType"), Str.read, WidthType.fromString)() ??
      DEFAULT_VALUE.widthType,
    width:
      mPipe(() => get("width"), Num.read, Width.fromNumber)() ??
      DEFAULT_VALUE.width,
    topWidth:
      mPipe(() => get("topWidth"), Num.read, Width.fromNumber)() ??
      DEFAULT_VALUE.topWidth,
    rightWidth:
      mPipe(() => get("rightWidth"), Num.read, Width.fromNumber)() ??
      DEFAULT_VALUE.rightWidth,
    bottomWidth:
      mPipe(() => get("bottomWidth"), Num.read, Width.fromNumber)() ??
      DEFAULT_VALUE.bottomWidth,
    leftWidth:
      mPipe(() => get("leftWidth"), Num.read, Width.fromNumber)() ??
      DEFAULT_VALUE.leftWidth
  };
  const isEmpty =
    partial.style === Style.empty ||
    partial.opacity === Opacity.empty ||
    isEmptyWidth(partial);

  return {
    style: isEmpty ? Style.empty : partial.style,
    tempStyle:
      mPipe(() => get("tempStyle"), Str.read, Style.fromString)() ??
      DEFAULT_VALUE.tempStyle,
    hex:
      mPipe(() => get("colorHex"), Str.read, Hex.fromString)() ??
      DEFAULT_VALUE.hex,
    opacity: isEmpty ? Opacity.empty : partial.opacity,
    tempOpacity:
      mPipe(() => get("tempColorOpacity"), Num.read, Opacity.fromNumber)() ??
      DEFAULT_VALUE.tempOpacity,
    palette: isEmpty
      ? Palette.empty
      : mPipe(() => get("colorPalette"), Str.read, Palette.fromString)() ??
        DEFAULT_VALUE.palette,
    tempPalette: isEmpty
      ? Palette.empty
      : mPipe(() => get("tempColorPalette"), Str.read, Palette.fromString)() ??
        DEFAULT_VALUE.tempPalette,
    widthType:
      mPipe(() => get("widthType"), Str.read, WidthType.fromString)() ??
      DEFAULT_VALUE.widthType,
    width: isEmpty ? Width.empty : partial.width,
    tempWidth:
      mPipe(() => get("tempWidth"), Num.read, Width.fromNumber)() ??
      DEFAULT_VALUE.tempWidth,
    topWidth: isEmpty ? Width.empty : partial.topWidth,
    tempTopWidth:
      mPipe(() => get("tempTopWidth"), Num.read, Width.fromNumber)() ??
      DEFAULT_VALUE.tempTopWidth,
    rightWidth: isEmpty ? Width.empty : partial.rightWidth,
    tempRightWidth:
      mPipe(() => get("tempRightWidth"), Num.read, Width.fromNumber)() ??
      DEFAULT_VALUE.tempRightWidth,
    bottomWidth: isEmpty ? Width.empty : partial.bottomWidth,
    tempBottomWidth:
      mPipe(() => get("tempBottomWidth"), Num.read, Width.fromNumber)() ??
      DEFAULT_VALUE.tempBottomWidth,
    leftWidth: isEmpty ? Width.empty : partial.leftWidth,
    tempLeftWidth:
      mPipe(() => get("tempLeftWidth"), Num.read, Width.fromNumber)() ??
      DEFAULT_VALUE.tempLeftWidth
  };
};

export const toElementModel: GetElementModel<Value> = (m, get) => {
  return {
    [get("style")]: m.style,
    [get("tempStyle")]: m.tempStyle,
    [get("colorHex")]: m.hex,
    [get("colorOpacity")]: m.opacity,
    [get("tempColorOpacity")]: m.tempOpacity,
    [get("colorPalette")]: m.palette,
    [get("tempColorPalette")]: m.tempPalette,
    [get("widthType")]: m.widthType,
    [get("width")]: m.width,
    [get("tempWidth")]: m.tempWidth,
    [get("topWidth")]: m.topWidth,
    [get("tempTopWidth")]: m.tempTopWidth,
    [get("rightWidth")]: m.rightWidth,
    [get("tempRightWidth")]: m.tempRightWidth,
    [get("bottomWidth")]: m.bottomWidth,
    [get("tempBottomWidth")]: m.tempBottomWidth,
    [get("leftWidth")]: m.leftWidth,
    [get("tempLeftWidth")]: m.tempLeftWidth
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
  }
};

export const _setOpacity = (v: Opacity.Opacity, m: Value, f: boolean): Value =>
  ColorUtils.setOpacity(setOpacity, v, m, f);
