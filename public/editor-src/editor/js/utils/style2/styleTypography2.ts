import Config from "visual/global/Config";
import {
  getFontById,
  getFontCssStyle,
  makeStyleCSSVar
} from "visual/utils/fonts";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionFontByGlobal } from "visual/utils/options";
import { DESKTOP } from "visual/utils/responsiveMode";
import { capByPrefix } from "visual/utils/string";
import { isNullish } from "visual/utils/value";
import { FONT_INITIAL } from "../fonts/utils";
import { CSSValue } from "./types";

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
  const fontStyle = dvv(fontStyleKey);

  if (fontStyle && fontStyle !== "custom") {
    return `var(${makeStyleCSSVar({
      id: fontStyle,
      device: DESKTOP,
      key: "fontFamily",
      config: Config.getAll()
    })}, ${FONT_INITIAL})`;
  } else {
    const fontFamily = getOptionFontByGlobal(
      "fontFamily",
      v[fontFamilyKey],
      fontStyle
    );
    const fontFamilyType = getOptionFontByGlobal(
      "fontFamilyType",
      v[fontFamilyTypeKey],
      fontStyle
    );

    if (isNullish(fontFamily) || isNullish(fontFamilyType)) {
      return;
    }

    return getFontById({ type: fontFamilyType, family: fontFamily }).family;
  }
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

  return (
    globalSize ??
    getOptionFontByGlobal(dvk("fontSize"), dvv(fontSizeKey), dvv(fontStyleKey))
  );
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
    return (
      getOptionFontByGlobal(
        dvk("fontSizeSuffix"),
        dvv(fontSizeSuffixKey),
        dvv(fontStyleKey)
      ) || "px"
    );
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

  return (
    globalSize ??
    getOptionFontByGlobal(
      dvk("lineHeight"),
      dvv(lineHeightKey),
      dvv(fontStyleKey)
    )
  );
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

  return (
    globalSize ??
    getOptionFontByGlobal(
      dvk("fontWeight"),
      dvv(fontWeightKey),
      dvv(fontStyleKey)
    )
  );
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
    `${getOptionFontByGlobal(
      dvk("letterSpacing"),
      dvv(letterSpacingKey),
      dvv(fontStyleKey)
    )}${suffix}`
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

  return (
    globalSize ??
    getOptionFontByGlobal(fontVariationKey, value, dvv(fontStyleKey))
  );
}
