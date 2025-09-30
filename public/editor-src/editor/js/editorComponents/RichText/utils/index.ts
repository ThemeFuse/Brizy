import { Num } from "@brizy/readers";
import { once } from "es-toolkit";
import { mPipe, optional, parseStrict, pass } from "fp-utilities";
import { JSX } from "react";
import { ElementModelType2 } from "visual/component/Elements/Types";
import {
  DCGroupCloud,
  DCGroups,
  DCTypes,
  Display
} from "visual/global/Config/types/DynamicContent";
import { RenderType, isEditor } from "visual/providers/RenderProvider";
import { ReduxState } from "visual/redux/types";
import { explodePlaceholder } from "visual/utils/dynamicContent";
import type { DCPlaceholderStartObj } from "visual/utils/dynamicContent/types";
import { pipe } from "visual/utils/fp";
import type { Value as LinkValue } from "visual/utils/models/link";
import { getDynamicContentChoices } from "visual/utils/options";
import { findDCChoiceByPlaceholder } from "visual/utils/options/Population/utils";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import {
  capByPrefix,
  decodeFromString,
  parseFromString
} from "visual/utils/string";
import {
  MValue,
  isNullish,
  onNullish,
  throwOnNullish
} from "visual/utils/value";
import type { QuillFormat, TooltipFormat } from "../types";
import { fromFormatsToTextTransform } from "./dependencies";
import { classNamesToV } from "./transforms";

type JQueryType = typeof $;
type JQueryStatic = ReturnType<JQueryType>;
type DOMLib = JQueryType | cheerio.CheerioAPI;

function isJQueryLib(lib: DOMLib): lib is JQueryType {
  return (lib as JQueryType).fn !== undefined;
}

function isJQueryHTMLElement(instance: unknown): instance is JQueryStatic {
  return (
    !!instance &&
    typeof instance === "object" &&
    "find" in instance &&
    typeof instance.find === "function"
  );
}

function quillUtils(renderContext: RenderType) {
  const $doc = isEditor(renderContext)
    ? // eslint-disable-next-line @typescript-eslint/no-var-requires
      (require("jquery") as JQueryType)
    : // eslint-disable-next-line @typescript-eslint/no-var-requires
      (require("cheerio") as cheerio.CheerioAPI);

  function mapElements(html: string, fn: JQueryCallback | cheerio.Selector) {
    const $ = getWrapper(html);
    const nodes = getParagraphsArray($);

    nodes.each((_: number, elem) => {
      const $elem = isJQueryLib($doc)
        ? $doc(elem)
        : ($ as cheerio.CheerioAPI)(elem);
      //@ts-expect-error: wrong jQueryStatic Callable overload
      return fn($elem);
    });

    return $.html();

    function getWrapper(html: string) {
      return isJQueryLib($doc)
        ? $doc(`<div class="brz-temp-div">${html}</div>`)
        : $doc.load(html, { decodeEntities: false });
    }

    function getParagraphsArray($: cheerio.Root | JQuery<HTMLElement>) {
      const selector =
        ":header, p, pre, li, div:not(.brz-temp-div), span[data-tooltip]";

      return isJQueryHTMLElement($) ? $.find(selector) : $(selector);
    }
  }

  return { mapElements };
}

const GetQuillUtils = once((renderContext: RenderType) =>
  quillUtils(renderContext)
);
export default GetQuillUtils;

const rgbaTohex = (rgba = "rgba(0, 0, 0, 1)") => {
  const parsedRgba = rgba.match(
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i
  );

  return parsedRgba
    ? {
        hex: `#${toHexadecimal(parsedRgba[1])}${toHexadecimal(
          parsedRgba[2]
        )}${toHexadecimal(parsedRgba[3])}`,
        opacity: parsedRgba[4]
      }
    : parsedRgba;

  function toHexadecimal(number: string) {
    return ("0" + parseInt(number, 10).toString(16)).slice(-2);
  }
};

const flatFormats = (format: QuillFormat) => {
  return Object.entries(format).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      acc[key] = Array.isArray(value) ? value[0] : value;
      return acc;
    },
    {}
  );
};

const getCSSVarValue = (cssVar: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar);
};

const getColorValues = (str: string, regex: RegExp) => {
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

  const hexColor = rgba && rgbaTohex(rgba);
  if (rgba && shadow && !!hexColor) {
    const { hex, opacity } = hexColor;
    const [horizontal, vertical, blur] = shadow.split(" ");

    return {
      textShadowColorHex: hex,
      textShadowColorOpacity: !isNaN(parseFloat(opacity)) ? opacity : 1,
      textShadowVertical: parseInt(vertical),
      textShadowHorizontal: parseInt(horizontal),
      textShadowBlur: parseInt(blur)
    };
  }

  return {
    textShadowColorHex: "#000000",
    textShadowColorOpacity: 0,
    textShadowVertical: 0,
    textShadowHorizontal: 0,
    textShadowBlur: 0
  };
};

export const parseColor = (color = "", opacity: string | number) => {
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
    const { hex: _hex, opacity: _opacity } = rgbaTohex(color) || {};

    hex = _hex ?? hex;

    opacity = pipe(
      Num.read,
      (parsedOpacity) => parsedOpacity ?? opacity
    )(_opacity);
  }

  return {
    hex,
    opacity
  };
};

/* eslint-disable no-unused-vars */
const getTagName = ($elem: JQuery<HTMLElement>) => {
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
  } = decodeFromString<{ [K in keyof LinkValue]: string }>(value);

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

