import { Obj, Str } from "@brizy/readers";
import { produce } from "immer";
import { Config } from "visual/global/Config";
import { DeviceMode } from "visual/types";
import { hexToRgba, makeStylePaletteCSSVar } from "visual/utils/color";
import { defaultValueKey } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import {
  ColorOption,
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

export function isTypographyTags(arg: unknown): arg is TypographyTags {
  return typeof arg === "string" && arg in TypographyTags;
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

  return `${hexToRgba(hex, parseFloat(opacity))}`;
};

export const gradientValues = (
  type: ColorOption,
  value: Value,
  prefix: string,
  device: DeviceMode
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

  const dvk = (key: string) =>
    defaultValueKey({ key, device, state: "normal" });

  const bgColorHexKey = dvk(capByPrefix(prefix, "bgColorHex"));
  const bgColorPaletteKey = dvk(capByPrefix(prefix, "bgColorPalette"));
  const bgColorOpacityKey = dvk(capByPrefix(prefix, "bgColorOpacity"));
  const gradientColorOpacityKey = dvk(
    capByPrefix(prefix, "gradientColorOpacity")
  );
  const gradientColorPaletteKey = dvk(
    capByPrefix(prefix, "gradientColorPalette")
  );
  const gradientColorHexKey = dvk(capByPrefix(prefix, "gradientColorHex"));
  const gradientStartPointerKey = dvk(
    capByPrefix(prefix, "gradientStartPointer")
  );
  const gradientFinishPointerKey = dvk(
    capByPrefix(prefix, "gradientFinishPointer")
  );
  const gradientActivePointerKey = dvk(
    capByPrefix(prefix, "gradientActivePointer")
  );
  const gradientTypeKey = dvk(capByPrefix(prefix, "gradientType"));
  const gradientLinearDegreeKey = dvk(
    capByPrefix(prefix, "gradientLinearDegree")
  );
  const gradientRadialDegreeKey = dvk(
    capByPrefix(prefix, "gradientRadialDegree")
  );

  const gradient: GradientValue = {
    ...DEFAULT_GRADIENT,
    startHex: Str.read(value[bgColorHexKey]),
    startOpacity: Str.read(value[bgColorOpacityKey]),
    finishOpacity: Str.read(value[gradientColorOpacityKey]),
    startPalette: Str.read(value[bgColorPaletteKey]),
    finishPalette: Str.read(value[gradientColorPaletteKey]),
    finishHex: Str.read(value[gradientColorHexKey]),
    startPointer: Str.read(value[gradientStartPointerKey]),
    finishPointer: Str.read(value[gradientFinishPointerKey]),
    activePointer: Str.read(value[gradientActivePointerKey]),
    type:
      value[gradientTypeKey] === "linear"
        ? "linear-gradient"
        : "radial-gradient",
    linearAngle: Str.read(value[gradientLinearDegreeKey]),
    radialPosition: Str.read(value[gradientRadialDegreeKey])
  };

  switch (type) {
    case ColorOption.Background:
      return {
        [dvk("background")]: null,
        [dvk("textBgColorPalette")]: Str.read(value[bgColorPaletteKey]),
        [dvk("textBackgroundGradient")]: gradient
      };
    case ColorOption.Color:
      return {
        [dvk("color")]: Str.read(value[bgColorHexKey]),
        [dvk("colorPalette")]: Str.read(value[bgColorPaletteKey]),
        [dvk("opacity")]: null,
        [dvk("backgroundGradient")]: gradient
      };
  }
};

export const colorValues = ({
  value,
  config,
  prefix,
  device,
  type
}: {
  value: Value;
  config: Config;
  prefix: string;
  device: DeviceMode;
  type: ColorOption;
}): Record<string, unknown> => {
  const dvk = (key: string) =>
    defaultValueKey({ key, device, state: "normal" });
  const bgColorHexKey = dvk(capByPrefix(prefix, "bgColorHex"));
  const bgColorPaletteKey = dvk(capByPrefix(prefix, "bgColorPalette"));
  const bgColorOpacityKey = dvk(capByPrefix(prefix, "bgColorOpacity"));
  const bgColorHex = Str.read(value[bgColorHexKey]);
  const bgColorPalette = Str.read(value[bgColorPaletteKey]);

  const rgbColor = hexToString(
    {
      palette: bgColorPalette ?? "",
      hex: bgColorHex ?? "#000000",
      opacity: Str.read(value[bgColorOpacityKey]) ?? "1"
    },
    config
  );

  switch (type) {
    case ColorOption.Background:
      return {
        [dvk("textBackgroundGradient")]: null,
        [dvk("textBgColorPalette")]: bgColorPalette,
        [dvk("background")]: rgbColor
      };
    case ColorOption.Color:
      return {
        [dvk("backgroundGradient")]: null,
        [dvk("opacity")]: null,
        [dvk("color")]: rgbColor,
        [dvk("colorPalette")]: bgColorPalette
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
