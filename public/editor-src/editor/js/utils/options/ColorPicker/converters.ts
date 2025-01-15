import { Num, Str } from "@brizy/readers";
import { mPipe } from "fp-utilities";
import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import * as Hex from "visual/utils/color/Hex";
import { Black } from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
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
    hex: mPipe(get, Str.read, Hex.fromString)("hex") ?? defaultValue.hex,
    opacity:
      mPipe(get, Num.read, Opacity.fromNumber)("opacity") ??
      defaultValue.opacity,
    palette: palette,
    tempOpacity:
      mPipe(get, Num.read, Opacity.fromNumber)("tempOpacity") ??
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
