import { Store } from "visual/redux/store";
import { FontStyle } from "visual/types/Style";
import { getFontById } from "./getFontById";

const generateStyles = (style: Omit<FontStyle, "id">, store: Store) => {
  const {
    fontFamily,
    fontFamilyType,
    fontSize,
    fontSizeSuffix,
    fontWeight,
    letterSpacing,
    lineHeight,
    tabletFontSize,
    tabletFontSizeSuffix,
    tabletFontWeight,
    tabletLetterSpacing,
    tabletLineHeight,
    mobileFontSize,
    mobileFontSizeSuffix,
    mobileFontWeight,
    mobileLetterSpacing,
    mobileLineHeight
  } = style;
  const { family } = getFontById({
    family: fontFamily,
    type: fontFamilyType,
    store
  });

  const desktop = [
    `font-family: ${family};`,
    `font-size: ${fontSize}${fontSizeSuffix};`,
    `font-weight: ${fontWeight};`,
    `letter-spacing: ${letterSpacing}px;`,
    `line-height: ${lineHeight};`
  ].join("");

  const tablet = [
    `font-family: ${family};`,
    `font-size: ${tabletFontSize}${tabletFontSizeSuffix};`,
    `font-weight: ${tabletFontWeight};`,
    `letter-spacing: ${tabletLetterSpacing}px;`,
    `line-height: ${tabletLineHeight};`
  ].join("");

  const mobile = [
    `font-family: ${family};`,
    `font-size: ${mobileFontSize}${mobileFontSizeSuffix};`,
    `font-weight: ${mobileFontWeight};`,
    `letter-spacing: ${mobileLetterSpacing}px;`,
    `line-height: ${mobileLineHeight};`
  ].join("");

  return {
    desktop,
    tablet,
    mobile
  };
};

export const dynamicStyleIds: { [k: string]: string } = {
  heading1: "h1",
  heading2: "h2",
  heading3: "h3",
  heading4: "h4",
  heading5: "h5",
  heading6: "h6",
  paragraph: "p"
};

export const makeRichTextDynamicFontStylesCSS = (
  value: Array<FontStyle>,
  store: Store
) => {
  return value
    .map((item) => {
      const { id, ...styles } = item;
      const { desktop, tablet, mobile } = generateStyles(styles, store);
      const dynamicClassName = dynamicStyleIds[id.toLowerCase()];

      return [
        `.brz .brz-tp__dc-block-st1 ${dynamicClassName} { ${desktop} }`,
        `@media (max-width: 991px) {.brz .brz-tp__dc-block-st1 ${dynamicClassName} { ${tablet} } }`,
        `@media (max-width: 767px) {.brz .brz-tp__dc-block-st1 ${dynamicClassName} { ${mobile} } }`
      ].join("\n");
    })
    .join("\n");
};
