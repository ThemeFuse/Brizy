import { once } from "underscore";
import Conf, { Config } from "visual/global/Config";
import { FontStyle as _FontStyle } from "visual/types";
import { isExternalPopup } from "visual/utils/models/modes";
import {
  DESKTOP,
  MOBILE,
  ResponsiveMode,
  TABLET
} from "visual/utils/responsiveMode";
import { uuid } from "visual/utils/uuid";
import { getFontById } from "./getFontById";

interface FontStyle extends _FontStyle {
  fontSizeSuffix: string;
  tabletFontSizeSuffix: string;
  mobileFontSizeSuffix: string;
}

const getUid = once(() => uuid(4));

export const makeStyleCSSVar = (data: {
  id: string;
  key: string;
  device: ResponsiveMode;
  config: Config;
}): string => {
  const { id, key, device, config } = data;
  const _device = device === "desktop" ? "" : device;

  if (isExternalPopup(config)) {
    // For ExternalPopup all global CSS variables must be
    // unique per compile this is because external popup
    // possible to be included in the brizy page and created
    // conflicts with the current page global style
    const uuid = getUid();
    return `--brz-${id}${uuid}${_device}${key}`.toLowerCase();
  }

  // Keys is lowercase because have problems in backend export HTML
  return `--brz-${id}${_device}${key}`.toLowerCase();
};

export const makeGlobalStylesTypography = (fontStyles: FontStyle[]): string => {
  const config = Conf.getAll();

  const vars = fontStyles
    .map(style => {
      const {
        id: _id,
        fontSize,
        fontSizeSuffix,
        fontWeight,
        letterSpacing,
        lineHeight,
        mobileFontSize,
        mobileFontSizeSuffix,
        mobileFontWeight,
        mobileLetterSpacing,
        mobileLineHeight,
        tabletFontSize,
        tabletFontSizeSuffix,
        tabletFontWeight,
        tabletLetterSpacing,
        tabletLineHeight
      } = style;
      const id = _id.toLowerCase();
      const fontFamily = getFontById({
        family: style.fontFamily,
        type: style.fontFamilyType
      }).family;

      const _fontSize = `${fontSize}${fontSizeSuffix ?? "px"}`;
      const _mobileFontSize = `${mobileFontSize}${mobileFontSizeSuffix ??
        "px"}`;
      const _tabletFontSize = `${tabletFontSize}${tabletFontSizeSuffix ??
        "px"}`;
      const storyFontSize = `${style.fontSize * 0.23}%`;

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

      const storyFontSizeKey = makeStyleCSSVar({
        id,
        config,
        key: "storyFontSize",
        device: DESKTOP
      });

      return `
      ${fontFamilyKey}: ${fontFamily};
      ${fontSizeKey}: ${_fontSize};
      ${fontSizeSuffixKey}: ${fontSizeSuffix};
      ${fontWeightKey}: ${fontWeight};
      ${letterSpacingKey}: ${letterSpacing};
      ${lineHeightKey}: ${lineHeight};

      ${tabletFontSizeKey}: ${_tabletFontSize};
      ${tabletFontWeightKey}: ${tabletFontWeight};
      ${tabletLetterSpacingKey}: ${tabletLetterSpacing};
      ${tabletLineHeightKey}: ${tabletLineHeight};

      ${mobileFontSizeKey}: ${_mobileFontSize};
      ${mobileFontWeightKey}: ${mobileFontWeight};
      ${mobileLetterSpacingKey}: ${mobileLetterSpacing};
      ${mobileLineHeightKey}: ${mobileLineHeight};

      ${storyFontSizeKey}: ${storyFontSize};
      `;
    })
    .join("");

  return `:root{${vars}}`;
};
