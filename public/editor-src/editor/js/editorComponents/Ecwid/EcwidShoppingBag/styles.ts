import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./index";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleBorderRadius",
        "cssStyleElementEcwidShoppingBagBgColor",
        "cssStyleElementEcwidShoppingBagBgGradient",
        "cssStyleElementEcwidShoppingBagBorderRadius",
        "cssStyleElementEcwidShoppingBagPadding"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementEcwidShoppingBagPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .ec-cart-widget .ec-minicart .ec-minicart__body .ec-minicart__icon svg.icon-default g path": {
      standart: ["cssStyleElementEcwidShoppingBagColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementEcwidShoppingBagPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .ec-cart-widget .ec-minicart .ec-minicart__body .ec-minicart__wrap .ec-minicart__counter": {
      standart: [
        "cssStyleElementEcwidShoppingBagTypography2FontFamily",
        "cssStyleElementEcwidShoppingBagTypography2FontSize",
        "cssStyleElementEcwidShoppingBagTypography2LineHeight",
        "cssStyleElementEcwidShoppingBagTypography2FontWeight",
        "cssStyleElementEcwidShoppingBagTypography2LetterSpacing",
        "cssStyleElementEcwidShoppingBagIconPositionTop",
        "cssStyleElementEcwidShoppingBagIconPositionLeft",
        "cssStyleElementEcwidShoppingBagIconPadding",
        "cssStyleElementEcwidShoppingBagIconColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementEcwidShoppingBagPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .ec-cart-widget .ec-minicart .ec-minicart__body .ec-minicart__wrap .ec-minicart__counter:after": {
      standart: [
        "cssStyleElementEcwidShoppingBagIconBorderRadius",
        "cssStyleElementEcwidShoppingBagIconBgColor",
        "cssStyleElementEcwidShoppingBagIconBorder",
        "cssStyleElementEcwidShoppingBagIconBoxShadow",
        "cssStyleBgGradient"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementEcwidShoppingBagPropertyHoverTransition"
      ]
    },
    ".brz && .ec-cart-widget .ec-minicart .ec-minicart__body .ec-minicart__icon": {
      standart: ["cssStyleElementEcwidShoppingBagSize"]
    }
  };

  return renderStyles({ v, vs, vd, styles }) as [string, string, string];
}
