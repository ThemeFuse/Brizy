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
  const { v, contexts } = data;

  const _isEditor = isEditor(contexts.renderContext);

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
    ".brz &&": {
      interval: ["cssStyleRowMinHeight", "cssStyleDisplayFlex"],
      standart: [
        "cssStyleMargin",
        "cssStyleZIndex",
        "cssStyleFlexVerticalAlign"
      ]
    },

    [`.brz && > ${innerDivFromMotion}${hoverContainer}.brz-bg`]: {
      standart: [
        "cssStyleBorderRadius",
        "cssStyleSizeMaxWidthSize",
        "cssStyleBlendMode"
      ]
    },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg`]: {
      standart: [
        "cssStyleBorder",
        ...(maskShape === "none"
          ? ["cssStyleBoxShadow"]
          : ["cssStyleMaskDropShadow"])
      ]
    },
    [`.brz && > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-image`]:
      {
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
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-image`]:
      {
        standart: [
          "cssStyleBgImage",
          "cssStyleFilter",
          "cssStyleBgImagePosition",
          "cssStyleBgMediaImage"
        ]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-image:after`]:
      {
        standart: ["cssStyleBgImageHover"]
      },
    [`.brz && > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-color`]:
      {
        standart: [
          "cssStyleMaskShape",
          "cssStyleMaskCustomShape",
          "cssStyleMaskSize",
          "cssStyleMaskPosition",
          "cssStyleMaskRepeat"
        ]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-color`]:
      {
        standart: ["cssStyleBgColor", "cssStyleBgGradient"]
      },
    [`.brz && > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-map`]: {
      standart: ["cssStyleBgMediaMap"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-map`]:
      {
        standart: ["cssStyleFilter"]
      },
    [`.brz && > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-video`]:
      {
        standart: ["cssStyleBgMediaVideo"]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-video`]:
      {
        standart: ["cssStyleFilter"]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverContainer}.brz-row`]: {
      standart: ["cssStyleBorderTransparentColor"]
    },
    [`.brz && > ${innerDivFromMotion}${hoverContainer}.brz-row, .brz && > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-video, .brz && > ${innerDivFromMotion}${hoverContainer}.brz-bg, .brz && > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-image, .brz && > ${innerDivFromMotion}${hoverContainer}.brz-bg > .brz-bg-color`]:
      {
        standart: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
      }
  };

  if (_isEditor) {
    styles[".brz &&"].interval.push(
      "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
    );
  } else {
    styles[".brz &&"].interval.push("cssStyleVisible|||preview");
  }

  return renderStyles({ ...data, styles });
}

export function styleContainer(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const { renderContext } = data.contexts;
  const _isEditor = isEditor(renderContext);
  const styles = {
    ".brz &&": {
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
    ".brz &&": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ ...data, styles });
}
