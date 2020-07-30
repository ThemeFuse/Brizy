import { uuid } from "visual/utils/uuid";
import { murmurhash2 } from "visual/utils/crypto";
import * as onStyles from "visual/utils/cssStyle";

const devices = {
  desktop: 1500,
  tablet: 991,
  mobile: 767
};

const states = {
  normal: "normal",
  hover: "hover"
};

let legacyByDefault = {};

export function renderStyles({ v, vs, vd, styles, props }) {
  if (vd) {
    const { defaultCSS, rulesCSS, customCSS } = loopStyles({
      v,
      vs,
      vd,
      styles,
      props
    });

    return [defaultCSS, rulesCSS, customCSS];
  } else {
    throw new Error(
      "this should not happen. we must have accidentally omitted some element"
    );
  }
}
function loopStyles({ v, vs, vd, styles, props }) {
  let outV = "";
  let outVS = "";
  let outVD = "";
  let legacyV = {};
  let legacyVS = {};
  let legacyVD = {};
  let mode = "";
  /* eslint-disable no-unused-vars */
  Object.entries(devices).forEach(function([device, deviceValue]) {
    Object.entries(states).forEach(function([state, stateValue]) {
      if (device === "desktop" || state === "normal") {
        Object.entries(styles).forEach(function([styleKey, styleValue]) {
          Object.entries(styleValue).forEach(function([
            styleKeyKey,
            styleValueValue
          ]) {
            styleValueValue.forEach(function(currentStyle) {
              const currentStyleArray = currentStyle.split("|||");
              /* eslint-enabled no-unused-vars */
              if (currentStyleArray.length === 2) {
                mode = currentStyleArray[1];
              } else {
                mode = "";
              }

              const styleFn = currentStyleArray[0];

              if (!onStyles[styleFn]) {
                throw `The style function ${styleFn} is missing`;
              }

              outV = onStyles[styleFn]({
                v,
                device,
                state,
                mode,
                props
              });
              legacyV = legacyByOut({
                legacy: legacyV,
                out: outV,
                styleKey,
                state,
                currentStyle
              });

              outVS = onStyles[styleFn]({
                v: vs,
                device,
                state,
                mode,
                props
              });
              legacyVS = legacyByOut({
                legacy: legacyVS,
                out: outVS,
                styleKey,
                state,
                currentStyle
              });

              outVD = onStyles[styleFn]({
                v: vd,
                device,
                state,
                mode,
                props
              });
              legacyVD = legacyByOut({
                legacy: legacyVD,
                out: outVD,
                styleKey,
                state,
                currentStyle
              });
            });
          });
        });
      }
    });
  });

  const defaultCSS = cssOutput({ v: undefined, styles, legacy: legacyVD });

  legacyByDefault = legacyVD;
  const rulesCSS = cssOutput({ v: vs, styles, legacy: legacyVS });

  legacyByDefault = legacyVS;
  const customCSS = cssOutput({ v, styles, legacy: legacyV });

  return { defaultCSS, rulesCSS, customCSS };
}

