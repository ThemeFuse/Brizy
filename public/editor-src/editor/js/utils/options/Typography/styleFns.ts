import { OptionValue } from "visual/component/Options/types";
import Config from "visual/global/Config";
import { ReduxState } from "visual/redux/types";
import { Fonts } from "visual/types";
import {
  getFontById,
  getFontCssStyle,
  makeStyleCSSVar
} from "visual/utils/fonts";
import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
import { Weight } from "visual/utils/fonts/Weight";
import { FONT_INITIAL } from "visual/utils/fonts/utils";
import { Positive } from "visual/utils/math/Positive";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionFontByGlobal } from "visual/utils/options";
import { DESKTOP } from "visual/utils/responsiveMode";
import { capByPrefix } from "visual/utils/string";
import { CSSValue as CSSValue_ } from "visual/utils/style2/types";
import { isNullish } from "visual/utils/value";

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
      v[fontFamilyKey as keyof typeof v],
      dvv(fontStyleKey),
      allFontStyles
    );
    const fontFamilyType = getOptionFontByGlobal(
      "fontFamilyType",
      v[fontFamilyTypeKey as keyof typeof v],
      dvv(fontStyleKey),
      allFontStyles
    );

    if (isNullish(fontFamily) || isNullish(fontFamilyType)) {
      return "";
    }

    return getFontById({ type: fontFamilyType, family: fontFamily, fonts })
      .family;
  }
}

export function styleTypographyFontSize({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue): Positive {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontSizeKey = capByPrefix(prefix, "fontSize");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({ fontStyle, key: "fontSize", device });

  return (
    globalSize ??
    getOptionFontByGlobal(
      dvk("fontSize"),
      dvv(fontSizeKey),
      dvv(fontStyleKey),
      {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    )
  );
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
    return (
      getOptionFontByGlobal(
        dvk("fontSizeSuffix"),
        dvv(fontSizeSuffixKey),
        dvv(fontStyleKey),
        {
          fontStyles: fontsData.fontStyles,
          extraFontStyles: fontsData.extraFontStyles
        }
      ) || "px"
    );
  }
}

export function styleTypographyLineHeight({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue): Positive {
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
      dvv(fontStyleKey),
      {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    )
  );
}

export function styleTypographyFontWeight({
  v,
  device,
  state,
  prefix = "",
  fontsData
}: CSSValue): Weight {
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
      dvv(fontStyleKey),
      {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    )
  );
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
    `${getOptionFontByGlobal(
      dvk("letterSpacing"),
      dvv(letterSpacingKey),
      dvv(fontStyleKey),
      {
        fontStyles: fontsData.fontStyles,
        extraFontStyles: fontsData.extraFontStyles
      }
    )}${suffix}`
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

  return (
    globalSize ??
    getOptionFontByGlobal(fontVariationKey, value, dvv(fontStyleKey), {
      fontStyles: fontsData.fontStyles,
      extraFontStyles: fontsData.extraFontStyles
    })
  );
}
