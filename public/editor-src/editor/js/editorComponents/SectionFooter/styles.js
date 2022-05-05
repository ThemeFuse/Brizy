import { renderStyles } from "visual/utils/cssStyle";

export function styleSection(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: ["cssStyleVisibleMode|||preview"],
      standart: [
        "cssStylePaddingPreview",
        "cssStylePaddingRightLeftForEditor",
        "cssStyleSectionHeightStyle",
        "cssStyleDisplayFlex",
        "cssStyleMargin"
      ]
    },
    ".brz &&:hover > .brz-bg": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius"]
    },
    ".brz &&:hover > .brz-bg:after": {
      standart: ["cssStyleBoxShadowSection"]
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
    ".brz &&:hover > .brz-bg > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"]
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

  if (IS_EDITOR) {
    styles[".brz &&:hover"].interval.push("cssStyleShowMembershipFlex");

    // Added offset for toolbar when uses marginTop in negative value
    styles[".brz &&:hover .brz-ed-collapsible"] = {
      standart: ["cssStyleSectionToolbarOffset"]
    };
    styles[".brz &&:hover"].interval.push(
      "cssStyleVisibleEditorDisplayNoneOrFlex"
    );
    styles[".brz &&:hover > .brz-bg"].interval = [
      "cssStyleVisibleMode|||editor"
    ];
    styles[".brz &&:hover > .brz-container"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
  }

  return renderStyles({ v, vs, vd, styles });
}

export function styleContainer(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBorderTransparentColor"],
      interval: ["cssStyleSectionMaxWidth"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleAnimation(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleAnimation",
        "cssStyleAnimationDuration",
        "cssStyleAnimationDelay"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
