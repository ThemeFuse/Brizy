import Config from "visual/global/Config";
import { getFontCssStyle } from "visual/utils/fonts";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionFontByGlobal } from "visual/utils/options";
import { getDetailsModelFontFamily } from "visual/utils/options/getDetailsModelFontFamily";
import { read as readStr } from "visual/utils/reader/string";
import { capByPrefix } from "visual/utils/string";
import { MValue, isNullish } from "visual/utils/value";
import { CSSValue } from "./types";
import { Str } from "@brizy/readers";

export function styleTypography2FontFamily({
  v,
  device,
  state,
  prefix = ""
}: CSSValue) {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const dvk = (key: string) =>
    defaultValueKey({ key, device, state: "normal" });

  const fontFamilyKey = dvk(capByPrefix(prefix, "fontFamily"));
  const fontFamilyTypeKey = dvk(capByPrefix(prefix, "fontFamilyType"));
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = readStr(dvv(fontStyleKey));
  const family = readStr(v[fontFamilyKey]);
  const familyType = readStr(v[fontFamilyTypeKey]) as MValue<FontFamilyType>;

  if (isNullish(family) || isNullish(familyType)) {
    return "";
  }

  return getDetailsModelFontFamily(
    {
      family,
      familyType,
      style: fontStyle
    },
    Config.getAll()
  );
}

export function styleTypography2FontSize({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): number {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontSizeKey = capByPrefix(prefix, "fontSize");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({ fontStyle, key: "fontSize", device });
  const value =
    globalSize ??
    getOptionFontByGlobal({
      key: dvk("fontSize"),
      value: dvv(fontSizeKey),
      style: dvv(fontStyleKey)
    });

  return value as number;
}

export function styleTypography2FontSizeSuffix({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const fontSizeSuffixKey = capByPrefix(prefix, "fontSizeSuffix");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  if (fontStyle && fontStyle !== "custom") {
    return "";
  } else {
    const value =
      getOptionFontByGlobal({
        key: dvk("fontSizeSuffix"),
        value: dvv(fontSizeSuffixKey),
        style: dvv(fontStyleKey)
      }) || "px";
    return value as string;
  }
}

export function styleTypography2LineHeight({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const lineHeightKey = capByPrefix(prefix, "lineHeight");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({ fontStyle, key: "lineHeight", device });
  const value =
    globalSize ??
    getOptionFontByGlobal({
      key: dvk("lineHeight"),
      value: dvv(lineHeightKey),
      style: dvv(fontStyleKey)
    });

  return Str.read(value) ?? "";
}

export function styleTypography2FontWeight({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontWeightKey = capByPrefix(prefix, "fontWeight");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({ fontStyle, key: "fontWeight", device });
  const value =
    globalSize ??
    getOptionFontByGlobal({
      key: dvk("fontWeight"),
      value: dvv(fontWeightKey),
      style: dvv(fontStyleKey)
    });

  return Str.read(value) ?? "";
}

export function styleTypography2LetterSpacing({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);
  const letterSpacingKey = capByPrefix(prefix, "letterSpacing");
  const suffix = fontStyle ? "" : "px";

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "letterSpacing",
    device
  });

  return (
    globalSize ??
    `${getOptionFontByGlobal({
      key: dvk("letterSpacing"),
      value: dvv(letterSpacingKey),
      style: dvv(fontStyleKey)
    })}${suffix}`
  );
}

export function styleTypography2FontVariation({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const variableFontWeightKey = capByPrefix(prefix, "variableFontWeight");
  const fontWidthKey = capByPrefix(prefix, "fontWidth");
  const fontSoftnessKey = capByPrefix(prefix, "fontSoftness");
  const fontStyle = dvv(fontStyleKey);
  const fontVariationKey = defaultValueKey({
    key: "fontVariation",
    device,
    state
  });
  const globalSize = getFontCssStyle({
    fontStyle,
    key: "fontVariation",
    device
  });

  const value = `"wght" ${dvv(variableFontWeightKey)}, "wdth" ${dvv(
    fontWidthKey
  )}, "SOFT" ${dvv(fontSoftnessKey)}`;

  const _value =
    globalSize ??
    getOptionFontByGlobal({
      key: fontVariationKey,
      value,
      style: dvv(fontStyleKey)
    });

  return Str.read(_value) ?? "";
}
