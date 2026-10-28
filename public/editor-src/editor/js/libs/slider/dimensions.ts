// Element sizes and inline styles, measured and written the way jQuery does.

export type Dimension = "width" | "height";

/** Which box to measure: content, padding, border or margin. */
export type Box = "content" | "padding" | "border" | "margin";

const PNUM = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
const CSS_NUM = new RegExp(`^(?:([+-])=|)(${PNUM})([a-z%]*)$`, "i");
const NUM_NON_PX = new RegExp(`^(${PNUM})(?!px)[a-z%]+$`, "i");
const DISPLAY_SWAP = /^(none|table(?!-c[ea]).+)/;
const SIDES = ["Top", "Right", "Bottom", "Left"];

/** Properties a number is written to without a `px` unit (`jQuery.cssNumber`). */
const UNITLESS = new Set([
  "animationIterationCount",
  "aspectRatio",
  "borderImageSlice",
  "columnCount",
  "flexGrow",
  "flexShrink",
  "fontWeight",
  "gridArea",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnStart",
  "gridRow",
  "gridRowEnd",
  "gridRowStart",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "scale",
  "widows",
  "zIndex",
  "zoom",
  "fillOpacity",
  "floodOpacity",
  "stopOpacity",
  "strokeMiterlimit",
  "strokeOpacity"
]);

const stylesOf = (element: HTMLElement): CSSStyleDeclaration =>
  (element.ownerDocument.defaultView ?? window).getComputedStyle(element);

/** `curCSS`: the computed value of `name` (camel case), as a string. */
function computedValue(
  _element: HTMLElement,
  name: string,
  styles: CSSStyleDeclaration
): string {
  const value: unknown = Reflect.get(styles, name);

  return (
    styles.getPropertyValue(name) || (typeof value === "string" ? value : "")
  );
}

/** `jQuery.css(elem, name, true)`: a computed value as a number, `0` when not numeric. */
function computedNumber(
  element: HTMLElement,
  name: string,
  styles: CSSStyleDeclaration
): number {
  return parseFloat(computedValue(element, name, styles)) || 0;
}

const offsetOf = (element: HTMLElement, dimension: Dimension): number =>
  dimension === "width" ? element.offsetWidth : element.offsetHeight;

const isBorderBoxStyle = (
  element: HTMLElement,
  styles: CSSStyleDeclaration
): boolean => computedValue(element, "boxSizing", styles) === "border-box";

function boxModelAdjustment(
  element: HTMLElement,
  dimension: Dimension,
  box: Box,
  isBorderBox: boolean,
  styles: CSSStyleDeclaration,
  computedSize: number | undefined
): number {
  let extra = 0;
  let delta = 0;
  let marginDelta = 0;

  if (box === (isBorderBox ? "border" : "content")) {
    return 0;
  }

  for (let i = dimension === "width" ? 1 : 0; i < 4; i += 2) {
    const side = SIDES[i];

    if (box === "margin") {
      marginDelta += computedNumber(element, `margin${side}`, styles);
    }

    if (!isBorderBox) {
      delta += computedNumber(element, `padding${side}`, styles);

      if (box !== "padding") {
        delta += computedNumber(element, `border${side}Width`, styles);
      } else {
        extra += computedNumber(element, `border${side}Width`, styles);
      }
    } else {
      if (box === "content") {
        delta -= computedNumber(element, `padding${side}`, styles);
      }
      if (box !== "margin") {
        delta -= computedNumber(element, `border${side}Width`, styles);
      }
    }
  }

  if (!isBorderBox && computedSize !== undefined && computedSize >= 0) {
    delta +=
      Math.max(
        0,
        Math.ceil(
          offsetOf(element, dimension) - computedSize - delta - extra - 0.5
        )
      ) || 0;
  }

  return delta + marginDelta;
}

