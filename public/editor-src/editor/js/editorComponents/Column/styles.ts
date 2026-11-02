import type { ElementModel } from "visual/component/Elements/Types";
import { hasTransform } from "visual/component/TransformWrapper/utils";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { isEditor } from "visual/providers/RenderProvider";
import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { defaultValueValue } from "visual/utils/onChange";
import { fromElementModel } from "visual/utils/options/Motion/types/Value";
import { types as Devices } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";

export function styleColumn(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const {
    v,
    store,
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
  const enabledTransform = hasTransform(v, store);
  const transformSelector = `${innerDivFromMotion}${hoverSelector}.brz-columns__transform`;
  const innerWrappers = enabledTransform
    ? `${transformSelector} > `
    : `${innerDivFromMotion}${hoverSelector}`;

  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleZIndex|||preview",
        "cssStyleFlexColumn",
        "cssStyleSizeMaxWidth",
        "cssStyleFlexColumnVerticalAlign",
        "cssStyleColumnContainerHeight"
      ]
    },
    [`.brz && > ${innerWrappers}.brz-ed-sortable--empty`]: {
      standart: ["cssStyleEmptyColumnHeight"]
    },
    ".brz && .brz-columns__scroll-effect": {
      standart: ["cssStyleFlexColumnVerticalAlign"]
    },
    [`.brz && > ${innerWrappers}.brz-bg`]: {
      standart: [
        "cssStyleMargin",
        "cssStyleBlendMode",
        "cssStyleBorderRadius",
        ...(enabledTransform ? ["cssStyleColumnTransformBg"] : [])
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
        "cssStyleMaskSize",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
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
    [`.brz && > ${innerWrappers}.brz-bg, .brz && > ${innerWrappers}.brz-bg > .brz-bg-image, .brz && > ${innerWrappers}.brz-bg > .brz-bg-color`]:
      {
        standart: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
      }
  };

  if (enabledTransform) {
    styles[`.brz && > ${transformSelector}`] = {
      standart: [
        "cssStyleTransform",
        "cssStyleFlexColumnVerticalAlign",
        "cssStyleColumnTransformWrapper"
      ],
      interval: [
        "cssStyleDisplayFlex",
        isEditor(renderContext)
          ? "cssStyleVisibleEditorDisplayNoneOrFlex|||editor"
          : "cssStyleVisible|||preview"
      ]
    };
  }

  // the motion wrapper rules outweigh div[data-scroll-motion] { display: inherit } from column.scss
  if (isEditor(renderContext)) {
    styles[".brz && > *"] = {
      interval: ["cssStyleVisibleEditorDisplayNoneOrBlock|||editor"]
    };
    styles[".brz && > .brz-columns__scroll-effect[data-scroll-motion]"] = {
      interval: ["cssStyleVisibleEditorDisplayNoneOrFlex|||editor"]
    };
    styles[`.brz && > ${innerWrappers}.brz-bg`].interval?.push(
      "cssStyleVisible|||editor"
    );
    styles[`.brz && > ${innerWrappers}.brz-column__items`] = {
      interval: ["cssStyleVisible|||editor"]
    };
  } else {
    styles[".brz && > *"] = {
      interval: ["cssStyleVisible|||preview"]
    };
    styles[".brz && > .brz-column__items"] = {
      interval: ["cssStyleVisible|||preview"]
    };
    styles[".brz && > .brz-columns__scroll-effect.brz-motion--effects"] = {
      interval: ["cssStyleVisible|||preview"]
    };
  }

  return renderStyles({ ...data, styles });
}

export function styleItems(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&.brz-column__items": {
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
