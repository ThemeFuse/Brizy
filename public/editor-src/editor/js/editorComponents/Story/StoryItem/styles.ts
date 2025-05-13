import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

interface Data extends DynamicStylesProps<ElementModel> {
  props: Record<string, unknown>;
}

export function style(data: Data): OutputStyle {
  const { maskShape = "none" } = data.v;

  const styles = {
    ".brz && > .brz-bg": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover > .brz-bg": {
      standart: [
        "cssStyleBorder",
        ...(maskShape === "none" ? [] : ["cssStyleMaskDropShadow"])
      ]
    },
    ".brz && > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgImagePosition",
        "cssStyleBgMediaImage"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image:after": {
      standart: ["cssStyleBgImageHover"]
    },
    ".brz && > .brz-bg > .brz-bg-color": {
      standart: [
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"]
    },
    ".brz && > .brz-bg > .brz-bg-map": {
      standart: ["cssStyleBgMediaMap"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-map": {
      standart: ["cssStyleFilter"]
    },
    ".brz && > .brz-bg > .brz-bg-video": {
      standart: ["cssStyleBgMediaVideo"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-video": {
      standart: ["cssStyleFilter"]
    }
  };

  return renderStyles({ ...data, styles });
}
