import { isHex } from "visual/utils/color";
import { getFontStyle, getUsedFonts } from "visual/utils/fonts";
import { getDynamicContentByPlaceholder } from "visual/utils/options";
import { decodeFromString } from "visual/utils/string";

const DEFAULT_LINE_HEIGHT = 1.5;

const rgbaTohex = (rgba = "rgba(0, 0, 0, 1)") => {
  rgba = rgba.match(
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i
  );

  return rgba
    ? {
        hex: `#${toHexadecimal(rgba[1])}${toHexadecimal(
          rgba[2]
        )}${toHexadecimal(rgba[3])}`,
        opacity: rgba[4]
      }
    : rgba;

  function toHexadecimal(number) {
    return ("0" + parseInt(number, 10).toString(16)).slice(-2);
  }
};

const formatStr = str => {
  return str
    .trim()
    .toLowerCase()
    .replace(/"|'/g, "")
    .replace(/ /g, "_");
};

const flatFormats = format => {
  return Object.entries(format).reduce((acc, [key, value]) => {
    acc[key] = Array.isArray(value) ? value[0] : value;
    return acc;
  }, {});
};

const parseShadow = str => {
  const [, rgba, shadow] = str.match(/^(rgb.*\)) (.*)/) || [];

  if (rgba && shadow) {
    let { hex, opacity } = rgbaTohex(rgba);
    const [horizontal, vertical, blur] = shadow.split(" ");
    opacity = parseFloat(opacity);

    return {
      hex,
      opacity: !isNaN(opacity) ? opacity : 1,
      vertical: parseInt(vertical),
      horizontal: parseInt(horizontal),
      blur: parseInt(blur)
    };
  }

  return {};
};

/* eslint-disable no-unused-vars */
const getTagName = ({ header, pre }, $elem) => {
  /* eslint-enabled no-unused-vars */
  const preElem = $elem.closest("pre");
  const preTagName = preElem.prop("tagName")
    ? preElem.prop("tagName").toLowerCase()
    : null;

  const headerElem = $elem.closest("p, h1, h2, h3, h4, h5, h6");
  const headerTagName = headerElem.prop("tagName")
    ? headerElem.prop("tagName").toLowerCase()
    : null;

  return preTagName || headerTagName;
};

