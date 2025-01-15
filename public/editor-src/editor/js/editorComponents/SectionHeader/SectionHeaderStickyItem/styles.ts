import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./toolbar";
import { DynamicStylesProps } from "visual/types";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function styleSection(data: DynamicStylesProps<Value>): OutputStyle {
  const { maskShape = "none" } = data.v;

  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: [
        "cssStylePaddingPreview",
        "cssStylePaddingRightLeftForEditor",
        "cssStyleMargin"
      ]
    },
    ".brz &&:hover > .brz-bg": {
      standart: [
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBoxShadowSectionOutset",
        ...(maskShape === "none"
          ? ["cssStyleBoxShadowSectionOutset"]
          : ["cssStyleMaskDropShadow"])
      ]
    },
    ".brz &&:hover > .brz-bg:after": {
      standart: ["cssStyleBoxShadowSection"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgSize",
        "cssStyleBgRepeat",
        "cssStyleBgImagePosition",
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
    ".brz &&:hover > .brz-bg > .brz-bg-shape__top": {
      standart: [
        "cssStyleShapeTopHeight",
        "cssStyleShapeTopFlip",
        "cssStyleShapeTopIndex"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-shape__top::after": {
      standart: ["cssStyleShapeTopType", "cssStyleShapeTopHeight"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-shape__bottom": {
      standart: [
        "cssStyleShapeBottomHeight",
        "cssStyleShapeBottomFlip",
        "cssStyleShapeBottomIndex"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-shape__bottom::after": {
      standart: ["cssStyleShapeBottomType", "cssStyleShapeBottomHeight"]
    },
    ".brz &&:hover > .brz-ed-draggable__padding--top": {
      standart: [
        "cssStylePaddingTopForEditorResizer",
        "cssStyleSectionPaddingsForEditorResize"
      ]
    },
    ".brz &&:hover > .brz-ed-draggable__padding--bottom": {
      standart: [
        "cssStylePaddingBottomForEditorResizer",
        "cssStyleSectionPaddingsForEditorResize"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleContainer(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: ["cssStyleBorderTransparentColor"],
      interval: ["cssStyleSectionMaxWidth"]
    }
  };

  return renderStyles({ ...data, styles });
}
