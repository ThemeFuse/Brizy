import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd, props) {
  const { maskShape = "none" } = v;

  const styles = {
    ".brz &&:hover > .brz-bg": {
      standart: [
        "cssStyleBorder",
        "cssStyleBorderRadius",
        ...(maskShape === "none" ? [] : ["cssStyleMaskDropShadow"])
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgImagePosition",
        "cssStyleBgMediaImage",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image:after": {
      standart: ["cssStyleBgImageHover"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-color": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-map": {
      standart: ["cssStyleFilter", "cssStyleBgMediaMap"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-video": {
      standart: ["cssStyleFilter", "cssStyleBgMediaVideo"]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}
