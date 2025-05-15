import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Store } from "visual/redux/store";
import { FontStyle } from "visual/types/Style";
import {
  FONT_INITIAL,
  makeGlobalStylesTextTransform
} from "visual/utils/fonts/utils";
import { isExternalPopup } from "visual/utils/models/modes";
import {
  DESKTOP,
  MOBILE,
  ResponsiveMode,
  TABLET
} from "visual/utils/responsiveMode";
import { uidByConfig } from "visual/utils/uuid";
import { getFontById } from "./getFontById";

export const makeStyleCSSVar = (data: {
  id: string;
  key: string;
  device: ResponsiveMode;
  config: ConfigCommon;
}): string => {
  const { id, key, device, config } = data;
  const _device = device === "desktop" ? "" : device;

  if (isExternalPopup(config)) {
    // For ExternalPopup all global CSS variables must be
    // unique per compile this is because external popup
    // possible to be included in the brizy page and created
    // conflicts with the current page global style
    const uuid = uidByConfig(config);
    return `--brz-${id}${uuid}${_device}${key}`.toLowerCase();
  }

  // Keys is lowercase because have problems in backend export HTML
  return `--brz-${id}${_device}${key}`.toLowerCase();
};

interface Data {
  fontStyles: FontStyle[];
  store: Store;
  config: ConfigCommon;
}

export const makeGlobalStylesTypography = ({
  fontStyles,
  store,
  config
}: Data): string => {
  const vars = fontStyles
    .map((style) => {
      const {
        id: _id,
        fontSize,
        fontSizeSuffix,
        fontWeight,
        letterSpacing,
        lineHeight,
        variableFontWeight = 400,
        fontWidth = 100,
        fontSoftness = 0,
        bold = false,
        italic = false,
        underline = false,
        strike = false,
        uppercase = false,
        lowercase = false,
        mobileFontSize,
        mobileFontSizeSuffix,
        mobileFontWeight,
        mobileLetterSpacing,
        mobileLineHeight,
        mobileVariableFontWeight = 400,
        mobileFontSoftness = 0,
        mobileFontWidth = 100,
        tabletFontSize,
        tabletFontSizeSuffix,
        tabletFontWeight,
        tabletLetterSpacing,
        tabletLineHeight,
        tabletVariableFontWeight = 400,
        tabletFontSoftness = 0,
        tabletFontWidth = 100
      } = style;
      const id = _id.toLowerCase();

      const fontFamily =
        style.fontFamily === FONT_INITIAL
          ? FONT_INITIAL
          : getFontById({
              family: style.fontFamily,
              type: style.fontFamilyType,
              store
            }).family;

      const _fontSize = `${fontSize}${fontSizeSuffix ?? "px"}`;
      const _mobileFontSize = `${mobileFontSize}${
        mobileFontSizeSuffix ?? "px"
      }`;
      const _tabletFontSize = `${tabletFontSize}${
        tabletFontSizeSuffix ?? "px"
      }`;
      const storyFontSize = `${style.fontSize * 0.23}%`;

      const fontVariation = `"wght" ${variableFontWeight}, "wdth" ${fontWidth}, "SOFT" ${fontSoftness}`;
      const mobileFontVariation = `"wght" ${mobileVariableFontWeight}, "wdth" ${mobileFontWidth}, "SOFT" ${mobileFontSoftness}`;
      const tabletFontVariation = `"wght" ${tabletVariableFontWeight}, "wdth" ${tabletFontWidth}, "SOFT" ${tabletFontSoftness}`;

      const fontFamilyKey = makeStyleCSSVar({
        id,
        config,
        key: "fontFamily",
        device: DESKTOP
      });
      const fontSizeKey = makeStyleCSSVar({
        id,
        config,
        key: "fontSize",
        device: DESKTOP
      });
      const fontSizeSuffixKey = makeStyleCSSVar({
        id,
        config,
        key: "fontSizeSuffix",
        device: DESKTOP
      });
      const fontWeightKey = makeStyleCSSVar({
        id,
        config,
        key: "fontWeight",
        device: DESKTOP
      });
      const letterSpacingKey = makeStyleCSSVar({
        id,
        config,
        key: "letterSpacing",
        device: DESKTOP
      });
      const lineHeightKey = makeStyleCSSVar({
        id,
        config,
        key: "lineHeight",
        device: DESKTOP
      });
      const fontVariationKey = makeStyleCSSVar({
        id,
        config,
        key: "fontVariation",
        device: DESKTOP
      });

      const tabletFontSizeKey = makeStyleCSSVar({
        id,
        config,
        key: "fontSize",
        device: TABLET
      });
      const tabletFontWeightKey = makeStyleCSSVar({
        id,
        config,
        key: "fontWeight",
        device: TABLET
      });
      const tabletLetterSpacingKey = makeStyleCSSVar({
        id,
        config,
        key: "letterSpacing",
        device: TABLET
      });
      const tabletLineHeightKey = makeStyleCSSVar({
        id,
        config,
        key: "lineHeight",
        device: TABLET
      });
      const tabletFontVariationKey = makeStyleCSSVar({
        id,
        config,
        key: "fontVariation",
        device: TABLET
      });

      const mobileFontSizeKey = makeStyleCSSVar({
        id,
        config,
        key: "fontSize",
        device: MOBILE
      });
      const mobileFontWeightKey = makeStyleCSSVar({
        id,
        config,
        key: "fontWeight",
        device: MOBILE
      });
      const mobileLetterSpacingKey = makeStyleCSSVar({
        id,
        config,
        key: "letterSpacing",
        device: MOBILE
      });
      const mobileLineHeightKey = makeStyleCSSVar({
        id,
        config,
        key: "lineHeight",
        device: MOBILE
      });
      const mobileFontVariationKey = makeStyleCSSVar({
        id,
        config,
        key: "fontVariation",
        device: MOBILE
      });

      const storyFontSizeKey = makeStyleCSSVar({
        id,
        config,
        key: "storyFontSize",
        device: DESKTOP
      });

      const textTransformStyle = makeGlobalStylesTextTransform(
        {
          bold,
          italic,
          underline,
          strike,
          uppercase,
          lowercase,
          id,
          fontWeight,
          tabletFontWeight,
          mobileFontWeight
        },
        config
      );

      // "px" on letterSpacing is hardcoded because we don't have another suffix on letterSpacing
      return `
      ${fontFamilyKey}:${fontFamily};
      ${fontSizeKey}:${_fontSize};
      ${fontSizeSuffixKey}:${fontSizeSuffix};
      ${fontWeightKey}:${fontWeight};
      ${letterSpacingKey}:${letterSpacing}px;
      ${lineHeightKey}:${lineHeight};
      ${fontVariationKey}:${fontVariation};
      ${tabletFontSizeKey}:${_tabletFontSize};
      ${tabletFontWeightKey}:${tabletFontWeight};
      ${tabletLetterSpacingKey}:${tabletLetterSpacing}px;
      ${tabletLineHeightKey}:${tabletLineHeight};
      ${tabletFontVariationKey}:${tabletFontVariation};
      ${mobileFontSizeKey}:${_mobileFontSize};
      ${mobileFontWeightKey}:${mobileFontWeight};
      ${mobileLetterSpacingKey}:${mobileLetterSpacing}px;
      ${mobileLineHeightKey}:${mobileLineHeight};
      ${mobileFontVariationKey}:${mobileFontVariation};
      ${storyFontSizeKey}:${storyFontSize};
      ${textTransformStyle}
      `;
    })
    .join("")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .join("");

  return `:root{${vars}}`;
};
