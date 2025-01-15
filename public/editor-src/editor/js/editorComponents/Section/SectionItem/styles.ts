import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";

interface Data extends DynamicStylesProps<ElementModel> {
  props: Record<string, unknown>;
}

export function style(data: Data): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStylePaddingPreview", "cssStylePaddingRightLeftForEditor"]
    },
    ".brz &&:hover > .brz-bg": {
      standart: [
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBlendMode",
        "cssStyleMaskDropShadow"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },

    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgImagePosition",
        "cssStyleBgMediaImage",
        "cssStyleBgSize",
        "cssStyleBgRepeat",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
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
    ".brz &&:hover > .brz-bg > .brz-bg-color": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ],
      interval: [
        "cssStyleHoverTransitionFlash",
        "cssStylePropertyHoverTransition"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-map": {
      standart: ["cssStyleFilter", "cssStyleBgMediaMap"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-video": {
      standart: ["cssStyleFilter", "cssStyleBgMediaVideo"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
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
    },
    ".brz &&:hover > .brz-bg > .brz-bg-slideshow  .brz-bg-slideshow-item": {
      standart: [
        "cssStyleBgMediaSlideshow",
        "cssStyleFilter",
        "cssStyleBgSlideshowKenBurnsEffectStart",
        "cssStyleBgSlideshowPosition"
      ]
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
    ".brz &&:hover": {
      standart: ["cssStyleBorderTransparentColor"],
      interval: ["cssStyleSectionMaxWidth"]
    }
  };

  return renderStyles({ ...data, styles });
}
