import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";

interface Data extends DynamicStylesProps<ElementModel> {
  props: Record<string, unknown>;
}

export function style(data: Data): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStylePaddingPreview", "cssStylePaddingRightLeftForEditor"]
    },
    ".brz && > .brz-bg": {
      standart: ["cssStyleBorderRadius", "cssStyleBlendMode"]
    },
    ".brz &&:hover > .brz-bg": {
      standart: ["cssStyleBorder", "cssStyleMaskDropShadow"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz && > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleBgSize",
        "cssStyleBgRepeat",
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
      ],
      interval: [
        "cssStyleBgImageAttachment",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransition"
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
      standart: ["cssStyleBgColor", "cssStyleBgGradient"],
      interval: [
        "cssStyleHoverTransitionFlash",
        "cssStylePropertyHoverTransition"
      ]
    },
    ".brz && > .brz-bg > .brz-bg-map": {
      standart: ["cssStyleBgMediaMap"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-map": {
      standart: ["cssStyleFilter"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz && > .brz-bg > .brz-bg-video": {
      standart: ["cssStyleBgMediaVideo"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-video": {
      standart: ["cssStyleFilter"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
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
    },
    ".brz && > .brz-bg > .brz-bg-slideshow  .brz-bg-slideshow-item": {
      standart: [
        "cssStyleBgMediaSlideshow",
        "cssStyleBgSlideshowKenBurnsEffectStart",
        "cssStyleBgSlideshowPosition"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-slideshow  .brz-bg-slideshow-item": {
      standart: ["cssStyleFilter"]
    },
    ".brz && > .brz-bg > .brz-bg-slideshow .swiper-slide.swiper-slide-active .brz-bg-slideshow-item, .brz && > .brz-bg > .brz-bg-slideshow .swiper-slide-duplicate-active .brz-bg-slideshow-item":
      {
        standart: ["cssStyleBgSlideshowKenBurnsEffectEnd"]
      }
  };

  return renderStyles({ ...data, styles });
}

export function styleContainer(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      interval: ["cssStyleSectionMaxWidth"]
    },
    ".brz &&:hover": {
      standart: ["cssStyleBorderTransparentColor"]
    }
  };

  return renderStyles({ ...data, styles });
}
