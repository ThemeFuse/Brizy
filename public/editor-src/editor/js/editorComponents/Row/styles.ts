import type { ElementModel } from "visual/component/Elements/Types";
import { hasTransform } from "visual/component/TransformWrapper/utils";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { isEditor } from "visual/providers/RenderProvider";
import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";
import { defaultValueValue } from "visual/utils/onChange";
import { fromElementModel } from "visual/utils/options/Motion/types/Value";
import { types as Devices } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";

export function styleRow(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const { v, store, contexts } = data;

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
  const enabledTransform = hasTransform(v, store);
  const transformSelector = `${innerDivFromMotion}${hoverContainer}.brz-row__transform`;
  const innerWrappers = enabledTransform
    ? `${transformSelector} > `
    : `${innerDivFromMotion}${hoverContainer}`;

  const styles = {
    ".brz &&": {
      interval: ["cssStyleRowMinHeight", "cssStyleDisplayFlex"],
      standart: [
        "cssStyleMargin",
        "cssStyleZIndex",
        "cssStyleFlexVerticalAlign"
      ]
    },

    [`.brz && > ${innerWrappers}.brz-bg`]: {
      standart: [
        "cssStyleBorderRadius",
        "cssStyleSizeMaxWidthSize",
        "cssStyleBlendMode",
        ...(enabledTransform ? ["cssStyleRowTransformBg"] : [])
      ]
    },
    [`.brz &&:hover > ${innerWrappers}.brz-bg`]: {
      standart: [
        "cssStyleBorder",
        ...(maskShape === "none"
          ? ["cssStyleBoxShadow"]
          : ["cssStyleMaskDropShadow"])
      ]
    },
    [`.brz && > ${innerWrappers}.brz-bg > .brz-bg-image`]: {
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
    [`.brz &&:hover > ${innerWrappers}.brz-bg > .brz-bg-image`]: {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgImagePosition",
        "cssStyleBgMediaImage"
      ]
    },
    [`.brz &&:hover > ${innerWrappers}.brz-bg > .brz-bg-image:after`]: {
      standart: ["cssStyleBgImageHover"]
    },
    [`.brz && > ${innerWrappers}.brz-bg > .brz-bg-color`]: {
      standart: [
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    [`.brz &&:hover > ${innerWrappers}.brz-bg > .brz-bg-color`]: {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"]
    },
    [`.brz && > ${innerWrappers}.brz-bg > .brz-bg-map`]: {
      standart: ["cssStyleBgMediaMap"]
    },
    [`.brz &&:hover > ${innerWrappers}.brz-bg > .brz-bg-map`]: {
      standart: ["cssStyleFilter"]
    },
    [`.brz && > ${innerWrappers}.brz-bg > .brz-bg-video`]: {
      standart: ["cssStyleBgMediaVideo"]
    },
    [`.brz &&:hover > ${innerWrappers}.brz-bg > .brz-bg-video`]: {
      standart: ["cssStyleFilter"]
    },
    [`.brz &&:hover > ${innerWrappers}.brz-row`]: {
      standart: ["cssStyleBorderTransparentColor", "cssStyleRowReverseColumn"]
    },
    [`.brz && > ${innerWrappers}.brz-row, .brz && > ${innerWrappers}.brz-bg > .brz-bg-video, .brz && > ${innerWrappers}.brz-bg, .brz && > ${innerWrappers}.brz-bg > .brz-bg-image, .brz && > ${innerWrappers}.brz-bg > .brz-bg-color`]:
      {
        standart: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
      }
  };

  if (enabledTransform) {
    styles[`.brz && > ${transformSelector}`] = {
      standart: [
        "cssStyleTransform",
        "cssStyleDisplayFlex",
        "cssStyleRowTransformWrapper"
      ]
    };
  }

  if (_isEditor) {
    styles[".brz &&"].interval.push(
      "cssStyleVisibleEditorDisplayNoneOrFlex|||editor"
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
