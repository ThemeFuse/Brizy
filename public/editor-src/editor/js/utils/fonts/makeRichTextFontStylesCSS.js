import getFontById from "./getFontById";

const generateStyles = ({
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
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

  const mobile = [
    `font-size: ${mobileFontSize}px;`,
    `font-weight: ${mobileFontWeight};`,
    `letter-spacing: ${mobileLetterSpacing}px;`,
    `line-height: ${mobileLineHeight}em;`
  ].join("");

  return {
    desktop,
    mobile
  };
};

export const makeRichTextFontStylesCSS = value => {
  return value
    .map(item => {
      const { id, ...styles } = item;

      const { desktop, mobile } = generateStyles(styles);
      const className = `.brz-tp-${id.toLowerCase()}`;

      return IS_EDITOR
        ? [
            `.brz-ed--desktop ${className}, ${className} { ${desktop} }`,
            `.brz-ed--mobile ${className} { ${mobile} }`
          ].join("\n")
        : [
            `.brz ${className} { ${desktop} }`,
            `@media (max-width: 767px) {.brz ${className} { ${mobile} } }`
          ].join("\n");
    })
    .join("\n");
};
