import { isView } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function style<T>(data: DynamicStylesProps<T>): OutputStyle {
  const { renderContext } = data.contexts;

  const IS_VIEW = isView(renderContext);

  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth", "cssStyleBorderRadius"]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleBorder",
        "cssStyleBgColor",
        "cssStyleAlertContainerShadow",
        // in preview we don't have <BoxResizer/>
        ...(IS_VIEW ? ["cssStyleAlertPadding"] : [])
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ...(!IS_VIEW
      ? {
          ".brz && .brz-ed-box__resizer": {
            // it is necessary for the resizer points to stay at the start and end of alert
            standart: ["cssStyleAlertPadding"]
          }
        }
      : {}),
    ".brz && .brz-alert-title": {
      standart: [
        "cssStyleElementAlertTitleFontFamily",
        "cssStyleElementAlertTitleFontSize",
        "cssStyleElementAlertTitleLineHeight",
        "cssStyleElementAlertTitleFontWeight",
        "cssStyleElementAlertTitleLetterSpacing",
        "cssStyleElementAlertTitleFontVariation",
        "cssStyleElementAlertTitleTextTransform",
        "cssStyleDisplayBlock",
        "cssStyleElementAlertTitleAlign"
      ]
    },
    ".brz &&:hover .brz-alert-title": {
      standart: [
        "cssStyleElementAlertTitleColor",
        "cssStyleElementAlertTitleShadow"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-alert-description": {
      standart: [
        "cssStyleElementAlertDescriptionFontFamily",
        "cssStyleElementAlertDescriptionFontSize",
        "cssStyleElementAlertDescriptionLineHeight",
        "cssStyleElementAlertDescriptionFontWeight",
        "cssStyleElementAlertDescriptionLetterSpacing",
        "cssStyleElementAlertDescriptionFontVariation",
        "cssStyleElementAlertDescriptionTextTransform",
        "cssStyleDisplayBlock",
        "cssStyleElementAlertDescriptionAlign",
        "cssStyleElementAlertDescriptionVisibility",
        "cssStyleElementAlertDescriptionGap"
      ]
    },
    ".brz &&:hover .brz-alert-description": {
      standart: [
        "cssStyleElementAlertDescriptionColor",
        "cssStyleElementAlertDescriptionShadow"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-alert-close": {
      standart: [
        "cssStyleElementAlertCloseButtonVisibility",
        "cssStyleElementAlertCloseButtonSize",
        "cssStyleElementAlertCloseButtonPosition",
        "cssStyleElementAlertCloseButtonBorderRadius"
      ]
    },
    ".brz && .brz-alert-close:hover": {
      standart: [
        "cssStyleElementAlertCloseButtonColor",
        "cssStyleElementAlertCloseButtonBgColor",
        "cssStyleBoxShadow"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-alert-close-icon": {
      standart: ["cssStyleElementAlertCloseButtonBgSize"]
    }
  };

  return renderStyles({ ...data, styles });
}
