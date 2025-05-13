import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function styleCloseButton(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz && > .brz-popup__close:hover": {
      standart: ["cssStyleColor"]
    },
    ".brz && > .brz-bg": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover > .brz-bg": {
      standart: ["cssStyleBorder"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: ["cssStyleBgImage", "cssStyleFilter", "cssStyleBgImagePosition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image:after": {
      standart: ["cssStyleBgImageHover"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleContainer(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      interval: ["cssStyleSizeMaxWidthContainer"]
    },
    ".brz &&:hover": {
      standart: ["cssStyleBorderTransparentColor"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleContainerWrap(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSectionPopupContainerWrap"]
    }
  };

  return renderStyles({ ...data, styles });
}
