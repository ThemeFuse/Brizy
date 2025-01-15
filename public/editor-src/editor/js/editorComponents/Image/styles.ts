import { ElementModel, ElementProps } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";

interface Props extends DynamicStylesProps<ElementModel> {
  props: ElementProps;
}

export function styleHover(data: Props): OutputStyle {
  const styles: Styles = {
    ".brz &&.brz-hover-animation__container": {
      standart: ["cssStyleElementImageMaxWidthPreview"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function style(data: Props): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover:not(.brz-image--hovered)": {
      standart: ["cssStyleElementImageMaxWidthPreview"]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageHeightPreview",
        "cssStyleElementImageBoxShadow|||preview",
        "cssStyleBorder|||preview",
        "cssStyleBorderRadius|||preview",
        "cssStyleMaskDropShadow",
        "cssStyleBlendMode"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover .brz-picture:after": {
      standart: [
        "cssStyleElementImageBoxShadow|||preview",
        "cssStyleBgColor|||preview",
        "cssStyleBgGradient|||preview",
        "cssStyleBorderRadius|||preview"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover .brz-picture": {
      standart: [
        "cssStyleElementImageFilter|||preview",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleContent(data: Props): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageMaxWidthEditor",
        "cssStyleElementImageHeightEditor",
        "cssStyleBlendMode|||editor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleWrapper(data: Props): OutputStyle {
  const { v } = data;
  const { maskShape = "none" } = v;
  const styles: Styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageFilter|||editor",
        "cssStyleElementImageWidthWrapper",
        "cssStyleElementImageHeightWrapper|||editor",
        "cssStyleElementImagePosition",
        ...(maskShape === "none"
          ? [
              "cssStyleBorder|||editor",
              "cssStyleBorderRadius|||editor",
              "cssStyleElementImageBoxShadow|||editor",
              "cssStyleBlendMode|||editor"
            ]
          : []),
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover:after": {
      standart: [
        "cssStyleElementImageBoxShadow|||editor",
        "cssStyleBgColor|||editor",
        "cssStyleBgGradient|||editor"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleWrapperContainer(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBorderRadius|||editor",
        "cssStyleBorder|||editor",
        "cssStyleElementImageBoxShadow|||editor",
        "cssStyleMaskDropShadow"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleImage(data: Props): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageWidthWrapper",
        "cssStyleElementImageHeightWrapper",
        "cssStyleElementImageMarginLeft",
        "cssStyleElementImageMarginTop"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function stylePicture(data: Props): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementImagePictureSizePreview"]
    },
    ".brz &&:hover > .brz-img": {
      standart: [
        "cssStyleElementImagePosition",
        "cssStyleElementImageSizePreview"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