function cssOutput({ v, styles, legacy }) {
  let goStandart = "";
  let goInterval = "";
  let gooutStandart = "";
  let gooutInterval = "";
  let goout = "";
  let devicesCounter = 0;
  let standartCss = "";
  let intervalCss = "";

  Object.entries(devices).forEach(function(
    [device, deviceValue],
    deviceKey,
    devicesArray
  ) {
    Object.entries(states).forEach(function([state, stateValue]) {
      if (legacy[state]) {
        gooutStandart = "";
        gooutInterval = "";

        Object.entries(legacy[state]).forEach(function([className, type]) {
          goStandart = "";
          goInterval = "";

          Object.entries(type).forEach(function([typeKey, cssArray]) {
            let go = cssArray[devicesCounter];

            if (
              v &&
              JSON.stringify(legacyByDefault[state][className][typeKey]) ===
                JSON.stringify(legacy[state][className][typeKey])
            ) {
              go = "";
            }

            goStandart +=
              styles[className].standart &&
              styles[className].standart.indexOf(typeKey) !== -1 &&
              go !== "" &&
              go !== undefined
                ? go
                : "";

            goInterval +=
              styles[className].interval &&
              styles[className].interval.indexOf(typeKey) !== -1 &&
              go !== "" &&
              go !== undefined
                ? go
                : "";
          });

          let key;
          if (state === "normal") {
            key = `${className.replace(":hover", "")}{`;
          } else {
            key = `${className}{`;
          }

          if (goStandart !== "") {
            gooutStandart += key + goStandart + "}";
          }

          if (goInterval !== "") {
            gooutInterval += key + goInterval + "}";
          }
        });
      }

      if (gooutStandart !== "") {
        standartCss =
          device === "desktop" && state === "hover"
            ? `@media(min-width:${devicesArray[devicesCounter + 1][1]}px){`
            : device === "desktop"
            ? ""
            : devicesCounter === devicesArray.length - 1
            ? `@media(max-width:${deviceValue}px){`
            : `@media(max-width:${
                devicesArray[devicesCounter][1]
              }px) and (min-width:${devicesArray[devicesCounter + 1][1] +
                1}px){`;

        goout += standartCss + gooutStandart + (standartCss !== "" ? "}" : "");
      }

      if (gooutInterval !== "") {
        intervalCss =
          devicesCounter === 0
            ? `@media(min-width:${devicesArray[devicesCounter + 1][1]}px){`
            : devicesCounter === devicesArray.length - 1
            ? `@media(max-width:${deviceValue}px){`
            : `@media(max-width:${
                devicesArray[devicesCounter][1]
              }px) and (min-width:${devicesArray[devicesCounter + 1][1] +
                1}px){`;

        goout += intervalCss + gooutInterval + (intervalCss !== "" ? "}" : "");
      }
    });

    devicesCounter++;
  });
  return goout;
}

function legacyByOut({ legacy, out, styleKey, state, currentStyle }) {
  if (
    state === "hover" &&
    legacy.normal &&
    legacy.normal[styleKey] &&
    legacy.normal[styleKey][currentStyle]
  ) {
    out = legacy.normal[styleKey][currentStyle][0] === out ? "" : out;
  }

  // Codul asta era initial pentru a redue CSS intre devices dar el creaza probleme la show on devices
  /* if (
    legacy[state] &&
    legacy[state][styleKey] &&
    legacy[state][styleKey][currentStyle]
  ) {
    out = legacy[state][styleKey][currentStyle][0] === out ? "" : out;
  }*/

  if (legacy[state]) {
    if (legacy[state][styleKey]) {
      if (legacy[state][styleKey][currentStyle]) {
        legacy[state][styleKey][currentStyle].push(out);
      } else {
        legacy[state][styleKey][currentStyle] = [out];
      }
    } else {
      legacy[state][styleKey] = { [currentStyle]: [out] };
    }
  } else {
    legacy[state] = { [styleKey]: { [currentStyle]: [out] } };
  }

  return legacy;
}

// ====== tujur ======
/**
 *
 * @param {string} defaultID
 * @param {string} elementID
 * @param {object} defaultStyle
 * @param {object} rulesStyle
 * @param {object} elementStyle
 *
 * @return {string}
 */
