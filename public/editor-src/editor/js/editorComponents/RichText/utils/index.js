import _ from "underscore";
import { isHex } from "visual/utils/color";
import { getUsedFonts } from "visual/utils/fonts";
import { formatLinkFromString } from "./link";

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

const getFirstValue = format => {
  return _.isArray(format) ? format[0] : format;
};

const getCurrentFont = font => {
  const fontKeys = _.pluck(getUsedFonts(), "id");
  const currentFonts = font.split(",");

  const currentFont = _.find(currentFonts, item => {
    return _.indexOf(fontKeys, formatStr(item)) !== -1;
  });

  return currentFont ? formatStr(currentFont) : null;
};

const getLink = value => {
  const {
    type,
    anchor,
    external,
    externalBlank,
    externalRel
  } = formatLinkFromString(value);

  return {
    linkType: type,
    linkAnchor: anchor.replace("#", ""),
    linkExternal: external,
    linkExternalBlank: externalBlank,
    linkExternalRel: externalRel
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
  const height = cssHeight / size;
  const cssAlign = $elem.css("textAlign");
  const align =
    _.indexOf(["left", "center", "right"], cssAlign) != -1 ? cssAlign : "left";
  const font = $elem.css("fontFamily");
  const weight = parseInt($elem.css("fontWeight"));

  const formatSize = format[`${deviceMode}Size`];
  const formatWeight = format[`${deviceMode}Weight`];
  const formatHeight = format[`${deviceMode}Height`];
  const formatLetterSpacing = format[`${deviceMode}LetterSpacing`];
  const marginTop = format[`${deviceMode}MarginTop`];
  const marginBottom = format[`${deviceMode}MarginBottom`];

  const link = format.link ? getLink(format.link) : {};

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
    intermediateHeight: format.intermediateHeight || null,
    intermediateSize: format.intermediateSize || null,
    intermediateLetterSpacing: format.intermediateLetterSpacing || null,
    intermediateWeight: format.intermediateWeight || null,
    letterSpacing: formatLetterSpacing
      ? getFirstValue(formatLetterSpacing)
          .replace("m_", "-")
          .replace("_", ".")
      : String(letterSpacing),
    ...link,
    marginBottom: marginBottom ? getFirstValue(marginBottom) : cssMarginBottom,
    marginTop: marginTop ? getFirstValue(marginTop) : cssMarginTop,
    mobileHeight: format.mobileHeight || null,
    mobileHorizontalAlign: format.mobileHorizontalAlign || align,
    mobileSize: format.mobileSize || null,
    size: formatSize ? getFirstValue(formatSize) : size,
    tagName: getTagName(format, $elem),
    weight: formatWeight ? getFirstValue(formatWeight) : String(weight)
  };
};
