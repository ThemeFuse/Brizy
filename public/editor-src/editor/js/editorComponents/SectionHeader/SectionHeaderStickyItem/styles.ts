import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./toolbar";

export function styleSection(data: DynamicStylesProps<Value>): OutputStyle {
  const { maskShape = "none" } = data.v;

  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStylePaddingPreview",
        "cssStylePaddingRightLeftForEditor",
        "cssStyleMargin"
      ]
    },
    ".brz && > .brz-bg": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover > .brz-bg": {
      standart: [
        "cssStyleBorder",
        "cssStyleBoxShadowSectionOutset",
        ...(maskShape === "none"
          ? ["cssStyleBoxShadowSectionOutset"]
          : ["cssStyleMaskDropShadow"])
      ]
    },
    ".brz &&:hover > .brz-bg:after": {
      standart: ["cssStyleBoxShadowSection"]
    },
    ".brz && > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat",
        "cssStyleBgSize",
        "cssStyleBgRepeat"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: ["cssStyleBgImage", "cssStyleFilter", "cssStyleBgImagePosition"]
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
    ".brz && > .brz-bg > .brz-bg-shape__top": {
      standart: [
        "cssStyleShapeTopHeight",
        "cssStyleShapeTopFlip",
        "cssStyleShapeTopIndex"
      ]
    },
    ".brz && > .brz-bg > .brz-bg-shape__top::after": {
      standart: ["cssStyleShapeTopType", "cssStyleShapeTopHeight"]
    },
    ".brz && > .brz-bg > .brz-bg-shape__bottom": {
      standart: [
        "cssStyleShapeBottomHeight",
        "cssStyleShapeBottomFlip",
        "cssStyleShapeBottomIndex"
      ]
    },
    ".brz && > .brz-bg > .brz-bg-shape__bottom::after": {
      standart: ["cssStyleShapeBottomType", "cssStyleShapeBottomHeight"]
    },
    ".brz && > .brz-ed-draggable__padding--top": {
      standart: [
        "cssStylePaddingTopForEditorResizer",
        "cssStyleSectionPaddingsForEditorResize"
      ]
    },
    ".brz && > .brz-ed-draggable__padding--bottom": {
      standart: [
        "cssStylePaddingBottomForEditorResizer",
        "cssStyleSectionPaddingsForEditorResize"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleContainer(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      interval: ["cssStyleSectionMaxWidth"]
    },
    ".brz &&:hover": {
      standart: ["cssStyleBorderTransparentColor"]
    }
  };

  return renderStyles({ ...data, styles });
}
