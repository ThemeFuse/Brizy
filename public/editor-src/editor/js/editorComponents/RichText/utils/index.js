import { isHex } from "visual/utils/color";
import { getDynamicContentByPlaceholder } from "visual/utils/options";
import { decodeFromString } from "visual/utils/string";
import { classNamesToV } from "./transforms";
// have problems with cheerio it declared _ as global variables
const $doc = IS_EDITOR ? require("jquery") : require("cheerio");

export function mapBlockElements(html, fn) {
  let $ = getWrapper(html);
  const nodes = getParagraphsArray($);

  nodes.each((i, elem) => fn($doc(elem)));

  return $.html();

  function getWrapper(html) {
    return IS_EDITOR
      ? $doc(`<div class="brz-temp-div">${html}</div>`)
      : $doc.load(html);
  }

  function getParagraphsArray($) {
    const selector = ":header, p, pre, li, div:not(.brz-temp-div)";

    return IS_EDITOR ? $.find(selector) : $(selector);
  }
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

const getCSSVarValue = cssVar => {
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar);
};

const parseShadow = (str = "") => {
  if (str.includes("var")) {
    const regExp = /rgba\(var\((.*?)\),(\d+(?:\.\d+)?)\)+\s+(\d+px)\s?(\d+px)\s?(\d+px)/;
    const [, cssVar, opacity, horizontal, vertical, blur] =
      regExp.exec(str) ?? [];

    const hex = getCSSVarValue(cssVar);
    const rgba = `rgba(${hex}, ${opacity})`;
    const result = rgbaTohex(rgba);

    if (hex && result) {
      return {
        hex: result.hex ?? "#000000",
        opacity: result.opacity ?? 1,
        vertical: parseInt(vertical ?? 5),
        horizontal: parseInt(horizontal ?? 5),
        blur: parseInt(blur ?? 5)
      };
    }

    return {};
  }

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

// to think how to get rid of this function
const getLink = (value = "{}") => {
  const {
    type = "external",
    anchor = "",
    external = "",
    externalBlank = "off",
    externalRel = "off",
    population = "",
    externalType = "external",
    popup = "",
    upload = "",
    linkToSlide = 1
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
    linkUpload: upload,
    linkToSlide
  };
};

export const getFormats = ($elem, format = {}, deviceMode) => {
  const v = classNamesToV($elem.closest("p, :header, pre, li"));
  format = flatFormats(format);

  const cssColor = $elem.css("color");
  const cssOpacity = $elem.css("opacity");
  const cssShadow = $elem.css("text-shadow");

  const populationColor = format.populationColor
    ? { populationColor: decodeFromString(format.populationColor) }
    : {
        populationColor: {
          p: {
            hex: null,
            opacity: 1,
            colorPalette: null
          },
          h1: {
            hex: null,
            opacity: 1,
            colorPalette: null
          },
          h2: {
            hex: null,
            opacity: 1,
            colorPalette: null
          },
          h3: {
            hex: null,
            opacity: 1,
            colorPalette: null
          },
          h4: {
            hex: null,
            opacity: 1,
            colorPalette: null
          },
          h5: {
            hex: null,
            opacity: 1,
            colorPalette: null
          },
          h6: {
            hex: null,
            opacity: 1,
            colorPalette: null
          }
        }
      };

  let hex = format.color ? format.color : cssColor;

  if (!isHex(hex)) {
    hex = rgbaTohex(hex).hex;
  }

  const opacity = format.opacity || cssOpacity;

  // it's only for situations when colorPalette contain this data - "color2, color3" (normally it should never happen)
  const palette = format.colorPalette ? format.colorPalette.split(",")[0] : "";

  return {
    ...v,

    bold: format.bold ?? "",
    italic: format.italic ?? "",
    underline: format.underline ?? "",
    strike: format.strike ?? "",
    capitalize: format.capitalize ?? "",

    color: {
      hex,
      opacity: !isNaN(opacity) ? opacity : 1
    },
    colorPalette: palette,

    shadow: parseShadow(format.shadow || cssShadow),
    shadowColorPalette: format.shadowColorPalette || "",

    backgroundImage: format.backgroundImage || null,
    backgroundGradient: format.backgroundGradient || null,

    ...getLink(format.link),
    ...populationColor,

    list: format.list ?? "",

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
