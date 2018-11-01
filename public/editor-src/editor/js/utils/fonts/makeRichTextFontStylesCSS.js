import getFontById from "./getFontById";

const generateStyles = ({
  fontFamily,
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
  const { family } = getFontById(fontFamily);

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

export const makeRichTextFontStylesCSS = value => {
  return value
    .map(item => {
      const { id, ...styles } = item;

      const { desktop, tablet, mobile } = generateStyles(styles);
      const className = `.brz-tp-${id.toLowerCase()}`;

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
