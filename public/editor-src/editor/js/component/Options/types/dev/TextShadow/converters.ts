import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { Empty, isEmpty, isNoEmpty, NoEmpty, Value } from "./types/Value";
import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Blur from "visual/utils/cssProps/Blur";
import * as Palette from "visual/utils/color/Palette";
import { NoEmptyBlur, fromBlur } from "./types/NoEmptyBlur";
import { NoEmptyOpacity, fromOpacity } from "./types/NoEmptyOpacity";
import {
  optional,
  parseStrict,
  readWithParser
} from "visual/utils/reader/readWithParser";
import { mPipe, pipe } from "visual/utils/fp";
import { call } from "visual/component/Options/types/dev/Animation/utils";
import { onNullish } from "visual/utils/value";
import { match } from "visual/utils/fp/match";
import { ElementModel } from "visual/component/Elements/Types";

export const defaultValue: Empty = {
  blur: 0,
  opacity: 0,
  hex: Hex.Black,
  horizontal: 0,
  vertical: 0,
  tempPalette: undefined,
  tempBlur: 1 as NoEmptyBlur,
  tempOpacity: 1 as NoEmptyOpacity,
  tempHorizontal: 0,
  tempVertical: 0
};

export const elementModelToNoEmpty = readWithParser<
  FromElementModelGetter,
  NoEmpty
>({
  opacity: mPipe(
    call("colorOpacity"),
    Num.read,
    Opacity.fromNumber,
    fromOpacity
  ),
  blur: mPipe(call("blur"), Num.read, Blur.fromNumber, fromBlur),
  palette: optional(mPipe(call("colorPalette"), Str.read, Palette.fromString)),
  hex: mPipe(call("colorHex"), Str.read, Hex.fromString),
  horizontal: mPipe(call("horizontal"), Num.read),
  vertical: mPipe(call("vertical"), Num.read)
});

export const elementModelToEmpty = parseStrict<FromElementModelGetter, Empty>({
  opacity: () => 0,
  tempOpacity: pipe(
    mPipe(call("tempColorOpacity"), Num.read, Opacity.fromNumber, fromOpacity),
    onNullish(defaultValue.tempOpacity)
  ),
  blur: () => 0,
  tempBlur: pipe(
    mPipe(call("tempBlur"), Num.read, Blur.fromNumber, fromBlur),
    onNullish(defaultValue.tempBlur)
  ),
  tempPalette: optional(
    mPipe(call("tempColorPalette"), Str.read, Palette.fromString)
  ),
  hex: pipe(
    mPipe(call("colorHex"), Str.read, Hex.fromString),
    onNullish(defaultValue.hex)
  ),
  horizontal: () => 0,
  tempHorizontal: pipe(
    mPipe(call("tempHorizontal"), Num.read),
    onNullish(defaultValue.tempHorizontal)
  ),
  vertical: () => 0,
  tempVertical: pipe(
    mPipe(call("tempVertical"), Num.read),
    onNullish(defaultValue.tempVertical)
  )
});

export const fromElementModel: FromElementModel<Value> = g =>
  elementModelToNoEmpty(g) ?? elementModelToEmpty(g);

export const toElementModel: ToElementModel<Value> = match(
  [
    isEmpty,
    (v): ElementModel => ({
      colorHex: v.hex,
      colorOpacity: v.opacity,
      colorPalette: undefined,
      blur: v.blur,
      horizontal: v.horizontal,
      vertical: v.vertical
    })
  ],
  [
    isNoEmpty,
    (v): ElementModel => ({
      colorHex: v.hex,
      colorOpacity: v.opacity,
      colorPalette: v.palette,
      blur: v.blur,
      horizontal: v.horizontal,
      vertical: v.vertical,
      tempBlur: v.blur,
      tempHorizontal: v.horizontal,
      tempColorOpacity: v.opacity,
      tempColorPalette: v.palette,
      tempVertical: v.vertical
    })
  ]
);
