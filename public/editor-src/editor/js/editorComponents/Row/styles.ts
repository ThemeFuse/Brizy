import { ElementModel } from "visual/component/Elements/Types";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";
import { defaultValueValue } from "visual/utils/onChange";
import { fromElementModel } from "visual/utils/options/Motion/types/Value";
import { types as Devices } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";

export function styleRow(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const { v, renderContext } = data;
  const _isEditor = isEditor(renderContext);
  const get = (k: string) => {
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

  const hoverContainer =
    hoverName === "none" ? "" : ".brz-hover-animation__container > ";

  const styles = {
    ".brz &&:hover": {
      interval: ["cssStyleRowMinHeight", "cssStyleDisplayFlex"],
      standart: [
        "cssStyleMargin",
        "cssStyleZIndex",
        "cssStyleFlexVerticalAlign"
      ]
    },

    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg`]: {
      standart: [
        "cssStyleBorder",
        "cssStyleBorderRadius",
        ...(maskShape === "none"
          ? ["cssStyleBoxShadow"]
          : ["cssStyleMaskDropShadow"]),
        "cssStyleSizeMaxWidthSize",
        "cssStyleBlendMode"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-image`]:
      {
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
        interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-image:after`]:
      {
        standart: ["cssStyleBgImageHover"]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-color`]:
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
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-map`]:
      {
        standart: ["cssStyleFilter", "cssStyleBgMediaMap"]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-video`]:
      {
        standart: ["cssStyleFilter", "cssStyleBgMediaVideo"],
        interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-row`]: {
      standart: ["cssStyleBorderTransparentColor"],
      interval: [
        "cssStyleRowReverseColumn",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransition"
      ]
    }
  };

  if (_isEditor) {
    styles[".brz &&:hover"].interval.push(
      "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
    );
  } else {
    styles[".brz &&:hover"].interval.push("cssStyleVisible|||preview");
  }

  return renderStyles({ ...data, styles });
}

export function styleContainer(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const { renderContext } = data;
  const _isEditor = isEditor(renderContext);
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStylePaddingFourFields", "cssStyleSizeMaxWidthSize"],
      interval: _isEditor ? ["cssStyleVisible|||editor"] : []
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