function getWidthOrHeight(
  element: HTMLElement,
  dimension: Dimension,
  box: Box
): number {
  const styles = stylesOf(element);
  let isBorderBox = isBorderBoxStyle(element, styles);
  let valueIsBorderBox = isBorderBox;
  let value: string | number = computedValue(element, dimension, styles);

  if (NUM_NON_PX.test(value)) {
    value = "auto";
  }

  if (
    (value === "auto" ||
      (!parseFloat(value) &&
        computedValue(element, "display", styles) === "inline")) &&
    element.getClientRects().length
  ) {
    isBorderBox = isBorderBoxStyle(element, styles);
    valueIsBorderBox = true;
    value = offsetOf(element, dimension);
  }

  const size = parseFloat(String(value)) || 0;

  return (
    size +
    boxModelAdjustment(
      element,
      dimension,
      box || (isBorderBox ? "border" : "content"),
      valueIsBorderBox,
      styles,
      size
    )
  );
}

/** Runs `measure` with `display: block` swapped in for a hidden element, as jQuery does. */
function withShown<T>(element: HTMLElement, measure: () => T): T {
  const shown: Record<string, string> = {
    position: "absolute",
    visibility: "hidden",
    display: "block"
  };
  const previous: Record<string, string> = {};

  Object.keys(shown).forEach((name) => {
    previous[name] = element.style.getPropertyValue(name);
    element.style.setProperty(name, shown[name] ?? "");
  });

  const result = measure();

  Object.keys(shown).forEach((name) => {
    element.style.setProperty(name, previous[name] ?? "");
  });

  return result;
}

/** The size of `element` in `box`. */
export function measure(
  element: HTMLElement,
  dimension: Dimension,
  box: Box
): number {
  const display = computedValue(element, "display", stylesOf(element));
  const hidden =
    DISPLAY_SWAP.test(display) &&
    (!element.getClientRects().length ||
      !element.getBoundingClientRect().width);

  return hidden
    ? withShown(element, () => getWidthOrHeight(element, dimension, box))
    : getWidthOrHeight(element, dimension, box);
}

/** `$(window).width()` / `.height()`: the viewport without scrollbars. */
export function viewportSize(win: Window, dimension: Dimension): number {
  return dimension === "width"
    ? win.document.documentElement.clientWidth
    : win.document.documentElement.clientHeight;
}

/** `setPositiveNumber`: never below zero, unit kept (`px` by default). */
function positive(value: string, subtract: number): string {
  const matches = CSS_NUM.exec(value);

  return matches
    ? `${Math.max(0, Number(matches[2]) - subtract)}${matches[3] || "px"}`
    : value;
}

export type StyleValue = string | number | undefined;

/** The shorthands jQuery keeps from going negative (its `padding` / `borderWidth` hooks). */
const POSITIVE = new Set(["width", "height", "padding", "borderWidth"]);

/** Writes an inline style: numbers get `px`, `""` removes it, sizes never go negative. */
export function setStyle(
  element: HTMLElement,
  name: string,
  value: StyleValue
): void {
  if (value === undefined || Number.isNaN(value)) {
    return;
  }

  let written =
    typeof value === "number"
      ? `${value}${UNITLESS.has(name) ? "" : "px"}`
      : value;

  if (POSITIVE.has(name)) {
    written = positive(written, 0);
  }

  if (name.startsWith("--")) {
    element.style.setProperty(name, written);
  } else {
    Reflect.set(element.style, name, written);
  }
}

/** `.css({ ... })`. */
export function setStyles(
  element: HTMLElement,
  styles: Record<string, StyleValue>
): void {
  Object.entries(styles).forEach(([name, value]) => {
    setStyle(element, name, value);
  });
}

/** Sets the size so that the `box` of the element measures `value`. */
export function setSize(
  element: HTMLElement,
  dimension: Dimension,
  value: number,
  box: Box
): void {
  if (Number.isNaN(value)) {
    return;
  }

  const styles = stylesOf(element);
  const isBorderBox = isBorderBoxStyle(element, styles);
  const subtract = boxModelAdjustment(
    element,
    dimension,
    box,
    isBorderBox,
    styles,
    undefined
  );

  Reflect.set(element.style, dimension, positive(`${value}px`, subtract));
}
