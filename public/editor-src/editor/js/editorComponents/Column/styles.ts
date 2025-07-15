import { ElementModel } from "visual/component/Elements/Types";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { defaultValueValue } from "visual/utils/onChange";
import { fromElementModel } from "visual/utils/options/Motion/types/Value";
import { types as Devices } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";

export function styleColumn(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const {
    v,
    contexts: { renderContext }
  } = data;
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
  const hoverSelector =
    hoverName === "none" ? "" : ".brz-hover-animation__container > ";

  const styles: Styles = {
    ".brz &&": {
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
    [`.brz && > ${innerDivFromMotion}${hoverSelector}.brz-bg`]: {
      standart: ["cssStyleMargin", "cssStyleBlendMode", "cssStyleBorderRadius"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg`]: {
      standart: [
        "cssStyleBorder",
        ...(maskShape === "none"
          ? ["cssStyleBoxShadow"]
          : ["cssStyleMaskDropShadow"])
      ]
    },
    [`.brz && > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-image`]:
      {
        standart: [
          "cssStyleBgSize",
          "cssStyleBgRepeat",
          "cssStyleMaskSize",
          "cssStyleMaskShape",
          "cssStyleMaskCustomShape",
          "cssStyleMaskPosition",
          "cssStyleMaskRepeat"
        ]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-image`]:
      {
        standart: [
          "cssStyleBgImage",
          "cssStyleFilter",
          "cssStyleBgImagePosition",
          "cssStyleBgMediaImage"
        ]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-image:after`]:
      {
        standart: ["cssStyleBgImageHover"]
      },
    [`.brz && > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-color`]:
      {
        standart: [
          "cssStyleMaskShape",
          "cssStyleMaskCustomShape",
          "cssStyleMaskSize",
          "cssStyleMaskPosition",
          "cssStyleMaskRepeat"
        ]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-color`]:
      {
        standart: ["cssStyleBgColor", "cssStyleBgGradient"]
      },
    [`.brz && > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-map`]: {
      standart: ["cssStyleBgMediaMap"]
    },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-map`]:
      {
        standart: ["cssStyleFilter"]
      },
    [`.brz && > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-video`]:
      {
        standart: ["cssStyleBgMediaVideo"]
      },
    [`.brz &&:hover > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-video`]:
      {
        standart: ["cssStyleFilter"]
      },
    [`.brz && > ${innerDivFromMotion}${hoverSelector}.brz-bg, .brz && > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-image, .brz && > ${innerDivFromMotion}${hoverSelector}.brz-bg > .brz-bg-color`]:
      {
        standart: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
      }
  };

  if (isEditor(renderContext)) {
    styles[".brz && > *"] = {
      interval: ["cssStyleVisibleEditorDisplayNoneOrBlock|||editor"]
    };
    styles[
      `.brz && > ${innerDivFromMotion}${hoverSelector}.brz-bg`
    ].interval?.push("cssStyleVisible|||editor");
    styles[
      `.brz && > ${innerDivFromMotion}${hoverSelector}.brz-column__items`
    ] = {
      interval: ["cssStyleVisible|||editor"]
    };
  } else {
    styles[".brz && > *"] = {
      interval: ["cssStyleVisible|||preview"]
    };
    styles[".brz && > .brz-column__items"] = {
      interval: ["cssStyleVisible|||preview"]
    };
  }

  return renderStyles({ ...data, styles });
}

export function styleItems(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleZIndex|||editor",
        "cssStyleMargin",
        "cssStyleBorderTransparentColor",
        "cssStylePaddingFourFields",
        "cssStyleColumnHeight",
        "cssStyleColumnVerticalAlignItems",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransition"
      ]
    },
    ".brz &&:hover": {
      interval: ["cssStyleDisplayFlex"]
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
