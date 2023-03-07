import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { Value } from "./entities/Value";
import { mPipe } from "visual/utils/fp";
import * as Str from "visual/utils/string/specs";
import * as Palette from "./entities/palette";
import { paletteHex } from "./utils";
import * as Hex from "visual/utils/color/Hex";
import * as Num from "visual/utils/math/number";
import * as Opacity from "visual/utils/cssProps/opacity";
import { Black } from "visual/utils/color/Hex";
import { getColorPaletteColors as paletteColors } from "visual/utils/color";

export const defaultValue: Value = {
  hex: Black,
  opacity: Opacity.unsafe(1),
  tempOpacity: Opacity.unsafe(1),
  palette: "",
  tempPalette: ""
};

export const fromElementModel: FromElementModel<"colorPicker-dev"> = get => {
  const palette =
    mPipe(() => get("palette"), Str.read, Palette.fromString)() ??
    defaultValue.palette;

  return {
    hex:
      paletteHex(palette, paletteColors()) ??
      mPipe(get, Str.read, Hex.fromString)("hex") ??
      defaultValue.hex,
    opacity:
      mPipe(() => get("opacity"), Num.read, Opacity.fromNumber)() ??
      defaultValue.opacity,
    palette: palette,
    tempOpacity:
      mPipe(() => get("tempOpacity"), Num.read, Opacity.fromNumber)() ??
      defaultValue.tempOpacity,
    tempPalette:
      mPipe(get, Str.read, Palette.fromString)("tempPalette") ??
      defaultValue.palette
  };
};

export const toElementModel: ToElementModel<"colorPicker-dev"> = values => {
  return {
    hex: values.hex,
    opacity: values.opacity,
    palette: values.palette,
    tempOpacity: values.tempOpacity,
    tempPalette: values.tempPalette
  };
};