const getPopulationColorFormat = ({
  populationColor
}: {
  populationColor: NonNullable<QuillFormat["populationColor"]>;
}) => {
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
const getBackground = (value: QuillFormat["backgroundImage"]) => {
  if (isNullish(value)) {
    return {};
  }

  const { imagePopulation: _population } = value;
  const populationObj = explodePlaceholder(
    //@ts-expect-error: not know why need ??undefined
    _population ?? undefined
  ) as DCPlaceholderStartObj;
  const population = populationObj?.content
    ? {
        imagePopulation: populationObj.content,
        imagePopulationEntityId: populationObj.attr?.entityId ?? "",
        imagePopulationEntityType: populationObj.attr?.entityType ?? ""
      }
    : {};

  return { ...value, ...population };
};

export const getTextBackground = (
  background: QuillFormat["background"],
  textBackgroundGradient: QuillFormat["textBackgroundGradient"]
) => {
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
const getPopulation = (
  value: QuillFormat["population"],
  $elem: JQuery<HTMLElement>,
  dcGroups: MValue<DCGroups | DCGroupCloud>
) => {
  if (isNullish(value)) {
    return null;
  }

  const population = explodePlaceholder(value);
  const richTextDCChoices =
    dcGroups && getDynamicContentChoices(dcGroups, DCTypes.richText);

  if (population?.content && typeof richTextDCChoices !== "undefined") {
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

const getTooltipFormat = (value = "{}"): TooltipFormat => {
  const formats = parseFromString<MValue<TooltipFormat>>(value) ?? {};

  return {
    ...formats,
    enableTooltip: formats.enableTooltip ?? "off"
  };
};

export const getFormats = (
  $elem: JQuery<HTMLElement>,
  format: QuillFormat = {},
  dcGroups: MValue<DCGroups | DCGroupCloud>
) => {
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
    ? {
        populationColor: decodeFromString<
          NonNullable<QuillFormat["populationColor"]>
        >(
          //@ts-expect-error: Not know if everytime the format from richtext retur string or a PopulationColor object
          format.populationColor
        )
      }
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

  const {
    typographyBold,
    typographyItalic,
    typographyUnderline,
    typographyStrike,
    typographyUppercase,
    typographyScript
    //@ts-expect-error: Need to know the righ format
  } = fromFormatsToTextTransform(format);

  return {
    ...v,
    bold: format.typographyBold ?? format.bold ?? false,
    italic: format.italic ?? format.typographyItalic ?? false,
    underline: format.underline ?? format.typographyUnderline ?? false,
    strike: format.strike ?? format.typographyStrike ?? false,
    capitalize: format.capitalize || format.typographyUppercase ? "on" : "",
    script: format.script ?? format.typographyScript ?? "none",

    typographyBold: format.typographyBold ?? typographyBold,
    typographyItalic: format.typographyItalic ?? typographyItalic,
    typographyUnderline: format.typographyUnderline ?? typographyUnderline,
    typographyStrike: format.typographyStrike ?? typographyStrike,
    typographyUppercase: format.typographyUppercase || typographyUppercase,
    typographyLowercase: format.typographyLowercase ? "on" : "",
    typographyScript: format.typographyScript ?? typographyScript,

    color: {
      hex,
      opacity
    },
    colorPalette: palette,
    bgColorPalette: palette,
    bgColorOpacity: bgColorOpacity,
    bgColorHex: bgColor,
    bgColorType: format.backgroundGradient ? "gradient" : "solid",
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
    ...getTooltipFormat(format.tooltip),

    list: format.list ?? "",
    population: getPopulation(format.population, $elem, dcGroups),
    prepopulation: format.prepopulation
      ? $elem.closest(".brz-pre-population-visible").text()
      : null,
    tagName: getTagName($elem)
  };
};

function isDisplayProperty(v: string): v is Display {
  return ["block", "inline"].indexOf(v) !== -1;
}

function parseDCItemDisplay(v: string): Display | null {
  return isDisplayProperty(v) ? v : null;
}

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
    mPipe(
      pass(Obj.isObject),
      Obj.readKey("display"),
      Str.read,
      parseDCItemDisplay
    ),
    onNullish<Display>("inline" as Display)
  ),
  alias: optional(mPipe(pass(Obj.isObject), Obj.readKey("alias"), Str.read))
});

export const createLabel = (label: string) => {
  return `✦${label}`;
};

export const getFilteredPopups = (
  textContent: string,
  popups: Array<ElementModelType2>,
  blocksData: ReduxState["blocksData"] = {}
) => {
  const regex = /data-href="([^"]+)"/gs;
  const links = textContent.matchAll(regex);
  const domPopups: Array<string> = [];

  for (const [, link] of links) {
    try {
      const { type, popup } =
        decodeFromString<{ type: string; popup: string }>(link) ?? {};

      if (type === "popup" && popup) {
        domPopups.push(popup);
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }
    }
  }

  return popups.filter(({ value, type }) =>
    domPopups.some((popupId) => {
      const { _id } = value;
      if (type === "GlobalBlock" && typeof _id !== "undefined") {
        const { value: blockValue } = blocksData[_id] ?? {};

        if (blockValue) {
          return `#${blockValue.popupId}` === popupId;
        }
      }

      return `#${value.popupId}` === popupId;
    })
  );
};

export const getTag = (value: string): keyof JSX.IntrinsicElements => {
  switch (value) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
    case "p":
    case "pre":
      return value;
    default:
      return "span";
  }
};
