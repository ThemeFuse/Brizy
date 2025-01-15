import { produce } from "immer";
import { Config } from "visual/global/Config";
import { hexToRgba, makeStylePaletteCSSVar } from "visual/utils/color";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { capByPrefix } from "visual/utils/string";
import {
  ColorBgValues,
  ColorOption,
  ColorValues,
  GradientBgValues,
  GradientColorValues,
  GradientValue,
  HexToString,
  Value
} from "../types";

export enum TypographyTags {
  P = "P",
  H1 = "H1",
  H2 = "H2",
  H3 = "H3",
  H4 = "H4",
  H5 = "H5",
  H6 = "H6"
}

export function tagId(tag: TypographyTags): string {
  switch (tag) {
    case TypographyTags.P:
      return "typography";
    case TypographyTags.H1:
      return "h1";
    case TypographyTags.H2:
      return "h2";
    case TypographyTags.H3:
      return "h3";
    case TypographyTags.H4:
      return "h4";
    case TypographyTags.H5:
      return "h5";
    case TypographyTags.H6:
      return "h6";
  }
}

export const hexToString = (
  { palette, opacity, hex }: HexToString,
  config: Config
): string | undefined => {
  if (palette) {
    return `rgba(var(${makeStylePaletteCSSVar(palette, config)}),${opacity})`;
  }

  return `${hexToRgba(hex, parseInt(opacity))}`;
};

export const gradientValues = (
  type: ColorOption,
  value: Value,
  prefix: string
): GradientBgValues | GradientColorValues => {
  const DEFAULT_GRADIENT = {
    type: "linear-gradient",
    radialPosition: 90,
    linearAngle: 90,
    startPointer: 0,
    finishPointer: 100,
    activePointer: "startPointer",
    startHex: "#239ddb",
    finishHex: "#009900",
    startOpacity: 1,
    finishOpacity: 0.8,
    startPalette: "",
    finishPalette: ""
  };

  const bgColorHex = capByPrefix(prefix, "bgColorHex");
  const bgColorPalette = capByPrefix(prefix, "bgColorPalette");

  const gradient: GradientValue = {
    ...DEFAULT_GRADIENT,
    startHex: Str.read(value[bgColorHex]),
    startOpacity: Str.read(value[capByPrefix(prefix, "bgColorOpacity")]),
    finishOpacity: Str.read(value[capByPrefix(prefix, "gradientColorOpacity")]),
    startPalette: Str.read(value[bgColorPalette]),
    finishPalette: Str.read(value[capByPrefix(prefix, "gradientColorPalette")]),
    finishHex: Str.read(value[capByPrefix(prefix, "gradientColorHex")]),
    startPointer: Str.read(value[capByPrefix(prefix, "gradientStartPointer")]),
    finishPointer: Str.read(
      value[capByPrefix(prefix, "gradientFinishPointer")]
    ),
    activePointer: Str.read(
      value[capByPrefix(prefix, "gradientActivePointer")]
    ),
    type:
      value[capByPrefix(prefix, "gradientType")] === "linear"
        ? "linear-gradient"
        : "radial-gradient",
    linearAngle: Str.read(value[capByPrefix(prefix, "gradientLinearDegree")]),
    radialPosition: Str.read(value[capByPrefix(prefix, "gradientRadialDegree")])
  };

  switch (type) {
    case ColorOption.Background:
      return {
        background: null,
        textBgColorPalette: Str.read(value[bgColorPalette]),
        textBackgroundGradient: gradient
      };
    case ColorOption.Color:
      return {
        color: Str.read(value[bgColorHex]),
        colorPalette: Str.read(value[bgColorPalette]),
        opacity: null,
        backgroundGradient: gradient
      };
  }
};

export const colorValues = (
  type: ColorOption,
  value: Value,
  config: Config,
  prefix: string
): ColorBgValues | ColorValues => {
  const bgColorHex = Str.read(value[capByPrefix(prefix, "bgColorHex")]);
  const bgColorPalette = Str.read(value[capByPrefix(prefix, "bgColorPalette")]);

  const rgbColor = hexToString(
    {
      palette: bgColorPalette ?? "",
      hex: bgColorHex ?? "#000000",
      opacity: String(value[capByPrefix(prefix, "bgColorOpacity")])
    },
    config
  );

  switch (type) {
    case ColorOption.Background:
      return {
        textBackgroundGradient: null,
        textBgColorPalette: bgColorPalette,
        background: rgbColor
      };
    case ColorOption.Color:
      return {
        backgroundGradient: null,
        opacity: null,
        color: rgbColor,
        colorPalette: bgColorPalette
      };
  }
};

export const mergeTypographyFontFamily = (data: Record<string, unknown>) =>
  produce(data, (draft) => {
    if (Obj.hasKey("tabletTypographyFontFamily", data)) {
      draft["typographyFontFamily"] = data["tabletTypographyFontFamily"];
      delete draft["tabletTypographyFontFamily"];
    }
    if (Obj.hasKey("tabletTypographyFontFamilyType", data)) {
      draft["typographyFontFamilyType"] =
        data["tabletTypographyFontFamilyType"];
      delete draft["tabletTypographyFontFamilyType"];
    }

    if (Obj.hasKey("mobileTypographyFontFamily", data)) {
      draft["typographyFontFamily"] = data["mobileTypographyFontFamily"];
      delete draft["mobileTypographyFontFamily"];
    }
    if (Obj.hasKey("mobileTypographyFontFamilyType", data)) {
      draft["typographyFontFamilyType"] =
        data["mobileTypographyFontFamilyType"];
      delete draft["mobileTypographyFontFamilyType"];
    }
  });
