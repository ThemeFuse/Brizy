// A faithful port of the jQuery dimension getters and setters the two background plugins relied
// on. It is not a convenience wrapper: `offsetHeight`, `clientHeight`, `getBoundingClientRect()`
// and a bare `parseFloat(getComputedStyle(el).height)` each disagree with jQuery in a different
// situation, and the situations where they disagree — a percentage height inside a closed popup,
// a border-box element with padding, an element hidden by `display: none` — are exactly the ones
// this code runs in.
//
// Ported from jQuery 3.7.1 (`getWidthOrHeight`, `boxModelAdjustment`, `setPositiveNumber`, the
// width/height `cssHooks` and `offset`), minus the branches that only fire on browsers older than
// the ones the preview bundle targets.

type Dimension = "width" | "height";

// Only the two boxes this module is ever asked for. jQuery also knows "padding" and "margin",
// which it needs for `.innerHeight()` and `.outerHeight(true)` — API no caller here uses.
type Box = "content" | "border";

// A computed value in a unit other than px, e.g. "100%" or "50vh".
const NON_PX = /^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i;

// Displays whose box only exists once the element is laid out.
const DISPLAY_SWAP = /^(none|table(?!-c[ea]).+)/;

const SWAP_STYLES = {
  position: "absolute",
  visibility: "hidden",
  display: "block"
} as const;

const SIDES: Record<Dimension, [string, string]> = {
  width: ["left", "right"],
  height: ["top", "bottom"]
};

const number = (styles: CSSStyleDeclaration, property: string): number =>
  Number.parseFloat(styles.getPropertyValue(property)) || 0;

/** jQuery's `.height()` — the content box, fractional, whatever the box-sizing. */
export const height = (element: HTMLElement): number =>
  measure(element, "height", "content");

/** jQuery's `.width()` — the content box. */
export const width = (element: HTMLElement): number =>
  measure(element, "width", "content");

/** jQuery's `.outerHeight()` — content, padding and border, without margins. */
export const outerHeight = (element: HTMLElement): number =>
  measure(element, "height", "border");

/** jQuery's `.offset().top` — document-relative, and 0 for an element with no box. */
export function offsetTop(element: HTMLElement): number {
  if (element.getClientRects().length === 0) {
    return 0;
  }

  const view = element.ownerDocument.defaultView;

  return element.getBoundingClientRect().top + (view?.pageYOffset ?? 0);
}

/** jQuery's `.width(value)` / `.height(value)`: never negative, and border-box aware. */
export function setContentSize(
  element: HTMLElement,
  dimension: Dimension,
  value: number
): void {
  if (Number.isNaN(value)) {
    return;
  }

  const styles = getComputedStyle(element);
  const isBorderBox = styles.boxSizing === "border-box";
  const subtract = boxModelAdjustment(
    element,
    dimension,
    "content",
    isBorderBox,
    styles,
    undefined
  );

  element.style.setProperty(dimension, `${Math.max(0, value - subtract)}px`);
}

function measure(element: HTMLElement, dimension: Dimension, box: Box): number {
  const display = getComputedStyle(element).display;

  // jQuery can measure a hidden element by showing it out of flow for the duration of the read.
  if (
    DISPLAY_SWAP.test(display) &&
    (element.getClientRects().length === 0 ||
      element.getBoundingClientRect().width === 0)
  ) {
    return swap(element, () => widthOrHeight(element, dimension, box));
  }

  return widthOrHeight(element, dimension, box);
}

function swap(element: HTMLElement, read: () => number): number {
  const previous = Object.entries(SWAP_STYLES).map(
    ([property]): [string, string] => [
      property,
      element.style.getPropertyValue(property)
    ]
  );

  for (const [property, value] of Object.entries(SWAP_STYLES)) {
    element.style.setProperty(property, value);
  }

  const result = read();

  for (const [property, value] of previous) {
    element.style.setProperty(property, value);
  }

  return result;
}

function widthOrHeight(
  element: HTMLElement,
  dimension: Dimension,
  box: Box
): number {
  const styles = getComputedStyle(element);
  const isBorderBox = styles.boxSizing === "border-box";
  let valueIsBorderBox = isBorderBox;
  let value = styles.getPropertyValue(dimension);

  if (NON_PX.test(value)) {
    value = "auto";
  }

  const parsedValue = Number.parseFloat(value);

  // An "auto" value, or a missing one on an inline element, is only trustworthy as a border box
  // read off the element itself, and only while the element actually has one.
  if (
    (value === "auto" ||
      ((Number.isNaN(parsedValue) || parsedValue === 0) &&
        styles.display === "inline")) &&
    element.getClientRects().length > 0
  ) {
    valueIsBorderBox = true;
    value = String(
      dimension === "width" ? element.offsetWidth : element.offsetHeight
    );
  }

  const parsed = Number.parseFloat(value) || 0;

  return (
    parsed +
    boxModelAdjustment(
      element,
      dimension,
      box,
      valueIsBorderBox,
      styles,
      parsed
    )
  );
}

function boxModelAdjustment(
  element: HTMLElement,
  dimension: Dimension,
  box: Box,
  isBorderBox: boolean,
  styles: CSSStyleDeclaration,
  computed: number | undefined
): number {
  if (box === (isBorderBox ? "border" : "content")) {
    return 0;
  }

  let delta = 0;

  for (const side of SIDES[dimension]) {
    const padding = number(styles, `padding-${side}`);
    const border = number(styles, `border-${side}-width`);

    // Only two conversions are left once the matching box returned above: a border-box value
    // asked for its content, and a content-box value asked for its border box.
    delta += isBorderBox ? -(padding + border) : padding + border;
  }

  // A content box read off the computed style misses the scroll gutter; `offsetWidth` /
  // `offsetHeight` include it, so the difference is what is left after the known parts.
  if (!isBorderBox && computed !== undefined && computed >= 0) {
    const offset =
      dimension === "width" ? element.offsetWidth : element.offsetHeight;

    delta += Math.max(0, Math.ceil(offset - computed - delta - 0.5)) || 0;
  }

  return delta;
}
