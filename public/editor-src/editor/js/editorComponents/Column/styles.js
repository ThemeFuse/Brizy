import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { renderStyles } from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { fromElementModel } from "visual/utils/options/Motion/types/Value";
import { types as Devices } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";

export function styleColumn(v, vs, vd) {
  const get = (k) => {
    return Devices.some((device) => {
      return defaultValueValue({
        v,
        device,
        key: createOptionId("motion", k),
        state: NORMAL
      });
    });
  };
  const { maskShape = "none", hoverName = "none" } = v;
  const motion = fromElementModel(get);
  const enabledMotion =
    motion.vertical ||
    motion.horizontal ||
    motion.transparency ||
    motion.blur ||
    motion.rotate ||
    motion.scale ||
    motion.mouseTrack ||
    motion.mouseTilt;

  const innerDivFromMotion = enabledMotion ? "div[data-scroll-motion] > " : "";
  const hoverSelector =
    hoverName === "none" ? "" : ".brz-hover-animation__container > ";

  let styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleZIndex|||preview",
        "cssStyleFlexColumn",
        "cssStyleSizeMaxWidth",
        "cssStyleFlexColumnVerticalAlign"
      ]
    },
    ".brz && > .brz-ed-sortable--empty": {
      standart: ["cssStyleEmptyColumnHeight"]
    },
    ".brz && .brz-columns__scroll-effect": {
      standart: ["cssStyleFlexColumnVerticalAlign"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg`]: {
      standart: [
        "cssStyleBorder",
        "cssStyleBorderRadius",
        ...(maskShape === "none"
          ? ["cssStyleBoxShadow"]
          : ["cssStyleMaskDropShadow"]),
        "cssStyleMargin",
        "cssStyleBlendMode"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-image`]:
      {
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
        ],
        interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-image:after`]:
      {
        standart: ["cssStyleBgImageHover"]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-color`]:
      {
        standart: [
          "cssStyleBgColor",
          "cssStyleBgGradient",
          "cssStyleMaskShape",
          "cssStyleMaskCustomShape",
          "cssStyleMaskSize",
          "cssStyleMaskPosition",
          "cssStyleMaskRepeat"
        ],
        interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-map`]:
      {
        standart: ["cssStyleFilter", "cssStyleBgMediaMap"]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-video`]:
      {
        standart: ["cssStyleFilter", "cssStyleBgMediaVideo"]
      }
  };

  if (IS_EDITOR) {
    styles[".brz &&:hover > *"] = {
      interval: ["cssStyleVisibleEditorDisplayNoneOrBlock|||editor"]
    };
    styles[
      `.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg`
    ].interval.push("cssStyleVisible|||editor");
    styles[
      `.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-column__items`
    ] = {
      interval: ["cssStyleVisible|||editor"]
    };
  } else {
    styles[".brz &&:hover > *"] = {
      interval: ["cssStyleVisible|||preview"]
    };
    styles[".brz &&:hover > .brz-column__items"] = {
      interval: ["cssStyleVisible|||preview"]
    };
  }

  return renderStyles({ v, vs, vd, styles });
}

export function styleItems(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleZIndex|||editor",
        "cssStyleMargin",
        "cssStyleBorderTransparentColor",
        "cssStylePaddingFourFields",
        "cssStyleColumnHeight",
        "cssStyleColumnVerticalAlignItems"
      ],
      interval: [
        "cssStyleDisplayFlex",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransition"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleAnimation(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
