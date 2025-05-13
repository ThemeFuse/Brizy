import { ElementModel } from "visual/component/Elements/Types";
import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function styleSection(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const {
    v,
    contexts: { renderContext }
  } = data;
  const { maskShape = "none" } = v;

  const isEditorMode = isEditor(renderContext);

  const styles: Styles = {
    ".brz &&": {
      interval: ["cssStyleVisibleMode|||preview"],
      standart: [
        "cssStylePaddingPreview",
        "cssStylePaddingRightLeftForEditor",
        "cssStyleSectionHeightStyle",
        "cssStyleMargin",
        "cssStyleZIndex"
      ]
    },
    ".brz &&:hover": {
      interval: [],
      standart: [
        "cssStyleDisplayFlex",
        "cssStyleVisibleEditorDisplayNoneOrFlex|||editor"
      ]
    },
    ".brz && > .brz-bg": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover > .brz-bg": {
      standart: [
        "cssStyleBorder",
        "cssStyleBoxShadowSectionOutset",
        "cssStyleMaskDropShadow"
      ]
    },
    ".brz &&:hover > .brz-bg:after": {
      standart: maskShape === "none" ? ["cssStyleBoxShadowSection"] : []
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
    ".brz && .brz-container": {
      standart: ["cssStyleFlexColumnVerticalAlign"]
    }
  };

  if (isEditorMode) {
    styles[".brz &&:hover"].interval?.push("cssStyleShowFlex");

    // Added offset for toolbar when uses marginTop in negative value
    styles[".brz && .brz-ed-collapsible"] = {
      standart: ["cssStyleSectionToolbarOffset"]
    };
    styles[".brz &&"].interval?.push("cssStyleVisibleEditorDisplayNoneOrFlex");
    styles[".brz && > .brz-bg"].interval = ["cssStyleVisibleMode|||editor"];
    styles[".brz && > .brz-container"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
  }

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

export function styleAnimation(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ ...data, styles });
}
