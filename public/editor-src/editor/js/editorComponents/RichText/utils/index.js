import { isHex } from "visual/utils/color";
import { getDynamicContentByPlaceholder } from "visual/utils/options";
import { decodeFromString } from "visual/utils/string";

const DEFAULT_LINE_HEIGHT = 1.5;

function quillStringToNumber(num) {
  return Number(num.replace("m_", "-").replace("_", "."));
}

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

const flatFormats = format => {
  return Object.entries(format).reduce((acc, [key, value]) => {
    acc[key] = Array.isArray(value) ? value[0] : value;
    return acc;
  }, {});
};

const parseShadow = (str = "") => {
  const [, rgba, shadow] = str.split(", rgb")[0].match(/^(rgb.*\)) (.*)/) || [];

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
  const cssFontWeight = parseInt($elem.css("fontWeight"));
  const cssHeight = parseFloat($elem.css("lineHeight"));
  const cssLineHeight = isNaN(cssHeight)
    ? DEFAULT_LINE_HEIGHT
    : cssHeight / cssFontSize;
  const cssLetterSpacing = parseFloat($elem.css("letterSpacing"));

  const cssColor = $elem.css("color");
  const cssOpacity = $elem.css("opacity");
  const cssShadow = $elem.css("text-shadow");
  const cssMarginTop = parseFloat($blockElement.css("marginTop"));
  const cssMarginBottom = parseFloat($blockElement.css("marginBottom"));
  const cssAlign = $elem.css("textAlign");
  const align = ["left", "center", "right", "justify"].includes(cssAlign)
    ? cssAlign
    : "left";
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

  const opacity = format.opacity || cssOpacity;

  // it's only for situations when colorPalette contain this data - "color2, color3" (normally it should never happen)
  const palette = format.colorPalette ? format.colorPalette.split(",")[0] : "";

  let tabletFontStyle = "";
  if (!format.tabletFontStyle && !format.tabletFontSize) {
    tabletFontStyle = null;
  } else if (format.tabletFontSize) {
    tabletFontStyle = "";
  } else {
    tabletFontStyle = format.tabletFontStyle;
  }

  let mobileFontStyle = "";
  if (!format.mobileFontStyle && !format.mobileFontSize) {
    mobileFontStyle = null;
  } else if (format.mobileFontSize) {
    mobileFontStyle = "";
  } else {
    mobileFontStyle = format.mobileFontStyle;
  }

  return {
    ...format,

    color: {
      hex,
      opacity: !isNaN(opacity) ? opacity : 1
    },
    colorPalette: palette,

    shadow: parseShadow(format.shadow || cssShadow),
    shadowColorPalette: format.shadowColorPalette || "",

    fontFamily: format.fontFamily || null,
    tabletFontFamily: null,
    mobileFontFamily: null,
    fontFamilyType: format.fontFamilyType || null,
    tabletFontFamilyType: null,
    mobileFontFamilyType: null,

    fontStyleNew: format.fontStyleNew ?? "",
    fontStyle: format.fontStyle ?? "",
    tabletFontStyle,
    mobileFontStyle,

    fontSize: Number(format.fontSize) || cssFontSize,
    tabletFontSize:
      Number(format.tabletFontSize) ||
      Number(format.intermediateTabletFontSize) ||
      null,
    mobileFontSize:
      Number(format.mobileFontSize) ||
      Number(format.intermediateMobileFontSize) ||
      null,

    fontSizeSuffix: format.fontSizeSuffix || null,
    tabletFontSizeSuffix:
      format.tabletFontSizeSuffix ||
      format.intermediateTabletFontSizeSuffix ||
      null,
    mobileFontSizeSuffix:
      format.mobileFontSizeSuffix ||
      format.intermediateMobileFontSizeSuffix ||
      null,

    fontWeight: Number(format.fontWeight) || cssFontWeight,
    tabletFontWeight:
      Number(format.tabletFontWeight) ||
      Number(format.intermediateTabletWeight) ||
      null,
    mobileFontWeight:
      Number(format.mobileFontWeight) ||
      Number(format.intermediateMobileWeight) ||
      null,

    lineHeight: format.lineHeight
      ? quillStringToNumber(format.lineHeight)
      : cssLineHeight,
    tabletLineHeight: format.tabletLineHeight
      ? quillStringToNumber(
          format.tabletLineHeight ?? format.intermediateTabletLineHeight
        )
      : null,
    mobileLineHeight: format.mobileLineHeight
      ? quillStringToNumber(
          format.mobileLineHeight ?? format.intermediateMobileLineHeight
        )
      : null,

    letterSpacing: format.letterSpacing
      ? quillStringToNumber(format.letterSpacing)
      : cssLetterSpacing,
    tabletLetterSpacing: format.tabletLetterSpacing
      ? quillStringToNumber(
          format.tabletLetterSpacing ?? format.intermediateTabletLetterSpacing
        )
      : null,
    mobileLetterSpacing: format.mobileLetterSpacing
      ? quillStringToNumber(
          format.mobileLetterSpacing ?? format.intermediateMobileLetterSpacing
        )
      : null,

    backgroundImage: format.backgroundImage || null,
    backgroundGradient: format.backgroundGradient || null,

    ...link,
    ...populationColor,

    list: format.list ? format.list : null,
    marginBottom: marginBottom ? marginBottom : cssMarginBottom,
    marginTop: marginTop ? marginTop : cssMarginTop,

    horizontalAlign: format.horizontalAlign || align,
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
