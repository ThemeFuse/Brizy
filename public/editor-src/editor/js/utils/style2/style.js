import { uuid } from "visual/utils/uuid";
import * as onStyles from "visual/utils/style2";

const devices = {
  desktop: 1500,
  tablet: 991,
  mobile: 767
};

export function renderStyles({ vs, v, styles }) {
  let output = "";
  let result = "";

  Object.entries(devices).forEach(function([device, deviceValue]) {
    Object.entries(styles).forEach(function([styleKey, styleValue]) {
      result = diffResponsiveDesktopStyle({ vs, v, device, styleValue });

      if (result !== "") {
        output +=
          device !== "desktop" ? `@media (max-width: ${deviceValue}px) {` : "";

        output += `${styleKey} {`;

        output += result;

        output += `}`;
        output += device !== "desktop" ? `}` : "";
      }
    });
  });

  return output;
}

function diffResponsiveDesktopStyle({ vs, v, device, styleValue }) {
  let output = styleValue.reduce((acc, currentStyle) => {
    if (v === undefined) {
      const desktopValue = onStyles[currentStyle]({ v: vs, device: "desktop" });
      const responsiveValue = onStyles[currentStyle]({ v: vs, device });

      acc +=
        device === "desktop"
          ? desktopValue
          : desktopValue === responsiveValue
          ? ""
          : responsiveValue;
    } else {
      const defaultValue = onStyles[currentStyle]({ v: vs, device });
      const desktopValue = onStyles[currentStyle]({ v, device: "desktop" });
      const responsiveValue = onStyles[currentStyle]({ v, device });

      acc +=
        defaultValue === responsiveValue
          ? ""
          : device === "desktop"
          ? desktopValue
          : desktopValue === responsiveValue
          ? ""
          : responsiveValue;
    }

    return acc;
  }, "");

  return output;
}

const cssCache = new Map();

export function css(defaultID, elementID, [defaultStyle, elementStyle]) {
  if (process.env.NODE_ENV === "development") {
    if (!defaultStyle) {
      throw new Error(`css default styles can not be empty (${defaultID})`);
    }
  }

  let defaultData = cssCache.get(defaultID);
  // we don't treat the else clause because we suppose that
  // default styles will be the same for a given id no matter
  // how many times this function will be called
  if (!defaultData) {
    const className = `brz-css-${uuid(5)}`;
    const cssText = replacePlaceholders(defaultStyle, className);
    let node;

    if (!css.isServer) {
      node = document.createElement("style");

      node.setAttribute("data-brz-css", "");
      node.appendChild(document.createTextNode(""));
      node.childNodes[0].nodeValue = cssText;

      document.head.appendChild(node);
    }

    defaultData = {
      node,
      className,
      cssText
    };
    cssCache.set(defaultID, defaultData);
  }

  // elementStyle can be an empty string sometimes
  let elementData;
  if (elementStyle) {
    elementData = cssCache.get(elementID);
    if (!elementData) {
      const className = `brz-css-${uuid(5)}`;
      const cssText = replacePlaceholders(elementStyle, className);
      let node;

      if (!css.isServer) {
        node = document.createElement("style");

        node.setAttribute("data-brz-css", "");
        node.appendChild(document.createTextNode(""));
        node.childNodes[0].nodeValue = cssText;

        document.head.appendChild(node);
      }

      elementData = {
        node,
        className,
        cssText
      };
      cssCache.set(elementID, elementData);
    } else {
      const { node, className, cssText } = elementData;
      const cssTextNext = replacePlaceholders(elementStyle, className);

      if (cssTextNext !== cssText) {
        if (!css.isServer) {
          node.childNodes[0].nodeValue = cssTextNext;
        }

        elementData = {
          node,
          className,
          cssText: cssTextNext
        };
        cssCache.set(elementID, elementData);
      }
    }
  }

  return [
    defaultData.className,
    ...(elementData ? [elementData.className] : [])
  ].join(" ");
}

function replacePlaceholders(styles, className) {
  return styles.replace(/&/gm, `.${className}`);
}

export function renderStatic(cb) {
  cssDiff.isServer = true;
  cssCache.clear();

  const html = cb();
  let css = "";

  for (let { cssText } of cssCache.values()) {
    css += cssText;
    css += "\n\n\n";
  }

  return { html, css };
}

export function tmpCSSFromCache() {
  let css = "";

  for (let { cssText } of cssCache.values()) {
    css += cssText;
    css += "\n";
  }

  return css;
}
