import { FontStyle as _FontStyle } from "visual/types";
import { getFontById } from "./getFontById";

interface FontStyle extends _FontStyle {
  fontSizeSuffix: string;
  tabletFontSizeSuffix: string;
  mobileFontSizeSuffix: string;
}

export const makeGlobalStylesTypography = (fontStyles: FontStyle[]): string => {
  const vars = fontStyles
    .map(style => {
      const { id } = style;
      const fontFamily = getFontById({
        family: style.fontFamily,
        type: style.fontFamilyType
      }).family;

      const storyRichTextFontSize = `${style.fontSize * 0.23}%`;

      return `--brz-${id}FontFamily:${fontFamily};--brz-${id}FontFamilyType:${
        style.fontFamilyType
      };--brz-${id}FontSize:${style.fontSize}${style.fontSizeSuffix ??
        "px"};--brz-${id}FontSizeSuffix:${
        style.fontSizeSuffix
      };--brz-${id}FontWeight:${style.fontWeight};--brz-${id}LetterSpacing:${
        style.letterSpacing
      }px;--brz-${id}LineHeight:${style.lineHeight};--brz-${id}MobileFontSize:${
        style.mobileFontSize
      }${style.mobileFontSizeSuffix ?? "px"};--brz-${id}MobileFontWeight:${
        style.mobileFontWeight
      };--brz-${id}MobileLetterSpacing:${
        style.mobileLetterSpacing
      }px;--brz-${id}MobileLineHeight:${
        style.mobileLineHeight
      };--brz-${id}TabletFontSize:${
        style.tabletFontSize
      }${style.tabletFontSizeSuffix ?? "px"};--brz-${id}TabletFontWeight:${
        style.tabletFontWeight
      };--brz-${id}TabletLetterSpacing:${
        style.tabletLetterSpacing
      }px;--brz-${id}TabletLineHeight:${
        style.tabletLineHeight
      };--brz-${id}StoryFontSize:${storyRichTextFontSize};`;
    })
    .join("");

  return `:root{${vars}}`;
};
