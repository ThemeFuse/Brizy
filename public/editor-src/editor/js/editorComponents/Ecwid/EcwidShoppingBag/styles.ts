import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { Value } from "./types/Value";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz && .ec-cart-widget.brz-ecwid-shopping-bag": {
      standart: ["cssStyleBorderRadius", "cssStylePaddingFourFields"]
    },
    ".brz && .ec-cart-widget.brz-ecwid-shopping-bag:hover": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBorder",
        "cssStyleBoxShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionFill"
      ]
    },
    "#ecwid_html #ecwid_body && .ec-minicart .ec-minicart__body .ec-minicart__icon":
      { standart: ["cssStyleSizeWidthHeight"] },
    "#ecwid_html #ecwid_body &&:hover .ec-minicart .ec-minicart__body .ec-minicart__icon svg.icon-default g path":
      {
        standart: ["cssStyleStroke"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionFill"
        ]
      },
    "#ecwid_html #ecwid_body && .ec-minicart .ec-minicart__body .ec-minicart__wrap .ec-minicart__counter":
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
          "cssStyleElementEcwidShoppingBagIconSizes"
        ]
      },
    "#ecwid_html #ecwid_body &&:hover .ec-minicart .ec-minicart__body .ec-minicart__wrap .ec-minicart__counter":
      {
        standart: ["cssStyleElementEcwidShoppingBagIconColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionFill"
        ]
      },
    "#ecwid_html #ecwid_body && .ec-minicart .ec-minicart__body .ec-minicart__wrap .ec-minicart__counter:after":
      {
        standart: ["cssStyleElementEcwidShoppingBagIconBorderRadius"]
      },
    "#ecwid_html #ecwid_body &&:hover .ec-minicart .ec-minicart__body .ec-minicart__wrap .ec-minicart__counter:after":
      {
        standart: [
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
    "#ecwid_html #ecwid_body && .ec-minicart.ec-minicart--no-shape.ec-minicart--empty .ec-minicart__counter::after":
      {
        standart: ["cssStyleElementEcwidShoppingBagIconBorderRadius"]
      },
    "#ecwid_html #ecwid_body &&:hover .ec-minicart:hover.ec-minicart--no-shape.ec-minicart--empty .ec-minicart__counter::after":
      {
        standart: [
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

  return renderStyles({ ...data, styles });
}
