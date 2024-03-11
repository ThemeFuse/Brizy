import { mPipe, optional, parseStrict, pass } from "fp-utilities";
import { findDCChoiceByPlaceholder } from "visual/component/Options/types/common/Population/utils";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { explodePlaceholder } from "visual/utils/dynamicContent";
import { pipe } from "visual/utils/fp";
import { getDynamicContentChoices } from "visual/utils/options";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { capByPrefix, decodeFromString } from "visual/utils/string";
import { isNullish, onNullish, throwOnNullish } from "visual/utils/value";
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
      : $doc.load(html, { decodeEntities: false });
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

const flatFormats = (format) => {
  return Object.entries(format).reduce((acc, [key, value]) => {
    acc[key] = Array.isArray(value) ? value[0] : value;
    return acc;
  }, {});
};

const getCSSVarValue = (cssVar) => {
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar);
};

const getColorValues = (str, regex) => {
  const [, cssVar, opacity, horizontal, vertical, blur] = regex.exec(str) ?? [];

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

  return undefined;
};

export const parseShadow = (str = "") => {
  if (str.includes("var")) {
    const regExp =
      /rgba\(var\((.*?)\),(\d+(?:\.\d+)?)\)+\s+(\d+px)\s?(\d+px)\s?(\d+px)/;
    const values = getColorValues(str, regExp);

    if (values) {
      const { hex, opacity, vertical, horizontal, blur } = values;
      return {
        textShadowColorHex: hex,
        textShadowColorOpacity: opacity,
        textShadowVertical: vertical,
        textShadowHorizontal: horizontal,
        textShadowBlur: blur
      };
    }

    return {};
  }

  const [, rgba, shadow] = str.split(", rgb")[0].match(/^(rgb.*\)) (.*)/) || [];

  let textShadowColorHex = "#000000";
  let textShadowColorOpacity = 0;
  let textShadowVertical = 0;
  let textShadowHorizontal = 0;
  let textShadowBlur = 0;

  if (rgba && shadow) {
    let { hex, opacity } = rgbaTohex(rgba);
    const [horizontal, vertical, blur] = shadow.split(" ");

    textShadowColorHex = hex;
    textShadowColorOpacity = !isNaN(parseFloat(opacity)) ? opacity : 1;
    textShadowVertical = parseInt(vertical);
    textShadowHorizontal = parseInt(horizontal);
    textShadowBlur = parseInt(blur);
  }

  return {
    textShadowColorHex,
    textShadowColorOpacity,
    textShadowVertical,
    textShadowHorizontal,
    textShadowBlur
  };
};

export const parseColor = (color = "", opacity) => {
  if (color.includes("var")) {
    const regExp = /rgba\(var\((.*?)\),(\d+(?:\.\d+)?)\)/s;
    const values = getColorValues(color, regExp);

    if (values) {
      const { hex, opacity } = values;

      return {
        hex: hex ?? "#000000",
        opacity: opacity ?? 1
      };
    }

    return {};
  }

  let hex = "#000000";

  if (color !== "transparent") {
    let { hex: _hex, opacity: _opacity } = rgbaTohex(color) || {};

    hex = _hex;
    opacity = !isNaN(parseFloat(_opacity)) ? _opacity : opacity;
  }

  return {
    hex,
    opacity
  };
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
    type = "page",
    anchor = "",
    external = "",
    internal = "",
    pageTitle = "",
    externalBlank = "off",
    internalBlank = "off",
    externalRel = "off",
    population = "",
    populationEntityType = "",
    populationEntityId = "",
    externalType = "page",
    popup = "",
    upload = "",
    linkToSlide = 1,
    pageSource = null
  } = decodeFromString(value);

  return {
    linkType: type,
    linkAnchor: anchor.replace("#", ""),
    linkExternal: external,
    linkExternalBlank: externalBlank,
    linkExternalRel: externalRel,
    linkPopulation: population,
    linkPopulationEntityId: populationEntityId,
    linkPopulationEntityType: populationEntityType,
    linkExternalType: externalType,
    linkPopup: popup.replace("#", ""),
    linkUpload: upload,
    linkToSlide,
    linkPage: internal,
    linkPageTitle: pageTitle,
    linkPageSource: pageSource,
    linkInternalBlank: internalBlank
  };
};

const getPopulationColorFormat = ({ populationColor }) => {
  return Object.entries(populationColor).reduce((acc, [key, value]) => {
    const populationColorHex = value.hex;
    const populationColorOpacity = value.opacity;
    const populationColorPalette = value.colorPalette;
    const prefix = capByPrefix("paragraphColor", key);

    return {
      ...acc,
      [`${prefix}Hex`]: populationColorHex,
      [`${prefix}Opacity`]: populationColorOpacity,
      [`${prefix}Palette`]: populationColorPalette
    };
  }, {});
};

