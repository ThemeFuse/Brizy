import { Obj } from "@brizy/readers";
import { OptionValue } from "visual/component/Options/types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { PaletteType } from "visual/types/Style";
import { mPipe, pass } from "visual/utils/fp";
import { makeStylePaletteCSSVar } from "./makeGlobalStylesColorPallete";

export const COLOR3 = "color3";

export const palettes: PaletteType[] = [
  "color1",
  "color2",
  "color3",
  "color4",
  "color5",
  "color6",
  "color7",
  "color8"
];

export const is = (v: string): v is PaletteType =>
  palettes.includes(v as PaletteType);

export const fromString = mPipe(pass(is));

type ColorModel = OptionValue<
  "colorPicker" | "backgroundColor" | "border" | "boxShadow" | "textShadow"
>;

export const addPaletteVarsToModel = (
  model: ColorModel,
  config: ConfigCommon
): ColorModel => {
  if (!Obj.isObject(model)) {
    return model;
  }

  const isPaletteKey = (key: string): boolean =>
    key === "palette" || /[A-Za-z]+Palette$/.test(key);

  return Object.entries(model).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      acc[key] = value;

      if (isPaletteKey(key) && typeof value === "string") {
        const paletteVarKey = `${key}Var`;

        acc[paletteVarKey] = value
          ? makeStylePaletteCSSVar(value, config)
          : null;
      }

      return acc;
    },
    {} as Record<string, unknown>
  );
};
