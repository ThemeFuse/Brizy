import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function styleSection(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz && > .brz-bg, .brz && > .brz-bg > .brz-bg-image, .brz && > .brz-bg > .brz-bg-color":
      {
        standart: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
      },
    ".brz &&": {
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
      ]
    },
    ".brz && > .brz-bg": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover > .brz-bg": {
      standart: ["cssStyleBorder", "cssStyleBoxShadow"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: ["cssStyleBgImage", "cssStyleFilter", "cssStyleBgImagePosition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image:after": {
      standart: ["cssStyleBgImageHover"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"]
    },
    ".brz && > .brz-bg-content": {
      standart: [
        "cssStylePaddingFourFields",
        "cssStylePaddingRightLeftForEditor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleContainer(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      interval: ["cssStyleVisibleMode|||editor"],
      standart: [
        "cssStylePaddingFourFields",
        "cssStylePaddingRightLeftForEditor",
        "cssStyleElementMegaMenuHeight",
        "cssStyleFlexColumnVerticalAlign",
        "cssStyleBorderTransparentColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
