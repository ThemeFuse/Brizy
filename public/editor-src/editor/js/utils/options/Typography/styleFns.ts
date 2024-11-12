import { Num, Str } from "@brizy/readers";
import { OptionValue } from "visual/component/Options/types";
import Config from "visual/global/Config";
import { ReduxState } from "visual/redux/types";
import { Fonts } from "visual/types";
import { getFontCssStyle } from "visual/utils/fonts";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
import {
  empty as defaultWeight,
  fromNumber as readWeight,
  Weight
} from "visual/utils/fonts/Weight";
import {
  fromNumber as readPositive,
  Positive
} from "visual/utils/math/Positive";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionFontByGlobal } from "visual/utils/options";
import { getDetailsModelFontFamily } from "visual/utils/options/getDetailsModelFontFamily";
import { DESKTOP } from "visual/utils/responsiveMode";
import { capByPrefix } from "visual/utils/string";
import { CSSValue as CSSValue_ } from "visual/utils/style2/types";
import { isNullish, MValue } from "visual/utils/value";

type CSSValue = Omit<CSSValue_, "v"> & {
  v: OptionValue<"typography">;
  fontsData: {
    fonts: Fonts;
    fontStyles: ReduxState["currentStyle"]["fontStyles"];
    extraFontStyles: ReduxState["extraFontStyles"];
  };
};

export function styleTypographyFontFamily({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const fontFamilyKey = capByPrefix(prefix, "fontFamily");
  const fontFamilyTypeKey = capByPrefix(prefix, "fontFamilyType");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  const { fonts, fontStyles, extraFontStyles } = fontsData;
  const allFontStyles = { fontStyles, extraFontStyles };
  const config = Config.getAll();

  const family = Str.read(
    getOptionFontByGlobal({
      key: "fontFamily",
      value: defaultValueValue({ v, key: fontFamilyKey, device: DESKTOP }),
      style: dvv(fontStyleKey),
      styles: allFontStyles
    })
  );
  const familyType = Str.read(
    getOptionFontByGlobal({
      key: "fontFamilyType",
      value: defaultValueValue({ v, key: fontFamilyTypeKey, device: DESKTOP }),
      style: dvv(fontStyleKey),
      styles: allFontStyles
    })
  ) as MValue<FontFamilyType>;

  if (isNullish(family) || isNullish(familyType)) {
    return "";
  }

  return (
    getDetailsModelFontFamily(
      { family, familyType, style: fontStyle, fonts },
      config
    ) ?? ""
  );
}

export function styleTypographyFontSize({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue): Positive | string {
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
      style: dvv(fontStyleKey),
      styles: {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    });

  const nValue = Num.read(value);

  const data = nValue ? readPositive(nValue) : Str.read(value);

  return data ?? 0;
}

export function styleTypographyFontSizeSuffix({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue): SizeSuffix {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const fontSizeSuffixKey = capByPrefix(prefix, "fontSizeSuffix");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  if (fontStyle && fontStyle !== "custom") {
    return "" as SizeSuffix;
  } else {
    const suffix =
      getOptionFontByGlobal({
        key: dvk("fontSizeSuffix"),
        value: dvv(fontSizeSuffixKey),
        style: dvv(fontStyleKey),
        styles: {
          fontStyles: fontsData.fontStyles,
          extraFontStyles: fontsData.extraFontStyles
        }
      }) || "px";

    return suffix as SizeSuffix;
  }
}

export function styleTypographyLineHeight({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue): Positive | string {
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
      style: dvv(fontStyleKey),
      styles: {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    });

  const nValue = Num.read(value);

  const data = nValue ? readPositive(nValue) : Str.read(value);

  return data ?? 0;
}

export function styleTypographyFontWeight({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue): Weight | string {
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
      style: dvv(fontStyleKey),
      styles: {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    });

  const nValue = Num.read(value);

  const data = nValue ? readWeight(nValue) : Str.read(value);

  return data ?? defaultWeight;
}

export function styleTypographyLetterSpacing({
  v,
  device,
  state,
  prefix = "",
  fontsData
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
      style: dvv(fontStyleKey),
      styles: {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    })}${suffix}`
  );
}

export function styleTypography2FontVariation({
  v,
  device,
  state,
  prefix = "",
  fontsData
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
      style: dvv(fontStyleKey),
      styles: {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    });

  return Str.read(_value) ?? "";
}

export function styleTextTransformBold({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue) {
  const dvv = (key: string) => defaultValueValue({ v, device, state, key });
  const boldKey = capByPrefix(prefix, "bold");

  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "bold",
    device
  });
  const value = dvv(boldKey);

  return (
    globalSize ??
    getOptionFontByGlobal({
      key: boldKey,
      value,
      style: fontStyle,
      styles: {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    })
  );
}

export function styleTextTransformItalic({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue) {
  const dvv = (key: string) => defaultValueValue({ v, device, state, key });
  const italicKey = capByPrefix(prefix, "italic");

  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "italic",
    device
  });
  const value = dvv(italicKey);

  return (
    globalSize ??
    getOptionFontByGlobal({
      key: italicKey,
      value,
      style: fontStyle,
      styles: {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    })
  );
}

export function styleTextTransformTextDecoration({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue) {
  const dvv = (key: string) => defaultValueValue({ v, device, state, key });
  const underlineKey = capByPrefix(prefix, "underline");
  const strikeKey = capByPrefix(prefix, "strike");
  const textDecorationKey = capByPrefix(prefix, "textDecoration");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "textDecoration",
    device
  });
  const underline = dvv(underlineKey) ? "underline" : "";
  const strike = dvv(strikeKey) ? "line-through" : "";
  const value = [underline, strike].filter(Boolean).join(" ");

  return (
    globalSize ??
    getOptionFontByGlobal({
      key: textDecorationKey,
      value,
      style: fontStyle,
      styles: {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    })
  );
}

export function styleTextTransformUpperLowerCase({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue) {
  const dvv = (key: string) => defaultValueValue({ v, device, state, key });
  const uppercaseKey = capByPrefix(prefix, "uppercase");
  const lowercaseKey = capByPrefix(prefix, "lowercase");

  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "textTransform",
    device
  });
  const value =
    (dvv(uppercaseKey) && "uppercase") || (dvv(lowercaseKey) && "lowercase");

  return (
    globalSize ??
    getOptionFontByGlobal({
      key: uppercaseKey,
      value,
      style: fontStyle,
      styles: {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    })
  );
}
