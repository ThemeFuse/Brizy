import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { paletteHex } from "visual/component/Options/types/dev/ColorPicker/utils";
import { getColorPaletteColors as paletteColors } from "visual/utils/color";
import * as Hex from "visual/utils/color/Hex";
import { Black } from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import * as Str from "visual/utils/string/specs";
import { Value } from "./entities/Value";
import * as Palette from "./entities/palette";

export const defaultValue: Value = {
  hex: Black,
  opacity: Opacity.unsafe(1),
  tempOpacity: Opacity.unsafe(1),
  palette: "",
  tempPalette: ""
};

export const fromElementModel: FromElementModel<"colorPicker"> = (get) => {
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

export const toElementModel: ToElementModel<"colorPicker"> = (values) => {
  return {
    hex: values.hex,
    opacity: values.opacity,
    palette: values.palette,
    tempOpacity: values.tempOpacity,
    tempPalette: values.tempPalette
  };
};
