import { isView } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function style<T>(data: DynamicStylesProps<T>): OutputStyle {
  const { renderContext } = data.contexts;
  const IS_VIEW = isView(renderContext);
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: [
        "cssStyleSizeWidth",
        "cssStyleBorder",
        "cssStyleBgColor",
        "cssStyleAlertContainerShadow",
        "cssStyleBorderRadius",
        // it is necessary because in preview we don't have <BoxResizer/>
        ...(IS_VIEW ? ["cssStyleAlertPadding"] : [])
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ed-box__resizer": {
      // it is necessary for the resizer points to stay at the start and end of alert
      standart: ["cssStyleAlertPadding"]
    },
    ".brz &&:hover .brz-alert-title": {
      standart: [
        "cssStyleElementAlertTitleFontFamily",
        "cssStyleElementAlertTitleFontSize",
        "cssStyleElementAlertTitleLineHeight",
        "cssStyleElementAlertTitleFontWeight",
        "cssStyleElementAlertTitleLetterSpacing",
        "cssStyleElementAlertTitleFontVariation",
        "cssStyleElementAlertTitleTextTransform",
        "cssStyleElementAlertTitleColor",
        "cssStyleDisplayBlock",
        "cssStyleElementAlertTitleShadow",
        "cssStyleElementAlertTitleAlign"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-alert-description": {
      standart: [
        "cssStyleElementAlertDescriptionFontFamily",
        "cssStyleElementAlertDescriptionFontSize",
        "cssStyleElementAlertDescriptionLineHeight",
        "cssStyleElementAlertDescriptionFontWeight",
        "cssStyleElementAlertDescriptionLetterSpacing",
        "cssStyleElementAlertDescriptionFontVariation",
        "cssStyleElementAlertDescriptionTextTransform",
        "cssStyleElementAlertDescriptionColor",
        "cssStyleDisplayBlock",
        "cssStyleElementAlertDescriptionShadow",
        "cssStyleElementAlertDescriptionAlign",
        "cssStyleElementAlertDescriptionVisibility",
        "cssStyleElementAlertDescriptionGap"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-alert-close:hover": {
      standart: [
        "cssStyleElementAlertCloseButtonVisibility",
        "cssStyleElementAlertCloseButtonSize",
        "cssStyleElementAlertCloseButtonPosition",
        "cssStyleElementAlertCloseButtonBorderRadius",
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
