import { fromElementModel } from "visual/component/Options/types/dev/Motion/types/Value";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { renderStyles } from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { types as Devices } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";

export function styleRow(v, vs, vd) {
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
  let innerDivFromMotion = enabledMotion ? "div > " : "";

  const styles = {
    ".brz &&:hover": {
      interval: ["cssStyleRowMinHeight", "cssStyleDisplayFlex"],
      standart: [
        "cssStyleMargin",
        "cssStyleZIndex",
        "cssStyleFlexVerticalAlign"
      ]
    },
    [`.brz &&:hover > ${innerDivFromMotion}.brz-bg`]: {
      standart: [
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleSizeMaxWidthSize",
        "cssStyleBlendMode"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}.brz-bg > .brz-bg-image`]: {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgImagePosition",
        "cssStyleBgMediaImage"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}.brz-bg > .brz-bg-image:after`]: {
      standart: ["cssStyleBgImageHover"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}.brz-bg > .brz-bg-color`]: {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}.brz-bg > .brz-bg-map`]: {
      standart: ["cssStyleFilter", "cssStyleBgMediaMap"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}.brz-bg > .brz-bg-video`]: {
      standart: ["cssStyleFilter", "cssStyleBgMediaVideo"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}.brz-row`]: {
      standart: ["cssStyleBorderTransparentColor"],
      interval: [
        "cssStyleRowReverseColumn",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransition"
      ]
    }
  };

  if (IS_EDITOR) {
    styles[".brz &&:hover"].interval.push(
      "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
    );
  } else {
    styles[".brz &&:hover"].interval.push("cssStyleVisible|||preview");
  }

  return renderStyles({ v, vs, vd, styles });
}

export function styleContainer(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStylePaddingFourFields", "cssStyleSizeMaxWidthSize"],
      interval: IS_EDITOR ? ["cssStyleVisible|||editor"] : []
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
