import { ElementModel } from "visual/component/Elements/Types";
import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function styleSection(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const { renderContext, v } = data;
  const { maskShape = "none" } = v;

  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      interval: ["cssStyleVisibleMode|||preview"],
      standart: [
        "cssStylePaddingPreview",
        "cssStylePaddingRightLeftForEditor",
        "cssStyleSectionHeightStyle",
        "cssStyleDisplayFlex",
        "cssStyleMargin",
        "cssStyleZIndex"
      ]
    },
    ".brz &&:hover > .brz-bg": {
      standart: [
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBoxShadowSectionOutset",
        "cssStyleMaskDropShadow"
      ]
    },
    ".brz &&:hover > .brz-bg:after": {
      standart: maskShape === "none" ? ["cssStyleBoxShadowSection"] : []
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgSize",
        "cssStyleBgRepeat",
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
    ".brz && .brz-container": {
      standart: ["cssStyleFlexColumnVerticalAlign"]
    }
  };

  if (isEditor(renderContext)) {
    styles[".brz &&:hover"].interval?.push("cssStyleShowFlex");

    // Added offset for toolbar when uses marginTop in negative value
    styles[".brz &&:hover .brz-ed-collapsible"] = {
      standart: ["cssStyleSectionToolbarOffset"]
    };
    styles[".brz &&:hover"].interval?.push(
      "cssStyleVisibleEditorDisplayNoneOrFlex"
    );
    styles[".brz &&:hover > .brz-bg"].interval = [
      "cssStyleVisibleMode|||editor"
    ];
    styles[".brz &&:hover > .brz-container"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
  }

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

export function styleAnimation(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ ...data, styles });
}