const getCurrentFont = font => {
  const fontFamilies = getUsedFonts().map(({ family }) => family);
  const currentFonts = font.split(",");

  const currentFont = currentFonts.find(item =>
    fontFamilies.includes(item.replace(/"/g, ""))
  );

  return currentFont ? formatStr(currentFont) : null;
};

const getCurrentFontStyle = fontStyle => {
  return getFontStyle(fontStyle) || {};
};

const getLink = value => {
  const {
    type,
    anchor = "",
    external,
    externalBlank,
    externalRel,
    population,
    externalType,
    popup = "",
    upload
  } = decodeFromString(value);

  return {
    linkType: type,
    linkAnchor: anchor.replace("#", ""),
    linkExternal: external,
    linkExternalBlank: externalBlank,
    linkExternalRel: externalRel,
    linkPopulation: population,
    linkExternalType: externalType,
    linkPopup: popup.replace("#", ""),
    linkUpload: upload
  };
};

export const getFormats = ($elem, format = {}, deviceMode) => {
  format = flatFormats(format);
  const $blockElement = $elem.closest("p, :header, pre, div");
  const cssFontSize = parseInt($elem.css("fontSize"));
  const cssColor = $elem.css("color");
  const cssOpacity = $elem.css("opacity");
  const cssShadow = $elem.css("text-shadow");
  const cssMarginTop = parseFloat($blockElement.css("marginTop"));
  const cssMarginBottom = parseFloat($blockElement.css("marginBottom"));
  const cssHeight = parseFloat($elem.css("lineHeight"));
  const cssLetterSpacing = parseFloat($elem.css("letterSpacing"));
  const cssLineHeight = isNaN(cssHeight)
    ? DEFAULT_LINE_HEIGHT
    : cssHeight / cssFontSize;
  const cssAlign = $elem.css("textAlign");
  const align = ["left", "center", "right", "justify"].includes(cssAlign)
    ? cssAlign
    : "left";
  const cssFontFamily = $elem.css("fontFamily");
  const cssFontWeight = parseInt($elem.css("fontWeight"));

  const marginTop = format[`${deviceMode}MarginTop`];
  const marginBottom = format[`${deviceMode}MarginBottom`];

  const link = format.link ? getLink(format.link) : {};
  const populationColor = format.populationColor
    ? { populationColor: decodeFromString(format.populationColor) }
    : {};

  let hex = format.color ? format.color : cssColor;

  if (!isHex(hex)) {
    hex = rgbaTohex(hex).hex;
  }

  const cfs = getCurrentFontStyle(format.fontStyle) || {};

  const lineHeight = format.lineHeight
    ? format.lineHeight.replace("_", ".")
    : null;

  const tabletLineHeight = format.tabletLineHeight
    ? format.tabletLineHeight.replace("_", ".")
    : null;

  const mobileLineHeight = format.mobileLineHeight
    ? format.mobileLineHeight.replace("_", ".")
    : null;

  const letterSpacing = format.letterSpacing
    ? format.letterSpacing.replace("m_", "-").replace("_", ".")
    : null;

  const tabletLetterSpacing = format.tabletLetterSpacing
    ? format.tabletLetterSpacing.replace("m_", "-").replace("_", ".")
    : null;

  const mobileLetterSpacing = format.mobileLetterSpacing
    ? format.mobileLetterSpacing.replace("m_", "-").replace("_", ".")
    : null;

  const opacity = format.opacity || cssOpacity;

  // it's only for situations when colorPalette contain this data - "color2, color3" (normally it should never happen)
  const palette = format.colorPalette ? format.colorPalette.split(",")[0] : "";

  return {
    ...format,

    color: {
      hex,
      opacity: !isNaN(opacity) ? opacity : 1
    },
    colorPalette: palette,

    shadow: parseShadow(format.shadow || cssShadow),
    shadowColorPalette: format.shadowColorPalette || "",

    fontFamily:
      format.fontFamily || cfs.fontFamily || getCurrentFont(cssFontFamily),
    tabletFontFamily: null,
    mobileFontFamily: null,
    fontFamilyType: cfs.fontFamilyType || format.fontFamilyType || "google",
    tabletFontFamilyType: null,
    mobileFontFamilyType: null,

    fontStyle: format.fontStyle || null,

    fontWeight: Number(format.fontWeight) || cfs.fontWeight || cssFontWeight,
    tabletFontWeight:
      Number(format.tabletFontWeight) || cfs.tabletFontWeight || null,
    mobileFontWeight:
      Number(format.mobileFontWeight) || cfs.mobileFontWeight || null,

    lineHeight: Number(lineHeight) || cfs.lineHeight || cssLineHeight,
    tabletLineHeight: Number(tabletLineHeight) || cfs.tabletLineHeight || null,
    mobileLineHeight: Number(mobileLineHeight) || cfs.mobileLineHeight || null,

    fontSize: format.fontSize || cfs.fontSize || cssFontSize,
    tabletFontSize: format.tabletFontSize || cfs.tabletFontSize || null,
    mobileFontSize: format.mobileFontSize || cfs.mobileFontSize || null,

    letterSpacing: !isNaN(Number(tabletLetterSpacing))
      ? Number(letterSpacing)
      : cfs.letterSpacing || cssLetterSpacing,
    tabletLetterSpacing:
      tabletLetterSpacing && !isNaN(Number(tabletLetterSpacing))
        ? Number(tabletLetterSpacing)
        : cfs.tabletLetterSpacing || null,
    mobileLetterSpacing:
      mobileLetterSpacing && !isNaN(Number(mobileLetterSpacing))
        ? Number(mobileLetterSpacing)
        : cfs.mobileLetterSpacing || null,

    backgroundImage: format.backgroundImage || null,
    backgroundGradient: format.backgroundGradient || null,
    horizontalAlign: format.horizontalAlign || align,
    intermediateTabletLineHeight: format.intermediateTabletLineHeight || null,
    intermediateMobileLineHeight: format.intermediateMobileLineHeight || null,
    intermediateTabletFontSize: format.intermediateTabletFontSize || null,
    intermediateMobileFontSize: format.intermediateMobileFontSize || null,
    intermediateTabletLetterSpacing:
      format.intermediateTabletLetterSpacing || null,
    intermediateMobileLetterSpacing:
      format.intermediateMobileLetterSpacing || null,
    intermediateTabletWeight: format.intermediateTabletWeight || null,
    intermediateMobileWeight: format.intermediateMobileWeight || null,

    ...link,
    ...populationColor,

    list: format.list ? format.list : null,
    marginBottom: marginBottom ? marginBottom : cssMarginBottom,
    marginTop: marginTop ? marginTop : cssMarginTop,

    tabletHorizontalAlign: format.tabletHorizontalAlign || align,
    mobileHorizontalAlign: format.mobileHorizontalAlign || align,

    population: format.population
      ? {
          population: format.population,
          label: $elem.closest("[data-population]").text(),
          display: getDynamicContentByPlaceholder(
            "richText",
            `{{${format.population}}}`
          ).display
        }
      : null,
    prepopulation: format.prepopulation
      ? $elem.closest(".brz-pre-population-visible").text()
      : null,
    tagName: getTagName(format, $elem)
  };
};
