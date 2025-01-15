import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function styleSection(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
      ]
    },
    ".brz &&:hover > .brz-bg": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBoxShadow"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgImagePosition"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image:after": {
      standart: ["cssStyleBgImageHover"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg-content": {
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
    ".brz &&:hover": {
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
