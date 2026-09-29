import jQuery from "jquery";
import { t } from "visual/utils/i18n";
import type { Literal } from "visual/utils/types/Literal";
import type { MValue } from "visual/utils/value";
import type { CssName } from "./type";

export const STICKY_ITEM_INDEX = 1;

export const fixedContainerPlus = ({
  fixed,
  node,
  height
}: {
  fixed: MValue<boolean>;
  node: HTMLElement | null;
  height?: Literal;
}): void => {
  if (!node) {
    return;
  }

  const $adderBlock = jQuery(node).siblings(".brz-ed-container-plus");

  if (fixed) {
    $adderBlock.addClass("brz-ed-container-plus--fixed").css({
      top: `${height}px`
    });
  } else {
    $adderBlock.removeClass("brz-ed-container-plus--fixed").css({
      top: "auto"
    });
  }
};

export const getToolbarTagsChoices = () => [
  { title: "Div", value: "div" },
  { title: t("Header"), value: "header" },
  { title: t("Footer"), value: "footer" },
  { title: t("Main"), value: "main" },
  { title: t("Article"), value: "article" },
  { title: t("Section"), value: "section" },
  { title: t("Aside"), value: "aside" },
  { title: t("Nav"), value: "nav" }
];

// A number with a unit other than px (jQuery's `rnumnonpx`).
const NON_PIXEL = /^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i;
// Displays whose element is measured while shown (jQuery's `rdisplayswap`).
const SWAP_DISPLAY = /^(none|table(?!-c[ea]).+)/;

export const getHeader = (element: HTMLElement): HTMLElement | undefined =>
  element.closest<HTMLElement>(".brz-section__header") ?? undefined;

// jQuery uses the element's own window only when it has an opener.
function getStyles(element: Element): CSSStyleDeclaration {
  const view = element.ownerDocument.defaultView;

  return (view?.opener ? view : window).getComputedStyle(element);
}

// The computed value, or the inline one for a detached element.
function curCSS(
  element: Element,
  name: CssName,
  styles: CSSStyleDeclaration
): string {
  const value = styles[name];

  if (value === "" && !element.isConnected && element instanceof HTMLElement) {
    return element.style[name];
  }

  return value;
}

const cssNumber = (
  element: Element,
  name: CssName,
  styles: CSSStyleDeclaration
): number => parseFloat(curCSS(element, name, styles)) || 0;

function measureOuterHeight(element: HTMLElement): number {
  const styles = getStyles(element);
  const isBorderBox = curCSS(element, "boxSizing", styles) === "border-box";
  let valueIsBorderBox = isBorderBox;
  let value = curCSS(element, "height", styles);

  if (NON_PIXEL.test(value)) {
    value = "auto";
  }

  let height: number;

  if (
    (value === "auto" ||
      (!parseFloat(value) &&
        curCSS(element, "display", styles) === "inline")) &&
    element.getClientRects().length
  ) {
    valueIsBorderBox = true;
    height = element.offsetHeight || 0;
  } else {
    height = parseFloat(value) || 0;
  }

  if (valueIsBorderBox) {
    return height;
  }

  let delta = 0;
  delta += cssNumber(element, "paddingTop", styles);
  delta += cssNumber(element, "borderTopWidth", styles);
  delta += cssNumber(element, "paddingBottom", styles);
  delta += cssNumber(element, "borderBottomWidth", styles);

  // Content-box scroll gutter, from the rounded offsetHeight.
  delta +=
    Math.max(0, Math.ceil(element.offsetHeight - height - delta - 0.5)) || 0;

  return height + delta;
}

function whileShown<T>(element: HTMLElement, measure: () => T): T {
  const { position, visibility, display } = element.style;

  element.style.position = "absolute";
  element.style.visibility = "hidden";
  element.style.display = "block";

  const result = measure();

  element.style.position = position;
  element.style.visibility = visibility;
  element.style.display = display;

  return result;
}

function getOuterHeight(element: HTMLElement): number {
  const display = curCSS(element, "display", getStyles(element));

  if (
    SWAP_DISPLAY.test(display) &&
    (!element.getClientRects().length || !element.getBoundingClientRect().width)
  ) {
    return whileShown(element, () => measureOuterHeight(element));
  }

  return measureOuterHeight(element);
}

export function onAnimatedStickyChange(
  element: HTMLElement,
  isSticky: boolean
): void {
  const opened = "brz-section__header--animated-opened";
  const closed = "brz-section__header--animated-closed";

  if (isSticky) {
    element.classList.add(opened);
    element.classList.remove(closed);

    window.Brz.emit("elements.headerSticky.show", {
      node: element,
      type: "animated"
    });
  } else {
    element.classList.add(closed);
    element.classList.remove(opened);

    window.Brz.emit("elements.headerSticky.hide", {
      node: element,
      type: "animated"
    });
  }
}

export function onFixedStickyChange(
  element: HTMLElement,
  isSticky: boolean
): void {
  const header = getHeader(element);

  if (isSticky) {
    const firstChild = element.firstElementChild;
    const marginTop = firstChild
      ? curCSS(firstChild, "marginTop", getStyles(firstChild))
      : undefined;
    const height = getOuterHeight(element);

    if (marginTop !== undefined && parseInt(marginTop, 10) < 0 && header) {
      header.style.marginTop = marginTop;
    }

    element.classList.add("brz-section__header--fixed-opened");
    if (header) {
      header.style.height = `${Math.max(0, height)}px`;
    }

    window.Brz.emit("elements.headerSticky.show", {
      node: element,
      type: "fixed"
    });
  } else {
    element.classList.remove("brz-section__header--fixed-opened");
    if (header) {
      header.style.height = "auto";
      header.style.marginTop = "";
    }

    window.Brz.emit("elements.headerSticky.hide", {
      node: element,
      type: "fixed"
    });
  }
}