export function css(
  defaultID,
  elementID,
  [defaultStyle, rulesStyle, elementStyle]
) {
  let defaultData;
  if (defaultStyle) {
    defaultData = cssCache.get(defaultID);
    // we don't treat the else clause because we assume that
    // default styles will be the same for a given id no matter
    // how many times this function will be called
    if (!defaultData) {
      const className = `brz-css-${uuid(5)}`;
      const cssText = replacePlaceholders(defaultStyle, className);
      let node;

      if (!css.isServer) {
        node = document.createElement("style");
        if (process.env.NODE_ENV === "development") {
          node.setAttribute("data-brz-css", `default-${defaultID}`);
        }
        node.appendChild(document.createTextNode(""));
        node.childNodes[0].nodeValue = cssText;

        insertStyleNodeIntoDOM("default", node);
      }

      defaultData = {
        node,
        className,
        cssText
      };

      cssOrdered.default.push(defaultData);
      cssCache.set(defaultID, defaultData);
    } else {
      const { node, className, cssText } = defaultData;
      const cssTextNext = replacePlaceholders(defaultStyle, className);

      if (cssTextNext !== cssText) {
        if (!css.isServer) {
          node.childNodes[0].nodeValue = cssTextNext;
        }

        defaultData.cssText = cssTextNext;
      }
    }
  }

  let rulesData;
  if (rulesStyle) {
    const rulesStyleHash = murmurhash2(rulesStyle);

    rulesData = cssCache.get(rulesStyleHash);
    if (!rulesData) {
      const className = `brz-css-${uuid(5)}`;
      const cssText = replacePlaceholders(rulesStyle, className);
      let node;

      if (!css.isServer) {
        node = document.createElement("style");
        if (process.env.NODE_ENV === "development") {
          node.setAttribute("data-brz-css", `rules-${defaultID}`);
        }
        node.appendChild(document.createTextNode(""));
        node.childNodes[0].nodeValue = cssText;

        insertStyleNodeIntoDOM("rules", node);
      }

      rulesData = {
        node,
        className,
        cssText
      };

      cssOrdered.rules.push(rulesData);
      cssCache.set(rulesStyleHash, rulesData);
    }
  }

  let elementData;
  if (elementStyle) {
    elementData = cssCache.get(elementID);
    if (!elementData) {
      const className = `brz-css-${uuid(5)}`;
      const cssText = replacePlaceholders(elementStyle, className);
      let node;

      if (!css.isServer) {
        node = document.createElement("style");
        if (process.env.NODE_ENV === "development") {
          node.setAttribute("data-brz-css", `custom-${defaultID}`);
        }
        node.appendChild(document.createTextNode(""));
        node.childNodes[0].nodeValue = cssText;

        insertStyleNodeIntoDOM("custom", node);
      }

      elementData = {
        node,
        className,
        cssText
      };

      cssOrdered.custom.push(elementData);
      cssCache.set(elementID, elementData);
    } else {
      const { node, className, cssText } = elementData;
      const cssTextNext = replacePlaceholders(elementStyle, className);

      if (cssTextNext !== cssText) {
        if (!css.isServer) {
          node.childNodes[0].nodeValue = cssTextNext;
        }

        elementData.cssText = cssTextNext;
      }
    }
  }

  return [
    ...(defaultData ? [defaultData.className] : []),
    ...(rulesData ? [rulesData.className] : []),
    ...(elementData ? [elementData.className] : [])
  ].join(" ");
}

export function tmpCSSFromCache() {
  let css = "";

  for (const type of ["default", "rules", "custom"]) {
    for (const { cssText } of cssOrdered[type]) {
      css += cssText;
      css += "\n";
    }
  }

  return css;
}

function replacePlaceholders(styles, className) {
  return styles.replace(/&&/gm, `.${className}`);
}

function insertStyleNodeIntoDOM(styleType, styleNode) {
  const default_ = cssOrdered.default; // can't use default as a identifier
  const rules = cssOrdered.rules;
  const custom = cssOrdered.custom;
  let refNode;

  switch (styleType) {
    case "default":
      refNode = default_.length > 0 ? default_[default_.length - 1].node : null;
      break;
    case "rules":
      refNode =
        rules.length > 0
          ? rules[rules.length - 1].node
          : default_.length > 0
          ? default_[default_.length - 1].node
          : null;
      break;
    case "custom":
      refNode =
        custom.length > 0
          ? custom[custom.length - 1].node
          : rules.length > 0
          ? rules[rules.length - 1].node
          : default_.length > 0
          ? default_[default_.length - 1].node
          : null;
      break;
    default:
      throw new Error("invalid tujur css node type: " + styleType);
  }

  if (refNode) {
    refNode.insertAdjacentElement("afterend", styleNode);
  } else {
    document.head.appendChild(styleNode);
  }
}

const cssCache = new Map();
const cssOrdered = {
  default: [],
  rules: [],
  custom: []
};
