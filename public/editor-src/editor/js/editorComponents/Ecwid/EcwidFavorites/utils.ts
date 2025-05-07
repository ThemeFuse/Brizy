import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { onOffToBool } from "visual/utils/boolean";
import { Value } from "./types";

export const valueToEciwdConfig = (v: Value): EcwidConfig => ({
  show_footer_menu: onOffToBool(v.footerDisplay),
  show_signin_link: onOffToBool(v.signinLink),
  show_breadcrumbs: false
});

const selectors = [
  ".grid-product",
  ".grid-product__wrap",
  ".grid-product__scroller",
  ".grid-product__wrap-inner",
  ".grid-product__image",
  ".grid-product__spacer",
  ".grid-product__spacer-inner",
  ".grid-product__bg",
  ".grid-product__image-wrap",
  ".grid-product__image .grid-product__shadow",
  ".grid-product__image .grid-product__picture",
  ".grid-product__title",
  ".grid-product__title-inner",
  ".grid-product__price"
];

export const blockClick = (node: HTMLElement): void =>
  node.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  });

export const blockClicksBySelectors = (node: HTMLElement): void => {
  blockClick(node);

  selectors.forEach((selector) => {
    const childNode = node.querySelector<HTMLElement>(selector);

    if (childNode) {
      blockClick(childNode);
    }
  });
};
