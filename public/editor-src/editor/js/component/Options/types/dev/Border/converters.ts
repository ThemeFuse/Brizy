import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/dev/Border/entities/Value";
import * as Style from "visual/component/Options/types/dev/Border/entities/style";
import * as Width from "visual/component/Options/types/dev/Border/entities/width";
import * as WidthType from "visual/component/Options/types/dev/Border/entities/widthType";
import {
  getBottomWidth,
  getLeftWidth,
  getRightWidth,
  getTopWidth,
  getWidth,
  getWidthType
} from "visual/component/Options/types/dev/Border/model";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import * as Hex from "visual/utils/color/Hex";
import { Black } from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import * as Str from "visual/utils/string/specs";

export const defaultValue: Value = {
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

/**
 * Creates a Border model from element model
 *
 * @param {function(k:string):string|number} get
 * @return {Border}
 */
export const fromElementModel: FromElementModel<"border"> = (get) => {
  const partial = {
    style:
      mPipe(() => get("style"), Str.read, Style.fromString)() ??
      defaultValue.style,
    opacity:
      mPipe(() => get("colorOpacity"), Num.read, Opacity.fromNumber)() ??
      defaultValue.opacity,
    widthType:
      mPipe(() => get("widthType"), Str.read, WidthType.fromString)() ??
      defaultValue.widthType,
    width:
      mPipe(() => get("width"), Num.read, Width.fromNumber)() ??
      defaultValue.width,
    topWidth:
      mPipe(() => get("topWidth"), Num.read, Width.fromNumber)() ??
      defaultValue.topWidth,
    rightWidth:
      mPipe(() => get("rightWidth"), Num.read, Width.fromNumber)() ??
      defaultValue.rightWidth,
    bottomWidth:
      mPipe(() => get("bottomWidth"), Num.read, Width.fromNumber)() ??
      defaultValue.bottomWidth,
    leftWidth:
      mPipe(() => get("leftWidth"), Num.read, Width.fromNumber)() ??
      defaultValue.leftWidth
  };
  const isEmpty =
    partial.style === Style.empty ||
    partial.opacity === Opacity.empty ||
    isEmptyWidth(partial);

  return {
    style: isEmpty ? Style.empty : partial.style,
    tempStyle:
      mPipe(() => get("tempStyle"), Str.read, Style.fromString)() ??
      defaultValue.tempStyle,
    hex:
      mPipe(() => get("colorHex"), Str.read, Hex.fromString)() ??
      defaultValue.hex,
    opacity: isEmpty ? Opacity.empty : partial.opacity,
    tempOpacity:
      mPipe(() => get("tempColorOpacity"), Num.read, Opacity.fromNumber)() ??
      defaultValue.tempOpacity,
    palette: isEmpty
      ? Palette.empty
      : mPipe(() => get("colorPalette"), Str.read, Palette.fromString)() ??
        defaultValue.palette,
    tempPalette: isEmpty
      ? Palette.empty
      : mPipe(() => get("tempColorPalette"), Str.read, Palette.fromString)() ??
        defaultValue.tempPalette,
    widthType:
      mPipe(() => get("widthType"), Str.read, WidthType.fromString)() ??
      defaultValue.widthType,
    width: isEmpty ? Width.empty : partial.width,
    tempWidth:
      mPipe(() => get("tempWidth"), Num.read, Width.fromNumber)() ??
      defaultValue.tempWidth,
    topWidth: isEmpty ? Width.empty : partial.topWidth,
    tempTopWidth:
      mPipe(() => get("tempTopWidth"), Num.read, Width.fromNumber)() ??
      defaultValue.tempTopWidth,
    rightWidth: isEmpty ? Width.empty : partial.rightWidth,
    tempRightWidth:
      mPipe(() => get("tempRightWidth"), Num.read, Width.fromNumber)() ??
      defaultValue.tempRightWidth,
    bottomWidth: isEmpty ? Width.empty : partial.bottomWidth,
    tempBottomWidth:
      mPipe(() => get("tempBottomWidth"), Num.read, Width.fromNumber)() ??
      defaultValue.tempBottomWidth,
    leftWidth: isEmpty ? Width.empty : partial.leftWidth,
    tempLeftWidth:
      mPipe(() => get("tempLeftWidth"), Num.read, Width.fromNumber)() ??
      defaultValue.tempLeftWidth
  };
};

export const toElementModel: ToElementModel<"border"> = (m) => {
  return {
    style: m.style,
    tempStyle: m.tempStyle,
    colorHex: m.hex,
    colorOpacity: m.opacity,
    tempColorOpacity: m.tempOpacity,
    colorPalette: m.palette,
    tempColorPalette: m.tempPalette,
    widthType: m.widthType,
    width: m.width,
    tempWidth: m.tempWidth,
    topWidth: m.topWidth,
    tempTopWidth: m.tempTopWidth,
    rightWidth: m.rightWidth,
    tempRightWidth: m.tempRightWidth,
    bottomWidth: m.bottomWidth,
    tempBottomWidth: m.tempBottomWidth,
    leftWidth: m.leftWidth,
    tempLeftWidth: m.tempLeftWidth
  };
};