// background
const getBackground = (value) => {
  if (isNullish(value)) {
    return {};
  }

  const { imagePopulation: _population } = value;
  const populationObj = explodePlaceholder(_population ?? undefined);
  const population = populationObj?.content
    ? {
        imagePopulation: populationObj.content,
        imagePopulationEntityId: populationObj.attr?.entityId ?? "",
        imagePopulationEntityType: populationObj.attr?.entityType ?? ""
      }
    : {};

  return { ...value, ...population };
};

export const getTextBackground = (background, textBackgroundGradient) => {
  const defaultBgOpacity = background ? 1 : 0;
  const _bgHex = background ?? "";
  const { hex: bgHex, opacity: bgOpacity } = parseColor(
    _bgHex,
    defaultBgOpacity
  );

  const textBgColorHex = textBackgroundGradient
    ? textBackgroundGradient.startHex
    : bgHex;

  const textBgColorOpacity = textBackgroundGradient
    ? textBackgroundGradient.startOpacity
    : bgOpacity;

  return {
    background: {
      hex: textBgColorHex,
      opacity: textBgColorOpacity
    },
    textBgColorHex,
    textBgColorOpacity
  };
};

// population
const getPopulation = (value, $elem) => {
  if (isNullish(value)) {
    return null;
  }

  const population = explodePlaceholder(value);

  if (population?.content) {
    const config = Config.getAll();

    const richTextDCChoices = getDynamicContentChoices(
      config.dynamicContent.groups,
      DCTypes.richText
    );

    return {
      population: population.content,
      label: $elem.closest("[data-population]").text()?.trim(),
      display:
        findDCChoiceByPlaceholder({
          choices: richTextDCChoices,
          placeholder: population.content
        })?.display ?? "inline"
    };
  }

  return null;
};

export const getFormats = ($elem, format = {}, deviceMode) => {
  const v = classNamesToV(
    $elem
      .closest("p, :header, pre, li, div.brz-tp__dc-block")
      .attr("class")
      ?.split(" ") ?? []
  );
  format = flatFormats(format);

  const cssColor = $elem.css("color");
  const cssOpacity = $elem.css("opacity");

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

  const _hex = format.color ?? cssColor;
  const _opacity = format.opacity ?? cssOpacity;

  const { hex, opacity } = parseColor(_hex, _opacity);

  // it's only for situations when colorPalette contain this data - "color2, color3" (normally it should never happen)
  const palette = format.colorPalette ? format.colorPalette.split(",")[0] : "";
  const textBgColorPalette = format.textBgColorPalette
    ? format.textBgColorPalette.split(",")[0]
    : "";

  const bgColor = format.backgroundGradient
    ? format.backgroundGradient.startHex
    : hex;

  const bgColorOpacity = format.backgroundGradient
    ? format.backgroundGradient.startOpacity
    : opacity;

  return {
    ...v,

    bold: format.bold ?? "",
    italic: format.italic ?? "",
    underline: format.underline ?? "",
    strike: format.strike ?? "",
    capitalize: format.capitalize ?? "",

    color: {
      hex,
      opacity
    },
    colorPalette: palette,
    bgColorPalette: palette,
    bgColorOpacity: bgColorOpacity,
    bgColorHex: bgColor,
    ...parseShadow(format.shadow),
    textBgColorPalette,
    textShadowColorPalette: format.shadowColorPalette || null,

    ...getTextBackground(format.background, format.textBackgroundGradient),
    ...getBackground(format.backgroundImage),
    backgroundGradient: format.backgroundGradient || null,
    textBackgroundGradient: format.textBackgroundGradient || null,
    ...getLink(format.link),
    ...populationColor,
    ...getPopulationColorFormat({ ...populationColor }),

    list: format.list ?? "",
    population: getPopulation(format.population, $elem),
    prepopulation: format.prepopulation
      ? $elem.closest(".brz-pre-population-visible").text()
      : null,
    tagName: getTagName(format, $elem)
  };
};

export const dcItemOptionParser = parseStrict({
  label: pipe(
    mPipe(pass(Obj.isObject), Obj.readKey("label"), Str.read),
    throwOnNullish("Invalid label")
  ),
  placeholder: pipe(
    mPipe(pass(Obj.isObject), Obj.readKey("placeholder"), Str.read),
    throwOnNullish("Invalid placeholder")
  ),
  display: pipe(
    mPipe(pass(Obj.isObject), Obj.readKey("display"), Str.read),
    onNullish("inline")
  ),
  alias: optional((v) => Str.read(v.alias))
});

export const createLabel = (label) => {
  return `✦${label}`;
};
