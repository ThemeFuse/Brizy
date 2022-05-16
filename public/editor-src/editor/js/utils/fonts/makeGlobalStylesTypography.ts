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
      const { id: _id } = style;
      const id = _id.toLowerCase();
      const fontFamily = getFontById({
        family: style.fontFamily,
        type: style.fontFamilyType
      }).family;

      const storyRichTextFontSize = `${style.fontSize * 0.23}%`;

      // Keys is lowercase because have problems in backend export HTML
      return `--brz-${id}fontfamily:${fontFamily};--brz-${id}fontfamilytype:${
        style.fontFamilyType
      };--brz-${id}fontsize:${style.fontSize}${style.fontSizeSuffix ??
        "px"};--brz-${id}fontsizesuffix:${
        style.fontSizeSuffix
      };--brz-${id}fontweight:${style.fontWeight};--brz-${id}letterspacing:${
        style.letterSpacing
      }px;--brz-${id}lineheight:${style.lineHeight};--brz-${id}mobilefontsize:${
        style.mobileFontSize
      }${style.mobileFontSizeSuffix ?? "px"};--brz-${id}mobilefontweight:${
        style.mobileFontWeight
      };--brz-${id}mobileletterspacing:${
        style.mobileLetterSpacing
      }px;--brz-${id}mobilelineheight:${
        style.mobileLineHeight
      };--brz-${id}tabletfontsize:${
        style.tabletFontSize
      }${style.tabletFontSizeSuffix ?? "px"};--brz-${id}tabletfontweight:${
        style.tabletFontWeight
      };--brz-${id}tabletletterspacing:${
        style.tabletLetterSpacing
      }px;--brz-${id}tabletlineheight:${
        style.tabletLineHeight
      };--brz-${id}storyfontsize:${storyRichTextFontSize};`;
    })
    .join("");

  return `:root{${vars}}`;
};
