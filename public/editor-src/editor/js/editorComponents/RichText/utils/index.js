import { isHex } from "visual/utils/color";
import { getUsedFonts } from "visual/utils/fonts";
import { getDynamicContentByPlaceholder } from "visual/utils/options";
import { decodeFromString } from "visual/utils/string";

const DEFAULT_LINE_HEIGHT = 1.5;

const rgbTohex = (rgb = "rgb(0, 0, 0)") => {
  rgb = rgb.match(
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i
  );
  return rgb
    ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
    : rgb;
};

const formatStr = str => {
  return str
    .trim()
    .toLowerCase()
    .replace(/"|'/g, "")
    .replace(/ /g, "_");
};

const getTagName = ({ header, pre }, $elem) => {
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

const getFirstValue = format => (Array.isArray(format) ? format[0] : format);

const getCurrentFont = font => {
  const fontKeys = getUsedFonts().map(item => item["id"]);
  const currentFonts = font.split(",");

  const currentFont = currentFonts.find(item =>
    fontKeys.includes(formatStr(item))
  );

  return currentFont ? formatStr(currentFont) : null;
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
    popup = ""
  } = decodeFromString(value);

  return {
    linkType: type,
    linkAnchor: anchor.replace("#", ""),
    linkExternal: external,
    linkExternalBlank: externalBlank,
    linkExternalRel: externalRel,
    linkPopulation: population,
    linkExternalType: externalType,
    linkPopup: popup.replace("#", "")
  };
};

export const getFormats = ($elem, format = {}, deviceMode) => {
  const $blockElement = $elem.closest("p, :header, pre, div");
  const size = parseInt($elem.css("fontSize"));
  const cssColor = $elem.css("color");
  const cssOpacity = $elem.css("opacity");
  const cssMarginTop = parseFloat($blockElement.css("marginTop"));
  const cssMarginBottom = parseFloat($blockElement.css("marginBottom"));
  const cssHeight = parseFloat($elem.css("lineHeight"));
  const letterSpacing = parseFloat($elem.css("letterSpacing"));
  const height = isNaN(cssHeight) ? DEFAULT_LINE_HEIGHT : cssHeight / size;
  const cssAlign = $elem.css("textAlign");
  const align = ["left", "center", "right", "justify"].includes(cssAlign)
    ? cssAlign
    : "left";
  const font = $elem.css("fontFamily");
  const weight = parseInt($elem.css("fontWeight"));

  const formatSize = format[`${deviceMode}Size`];
  const formatWeight = format[`${deviceMode}Weight`];
  const formatHeight = format[`${deviceMode}Height`];
  const formatLetterSpacing = format[`${deviceMode}LetterSpacing`];
  const marginTop = format[`${deviceMode}MarginTop`];
  const marginBottom = format[`${deviceMode}MarginBottom`];

  const link = format.link ? getLink(getFirstValue(format.link)) : {};
  const populationColor = format.populationColor
    ? { populationColor: decodeFromString(format.populationColor) }
    : {};

  let hex = format.color ? getFirstValue(format.color) : cssColor;

  if (!isHex(hex)) {
    hex = rgbTohex(hex);
  }

  return {
    ...format,

    color: {
      hex,
      opacity: format.opacity ? getFirstValue(format.opacity) : cssOpacity
    },
    colorPalette: format.colorPalette || null,
    font: format.font ? getFirstValue(format.font) : getCurrentFont(font),
    fontStyle: format.fontStyle || null,
    height: formatHeight
      ? getFirstValue(formatHeight).replace("_", ".")
      : String(height),
    horizontalAlign: format.horizontalAlign || align,
    intermediateTabletHeight: format.intermediateTabletHeight || null,
    intermediateMobileHeight: format.intermediateMobileHeight || null,
    intermediateTabletSize: format.intermediateTabletSize || null,
    intermediateMobileSize: format.intermediateMobileSize || null,
    intermediateTabletLetterSpacing:
      format.intermediateTabletLetterSpacing || null,
    intermediateMobileLetterSpacing:
      format.intermediateMobileLetterSpacing || null,
    intermediateTabletWeight: format.intermediateTabletWeight || null,
    intermediateMobileWeight: format.intermediateMobileWeight || null,

    letterSpacing: formatLetterSpacing
      ? getFirstValue(formatLetterSpacing)
          .replace("m_", "-")
          .replace("_", ".")
      : String(letterSpacing),
    ...link,
    ...populationColor,
    list: format.list ? getFirstValue(format.list) : null,
    marginBottom: marginBottom ? getFirstValue(marginBottom) : cssMarginBottom,
    marginTop: marginTop ? getFirstValue(marginTop) : cssMarginTop,
    tabletHeight: format.tabletHeight || null,
    mobileHeight: format.mobileHeight || null,
    tabletHorizontalAlign: format.tabletHorizontalAlign || align,
    mobileHorizontalAlign: format.mobileHorizontalAlign || align,
    tabletSize: format.tabletSize || null,
    mobileSize: format.mobileSize || null,
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
    tabletWeight: format.tabletWeight || null,
    mobileWeight: format.mobileWeight || null,
    size: formatSize ? getFirstValue(formatSize) : size,
    tagName: getTagName(format, $elem),
    weight: formatWeight ? getFirstValue(formatWeight) : String(weight)
  };
};
