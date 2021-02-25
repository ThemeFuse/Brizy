import { getFontById } from "./getFontById";

const generateStyles = ({
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
}) => {
  const { family } = getFontById({ family: fontFamily, type: fontFamilyType });

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

export const dynamicStyleIds = {
  heading1: "h1",
  heading2: "h2",
  heading3: "h3",
  heading4: "h4",
  heading5: "h5",
  heading6: "h6",
  paragraph: "p"
};

export const makeRichTextFontStylesCSS = (value, prefix = p => p) => {
  return value
    .map(item => {
      const { id, ...styles } = item;

      const { desktop, tablet, mobile } = generateStyles(styles);
      let classNameDesktop = `.brz-tp-${id.toLowerCase()}`;
      let classNameDesktop2 = `.brz-tp-lg-${id.toLowerCase()}`;
      let classNameTablet = `.brz-tp-sm-${id.toLowerCase()}`;
      let classNameMobile = `.brz-tp-xs-${id.toLowerCase()}`;

      if (typeof prefix === "function") {
        classNameDesktop = prefix(classNameDesktop);
        classNameDesktop2 = prefix(classNameDesktop2);
        classNameTablet = prefix(classNameTablet);
        classNameMobile = prefix(classNameMobile);
      }

      const editorDesktopSelectors = [
        `.brz-ed--desktop ${classNameDesktop}`,
        classNameDesktop,
        `.brz-ed.brz-ed--desktop ${classNameDesktop2}`
      ];

      const editorTabletSelectors = [
        `.brz-ed--tablet ${classNameDesktop}`,
        `.brz-ed.brz-ed--tablet ${classNameTablet}`
      ];

      const editorMobileSelectors = [
        `.brz-ed--mobile ${classNameDesktop}`,
        `.brz-ed.brz-ed--mobile ${classNameMobile}`
      ];

      const previewDesktopSelectors = [
        `.brz ${classNameDesktop}`,
        `body.brz ${classNameDesktop2}`
      ];

      const previewTabletSelectors = [
        `.brz ${classNameDesktop}`,
        `body.brz div ${classNameTablet}`
      ];

      //body.brz div.brz-root__container - because this selector should be stronger
      // then tablet&desktop selectors
      const previewMobileSelectors = [
        `.brz ${classNameDesktop}`,
        `body.brz div.brz-root__container ${classNameMobile}`
      ];

      return IS_EDITOR
        ? [
            `${editorDesktopSelectors.join(", ")} { ${desktop} }`,
            `${editorTabletSelectors.join(", ")} { ${tablet} }`,
            `${editorMobileSelectors.join(", ")} { ${mobile} }`
          ].join("\n")
        : [
            `${previewDesktopSelectors.join(", ")} { ${desktop} }`,
            `@media (max-width: 991px) {${previewTabletSelectors.join(
              ", "
            )} { ${tablet} } }`,
            `@media (max-width: 767px) {${previewMobileSelectors.join(
              ", "
            )} { ${mobile} } }`
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
