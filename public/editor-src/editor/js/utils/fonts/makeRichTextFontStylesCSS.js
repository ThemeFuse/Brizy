import { getFontById } from "./getFontById";

const generateStyles = ({
  fontFamily,
  fontFamilyType,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  tabletFontSize,
  tabletFontWeight,
  tabletLetterSpacing,
  tabletLineHeight,
  mobileFontSize,
  mobileFontWeight,
  mobileLetterSpacing,
  mobileLineHeight
}) => {
  const { family } = getFontById({ family: fontFamily, type: fontFamilyType });

  const desktop = [
    `font-family: ${family};`,
    `font-size: ${fontSize}px;`,
    `font-weight: ${fontWeight};`,
    `letter-spacing: ${letterSpacing}px;`,
    `line-height: ${lineHeight}em;`
  ].join("");

  const tablet = [
    `font-size: ${tabletFontSize}px;`,
    `font-weight: ${tabletFontWeight};`,
    `letter-spacing: ${tabletLetterSpacing}px;`,
    `line-height: ${tabletLineHeight}em;`
  ].join("");

  const mobile = [
    `font-size: ${mobileFontSize}px;`,
    `font-weight: ${mobileFontWeight};`,
    `letter-spacing: ${mobileLetterSpacing}px;`,
    `line-height: ${mobileLineHeight}em;`
  ].join("");

  return {
    desktop,
    tablet,
    mobile
  };
};

export const dynamicStyleIds = {
  heading1: "h1",
  heading2: "h2",
  heading3: "h3",
  heading4: "h4",
  heading5: "h5",
  heading6: "h6",
  paragraph: "p"
};

export const makeRichTextFontStylesCSS = (
  value,
  { getClassName = c => c } = {}
) => {
  return value
    .map(item => {
      const { id, ...styles } = item;

      const { desktop, tablet, mobile } = generateStyles(styles);
      const className = getClassName(`.brz-tp-${id.toLowerCase()}`);

      return IS_EDITOR
        ? [
            `.brz-ed--desktop ${className}, ${className} { ${desktop} }`,
            `.brz-ed--tablet ${className} { ${tablet} }`,
            `.brz-ed--mobile ${className} { ${mobile} }`
          ].join("\n")
        : [
            `.brz ${className} { ${desktop} }`,
            `@media (max-width: 991px) {.brz ${className} { ${tablet} } }`,
            `@media (max-width: 767px) {.brz ${className} { ${mobile} } }`
          ].join("\n");
    })
    .join("\n");
};

export const makeRichTextDynamicFontStylesCSS = value => {
  return value
    .map(item => {
      const { id, ...styles } = item;
      const { desktop, tablet, mobile } = generateStyles(styles);
      const dynamicClassName = dynamicStyleIds[id.toLowerCase()];

      return IS_EDITOR
        ? [
            `.brz-ed--desktop .brz-tp__dc-block-st1 ${dynamicClassName} { ${desktop} }`,
            `.brz-ed--tablet .brz-tp__dc-block-st1 ${dynamicClassName} { ${tablet} }`,
            `.brz-ed--mobile .brz-tp__dc-block-st1 ${dynamicClassName} { ${mobile} }`
          ].join("\n")
        : [
            `.brz .brz-tp__dc-block-st1 ${dynamicClassName} { ${desktop} }`,
            `@media (max-width: 991px) {.brz .brz-tp__dc-block-st1 ${dynamicClassName} { ${tablet} } }`,
            `@media (max-width: 767px) {.brz .brz-tp__dc-block-st1 ${dynamicClassName} { ${mobile} } }`
          ].join("\n");
    })
    .join("\n");
};
