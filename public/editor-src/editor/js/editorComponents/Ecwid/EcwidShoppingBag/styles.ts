import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types/Value";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz && .ec-cart-widget.brz-ecwid-shopping-bag:hover": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleBorderRadius",
        "cssStylePaddingFourFields"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionFill"
      ]
    },
    "#ecwid_html #ecwid_body &&:hover .ec-minicart .ec-minicart__body .ec-minicart__icon":
      { standart: ["cssStyleSizeWidthHeight"] },
    "#ecwid_html #ecwid_body &&:hover .ec-minicart .ec-minicart__body .ec-minicart__icon svg.icon-default g path":
      {
        standart: ["cssStyleStroke"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionFill"
        ]
      },
    "#ecwid_html #ecwid_body &&:hover .ec-minicart .ec-minicart__body .ec-minicart__wrap .ec-minicart__counter":
      {
        standart: [
          "cssStyleTypography3FontFamily",
          "cssStyleTypography3FontSize",
          "cssStyleTypography3LineHeight",
          "cssStyleTypography3FontWeight",
          "cssStyleTypography3LetterSpacing",
          "cssStyleTypography3FontVariation",
          "cssStyleTypography3TextTransform",
          "cssStyleElementEcwidShoppingBagIconDisplay",
          "cssStyleElementEcwidShoppingBagIconPositionTop",
          "cssStyleElementEcwidShoppingBagIconPositionLeft",
          "cssStyleElementEcwidShoppingBagIconColor",
          "cssStyleElementEcwidShoppingBagIconSizes"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionFill"
        ]
      },
    "#ecwid_html #ecwid_body &&:hover .ec-minicart .ec-minicart__body .ec-minicart__wrap .ec-minicart__counter:after":
      {
        standart: [
          "cssStyleElementEcwidShoppingBagIconBorderRadius",
          "cssStyleElementEcwidShoppingBagIconBgColor",
          "cssStyleElementEcwidShoppingBagIconBgGradient",
          "cssStyleElementEcwidShoppingBagIconBorder",
          "cssStyleElementEcwidShoppingBagIconBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionFill"
        ]
      },
    "#ecwid_html #ecwid_body &&:hover .ec-minicart:hover.ec-minicart--no-shape.ec-minicart--empty .ec-minicart__counter::after":
      {
        standart: [
          "cssStyleElementEcwidShoppingBagIconBorderRadius",
          "cssStyleElementEcwidShoppingBagIconBgColor",
          "cssStyleElementEcwidShoppingBagIconBgGradient",
          "cssStyleElementEcwidShoppingBagIconBorder",
          "cssStyleElementEcwidShoppingBagIconBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionFill"
        ]
      }
  };

  return renderStyles({ v, vs, vd, styles }) as [string, string, string];
}
